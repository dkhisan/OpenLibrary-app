import { ajax, setCookies, removeCookies } from "@/assets/js/functions";

export default {
  login({ commit }, user) {
    return new Promise(async (resolve, reject) => {
      await ajax("//localhost:8001/api/v1/auth/login", user, "post")
        .then(res => {
          const accessToken = {
            token: res.access_token,
            type: res.token_type,
            expires: res.expires_in
          };
          const loggedUser = res.user;

          commit("setToken", accessToken);
          commit("setUser", loggedUser);
          setCookies({ accessToken, loggedUser });
          resolve();
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  logout({ commit }) {
    return new Promise(async (resolve, reject) => {
      await ajax("//localhost:8001/api/v1/auth/logout", null, "post")
        .then(({ message }) => {
          commit("logOut");
          removeCookies();
          resolve(message);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
};
