<template>
  <div class="modal-card">
    <form @submit.prevent="validate" autocomplete="off">
      <header class="modal-card-head">
        {{ user.profile.name }}
      </header>
      <section class="modal-card-body">
        <div class="columns">
          <div class="column">
            <b-field>
              <b-input
                placeholder="Nome completo"
                v-model="userUp.profile.name"
                :message="errors.name"
                required
              />
            </b-field>
          </div>
          <div class="column">
            <b-field>
              <b-input
                placeholder="Avatar"
                v-model="userUp.profile.avatar"
                :message="errors.avatar"
                required
              />
            </b-field>
          </div>
        </div>
        <div class="columns">
          <div class="column">
            <b-field>
              <b-input
                placeholder="Endereço"
                v-model="userUp.profile.address"
                :message="errors.address"
              />
            </b-field>
          </div>
        </div>
        <div class="columns">
          <div class="column">
            <b-field>
              <b-input placeholder="CPF" v-model="userUp.cpf" />
            </b-field>
            <b-field>
              <b-input
                placeholder="Email"
                v-model="userUp.email"
                :message="errors.email"
                readonly
              />
            </b-field>
          </div>
          <div class="column">
            <b-field>
              <b-input
                placeholder="Telefone/Celular"
                v-model="userUp.profile.phone"
              />
            </b-field>
            <b-field>
              <b-input
                placeholder="Senha"
                type="password"
                v-model="userUp.password"
                :message="errors.password"
                required
              />
            </b-field>
          </div>
        </div>
        <b-field position="is-centered">
          <b-radio native-value="leitor" v-model="userUp.role">Leitor</b-radio>
          <b-radio native-value="atendente" v-model="userUp.role"
            >Atendente</b-radio
          >
          <b-radio native-value="administrador" v-model="userUp.role"
            >Administrador</b-radio
          >
        </b-field>
      </section>
      <footer class="modal-card-foot">
        <b-button @click.prevent="close" :disabled="loading">Fechar</b-button>
        <b-button native-type="submit" type="is-primary" :loading="loading"
          >Enviar</b-button
        >
      </footer>
    </form>
  </div>
</template>

<script>
import { Button } from "buefy/dist/components/button";
import { Field } from "buefy/dist/components/field";
import { Input } from "buefy/dist/components/input";
import { Radio } from "buefy/dist/components/radio";
import { Toast } from "buefy/dist/components/toast";

import { ajax } from "@/assets/js/functions";

export default {
  name: "UserEditForm",
  components: {
    BButton: Button,
    BField: Field,
    BInput: Input,
    BRadio: Radio
  },
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  created() {
    const { name, avatar, address, phone } = Object.assign({}, this.user.profile);
    const { email, cpf, role } = Object.assign({}, this.user);
    this.userUp = Object.assign({}, { email, role, cpf, profile: { name, avatar, address, phone }});
  },
  data() {
    return {
      loading: false,
      userUp: {},
      profileUp: {},
      errors: {}
    };
  },
  methods: {
    validate() {
      const required = "O campo deve ser preenchido.";
      this.errors = {};

      if (!this.userUp.profile.name) {
        this.errors.name = required;
      }
      if (!this.userUp.profile.avatar) {
        this.errors.avatar = required;
      }
      if (!this.userUp.email) {
        this.errors.email = required;
      }
      if (!this.userUp.password) {
        this.errors.password = required;
      }
      if (!this.userUp.role) {
        this.errors.role = required;
      }

      if (_.isEmpty(this.errors)) this.saveUser();
    },
    saveUser() {
      this.loading = true;
      ajax("//localhost:8000/api/v1/users/", this.userUp, "put", this.user.id)
        .then(() => {
          Toast.open({
            message: "As informações do usuário foram atualizadas.",
            type: "is-success"
          });
        })
        .then(() => {
          this.$emit("reload");
          this.close();
        })
        .catch(err => {
          console.error(err);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    close() {
      this.$emit("close");
    }
  }
};
</script>
