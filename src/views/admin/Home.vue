<template>
  <div>
    <section>
      <navbar />
    </section>
    <section class="section">
      <div class="container">
        <div class="columns">
          <div class="column is-4">
            <sidebar />
          </div>
          <div class="column is-8">
            <router-view name="admin.views" />
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
