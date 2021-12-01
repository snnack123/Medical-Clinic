<template>
  <div>
    <h1>Login</h1>
    <form @submit.prevent="login()">
      <input v-model="email" type="text" placeholder="Email" />
      <input v-model="password" type="password" placeholder="password" />
      <button type="submit">Login</button>
    </form>
    <div>
      {{ message }}
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
      message: "",
    };
  },
  methods: {
    login() {
      if (this.email == "" || this.password == "")
        this.message = "Toate campurile sunt obligatorii!";
      else {
        this.message = "";
        let data = {
          email: this.email,
          password: this.password,
        };

        let requestParameters = utils.globalRequestParameters;
        requestParameters.method = "POST";
        requestParameters.body = JSON.stringify(data);

        fetch(utils.url + "login", requestParameters).then((res) => {
          res.json().then((res) => {
            this.message = res.message;
            if (res.token) {
              localStorage.setItem("token", res.token);
              this.$store.dispatch("login", true);
            }
            this.$router.push("/");
          });
        });
      }
    },
  },
};
</script>

<style></style>
