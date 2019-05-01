<template>
  <section>
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
          <div class="level">
            <div class="level-item">
              <b-tooltip
                label="Editar livro"
                type="is-dark"
                position="is-left"
                animated
              >
                <b-button
                  icon-left="file-document-edit-outline"
                  size="is-small"
                  @click="openBookEditModal(props.row)"
                />
              </b-tooltip>
            </div>
            <div class="level-item">
              <b-tooltip
                label="Remover livro"
                type="is-dark"
                position="is-left"
                animated
              >
                <b-button
                  type="is-danger"
                  icon-left="trash-can-outline"
                  size="is-small"
                  @click="confirmDelete(props.row)"
                />
              </b-tooltip>
            </div>
          </div>
        </b-table-column>
      </template>
    </b-table>
  </section>
</template>

<script>
import { Button } from "buefy/dist/components/button";
import { Dialog } from "buefy/dist/components/dialog";
import { ModalProgrammatic } from "buefy/dist/components/modal";
import { Table, TableColumn } from "buefy/dist/components/table";
import { Toast } from "buefy/dist/components/toast";
import { Tooltip } from "buefy/dist/components/tooltip";

import { ajax } from "@/assets/js/functions";
import Form from "@/components/admin/BookEditForm";

export default {
  name: "AdminViewBooks",
  components: {
    BButton: Button,
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
      response: {}
    };
  },
  methods: {
    fetchBooks(page = 1) {
      this.loading = true;
      const url = "//localhost:8000/api/v1/books?page=" + page;

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
    openBookEditModal(book) {
      ModalProgrammatic.open({
        parent: this,
        component: Form,
        props: { book },
        events: {
          reload: async () => {
            await this.fetchBooks();
          }
        },
        hasModalCard: true,
        canCancel: false
      });
    },
    confirmDelete(book) {
      Dialog.confirm({
        message: `Tem certeza de que quer apagar "${book.title}"?`,
        cancelText: "Não",
        confirmText: "Sim",
        onConfirm: async () => {
          await this.deleteBook(book.id);
        }
      });
    },
    deleteBook(id) {
      ajax("//localhost:8000/api/v1/books/" + id, null, "delete")
        .then(() => {
          this.fetchBooks();
        })
        .then(() => {
          Toast.open({
            message: "O registro foi apagado.",
            type: "is-success"
          });
        })
        .catch(err => {
          Toast.open({
            message: err,
            type: "is-danger"
          });
        });
    }
  }
};
</script>
