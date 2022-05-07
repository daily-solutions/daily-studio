import React, { useEffect, useCallback } from 'react';
import { useVCS } from '../contexts/VCSProvider';
import { useCall } from '../contexts/CallProvider';

// the composition is loaded as a separately built module in a global
const g_DailyVCS = window.DailyVCS;
if (!g_DailyVCS) {
  console.assert('window.DailyVCS not available');
}

const MAX_VIDEO_INPUT_SLOTS = 20;
const LOCAL_VIDEO_INPUT_ID = 'livecam0';

class VCSCompositionWrapper {
  constructor(rootEl, viewportSize, defaultParams) {
    const g_DailyVCS = window.DailyVCS;
    if (!g_DailyVCS) return;

    console.log('initializing VCS output for root element: ', rootEl);

    this.rootEl = rootEl;

    // viewportSize is the render size used by VCS.
    // for video layers, this doesn't affect resolution, as they are rendered as actual DOM elements.
    // for graphics, this sets the size of the canvas element.
    this.viewportSize = viewportSize || { w: 1280, h: 720 };

    console.log(
      'viewport size, default params: ',
      this.viewportSize,
      defaultParams,
    );
    this.defaultParams = defaultParams;

    this.fps = 15;

    this.recomputeOutputScaleFactor();

    this.paramValues = {};
    this.activeVideoInputSlots = [];

    for (let i = 0; i < MAX_VIDEO_INPUT_SLOTS; i++) {
      this.setActiveVideoInput(i, false);
    }
    this.setActiveVideoInput(0, true, LOCAL_VIDEO_INPUT_ID);
  }

  recomputeOutputScaleFactor() {
    const displayW = this.rootEl.clientWidth;
    const displayH = this.rootEl.clientHeight;
    if (!displayW || !displayH) return;

    const asp = this.viewportSize.w / this.viewportSize.h;

    if (asp >= 1) {
      // fit landscape
      this.scaleFactor = displayW / this.viewportSize.w;
    } else {
      // fit portrait
      this.scaleFactor = displayH / this.viewportSize.h;
    }
  }

  async setupDefaultSources() {
    console.log('--setup default sources start--');
    const videoInputElements = [];

    const liveVideoEl = await this.setupLiveVideo();

    this.localVideoSlotItem = videoInputElements[0] = {
      id: LOCAL_VIDEO_INPUT_ID,
      element: liveVideoEl,
      displayName: '',
    };

    const testImages = this.loadTestImages();

    this.sources = {
      videoSlots: videoInputElements,
      compositionAssetImages: testImages,
    };
    console.log('--setup default sources end--');
  }

  placeVideoSourceInDOM(el, trackId) {
    // place element in DOM so it gets updates
    el.setAttribute('style', 'display: none;');
    if (trackId) {
      el.setAttribute('data-video-remote-track-id', trackId);
    }
    this.rootEl.appendChild(el);
  }

