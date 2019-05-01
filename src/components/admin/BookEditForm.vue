<template>
  <div class="modal-card">
    <form @submit.prevent="validate" autocomplete="off">
      <header class="modal-card-head">
        {{ book.title }}
      </header>
      <section class="modal-card-body">
        <b-field>
          <b-input
            placeholder="Título do livro"
            v-model="bookUp.title"
            :message="errors.title"
            required
          />
        </b-field>
        <div class="columns">
          <div class="column">
            <b-field>
              <b-input placeholder="Autor" v-model="bookUp.author" />
            </b-field>
            <b-field>
              <b-input
                type="number"
                placeholder="Ano de publicação"
                v-model="bookUp.year"
              />
            </b-field>
          </div>
          <div class="column">
            <b-field>
              <b-input placeholder="Editora" v-model="bookUp.publisher" />
            </b-field>
            <b-field>
              <b-input
                placeholder="Capa do livro"
                v-model="bookUp.cover"
                :message="errors.cover"
                required
              />
            </b-field>
          </div>
        </div>
        <b-field>
          <b-input
            type="textarea"
            placeholder="Descrição do livro"
            v-model="bookUp.description"
            :message="errors.description"
            required
          />
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
import { Toast } from "buefy/dist/components/toast";

import { ajax } from "@/assets/js/functions";

export default {
  name: "BookEditDialog",
  components: {
    BButton: Button,
    BField: Field,
    BInput: Input
  },
  props: {
    book: {
      type: Object,
      required: true
    }
  },
  created() {
    this.bookUp = Object.assign({}, this.book);
  },
  data() {
    return {
      loading: false,
      bookUp: {},
      errors: {}
    };
  },
  methods: {
    validate() {
      const required = "O campo deve ser preenchido.";
      this.errors = {};

      if (!this.bookUp.title) {
        this.errors.title = required;
      }
      if (!this.bookUp.cover) {
        this.errors.cover = required;
      }
      if (!this.bookUp.description) {
        this.errors.description = required;
      }

      if (_.isEmpty(this.errors)) this.saveBook();
    },
    saveBook() {
      this.loading = true;
      ajax("//localhost:8000/api/v1/books/", this.bookUp, "put", this.book.id)
        .then(() => {
          Toast.open({
            message: "As informações do livro foram atualizadas.",
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
