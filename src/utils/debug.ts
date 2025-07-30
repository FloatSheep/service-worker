import { config } from "../../sw.config";

/**
 *
 * @param func 执行函数
 */
export const debug = (
  func: (console: {
    log: (...args: any[]) => void;
    error: (...args: any[]) => void;
    warn: (...args: any[]) => void;
  }) => void
) => {
  const localConsole = self.console ?? window.console;
  const console = {
    log: (...args: any[]) => {
      localConsole.log(
        `${new Date().toLocaleTimeString()} [DEBUG LOG]`,
        ...args
      );
    },
    error: (...args: any[]) => {
      localConsole.warn(
        `${new Date().toLocaleTimeString()} [DEBUG ERROR]`,
        ...args
      );
    },
    warn: (...args: any[]) => {
      localConsole.warn(
        `${new Date().toLocaleTimeString()} [DEBUG WARN]`,
        ...args
      );
    },
  };
  config.localMode && func(console);
};
