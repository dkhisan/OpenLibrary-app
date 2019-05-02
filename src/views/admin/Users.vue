<template>
  <section>
    <nav class="navbar">
      <div class="navbar-menu">
        <div class="navbar-start">
          <b-input
            placeholder="Nome do usuário"
            icon="magnify"
            @input="capture"
          />
        </div>
        <div class="navbar-end">
          <b-button
            type="is-success"
            icon-left="account-plus-outline"
            @click="openUserStoreModal"
            >Cadastrar usuário</b-button
          >
        </div>
      </div>
    </nav>
    <b-table
      :data="users"
      :loading="loading"
      :total="pagination.total"
      :per-page="pagination.per_page"
      :current-page.sync="pagination.current_page"
      :striped="true"
      @page-change="fetchUsers"
      paginated
      backend-pagination
    >
      <template slot-scope="props">
        <b-table-column field="name" label="Nome completo">
          {{ props.row.name }}
        </b-table-column>
        <b-table-column field="email" label="Email">
          {{ props.row.email }}
        </b-table-column>
        <b-table-column field="role" label="Grupo">
          <b-tag type="is-primary">
            {{ props.row.role }}
          </b-tag>
        </b-table-column>
        <b-table-column label="Ações" centered>
          <div class="level">
            <div class="level-item">
              <b-tooltip
                label="Editar usuário"
                type="is-dark"
                position="is-left"
                animated
              >
                <b-button
                  icon-left="account-edit"
                  size="is-small"
                  @click="openUserEditModal(props.row)"
                />
              </b-tooltip>
            </div>
            <div class="level-item">
              <b-tooltip
                label="Remover usuário"
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
import { Input } from "buefy/dist/components/input";
import { ModalProgrammatic } from "buefy/dist/components/modal";
import { Table, TableColumn } from "buefy/dist/components/table";
import { Tag } from "buefy/dist/components/tag";
import { Toast } from "buefy/dist/components/toast";
import { Tooltip } from "buefy/dist/components/tooltip";

import { ajax } from "@/assets/js/functions";
import Form from "@/components/admin/UserSaveForm";

export default {
  name: "AdminViewUsers",
  components: {
    BButton: Button,
    BInput: Input,
    BTable: Table,
    BTableColumn: TableColumn,
    BTag: Tag,
    BTooltip: Tooltip
  },
  created() {
    this.fetchUsers();
  },
  data() {
    return {
      loading: true,
      users: [],
      pagination: {}
    };
  },
  methods: {
    fetchUsers(page = 1, name = "") {
      this.loading = true;
      const url = `//localhost:8000/api/v1/users?page=${page}${
        name.length ? `&name=${name}` : name
      }`;

      ajax(url, null)
        .then(res => {
          const { total, per_page, current_page } = res;
          this.users = res.data.map(usr => usr);
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
        vm.fetchUsers(vm.pagination.current_page, term);
      }
    }, 500),
    openUserStoreModal() {
      ModalProgrammatic.open({
        parent: this,
        component: Form,
        props: { method: "post" },
        events: {
          reload: async () => {
            await this.fetchUsers(this.pagination.current_page);
          }
        },
        hasModalCard: true,
        canCancel: false
      });
    },
    openUserEditModal(user) {
      ModalProgrammatic.open({
        parent: this,
        component: Form,
        props: { user, method: "put" },
        events: {
          reload: async () => {
            await this.fetchUsers();
          }
        },
        hasModalCard: true,
        canCancel: false
      });
    },
    confirmDelete(user) {
      Dialog.confirm({
        message: `Tem certeza de que quer apagar "${user.name}"?`,
        cancelText: "Não",
        confirmText: "Sim",
        onConfirm: async () => {
          await this.deleteUser(user.id);
        }
      });
    },
    deleteUser(id) {
      ajax("//localhost:8000/api/v1/users/" + id, null, "delete")
        .then(() => {
          this.fetchUsers(this.pagination.current_page);
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
