<template>
  <div>
    <section>
      <navbar />
    </section>
    <section class="section">
      <div class="container">
        <div class="columns">
          <div class="column is-3">
            <sidebar />
          </div>
          <div class="column is-9">
            <router-view />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import Navbar from "@/components/template/Navbar.vue";
import Sidebar from "@/components/template/Sidebar.vue";

export default {
  name: "AdminHome",
  components: { Navbar, Sidebar }
};
</script>
