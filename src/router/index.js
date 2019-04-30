import Vue from "vue";
import Router from "vue-router";
import { hasCookies, getCookies } from "@/assets/js/functions";

Vue.use(Router);

const r = new Router({
  linkActiveClass: "is-active",
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      meta: { authentication: true },
      redirect: "redir",
      component: () => import("@/App.vue"),
      children: [
        {
          path: "/redir",
          redirect: () => {
            try {
              const { user } = getCookies();
              const { role } = user;
              if (role === "leitor") {
                return "/main";
              } else if (role === "atendente") {
                return "/manage";
              }

              return "/admin";
            } catch (e) {
              return "/login";
            }
          }
        },
        {
          path: "/main",
          meta: { role: "leitor" },
          component: () => import("@/views/main/Home.vue")
        },
        {
          path: "/admin",
          name: "admin.dir",
          meta: { role: "administrador" },
          component: () => import("@/views/admin/Home.vue")
        }
      ]
    },
    {
      path: "/login",
      name: "login",
      meta: { authentication: false },
      component: () => import("@/views/Login.vue")
    }
  ]
});

r.beforeEach((to, from, next) => {
  if (to.matched.some(rec => rec.meta.authentication)) {
    if (!hasCookies()) {
      next({
        path: "/login",
        query: { next: to.fullPath }
      });
    }
  }

  if (to.matched.some(rec => rec.meta.role)) {
    const { role } = getCookies();
    const access = to.meta.role;

    if (role === access) {
      next(to.path);
    }
  }

  next();
});

export default r;
