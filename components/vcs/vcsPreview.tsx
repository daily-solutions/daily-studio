import React, { useCallback, useEffect, useRef, useState } from 'react';
import * as vcsComp from '@daily-co/vcs-composition-daily-baseline-web';

import { VcsRenderInstance } from './types';

type Props = {
  viewportWidth?: number;
  viewportHeight?: number;
  params?: { [key: string]: any };
};

// callback passed to VCS.
// maps asset names to URLs in our /public folder.
function getAssetUrlCb(name: string, namespace: string, type: string) {
  if (type === 'font') {
    return `/vcs/res/fonts/${name}`;
  } else if (type === 'image') {
    if (namespace === 'composition') {
      return `/vcs/composition-assets/${name}`;
    } else {
      return `/vcs/res/test-assets/${name}`;
    }
  }
  return name;
}

export const VCSPreview = React.forwardRef(
  (
    { viewportWidth = 1280, viewportHeight = 720, params = {} }: Props,
    parentRef: any
  ) => {
    const vcsRenderRef = useRef<VcsRenderInstance | null>(null);

    const vcsContainerCb = useCallback(
      async (el) => {
        if (vcsRenderRef.current) {
          vcsRenderRef.current.stop();
          vcsRenderRef.current = null;
          if (parentRef?.current) {
            parentRef.current.restart = null;
          }
        }

        if (el) {
          vcsRenderRef.current = new VcsRenderInstance(
            vcsComp,
            el,
            { w: viewportWidth, h: viewportHeight },
            params,
            {
              getAssetUrlCb,
            }
          );

          await vcsRenderRef.current.start();

          console.log('--- VCS composition started ----');

          if (parentRef?.current) {
            parentRef.current.restart = async function (params: any) {
              if (vcsRenderRef.current) {
                vcsRenderRef.current.stop();
                await vcsRenderRef.current.start();
                console.log('sending params after restart: ', params);
                for (const key in params) {
                  vcsRenderRef.current.sendParam(key, params[key]);
                }
              }
            };
          }
        }
      },
      [params, parentRef, viewportHeight, viewportWidth]
    );

    useEffect(() => {
      if (!vcsRenderRef.current) return;
      for (const key in params) {
        vcsRenderRef.current.sendParam(key, params[key]);
      }
    }, [params]);

    // watch for size changes on window resize
    function updateDisplaySize() {
      if (!vcsRenderRef.current) return;
      vcsRenderRef.current.rootDisplaySizeChanged();
    }

    useEffect(() => {
      window.addEventListener('resize', updateDisplaySize);
      return () => window.removeEventListener('resize', updateDisplaySize);
    }, []);

    return (
      <div className="h-full w-full">
        <div ref={vcsContainerCb} />
      </div>
    );
  }
);

VCSPreview.displayName = 'VCSPreview';
