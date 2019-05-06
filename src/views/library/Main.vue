<template>
  <section>
    <span class="title is-size-4">Reservas</span>
    <b-table
      :data="reserves.books"
      :loading="reserves.loading"
      :total="reserves.pagination.total"
      :per-page="reserves.pagination.per_page"
      :current-page.sync="reserves.pagination.current_page"
      :striped="true"
      @page-change="page => fetchBooks(reserves, page)"
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
    <span class="title is-size-4">Alugueis</span>
    <b-table
      :data="rented.books"
      :loading="rented.loading"
      :total="rented.pagination.total"
      :per-page="rented.pagination.per_page"
      :current-page.sync="rented.pagination.current_page"
      :striped="true"
      @page-change="page => fetchBooks(rented, page)"
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
        <b-table-column field="time" label="Tempo restante" centered>
          <b-tag type="is-info">
            {{ remaining(props.row.time) }} dia(s)
          </b-tag>
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
import { Icon } from "buefy/dist/components/icon";
import { Table, TableColumn } from "buefy/dist/components/table";
import { Tag } from "buefy/dist/components/tag";

import { ajax } from "@/assets/js/functions";

export default {
  name: "LibraryViewMain",
  components: {
    BIcon: Icon,
    BTable: Table,
    BTableColumn: TableColumn,
    BTag: Tag
  },
  async created() {
    await this.fetchBooks(this.reserves);
    await this.fetchBooks(this.rented);
  },
  data() {
    return {
      reserves: {
        url: "//localhost:8000/api/v1/books?my_reserves=true",
        books: [],
        pagination: {},
        per_page: 6,
        loading: true
      },
      rented: {
        url: "//localhost:8000/api/v1/books?my_rents=true",
        books: [],
        pagination: {},
        per_page: 6,
        loading: true
      }
    };
  },
  methods: {
    fetchBooks(table, page = 1) {
      table.loading = true;
      const url = `${table.url}&page=${page}&per_page=${table.per_page}`;

      ajax(url, null)
        .then(res => {
          const { total, per_page, current_page } = res;
          table.books = res.data.map(b => b);
          table.pagination = { total, per_page, current_page };
        })
        .catch(err => {
          table.books = [];
          table.pagination = {};
          throw err;
        })
        .finally(() => {
          table.loading = false;
        });
    },
    remaining(time) {
      return moment(time).diff(moment(), "days");
    }
  }
};
</script>
