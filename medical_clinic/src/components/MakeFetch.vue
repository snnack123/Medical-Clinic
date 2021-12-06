<template>
  <div></div>
</template>

<script>
import utils from "../utils.js";

export default {
    name:"MakeFetch",
    data() {
        return {

        }
    },
    computed: {
      myClientEmail() {
        return this.$store.state.client.email;
      }
    },
    props: {
      get_email: Number,
      get_appointments: Number,
      raport: Number,
    },
    created() {
      let token = window.localStorage.getItem('token');
      if(this.raport) {
        this.getAllApointmentsWithoutToken();
      }
      if(token) {
        if(this.get_email)
          this.getEmail();
        if(this.get_appointments)
          this.getAllApointments();  
      } else {
        console.log("Nu esti autentificat");
      }

    },
    methods: {
      getEmail() {
        let data = {};
        data.token = localStorage.getItem("token");
        let token = window.localStorage.getItem("token");
        let url = utils.url;
        let requestParam = { ...utils.globalRequestParameters };
        requestParam.headers.Authorization = "Bearer " + token;
        requestParam.method = "POST";
        requestParam.body = JSON.stringify(data);
        fetch(url + "getUserEmail", requestParam).then((res) =>
          res.json().then((res) => {
            if (
              res.message === "Decoding error!" ||
              res.message === "Your token expired!"
            ) {
              console.log("Probleme cu token-ul la adaugare!");
            } else {
              this.$store.dispatch("setEmailClient", res.message);
              this.getUserData();
            }
          })
        );
      },
      getUserData() {
        let data = {};
        data.email = this.myClientEmail;
        let url = utils.url;
        let token = window.localStorage.getItem("token");
        let requestParam = { ...utils.globalRequestParameters };
        requestParam.method = "POST";
        requestParam.headers.Authorization = "Bearer " + token;
        requestParam.body = JSON.stringify(data);
        fetch(url + "getUserData", requestParam).then((res) =>
          res.json().then((res) => {
            if (
              res.message === "Decoding error!" ||
              res.message === "Your token expired!"
            ) {
              console.log("Probleme cu token-ul la adaugare!");
            } else {
              this.$store.dispatch("setClient", res[0]);
            }
          })
        );
      },
      getAllApointments() {
        let url = utils.url;

        let token = window.localStorage.getItem("token");
        let requestParam = { ...utils.globalRequestParameters };
        requestParam.headers.Authorization = "Bearer " + token;
        requestParam.method = "GET";
        requestParam.body = null;
        fetch(url + "getAllAppointments", requestParam).then((res) =>
        res.json().then((res) => 
        this.$store.dispatch("setAllAppointments", res))
      );
      },
      getAllApointmentsWithoutToken() {
        let url = utils.url;

        let requestParam = { ...utils.globalRequestParameters };
        requestParam.headers.Authorization = null;
        requestParam.method = "GET";
        requestParam.body = null;
        fetch(url + "getAllAppointmentsWithoutToken", requestParam).then((res) =>
        res.json().then((res) => 
        this.$store.dispatch("setAllAppointmentsWithoutToken", res))
      );
      },
    },
}
</script>

<style>

</style>