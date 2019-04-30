require("buefy/dist/buefy.css");
require("@mdi/font/css/materialdesignicons.css");

try {
  window.axios = require("axios");
  window._ = require("lodash");
} catch (e) {
  console.error(e);
}
