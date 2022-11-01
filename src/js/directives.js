import Vue from "vue";
import moment from "moment";
import { format } from "timeago.js";

Vue.prototype.moment = moment;
Vue.filter("changeTime", function(dateStr) {
  return format(dateStr, "zh_CN").replace("片刻后", "刚刚");
});
Vue.filter("dateFormat", function(dateStr, pattern = "YYYY-MM-DD HH:mm") {
  if (!dateStr) {
    return dateStr;
  }
  return moment(dateStr).format(pattern);
});

Vue.directive("code", function(el) {
  let blocks = el.querySelectorAll("pre") || el.querySelectorAll("code");
  blocks.forEach((block) => {
    window.hljs.highlightBlock(block);
  });
});

Vue.directive("latex", function(el) {
  var reg1 = new RegExp("&nbsp;", "g");
  var reg2 = new RegExp("&amp;", "g");
  var reg3 = new RegExp("nbsp;", "g");
  var reg4 = new RegExp("amp;", "g");
  el.innerHTML = el.innerHTML.replace(reg1, "");
  el.innerHTML = el.innerHTML.replace(reg2, "&");
  el.innerHTML = el.innerHTML.replace(reg3, "");
  el.innerHTML = el.innerHTML.replace(reg4, "");
  window.renderMathInElement(el, {
    delimiters: [
      { left: "$$", right: "$$", display: true },
      { left: "$", right: "$", display: false },
      { left: "\\(", right: "\\)", display: false },
      { left: "\\[", right: "\\]", display: true },
    ],
    macros: {
      "\\ge": "\\geqslant",
      "\\le": "\\leqslant",
      "\\geq": "\\geqslant",
      "\\leq": "\\leqslant",
    },
    options: {
      skipHtmlTags: ["noscript", "style", "textarea", "pre", "code"],
      // 跳过mathjax处理的元素的类名，任何元素指定一个类 tex2jax_ignore 将被跳过，多个累=类名'class1|class2'
      ignoreHtmlClass: "tex2jax_ignore",
    },
    svg: {
      fontCache: "global",
    },
    throwOnError: false,
  });
});
