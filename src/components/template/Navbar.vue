<template>
  <nav class="navbar is-spaced is-dark">
    <div class="container">
      <div class="navbar-brand"># logo #</div>
      <div class="navbar-menu">
        <div class="navbar-start">
          <router-link :to="{ name: 'admin.dir' }" class="navbar-item">
            <b-icon icon="home" />
            <span>Home</span>
          </router-link>
          <span class="navbar-item">Livros</span>
          <span class="navbar-item">Usuários</span>
        </div>
        <div class="navbar-end">
          <span class="navbar-item">Sair</span>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { Icon } from "buefy/dist/components/icon";

export default {
  name: "Navbar",
  components: { BIcon: Icon }
};
</script>
