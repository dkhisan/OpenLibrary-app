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
          <b-button
            type="is-success"
            icon-left="book-plus"
            @click="openBookStoreModal"
            >Cadastrar livro</b-button
          >
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
        <b-table-column label="Ações" centered>
          <b-tooltip
            label="Reservar livro"
            type="is-dark"
            position="is-left"
            animated
          >
            <b-button
              icon-left="file-document-edit-outline"
              size="is-small"
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
import { Table, TableColumn } from "buefy/dist/components/table";
import { Tooltip } from "buefy/dist/components/tooltip";

import { ajax } from "@/assets/js/functions";

export default {
  name: "Books",
  components: {
    BButton: Button,
    BInput: Input,
    BTable: Table,
    BTableColumn: TableColumn,
    BTooltip: Tooltip
  },
  created() {
    this.fetchBooks();
  },
  data() {
    return {
      loading: true,
      books: [],
      pagination: {},
    };
  },
  methods: {
    fetchBooks(page = 1, title = "") {
      this.loading = true;
      const url = `//localhost:8000/api/v1/books?page=${page}${
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
    handleSearch: _.debounce((term, vm = this) => {
      if (term.length > 3) {
        vm.fetchBooks(vm.pagination.current_page, term);
      }
    }, 500),
    confirmReserve(book) {
      Dialog.confirm({
        message: `Reservar o livro "${book.title}"?`,
        cancelText: "Não",
        confirmText: "Sim",
        onConfirm: async () => {
          return;
        }
      });
    }
  }
};
</script>
