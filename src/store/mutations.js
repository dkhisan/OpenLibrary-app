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
  init: (state, cookies) => {
    state.accessToken = cookies.accessToken;
    state.loggedUser = cookies.loggedUser;
  }
};
