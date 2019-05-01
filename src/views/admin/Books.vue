<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
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
              <b-button icon-left="file-document-edit-outline" size="is-small" />
            </div>
            <div class="level-item">
              <b-button type="is-danger" icon-left="trash-can-outline" size="is-small" />
            </div>
          </div>
        </b-table-column>
      </template>
    </b-table>
  </section>
</template>

<script>
import { Button } from "buefy/dist/components/button";
import { Icon } from "buefy/dist/components/icon";
import { Table, TableColumn } from "buefy/dist/components/table";
import { ajax } from "@/assets/js/functions";

export default {
  name: "AdminViewBooks",
  components: {
    BButton: Button,
    BIcon: Icon,
    BTable: Table,
    BTableColumn: TableColumn
  },
  created() {
    this.fetchBooks();
  },
  data() {
    return {
      loading: true,
      books: [],
      pagination: {}
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
    }
  }
};
</script>
