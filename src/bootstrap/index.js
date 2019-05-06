try {
  require("buefy/dist/buefy.css");
  require("@mdi/font/css/materialdesignicons.css");
  require("@/assets/css/open-library.css");
  window.axios = require("axios");
  window._ = require("lodash");
  window.moment = require("moment");
} catch (e) {
  throw e;
}
