<template>
  <div class="modal-card">
    <form @submit.prevent="validate">
      <header class="modal-card-head">
        Alugar livro
      </header>
      <section class="modal-card-body">
        <b-field label="Livro">
          <b-input :value="book.title" readonly />
        </b-field>
        <b-field label="Cliente" :message="errors.user">
          <b-autocomplete
            field="name"
            :data="users"
            :loading="loadingUsers"
            @typing="handleSearch"
            @select="option => (rental.user_id = option.id)"
            required
          />
        </b-field>
        <b-field label="Tempo (dias)" :message="errors.days">
          <b-input type="number" v-model.number="rental.days" required />
        </b-field>
      </section>
      <footer class="modal-card-foot">
        <b-button :disabled="loading" @click.prevent="close">Fechar</b-button>
        <b-button native-type="submit" type="is-primary" :loading="loading"
          >Alugar</b-button
        >
      </footer>
    </form>
  </div>
</template>

<script>
import { Autocomplete } from "buefy/dist/components/autocomplete";
import { Button } from "buefy/dist/components/button";
import { Field } from "buefy/dist/components/field";
import { Input } from "buefy/dist/components/input";
import { Toast } from "buefy/dist/components/toast";

import { ajax } from "@/assets/js/functions";
import debounce from "lodash/debounce";
import moment from "moment";

export default {
  name: "BookRentForm",
  components: {
    BAutocomplete: Autocomplete,
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
  data() {
    return {
      loading: false,
      loadingUsers: false,
      users: [],
      rental: {},
      errors: {}
    };
  },
  methods: {
    validate() {
      const required = "O campo deve ser preenchido.";
      this.errors = {};

      if (!this.rental.user_id) {
        this.errors.user = required;
      }
      if (this.rental.days < 1) {
        this.errors.days = "O tempo de aluguel não pode ser menor que 1 dia.";
      }

      // eslint-disable-next-line no-undef
      if (_.isEmpty(this.errors)) this.rent();
    },
    fetchUsers(name) {
      const url = `//localhost:8000/api/v1/users?name=${name}&reader=true`;

      ajax(url, null)
        .then(res => {
          this.users = res.data.map(user => user);
        })
        .catch(err => {
          Toast.open({
            message: err,
            type: "is-danger",
            duration: 5000
          });
        })
        .finally(() => {
          this.loadingUsers = false;
        });
    },
    rent() {
      this.loading = true;
      this.rental.book_id = this.book.id;
      this.rental.state = "alugado";
      this.rental.time = moment()
        .add(this.rental.days, "days")
        .format("YYYY-MM-DD HH:mm:ss");
      this.rental.rent_at = moment().format("YYYY-MM-DD HH:mm:ss");
      console.log(this.rental);
      ajax("//localhost:8000/api/v1/rents", this.rental, "post")
        .then(() => {
          Toast.open({
            message: `Sucesso! O livro foi alugado por ${
              this.rental.time
            } dias`,
            type: "is-success",
            duration: 5000
          });
          this.close();
          this.$emit("reload");
        })
        .catch(err => {
          Toast.open({
            message: err,
            type: "is-danger",
            duration: 5000
          });
        })
        .finally(() => {
          this.loading = false;
        });
    },
    handleSearch: debounce(async function(term) {
      if (term.length > 3) {
        this.loadingUsers = true;
        await this.fetchUsers(term);
      }
    }, 500),
    close() {
      this.$emit("close");
    }
  }
};
</script>
