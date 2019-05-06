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
          <div class="level">
            <div class="level-item">
              <b-tooltip
                label="Mais info"
                type="is-dark"
                position="is-left"
                animated
              >
                <b-button icon-left="eye" size="is-small" />
              </b-tooltip>
            </div>
            <div class="level-item">
              <b-tooltip
                label="Alugar livro"
                type="is-dark"
                position="is-left"
                animated
                v-if="props.row.state !== 'alugado'"
              >
                <b-button
                  icon-left="bookmark-plus"
                  size="is-small"
                  @click="openRentABookModal(props.row)"
                />
              </b-tooltip>
              <b-tooltip
                label="Devolver livro"
                type="is-dark"
                position="is-left"
                animated
                v-else
              >
                <b-button icon-left="bookmark-minus" size="is-small" />
              </b-tooltip>
            </div>
          </div>
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
import { Icon } from "buefy/dist/components/icon";
import { Input } from "buefy/dist/components/input";
import { ModalProgrammatic } from "buefy/dist/components/modal";
import { Table, TableColumn } from "buefy/dist/components/table";
import { Tag } from "buefy/dist/components/tag";
import { Tooltip } from "buefy/dist/components/tooltip";

import { ajax } from "@/assets/js/functions";
import Form from "@/components/service/BookRentForm";

export default {
  name: "ServiceViewBooks",
  components: {
    BButton: Button,
    BIcon: Icon,
    BInput: Input,
    BTable: Table,
    BTableColumn: TableColumn,
    BTag: Tag,
    BTooltip: Tooltip
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
          this.books = [];
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
    handleSearch: _.debounce((term, vm) => {
      if (!term.length) {
        vm.fetchBooks();
      } else if (term.length > 3) {
        vm.fetchBooks(1, term);
      }
    }, 500),
    openRentABookModal(book) {
      ModalProgrammatic.open({
        parent: this,
        component: Form,
        props: { book },
        events: {
          reload: () => {
            this.fetchBooks(this.pagination.current_page)
          }
        },
        hasModalCard: true,
        canCancel: false
      });
    }
  }
};
</script>
