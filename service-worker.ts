declare const self: ServiceWorkerGlobalScope;

import { fetchHandle } from "./src/utils/route";
import { hasItem, init } from "./src/utils/storeMethod";
import { config } from "./sw.config";

const state = { isChecked: false };
// 初始化储存
addEventListener("install", () => {
  init().then(async (e) => {
    if (!state.isChecked) {
      const data = (await (
        await fetch(`${config.registryBaseUrl}${config.packageName}/latest`, {
          cache: "no-store",
        })
      ).json()) as { version: string };
      state.isChecked = true;

      if (!(await hasItem("version"))) {
        await e!.setItem("version", data.version);
      } else {
        const version = await e!.getItem<number>("version");

        if (version! < Number(data.version.split("")[1])) {
          await e!.setItem("version", data.version);
        }
      }
    }
  });
});

// 路由处理
self.addEventListener("fetch", (e) => {
  if (
    (e.request.url.includes(config.blogDomain) || config.localMode) &&
    !e.request.url.includes(config.serviceWorkerName) &&
    e.request.url.startsWith(self.location.origin)
  ) {
    init().then(async (e) => {
      if (!state.isChecked) {
        const data = (await (
          await fetch(`${config.registryBaseUrl}${config.packageName}/latest`)
        ).json()) as { version: string };
        state.isChecked = true;

        if (!(await hasItem("version"))) {
          await e!.setItem("version", data.version);
        } else {
          const version = await e!.getItem<number>("version");

          if (version! < Number(data.version.split("")[1])) {
            await e!.setItem("version", data.version);
          }
        }
      }
    });

    //@ts-ignore
    return fetchHandle(e);
  } else {
    e.respondWith(fetch(e.request));
  }
});
