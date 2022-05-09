const offerOptions = {
  offerVideo: true,
  offerAudio: true,
  offerToReceiveAudio: false,
  offerToReceiveVideo: false,
};

export class Loopback {
  peer1: RTCPeerConnection;
  peer2: RTCPeerConnection;
  loopbackStream: MediaStream;
  offer: any;
  answer: any;

  public async start(stream: MediaStream) {
    this.loopbackStream = new MediaStream();
    this.peer1 = new RTCPeerConnection();
    this.peer2 = new RTCPeerConnection();
    this.peer1.onicecandidate = e => this.onIceCandidate(this.peer1, e);
    this.peer2.onicecandidate = e => this.onIceCandidate(this.peer2, e);

    this.peer2.ontrack = e => {
      this.loopbackStream.addTrack(e.track);
    };
    stream.getAudioTracks().forEach(t => {
      this.peer1.addTrack(t);
    });

    const offer = await this.peer1.createOffer(offerOptions);
    await this.peer1.setLocalDescription(offer);

    await this.peer2.setRemoteDescription(offer);
    const answer = await this.peer2.createAnswer();
    await this.peer2.setLocalDescription(answer);

    await this.peer1.setRemoteDescription(answer);
  }

  public getLoopback(): MediaStream {
    return this.loopbackStream;
  }

  public destroy() {
    this.peer1.close();
    this.peer2.close();
  }

  private onIceCandidate(
    conn: RTCPeerConnection,
    event: RTCPeerConnectionIceEvent,
  ) {
    this.getOtherConn(conn).addIceCandidate(event.candidate);
  }

  private getOtherConn(conn: RTCPeerConnection): RTCPeerConnection {
    return conn === this.peer1 ? this.peer2 : this.peer1;
  }
}
