<template>
  <div>
    <h1>Register</h1>
    <form @submit.prevent="register()">
      <input v-model="fullName" type="text" placeholder="Full Name" />
      <input v-model="password" type="password" placeholder="password" />
      <input v-model="email" type="email" placeholder="Email" />
      <input v-model="phone" type="text" placeholder="Phone Number" />
      <input v-model="yearsOld" type="text" placeholder="Years Old" />
      <button type="submit">Register</button>
    </form>
    <div>
      {{ message }}
    </div>
  </div>
</template>

<script>
import utils from "../utils.js";

export default {
  name: "Register",
  data() {
    return {
      fullName: "",
      password: "",
      email: "",
      phone: "",
      yearsOld: "",
      message: "",
    };
  },
  methods: {
    register() {
      console.log(`Vrei sa te inregistrezi cu email: ${this.email}`);
      if (
        this.fullName == "" ||
        this.password == "" ||
        this.email == "" ||
        this.phone == "" ||
        isNaN(this.yearsOld) === true
      )
        this.message = "Nu au fost completate corect toate campurile!";
      else {
        this.message = "";

        let client = {
          name: this.fullName,
          email: this.email,
          phone: this.phone,
          yearsOld: this.yearsOld,
          password: this.password,
        };

        let requestParameters = utils.globalRequestParameters;
        requestParameters.method = "POST";
        requestParameters.body = JSON.stringify(client);

        fetch(utils.url + "user", requestParameters).then((res) => {
          res.text().then((res) => (this.message = res));
        });
      }
    },
  },
};
</script>

<style></style>
