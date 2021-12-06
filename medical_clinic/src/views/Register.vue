<template>
    <div>
    <form @submit.prevent="register()" class="box">
      <h1>Register</h1>
      <br /> <br />
      <input v-model="fullName" type="text" placeholder="Full Name" />
      <input v-model="password" type="password" placeholder="password" />
      <input v-model="email" type="email" placeholder="Email" />
      <input v-model="phone" type="text" placeholder="Phone Number" />
      <input v-model="yearsOld" type="text" placeholder="Years Old" />
      <br /> <br />
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

<style scoped>
body{
  margin: 0;
  padding: 0;
  font-family: sans-serif;
  background: #34495e;
}
.box{
  width: 600px;
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
.box input[type = "text"],.box input[type = "password"],.box input[type = "email"]{
  border:0;
  background: none;
  display: block;
  margin: 20px auto;
  text-align: center;
  border: 2px solid #3498db;
  padding: 14px 10px;
  width: 400px;
  outline: none;
  color: white;
  border-radius: 24px;
  transition: 0.25s;
}
.box input[type = "text"]:focus,.box input[type = "password"]:focus, .box input[type = "email"]:focus{
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

@media only screen and (max-width: 1200px) {
  .box {
    font-size: 80%;
    width: 550px;
  }
}

@media only screen and (max-width: 1023px) {
  .box {
    font-size: 70%;
    width: 500px;
  }
}

@media only screen and (max-width: 767px) {
  .box {
    font-size: 60%;
    width: 480px;
  }
}

</style>