  async setupLiveVideo() {
    let liveVideoEl;

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false,
      });
      liveVideoEl = document.createElement('video');
      liveVideoEl.setAttribute('muted', true);
      liveVideoEl.setAttribute('autoplay', true);
      liveVideoEl.setAttribute('playsinline', true);
      liveVideoEl.setAttribute('controls', false);
      liveVideoEl.srcObject = mediaStream;

      this.placeVideoSourceInDOM(liveVideoEl);
    } catch (e) {
      console.error('** getUserMedia failed: ', e);
      alert('Live video not available, getUserMedia failed:\n\n' + e);
    }
    return liveVideoEl;
  }

  loadTestImages() {
    const { hostname, port, protocol } = window.location;
    return {
      'user_white_64.png': `${protocol}//${hostname}:${port}user_white_64.png`,
      'overlay.png': `${protocol}//${hostname}:${port}overlay.png`,
      'party-popper_1f389.png': `${protocol}//${hostname}:${port}party-popper_1f389.png`,
    };
  }

  async start() {
    if (!this.sources) {
      await this.setupDefaultSources();
    }

    console.log('starting VCS output');

    this.vcsApi = await g_DailyVCS.startDOMOutputAsync(
      this.rootEl,
      this.viewportSize.w,
      this.viewportSize.h,
      this.sources,
      {
        updateCb: this.compUpdated.bind(this),
        errorCb: this.onError.bind(this),
        fps: this.fps,
        scaleFactor: this.scaleFactor,
        enablePreload: true,
      },
    );

    this.sendActiveVideoInputSlots();

    if (this.defaultParams) {
      for (const key in this.defaultParams) {
        this.sendParam(key, this.defaultParams[key]);
      }
    }
  }

  stop() {
    if (!this.vcsApi) return;

    this.vcsApi.stop();
  }

  onError(error) {
    console.error('React error: ', error);
  }

  compUpdated() {
    //console.log("comp updated");
  }

  setActiveVideoInput(idx, active, id, name, isScreenshare) {
    this.activeVideoInputSlots[idx] = {
      id: id || '',
      active: !!active,
      type: isScreenshare ? 'screenshare' : 'camera',
      displayName: name || 'Participant ' + (idx + 1),
    };
  }

  sendActiveVideoInputSlots() {
    if (!this.vcsApi) return;

    const arr = [];
    for (let i = 0; i < this.activeVideoInputSlots.length; i++) {
      let obj = this.activeVideoInputSlots[i];
      if (obj.active) {
        obj = { ...obj };
        arr.push(obj);
      } else {
        arr.push(false);
      }
    }

    this.vcsApi.setActiveVideoInputSlots(arr);
  }

  sendParam(paramId, value) {
    if (!this.vcsApi) return;

    this.vcsApi.setParamValue(paramId, value);

    // retain a copy of param values so we can reset renderer to the same state
    this.paramValues[paramId] = value;
  }

  sendUpdateImageSources() {
    if (!this.vcsApi) return;

    this.vcsApi.updateImageSources(this.sources);
  }

  setLocalUserName(userName) {
    if (!this.vcsApi) return;

    const slot0 = this.sources.videoSlots[0];
    if (slot0 && slot0.id === LOCAL_VIDEO_INPUT_ID) {
      slot0.displayName = userName;
      this.setActiveVideoInput(0, true, LOCAL_VIDEO_INPUT_ID, userName);
      this.sendActiveVideoInputSlots();
    }
  }

  applyMeetingTracksAndOrdering(
    newTracksById,
    orderedVideoInputs,
    localSessionId,
  ) {
    if (!this.sources || !newTracksById || !orderedVideoInputs) return;

    const prevSlots = this.sources.videoSlots;
    const newSlots = [];

    for (const inputDesc of orderedVideoInputs) {
      const { id: sessionId, displayName } = inputDesc;
      if (sessionId === localSessionId) {
        const slot = this.localVideoSlotItem;
        slot.displayName = displayName;
        newSlots.push(slot);
        continue;
      }

      if (!newTracksById[sessionId]) {
        console.log(' -- no track available for session id: ', sessionId);
        continue;
      }

      const { track } = newTracksById[sessionId];

      const prevSlot = prevSlots.find(it => it.sessionId === sessionId);
      if (prevSlot && prevSlot.track.id === track.id) {
        console.log(
          'found existing track for participant session %s',
          sessionId,
        );
        newSlots.push({ ...prevSlot, displayName });
      } else {
        const mediaStream = new MediaStream([track]);
        let videoEl;
        if (prevSlot) {
          console.log('track has changed for %s', sessionId);
          /*// remove previous element
          this.rootEl.removeChild(prevSlot.element);*/
          videoEl = prevSlot.element;
        } else {
          console.log(
            "haven't seen participant session %s before",
            sessionId,
            track,
          );
          videoEl = document.createElement('video');
          console.log('... created video el for track %s: ', track.id, videoEl);

          this.placeVideoSourceInDOM(videoEl, track.id);
        }
        videoEl.srcObject = mediaStream;
        videoEl.setAttribute('autoplay', true);
        videoEl.setAttribute('playsinline', true);
        videoEl.setAttribute('controls', false);
        if (g_isIOS) {
          videoEl.play();
        }

        newSlots.push({
          id: `videotrack_${track.id}`,
          element: videoEl,
          track: track,
          sessionId: sessionId,
          displayName,
        });
      }
    }

    let didChange = newSlots.length !== prevSlots.length;
    if (!didChange) {
      // check the ids
      for (let i = 0; i < newSlots.length; i++) {
        if (newSlots[i].id !== prevSlots[i].id) {
          didChange = true;
          break;
        }
      }
    }

    if (didChange) {
      this.sources.videoSlots = newSlots;
      this.sendUpdateImageSources();

      console.log(
        'updating video slots with ordering, %d: ',
        newSlots.length,
        newSlots,
      );

      for (let i = 0; i < MAX_VIDEO_INPUT_SLOTS; i++) {
        const slot = newSlots[i];
        if (slot) {
          this.setActiveVideoInput(i, true, slot.id, slot.displayName);
        } else {
          this.setActiveVideoInput(i, false);
        }
      }
      this.sendActiveVideoInputSlots();
    }
  }

  reconcileMeetingTracks(newTracksById) {
    if (!this.sources || !newTracksById) return;

    const prevSlots = this.sources.videoSlots;
    const newSlots = [];

    newSlots[0] = this.localVideoSlotItem;

    let didChange = false;

    for (const sessionId in newTracksById) {
      const { track, userName: displayName } = newTracksById[sessionId];
      const prevSlot = prevSlots.find(it => it.sessionId === sessionId);
      if (prevSlot && prevSlot.track.id === track.id) {
        console.log(
          'found existing track for participant session %s',
          sessionId,
        );
        newSlots.push({ ...prevSlot, displayName });
      } else {
        const mediaStream = new MediaStream([track]);
        let videoEl;
        if (prevSlot) {
          console.log('track has changed for %s', sessionId);
          /*// remove previous element
          this.rootEl.removeChild(prevSlot.element);*/
          videoEl = prevSlot.element;
        } else {
          console.log(
            "haven't seen participant session %s before",
            sessionId,
            track,
          );
          videoEl = document.createElement('video');
          console.log('... created video el for track %s: ', track.id, videoEl);

          this.placeVideoSourceInDOM(videoEl, track.id);
        }
        videoEl.srcObject = mediaStream;
        videoEl.setAttribute('autoplay', true);
        videoEl.setAttribute('playsinline', true);
        videoEl.setAttribute('controls', false);
        if (g_isIOS) {
          videoEl.play();
        }

        newSlots.push({
          id: `videotrack_${track.id}`,
          element: videoEl,
          track: track,
          sessionId: sessionId,
          displayName,
        });
        didChange = true;
      }
    }

    if (!didChange) {
      // check for deletions
      for (const it of prevSlots) {
        const sessionId = it.sessionId;
        if (!sessionId) continue;
        const newIt = newSlots.find(it => it.sessionId === sessionId);
        if (!newIt) {
          console.log(
            'track for participant session %s was deleted',
            sessionId,
          );
          didChange = true;
          break;
        }
      }
    }

    if (didChange) {
      this.sources.videoSlots = newSlots;
      this.sendUpdateImageSources();

      console.log('updating slots: ', newSlots);

      for (let i = 0; i < MAX_VIDEO_INPUT_SLOTS; i++) {
        const slot = newSlots[i];
        if (slot) {
          this.setActiveVideoInput(i, true, slot.id, slot.displayName);
        } else {
          this.setActiveVideoInput(i, false);
        }
      }
      this.sendActiveVideoInputSlots();
    }
  }

  rootDisplaySizeChanged() {
    this.recomputeOutputScaleFactor();

    if (this.vcsApi) {
      this.vcsApi.setScaleFactor(this.scaleFactor);
    }
  }
}

