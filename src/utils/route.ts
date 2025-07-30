import { Hono } from "hono";
import { handle } from "hono/service-worker";
import { init } from "./storeMethod";
import type { CacheManager } from "@floatsheep/cachemanager";
import { config } from "../../sw.config";

const app = new Hono();

let store: CacheManager | undefined;

init().then((cacheManager) => {
  store = cacheManager;
});

// 将路径转换为 -html.json 格式
const convertPathToHtmlJson = (relPath: string): string => {
  if (relPath.endsWith(".html")) {
    const fileNameWithExt = relPath.split("/").pop()!;
    const fileNameWithoutExt = fileNameWithExt.slice(
      0,
      fileNameWithExt.lastIndexOf(".")
    );
    return relPath.replace(fileNameWithExt, `${fileNameWithoutExt}-html.json`);
  }
  return relPath;
};

// 处理请求的核心逻辑
const handleRequest = async (relPath: string): Promise<Response> => {
  // 如果路径以 '/' 结尾，则默认指向 index.html
  if (relPath.endsWith("/")) {
    relPath += "index.html";
  }

  // 转换 HTML 请求为数据请求
  relPath = convertPathToHtmlJson(relPath);

  const version =
    (await store?.getItem<string>("version"))?.split('"')[1] || "";
  const npmPath = `${config.registryBaseUrl}${config.packageName}/${version}/files${relPath}`;
  return fetch(npmPath);
};

// 通配符路由：匹配所有路径
app.get("*", async (c) => {
  let relPath = c.req.path; // 获取完整路径

  // 处理请求并返回结果
  const content = await handleRequest(relPath);
  if (content.url.includes(".svg")) {
    c.header("Content-Type", "image/svg+xml");
  }
  if (content.status === 404) {
    return c.notFound();
  } else {
    return c.body(await content.arrayBuffer());
  }
});

app.notFound(async (c) => {
  return c.body(await (await handleRequest("/404.html")).arrayBuffer(), 404);
});

/**
 * @param {FetchEvent} FetchEvent Fetch 事件
 */
export const fetchHandle = handle(app);
