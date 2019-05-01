try {
  require("buefy/dist/buefy.css");
  require("@mdi/font/css/materialdesignicons.css");
  require("@/assets/css/open-library.css");
  window.axios = require("axios");
  window._ = require("lodash");
} catch (e) {
  throw e;
}
