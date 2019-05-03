<template>
  <div>
    <section>
      <navbar>
        <template slot="links">
          <router-link
            :to="{ name: 'library.view.home' }"
            class="navbar-item"
            exact
          >
            <b-icon icon="home" size="is-small" />
            <span>Home</span>
          </router-link>
          <router-link
            :to="{ name: 'library.view.books' }"
            class="navbar-item"
            exact
          >
            <b-icon icon="book" size="is-small" />
            <span>Livros</span>
          </router-link>
        </template>
      </navbar>
    </section>
    <section class="section">
      <div class="container">
        <div class="columns">
          <div class="column is-3">
            <sidebar />
          </div>
          <div class="column is-9">
            <router-view />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { Icon } from "buefy/dist/components/icon";
import Navbar from "@/components/template/Navbar.vue";
import Sidebar from "@/components/template/Sidebar.vue";

export default {
  name: "LibraryHome",
  components: {
    BIcon: Icon,
    Navbar,
    Sidebar
  }
};
</script>
