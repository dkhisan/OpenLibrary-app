<template>
  <div class="modal-card">
    <form @submit.prevent="validate" autocomplete="off">
      <header class="modal-card-head">
        {{ modalTitle }}
      </header>
      <section class="modal-card-body">
        <div class="columns">
          <div class="column">
            <b-field :message="errors.name">
              <b-input
                placeholder="Nome completo"
                v-model="userUp.name"
                :message="errors.name"
                required
              />
            </b-field>
          </div>
          <div class="column">
            <b-field :message="errors.avatar">
              <b-input
                placeholder="Avatar"
                v-model="userUp.avatar"
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
                v-model="userUp.address"
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
                :readonly="this.method === 'put'"
              />
            </b-field>
          </div>
          <div class="column">
            <b-field>
              <b-input placeholder="Telefone/Celular" v-model="userUp.phone" />
            </b-field>
            <b-field :message="errors.password">
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
        <b-field position="is-centered" :message="errors.role">
          <b-radio native-value="leitor" v-model="userUp.role"
            >Leitor</b-radio
          >
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
  name: "UserSaveForm",
  components: {
    BButton: Button,
    BField: Field,
    BInput: Input,
    BRadio: Radio
  },
  props: {
    method: {
      type: String,
      required: true
    },
    user: {
      type: Object,
      required: false
    }
  },
  created() {
    if (this.user) {
      this.userUp = Object.assign({}, this.user);
      this.modalTitle = this.user.name;
    } else {
      this.modalTitle = "Cadastrar usuário";
    }
  },
  data() {
    return {
      loading: false,
      modalTitle: "",
      userUp: {},
      errors: {}
    };
  },
  methods: {
    validate() {
      const required = "O campo deve ser preenchido.";
      this.errors = {};

      if (!this.userUp.name) {
        this.errors.name = required;
      }
      if (!this.userUp.avatar) {
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
      const index = this.method === "post" ? "" : `/${this.user.id}`;
      ajax("//localhost:8000/api/v1/users", this.userUp, this.method, index)
        .then(() => {
          const message =
            this.method === "post"
              ? "Cadastro realizado"
              : "Informações do usuário atualizadas";
          Toast.open({
            message,
            type: "is-success",
            duration: 5000
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
