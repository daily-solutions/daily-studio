import * as comp from '@daily-co/vcs-composition-daily-baseline-web';

const MAX_VIDEO_INPUT_SLOTS = 20;

interface VideoInputSlot {
  id: string;
  active: boolean;
  type: 'camera' | 'screenshare';
  displayName: string;
}

interface Sources {
  videoSlots: any[];
  assetImages: any;
}

export class VCSCompositionWrapper {
  private readonly rootEl: HTMLElement;
  private viewportSize: { w: number; h: number };
  private readonly defaultParams: Record<string, any>;
  private readonly fps = 30;
  private scaleFactor: number;
  public readonly paramValues: Record<string, any> = {};
  private readonly activeVideoInputSlots: VideoInputSlot[] = [];
  public sources: Sources;
  private vcsApi: any;
  private getAssetUrlcb: (
    name: string,
    namespace: string,
    type: string
  ) => string;

  constructor(rootEl, viewportSize, defaultParams, opts) {
    if (!comp) return;

    console.log('initializing VCS output for root element: ', rootEl);

    this.getAssetUrlcb = opts && opts.getAssetUrlCb ? opts.getAssetUrlCb : null;
    this.rootEl = rootEl;

    // viewportSize is the render size used by VCS.
    // for video layers, this doesn't affect resolution, as they are rendered as actual DOM elements.
    // for graphics, this sets the size of the canvas element.
    this.viewportSize = viewportSize || { w: 1280, h: 720 };

    this.defaultParams = defaultParams;

    this.fps = 30;

    this.recomputeOutputScaleFactor();

    this.paramValues = {};
    this.activeVideoInputSlots = [];

    for (let i = 0; i < MAX_VIDEO_INPUT_SLOTS; i++) {
      this.setActiveVideoInput(i, false);
    }
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

    const testImages = await this.loadTestImages();

    this.sources = {
      videoSlots: videoInputElements,
      assetImages: testImages,
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

  async loadTestImages() {
    return;
  }

  async start() {
    if (!this.sources) {
      await this.setupDefaultSources();
    }

    console.log('starting VCS output', this.sources);

    this.vcsApi = await comp.startDOMOutputAsync(
      this.rootEl,
      this.viewportSize.w,
      this.viewportSize.h,
      this.sources,
      {
        updateCb: this.compUpdated.bind(this),
        errorCb: this.onError.bind(this),
        getAssetUrlCb: this.getAssetUrlcb,
        fps: this.fps,
        scaleFactor: this.scaleFactor,
        enablePreload: true,
      }
    );

    this.sendActiveVideoInputSlots();

    if (this.defaultParams) {
      for (const key in this.defaultParams) {
        this.sendParam(key, this.defaultParams[key]);
      }
    }
  }

  stop() {
    console.log('----- VCS composition stop ----', this.vcsApi);
    if (!this.vcsApi) return;

    this.vcsApi.stop();
  }

  onError(error) {
    console.error('React error: ', error);
  }

  compUpdated() {
    //console.log("comp updated");
  }

  setActiveVideoInput(
    idx: number,
    active: boolean,
    id?: string,
    name?: string,
    isScreenshare = false
  ): void {
    this.activeVideoInputSlots[idx] = {
      id: id || '',
      active: Boolean(active),
      type: isScreenshare ? 'screenshare' : 'camera',
      displayName: name || `Participant ${idx + 1}`,
    };
  }

  sendActiveVideoInputSlots() {
    if (!this.vcsApi) return;

    const arr: any[] = [];
    for (const element of this.activeVideoInputSlots) {
      let obj = element;
      if (obj.active) {
        arr.push({ ...obj });
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

  applyMeetingTracksAndOrdering(newTracksById, orderedVideoInputs) {
    if (!this.sources || !newTracksById || !orderedVideoInputs) return;

    // Get the previous slots.
    const prevSlots = this.sources.videoSlots;

    // Create a new array of slots.
    const newSlots: any[] = [];

    // Iterate over the ordered video inputs.
    for (const inputDesc of orderedVideoInputs) {
      // Get the session ID and display name.
      const { id: sessionId, displayName } = inputDesc;

      // Check if there is a track for the session ID.
      if (!newTracksById[sessionId]) {
        console.log(' -- no track available for session id: ', sessionId);
        continue;
      }

      // Get the track.
      const { track } = newTracksById[sessionId];

      // Find the previous slot for the session ID.
      const prevSlot = prevSlots.find((it) => it.sessionId === sessionId);

      // If there is a previous slot, and the track IDs match, update the slot.
      if (prevSlot && prevSlot.track.id === track?.id) {
        console.log(
          'found existing track for participant session %s',
          sessionId
        );
        newSlots.push({ ...prevSlot, displayName });
      } else {
        // Otherwise, create a new slot.
        if (track) {
          const mediaStream = new MediaStream([track]);
          let videoEl;

          // If there is a previous slot, use its element.
          if (prevSlot) {
            videoEl = prevSlot.element;
          } else {
            // Otherwise, create a new element.
            videoEl = document.createElement('video');
            console.log(
              "haven't seen participant session %s before",
              sessionId,
              track
            );

            this.placeVideoSourceInDOM(videoEl, track.id);
          }

          videoEl.srcObject = mediaStream;
          videoEl.setAttribute('autoplay', true);
          videoEl.setAttribute('playsinline', true);
          videoEl.setAttribute('controls', false);

          newSlots.push({
            id: `videotrack_${track.id}`,
            element: videoEl,
            track: track,
            sessionId: sessionId,
            displayName,
            isScreenShare: sessionId.endsWith('-screen'),
          });
        }
      }
    }

    // Check if the new slots are different from the previous slots.
    let didChange = newSlots.length !== prevSlots.length;
    if (!didChange) {
      // If they are not different, check the IDs.
      for (let i = 0; i < newSlots.length; i++) {
        if (newSlots[i].id !== prevSlots[i].id) {
          didChange = true;
          break;
        }
      }
    }

    // If the slots have changed, update the sources and send the update.
    if (didChange) {
      this.sources.videoSlots = newSlots;
      this.sendUpdateImageSources();

      console.log(
        'updating video slots with ordering, %d: ',
        newSlots.length,
        newSlots
      );

      for (let i = 0; i < MAX_VIDEO_INPUT_SLOTS; i++) {
        const slot = newSlots[i];
        if (slot) {
          this.setActiveVideoInput(
            i,
            true,
            slot.id,
            slot.displayName,
            slot?.isScreenShare
          );
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
    const newSlots: any[] = [];

    for (const sessionId in newTracksById) {
      const { track, userName: displayName } = newTracksById[sessionId];
      const prevSlot = prevSlots.find((it) => it.sessionId === sessionId);

      if (prevSlot && prevSlot.track.id === track?.id) {
        newSlots.push({
          ...prevSlot,
          displayName,
        });
      } else if (track) {
        const mediaStream = new MediaStream([track]);
        let videoEl;

        if (prevSlot) {
          videoEl = prevSlot.element;
        } else {
          videoEl = document.createElement('video');
          this.placeVideoSourceInDOM(videoEl, track.id);
        }

        videoEl.srcObject = mediaStream;
        videoEl.setAttribute('autoplay', true);
        videoEl.setAttribute('playsinline', true);
        videoEl.setAttribute('controls', false);

        newSlots.push({
          id: `videotrack_${track.id}`,
          element: videoEl,
          track: track,
          sessionId: sessionId,
          displayName,
          isScreenShare: sessionId.endsWith('-screen'),
        });
      }
    }

    const didChange = newSlots.some((slot, i) => {
      return prevSlots[i] && prevSlots[i].id !== slot.id;
    });

    if (didChange) {
      this.sources.videoSlots = newSlots;
      this.sendUpdateImageSources();

      for (let i = 0; i < MAX_VIDEO_INPUT_SLOTS; i++) {
        const slot = newSlots[i];
        if (slot) {
          this.setActiveVideoInput(
            i,
            true,
            slot.id,
            slot.displayName,
            slot?.isScreenShare
          );
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