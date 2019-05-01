<template>
  <div class="modal-card">
    <form @submit.prevent autocomplete="off">
      <section class="modal-card-body">
        <b-field>
          <b-input placeholder="Título" />
        </b-field>
      </section>
      <footer class="modal-card-footer">
        <b-button>Fechar</b-button>
        <b-button type="is-primary">Enviar</b-button>
      </footer>
    </form>
  </div>
</template>

<script>
import { Button } from "buefy/dist/components/button";
import { Field } from "buefy/dist/components/field";
import { Input } from "buefy/dist/components/input";

export default {
  name: "BookEditDialog",
  components: {
    BButton: Button,
    BField: Field,
    BInput: Input
  }
};
</script>
