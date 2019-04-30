import Vue from "vue";
import router from "./router/index";
import store from "./store/index";

import App from "./App.vue";

require("./bootstrap");

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
  beforeCreate() {
    store.dispatch("initialize");
  }
}).$mount("#app");
