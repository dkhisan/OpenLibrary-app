<template>
  <section>
    <nav class="navbar">
      <div class="navbar-menu">
        <div class="navbar-start">
          <b-input
            placeholder="Título do livro"
            icon="magnify"
            @input="capture"
          />
        </div>
        <div class="navbar-end">
          <b-switch v-model="my_reserves">Minhas reservas</b-switch>
        </div>
      </div>
    </nav>
    <b-table
      :data="books"
      :loading="loading"
      :total="pagination.total"
      :per-page="pagination.per_page"
      :current-page.sync="pagination.current_page"
      :striped="true"
      @page-change="fetchBooks"
      paginated
      backend-pagination
    >
      <template slot-scope="props">
        <b-table-column field="title" label="Título">
          {{ props.row.title }}
        </b-table-column>
        <b-table-column field="author" label="Autor">
          {{ props.row.author }}
        </b-table-column>
        <b-table-column field="publisher" label="Editora">
          {{ props.row.publisher }}
        </b-table-column>
        <b-table-column field="year" label="Publicação" numeric centered>
          {{ props.row.year }}
        </b-table-column>
        <b-table-column label="Ações" centered v-if="!my_reserves">
          <b-tooltip
            label="Reservar livro"
            type="is-dark"
            position="is-left"
            animated
          >
            <b-button
              icon-left="bookmark"
              size="is-small"
              @click="confirmReserve(props.row)"
            />
          </b-tooltip>
        </b-table-column>
      </template>
    </b-table>
  </section>
</template>

<script>
import { Button } from "buefy/dist/components/button";
import { Dialog } from "buefy/dist/components/dialog";
import { Input } from "buefy/dist/components/input";
import { Switch } from "buefy/dist/components/switch";
import { Table, TableColumn } from "buefy/dist/components/table";
import { Toast } from "buefy/dist/components/toast";
import { Tooltip } from "buefy/dist/components/tooltip";

import { ajax } from "@/assets/js/functions";
import { mapGetters } from "vuex";

export default {
  name: "Books",
  components: {
    BButton: Button,
    BInput: Input,
    BSwitch: Switch,
    BTable: Table,
    BTableColumn: TableColumn,
    BTooltip: Tooltip
  },
  watch: {
    my_reserves() {
      this.fetchBooks();
    }
  },
  created() {
    this.fetchBooks();
  },
  data() {
    return {
      loading: true,
      my_reserves: false,
      books: [],
      pagination: {}
    };
  },
  methods: {
    ...mapGetters(["loggedUser"]),
    fetchBooks(page = 1, title = "") {
      this.loading = true;
      const url = `//localhost:8000/api/v1/books?is_available=${!this
        .my_reserves}&my_reserves=${this.my_reserves}&page=${page}${
        title.length ? `&title=${title}` : title
      }`;

      ajax(url, null)
        .then(res => {
          const { total, per_page, current_page } = res;
          this.books = res.data.map(b => b);
          this.pagination = { total, per_page, current_page };
        })
        .catch(err => {
          this.data = [];
          this.pagination = {};
          throw err;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    capture(term) {
      this.handleSearch(term, this);
    },
    // eslint-disable-next-line no-undef
    handleSearch: _.debounce((term, vm = this) => {
      if (term.length > 3) {
        vm.fetchBooks(vm.pagination.current_page, term);
      }
    }, 500),
    confirmReserve(book) {
      const { id: book_id, title } = book;
      const { id: user_id } = this.loggedUser();
      const rent = {
        user_id,
        book_id,
        state: "reservado"
      };

      Dialog.confirm({
        message: `Reservar o livro "${title}"?`,
        cancelText: "Não",
        confirmText: "Sim",
        onConfirm: async () => {
          await ajax("//localhost:8000/api/v1/rents", rent, "post")
            .then(() => {
              const { current_page } = this.pagination;

              this.fetchBooks(current_page);
            })
            .then(() => {
              this.makeToast({
                message: `Reserva de ${title} foi realizada.`,
                type: "is-success"
              });
            })
            .catch(message => {
              this.makeToast({
                message,
                type: "is-danger"
              });
            });
        }
      });
    },
    makeToast({ message, type }) {
      Toast.open({
        message,
        type
      });
    }
  }
};
</script>
