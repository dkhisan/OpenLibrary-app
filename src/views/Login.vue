<template>
  <section class="hero is-fullheight">
    <div class="hero-body">
      <div class="container has-text-centered">
        <div class="column is-4 is-offset-4">
          <h3 class="title has-text-grey">Open Library</h3>
          <p class="subtitle has-text-grey">###</p>
          <b-message v-if="response.message" :type="response.type">
            {{ response.message }}
          </b-message>
          <form @submit.prevent="validate" autocomplete="off">
            <b-field :message="errors.email">
              <b-input
                v-model="account.email"
                placeholder="Email"
                size="is-large"
                icon="account"
                type="email"
                required
              />
            </b-field>
            <b-field :message="errors.password">
              <b-input
                v-model="account.password"
                placeholder="Senha"
                size="is-large"
                icon="lock"
                required
                type="password"
              />
            </b-field>
            <b-button
              native-type="submit"
              type="is-primary is-fullwidth"
              size="is-large"
              :loading="loading"
              >Entrar</b-button
            >
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { Button } from "buefy/dist/components/button";
import { Field } from "buefy/dist/components/field";
import { Input } from "buefy/dist/components/input";
import { Message } from "buefy/dist/components/message";

import { mapActions } from "vuex";
import _ from "lodash";

export default {
  name: "Login",
  components: {
    BButton: Button,
    BField: Field,
    BInput: Input,
    BMessage: Message
  },
  data() {
    return {
      loading: false,
      account: {},
      response: {},
      errors: {}
    };
  },
  methods: {
    ...mapActions(["login"]),
    validate() {
      const required = "O campo deve ser preenchido.";
      this.response = {};

      if (this.account && !this.account.email) {
        this.errors.email = required;
      }
      if (this.account && !this.account.password) {
        this.errors.password = required;
      }

      if (_.isEmpty(this.errors)) this.doLogin();
    },
    doLogin() {
      this.loading = true;
      this.login(this.account)
        .then(() => {
          this.$router.replace(this.$route.query.next || "/redir");
        })
        .catch(err => {
          this.showResponse(err, "is-danger");
        })
        .finally(() => (this.loading = false));
    },
    showResponse(message, type) {
      this.response = {
        type,
        message
      };
    }
  }
};
</script>
