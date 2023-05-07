import VcsRenderInstanceInner from './vcsRenderInstance';

export interface VcsSize {
  w: number;
  h: number;
}

export interface VcsCompositionModule {
  startDOMOutputAsync: (
    rootEl: any,
    w: number,
    h: number,
    imageSources: Array<any>,
    opts: { [key: string]: any }
  ) => Promise<void>;
}

export class VcsRenderInstance {
  inner: any;

  constructor(
    comp: VcsCompositionModule,
    rootEl: HTMLDivElement,
    viewportSize: VcsSize,
    defaultParams: Object,
    opts?: { [key: string]: any }
  ) {
    console.log('VcsRenderInstance create: ', comp, rootEl, viewportSize);
    this.inner = new VcsRenderInstanceInner(
      comp,
      rootEl,
      viewportSize,
      defaultParams,
      opts
    );
  }

  async start() {
    await this.inner.start();
  }

  async stop() {
    this.inner.stop();
  }

  rootDisplaySizeChanged() {
    this.inner.rootDisplaySizeChanged();
  }

  sendParam(key: string, value: any) {
    this.inner.sendParam(key, value);
  }
}
