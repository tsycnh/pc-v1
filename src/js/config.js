let url = process.env.VUE_APP_URL || "";
let goMeeduUri = process.env.VUE_APP_GO_MEEDU_URL || "";

if (typeof window.meedu_app_url !== "undefined" && window.meedu_app_url) {
  url = window.meedu_app_url;
}

if (typeof window.go_meedu_url !== "undefined" && window.go_meedu_url) {
  goMeeduUri = window.go_meedu_url;
}

export default {
  url: url,
  goMeeduUri: goMeeduUri,
  version: "v4.9.1",
};
