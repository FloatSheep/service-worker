import sw from "../service-worker?worker&url";

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register(sw, { type: "module" });
}
