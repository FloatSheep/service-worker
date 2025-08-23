declare const self: ServiceWorkerGlobalScope;

import { debug } from "./src/utils/debug";
import { fetchHandle } from "./src/utils/route";
import { hasItem, init } from "./src/utils/storeMethod";
import { config } from "./sw.config";

const state = { isChecked: false };

const checkUpdate = async () => {
  debug((console) => {
    console.log("检查更新");
  });

  const e = await init();
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
      const version = Number(
        (await e!.getItem<string>("version"))?.split("-")[1].replace('"', "")
      );

      if (version! < Number(data.version.split("-")[1])) {
        await e!.setItem("version", data.version);
      }

      debug((console) => {
        console.log(version, Number(data.version.split("-")[1]));
      });
    }
  }
};

// 初始化储存
addEventListener("install", () => {
  checkUpdate();
});

// 路由处理
self.addEventListener("fetch", (e) => {
  if (
    (e.request.url.includes(config.blogDomain) || config.localMode) &&
    (!e.request.url.includes(config.serviceWorkerName) ||
      e.request.url.includes("service-worker")) &&
    e.request.url.startsWith(self.location.origin)
  ) {
    checkUpdate();

    //@ts-ignore
    return fetchHandle(e);
  } else {
    e.respondWith(fetch(e.request));
  }
});
