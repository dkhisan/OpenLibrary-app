import Vue from "vue";
import Router from "vue-router";
import { hasCookies, getCookies } from "@/assets/js/functions";
import routes from "./routes";

Vue.use(Router);

const r = new Router({
  linkActiveClass: "is-active",
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

r.beforeEach((to, from, next) => {
  if (to.matched.some(rec => rec.meta.authentication)) {
    if (!hasCookies()) {
      next({
        path: "/login",
        query: { next: to.fullPath }
      });
    }
  } else {
    // se a url solicitada não pode ser acessada
    // usando auth então redirecione para '/'.
    // next("/");
  }

  // verifica se o usuário conectado faz parte
  // do grupo para acessar a página.
  if (to.matched.some(rec => rec.meta.role)) {
    try {
      const { loggedUser } = getCookies();
      const { role } = loggedUser;
      const access = to.meta.role;
      if (role !== access) {
        next("/");
      }
    } catch (e) {
      // next("/");
    }
  }

  next();
});

export default r;
