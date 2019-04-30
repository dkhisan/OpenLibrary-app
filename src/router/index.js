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
              const { loggedUser } = getCookies();
              const { role } = loggedUser;

              if (role === "leitor") {
                return "/main";
              } else if (role === "atendente") {
                return "/manage";
              }
              return "/admin";
            } catch (e) {
              return "/";
            }
          }
        },
        {
          path: "/main",
          meta: { role: "leitor" },
          component: () => import("@/views/main/Home.vue")
        },
        {
          path: "/manage",
          meta: { role: "atendente" }
        },
        {
          path: "/admin",
          meta: { role: "administrador" },
          component: () =>
            import(/* webpackChunkName: 'admin' */ "@/views/admin/Home.vue"),
          children: [
            {
              path: "dashboard",
              name: "admin.view.dash",
              meta: { role: "administrador" },
              component: () =>
                import(
                  /* webpackChunkName: 'admin' */ "@/views/admin/Dashboard.vue"
                )
            },
            {
              path: "books",
              name: "admin.view.books",
              meta: { role: "administrador" },
              component: () =>
                import(
                  /* webpackChunkName: 'admin' */ "@/views/admin/Books.vue"
                )
            },
            {
              path: "users",
              name: "admin.view.users",
              meta: { role: "administrador" },
              component: () =>
                import(
                  /* webpackChunkName: 'admin' */ "@/views/admin/Users.vue"
                )
            }
          ]
        }
      ]
    },
    {
      path: "/login",
      name: "login",
      props: true,
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
  } else {
    // se a url solicitada não pode ser acessada
    // usando auth então redirecione para '/'.
    next("/");
  }

  // verifica se o usuário conectado faz parte
  // do grupo para acessar a página.
  if (to.matched.some(rec => rec.meta.role)) {
    const { loggedUser } = getCookies();
    const { role } = loggedUser;
    const access = to.meta.role;
    if (role !== access) {
      next("/");
    }
  }

  next();
});

export default r;