const DailyVCSOutput = ({ compositionReadyCb, viewportSize }) => {
  const { localUser, joinedMeeting } = useCall();
  const { params, activeVideoInputs, remoteTracksBySessionId } = useVCS();

  const vcsCompRef = React.useRef();

  function updateDisplaySize() {
    if (!vcsCompRef.current) return;
    vcsCompRef.current.rootDisplaySizeChanged();
  }

  const outputElementCb = useCallback(
    el => {
      if (!joinedMeeting) return;

      if (!vcsCompRef.current) {
        // container element has been mounted by React, attach to a VCS output
        vcsCompRef.current = new VCSCompositionWrapper(
          el,
          viewportSize,
          params,
        );

        vcsCompRef.current.start().then(() => {
          compositionReadyCb(vcsCompRef.current);
        });
      } else if (el) {
        vcsCompRef.current.rootDisplaySizeChanged();
      }
    },
    [compositionReadyCb, joinedMeeting, params, viewportSize],
  );

  useEffect(() => {
    if (!vcsCompRef.current) return;

    if (!localUser?.session_id) {
      vcsCompRef.current.setLocalUserName(localUser?.user_name);
    } else {
      console.log('vcsCall.activeVideoInputs: ', activeVideoInputs);
      if (Array.isArray(activeVideoInputs) && activeVideoInputs.length > 0) {
        vcsCompRef.current.applyMeetingTracksAndOrdering(
          remoteTracksBySessionId,
          activeVideoInputs,
          localUser.session_id,
        );
      } else {
        // old code path without activeVideoInputs ordering sent from the producer client
        vcsCompRef.current.reconcileMeetingTracks(remoteTracksBySessionId);
      }
    }
  }, [
    activeVideoInputs,
    localUser?.session_id,
    localUser?.user_name,
    remoteTracksBySessionId,
  ]);

  // watch for size changes on window resize
  useEffect(() => {
    window.addEventListener('resize', updateDisplaySize);
    return () => window.removeEventListener('resize', updateDisplaySize);
  }, []);

  return (
    <div
      className="DailyVCSOutput"
      ref={outputElementCb}
      style={{ height: '100vh', width: viewportSize.w }}
    />
  );
};

export default DailyVCSOutput;
