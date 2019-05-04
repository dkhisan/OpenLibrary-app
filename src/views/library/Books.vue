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
        <b-table-column
          field="state"
          label="Status"
          :visible="!!props.row.state"
        >
          <b-tag type="is-success">{{ props.row.state }}</b-tag>
        </b-table-column>
        <b-table-column label="Ações" centered>
          <b-tooltip
            label="Reservar livro"
            type="is-dark"
            position="is-left"
            animated
          >
            <b-button
              icon-left="bookmark"
              size="is-small"
              :disabled="!!props.row.state && props.row.state !== 'disponível'"
              @click="confirmReserve(props.row)"
            />
          </b-tooltip>
        </b-table-column>
      </template>

      <template slot="empty">
        <section class="section">
          <div class="content has-text-grey has-text-centered">
            <p>
              <b-icon icon="emoticon-sad-outline" size="is-large" />
            </p>
            <p>Nenhum resultado.</p>
          </div>
        </section>
      </template>
    </b-table>
  </section>
</template>

<script>
import { Button } from "buefy/dist/components/button";
import { Dialog } from "buefy/dist/components/dialog";
import { Icon } from "buefy/dist/components/icon";
import { Input } from "buefy/dist/components/input";
import { Table, TableColumn } from "buefy/dist/components/table";
import { Tag } from "buefy/dist/components/tag";
import { Toast } from "buefy/dist/components/toast";
import { Tooltip } from "buefy/dist/components/tooltip";

import { ajax } from "@/assets/js/functions";
import { mapGetters } from "vuex";

export default {
  name: "Books",
  components: {
    BButton: Button,
    BIcon: Icon,
    BInput: Input,
    BTable: Table,
    BTableColumn: TableColumn,
    BTag: Tag,
    BTooltip: Tooltip
  },
  computed: {
    ...mapGetters(["loggedUser"])
  },
  created() {
    this.fetchBooks();
  },
  data() {
    return {
      loading: true,
      available: true,
      title: "",
      books: [],
      pagination: {}
    };
  },
  methods: {
    fetchBooks(page = 1) {
      this.loading = true;
      const url = `//localhost:8000/api/v1/books?is_available=${
        this.available
      }&page=${page}${this.title.length ? `&title=${this.title}` : this.title}`;

      ajax(url, null)
        .then(res => {
          const { total, per_page, current_page } = res;
          this.books = res.data.map(b => b);
          this.pagination = { total, per_page, current_page };
        })
        .catch(err => {
          this.books = [];
          this.pagination = {};
          throw err;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    capture(term) {
      this.title = term;
      this.handleSearch(this);
    },
    // eslint-disable-next-line no-undef
    handleSearch: _.debounce(vm => {
      if (vm.title.length === 0) {
        vm.available = true;
        vm.fetchBooks();
      } else if (vm.title.length > 3) {
        vm.available = false;
        vm.fetchBooks();
      }
    }, 500),
    confirmReserve(book) {
      const { id: book_id, title } = book;
      const { id: user_id } = this.loggedUser;
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
              Dialog.alert({
                message: `Reserva de "${title}" foi realizada.\nAtenção, você tem um dia para retirar o livro ou então perderá sua reserva.`,
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
