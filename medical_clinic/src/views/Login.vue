<template>
  <div>
    <h1>Log In</h1>
    <form @submit.prevent="login()">
      <input v-model="email" type="email" placeholder="email" />
      <input v-model="password" type="password" placeholder="parola" />
      <button type="submit">Logare</button>
    </form>
    <div>
      {{ mesaj }}
    </div>
  </div>
</template>

<script>
import utils from "../utils.js";

export default {
  name: "Login",
  data() {
    return {
      email: "",
      password: "",
      mesaj: "",
    };
  },
  methods: {
    login() {
      console.log(`Vrei sa te autentifici cu email: ${this.email}`);

      let data = {
        email: this.email,
        password: this.password,
      };

      let requestParameters = utils.globalRequestParameters;
      requestParameters.method = "POST";
      requestParameters.body = JSON.stringify(data);

      fetch(utils.url + "login", requestParameters).then((res) => {
        res.json().then((res) => {
          this.mesaj = res.message;
          if (res.token) {
            localStorage.setItem("token", res.token);
            this.$store.dispatch("login", true);
          }
          this.$router.push("/");
        });
      });
    },
  },
};
</script>

<style></style>
