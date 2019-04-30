<template>
  <nav class="navbar is-spaced is-dark">
    <div class="container">
      <div class="navbar-brand"># logo #</div>
      <div class="navbar-menu">
        <div class="navbar-start">
          <router-link
            :to="{ name: 'admin.view.dash' }"
            class="navbar-item"
            exact
          >
            <b-icon icon="home" />
            <span>Home</span>
          </router-link>
          <router-link
            :to="{ name: 'admin.view.books' }"
            class="navbar-item"
            exact
          >
            <b-icon icon="book-multiple" />
            <span>Livros</span>
          </router-link>
          <router-link
            :to="{ name: 'admin.view.users' }"
            class="navbar-item"
            exact
          >
            <b-icon icon="account-group" />
            <span>Usuários</span>
          </router-link>
        </div>
        <div class="navbar-end">
          <b-button
            class="navbar-item"
            type="is-text"
            :loading="loading"
            @click="confirmLogout"
            >Sair</b-button
          >
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { Button } from "buefy/dist/components/button";
import { Dialog } from "buefy/dist/components/dialog";
import { Icon } from "buefy/dist/components/icon";

import { mapActions } from "vuex";

export default {
  name: "Navbar",
  components: { BButton: Button, BIcon: Icon },
  data() {
    return {
      loading: false
    };
  },
  methods: {
    ...mapActions(["logout"]),
    confirmLogout() {
      Dialog.confirm({
        message: "Desconectar agora?",
        cancelText: "Não",
        confirmText: "Sim",
        onConfirm: () => this.doLogout()
      });
    },
    doLogout() {
      this.loading = true;
      this.logout()
        .then(message => {
          this.$router.push({
            name: "login",
            query: { next: this.$route.path || "/" },
            params: {
              message: {
                message,
                type: "is-info"
              }
            }
          });
        })
        .catch(err => {
          console.error(err);
        })
        .finally(() => {
          this.loading = false;
        });
    }
  }
};
</script>
