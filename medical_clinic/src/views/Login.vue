<template>
  <div>
    <form @submit.prevent="login()" class="box">
      <h1>Login</h1>
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
              this.$store.dispatch("clearAllAppointmentsWithoutToken");
            }
            this.$router.push("/");
          });
        });
      }
    },
  },
};
</script>

<style scoped>
body{
  margin: 0;
  padding: 0;
  font-family: sans-serif;
  background: #34495e;
}
.box{
  width: 400px;
  padding: 40px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  background: #191919;
  text-align: center;
}
.box h1{
  color: white;
  text-transform: uppercase;
  font-weight: 500;
}
.box input[type = "text"],.box input[type = "password"]{
  border:0;
  background: none;
  display: block;
  margin: 20px auto;
  text-align: center;
  border: 2px solid #3498db;
  padding: 14px 10px;
  width: 200px;
  outline: none;
  color: white;
  border-radius: 24px;
  transition: 0.25s;
}
.box input[type = "text"]:focus,.box input[type = "password"]:focus{
  width: 280px;
  border-color: #2ecc71;
}
.box button[type = "submit"]{
  border:0;
  background: none;
  display: block;
  margin: 20px auto;
  text-align: center;
  border: 2px solid #2ecc71;
  padding: 14px 40px;
  outline: none;
  color: white;
  border-radius: 24px;
  transition: 0.25s;
  cursor: pointer;
}
.box button[type = "submit"]:hover{
  background: #2ecc71;
}

</style>
