<template>
  <nav class="navbar is-spaced is-dark">
    <div class="container">
      <div class="navbar-brand">
        <span class="navbar-item">###</span>
      </div>
      <div class="navbar-menu">
        <div class="navbar-start">
          <slot name="links" />
        </div>
        <div class="navbar-end">
          <b-button
            class="navbar-item"
            type="is-text"
            :loading="loading"
            @click="confirmLogout"
          >
            <span>Sair</span>
          </b-button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { Button } from "buefy/dist/components/button";
import { Dialog } from "buefy/dist/components/dialog";

import { mapActions } from "vuex";

export default {
  name: "Navbar",
  components: { BButton: Button },
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

<style scoped>
span.icon {
  margin-left: -0.25em;
  margin-right: 0.25em;
}
</style>
