<template>
  <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link> |
    <router-link v-if="isAuthenticated" to="/new_appointment"
      >New Appointment</router-link
    >
    <router-link v-if="!isAuthenticated" to="/register">Register</router-link> |
    <router-link v-if="!isAuthenticated" to="/login">Login</router-link>

    <button v-if="isAuthenticated" @click="logout()">Logout</button>
    <router-view />
  </div>
</template>

<script>
export default {
  created() {
    this.$store.dispatch("checkAuthenticated");
  },
  computed: {
    isAuthenticated() {
      return this.$store.state.isAuthenticated;
    },
  },
  methods: {
    logout() {
      console.log("Try logout");
      this.$store.commit("SET_AUTH", false);
      window.localStorage.removeItem("token");
      this.$router.push("/");
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
