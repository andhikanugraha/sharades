import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "./registerServiceWorker";

Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");

// test for TopicEncoding
// import * as topicEnc from "./lib/TopicEncoding";
// (async function () {
//   const builtInTopics = (await import("./builtInTopics")).default;
//   async function test(raw) {
//     const encoded = await topicEnc.encodeTopic(raw);

//     const uncompressedLength = raw.title.length + raw.words.join(' ').length + 1;
//     const encodedLength = encoded.length;
//     console.dir(`${uncompressedLength}\t=> ${encodedLength}`);
//   }
//   for (let topic of builtInTopics) {
//     test(topic);
//   }
// })();
