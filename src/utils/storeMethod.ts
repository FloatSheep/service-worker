import { CacheManager } from "@floatsheep/cachemanager";

const store = new CacheManager({
  cachePrefix: "FloatBlog",
  cacheNamespace: "ConfigData",
  broadId: "service-worker",
});

const state = {
  instance: null as CacheManager | null,
};

/**
 *
 * @returns CacheManager 实例
 */
export const init = async () => {
  if (!state.instance) {
    try {
      // 初始化储存
      await store.init();
      state.instance = store;
      return store;
    } catch (error) {
      console.error("Init cache failed:", error);
    }
  } else {
    return state.instance;
  }
};

/**
 * 
 * @param key 目标 key
 * @returns Boolean
 */
export const hasItem = async (key: string): Promise<boolean> => {
  if (state.instance) {
    try {
      const cachedValue = await store.getItem(key);
      return cachedValue !== null;
    } catch (error) {
      return false;
    }
  } else {
    throw new Error('CacheManager is not initialized. Call init() before using hasItem.');
  }
};
