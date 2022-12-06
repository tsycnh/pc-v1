let url = process.env.VUE_APP_URL || "";
let goMeeduUri = process.env.VUE_APP_GO_MEEDU_URL || "";

if (typeof window.meedu_app_url !== "undefined" && window.meedu_app_url) {
  url = window.meedu_app_url;
}

export default {
  url: url,
  goMeeduUri: goMeeduUri,
  version: "v4.8.4",
};
