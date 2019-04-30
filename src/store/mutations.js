import { hasCookies, getCookies } from "@/assets/js/functions";

export default {
  setToken: (state, token) => {
    state.accessToken = token;
  },
  setUser: (state, user) => {
    state.loggedUser = user;
  },
  logOut: state => {
    state.accessToken = {};
    state.loggedUser = {};
  },
  init: state => {
    if (hasCookies()) {
      const cookies = getCookies();

      state.accessToken = cookies.token;
      state.loggedUser = cookies.user;
    }
  }
};
