<template>
  <section>
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
        <b-table-column field="profile.name" label="Nome completo">
          {{ props.row.profile.name }}
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
                  icon-left="file-document-edit-outline"
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
import { ModalProgrammatic } from "buefy/dist/components/modal";
import { Table, TableColumn } from "buefy/dist/components/table";
import { Tag } from "buefy/dist/components/tag";
import { Toast } from "buefy/dist/components/toast";
import { Tooltip } from "buefy/dist/components/tooltip";

import { ajax } from "@/assets/js/functions";
import Form from "@/components/admin/UserEditForm";

export default {
  name: "AdminViewUsers",
  components: {
    BButton: Button,
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
    fetchUsers(page = 1) {
      this.loading = true;
      const url = "//localhost:8000/api/v1/users?profile=true&page=" + page;

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
    openUserEditModal(user) {
      ModalProgrammatic.open({
        parent: this,
        component: Form,
        props: { user },
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
        message: `Tem certeza de que quer apagar "${user.profile.name}"?`,
        cancelText: "Não",
        confirmText: "Sim",
        onConfirm: async () => {
          await this.deleteBook(user.id);
        }
      });
    },
    deleteBook(id) {
      ajax("//localhost:8000/api/v1/users/" + id, null, "delete")
        .then(() => {
          this.fetchUsers();
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
