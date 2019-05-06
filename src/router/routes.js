import { getCookies } from "@/assets/js/functions";

export default [
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
              return "/library";
            } else if (role === "atendente") {
              return "/service";
            }
            return "/admin";
          } catch (e) {
            return "/login";
          }
        }
      },
      {
        path: "/library",
        meta: { role: "leitor" },
        component: () =>
          import(/* webpackChunkName: 'library' */ "@/views/library/Home.vue"),
        children: [
          {
            path: "",
            redirect: "home"
          },
          {
            path: "home",
            name: "library.view.home",
            meta: { role: "leitor" },
            component: () =>
              import(
                /* webpackChunkName: 'library' */ "@/views/library/Main.vue"
              )
          },
          {
            path: "books",
            name: "library.view.books",
            meta: { role: "leitor" },
            component: () =>
              import(
                /* webpackChunkName: 'library' */ "@/views/library/Books.vue"
              )
          }
        ]
      },
      {
        path: "/service",
        meta: { role: "atendente" },
        component: () =>
          import(/* webpackChunkName: 'service' */ "@/views/service/Home.vue"),
        children: [
          {
            path: "",
            redirect: "dashboard"
          },
          {
            path: "dashboard",
            name: "service.view.dash",
            meta: { role: "atendente" },
            component: () =>
              import(
                /* webpackChunkName: 'service' */ "@/views/service/Dashboard.vue"
              )
          },
          {
            path: "books",
            name: "service.view.books",
            meta: { role: "atendente" },
            component: () =>
              import(
                /* webpackChunkName: 'service' */ "@/views/service/Books.vue"
              )
          }
        ]
      },
      {
        path: "/admin",
        meta: { role: "administrador" },
        component: () =>
          import(/* webpackChunkName: 'admin' */ "@/views/admin/Home.vue"),
        children: [
          {
            path: "",
            redirect: "dashboard"
          },
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
              import(/* webpackChunkName: 'admin' */ "@/views/admin/Books.vue")
          },
          {
            path: "users",
            name: "admin.view.users",
            meta: { role: "administrador" },
            component: () =>
              import(/* webpackChunkName: 'admin' */ "@/views/admin/Users.vue")
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
];
