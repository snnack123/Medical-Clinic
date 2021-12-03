
<template>
  <div>
    <form @submit.prevent="addProduct()">
      <input v-model="name" type="text" placeholder="Product Name" />
      <select v-model="status">
        <option value="true">In Stock</option>
        <option value="false">Out Of Stock</option>
      </select>
      <button type="submit">Add</button>
    </form>
  </div>
</template>

<script>
import utils from "../utils";

export default {
  data() {
    return {
      status: false,
      name: "",
    };
  },
  methods: {
    addProduct() {
      console.log("Adding product... ", "Name: ", this.name, "Status: ", this.status);

      let requestParameters = { ...utils.globalRequestParameters };
      let token = window.localStorage.getItem("token");
      requestParameters.headers.Authorization = "Bearer " + token;
      requestParameters.method = "POST";

      let data = {};
      data.name = this.name;
      data.status = this.status;

      requestParameters.body = JSON.stringify(data);

      fetch(utils.url + "products", requestParameters)
        .then((res) => res.json())
        .then((res) => {
          if ( res.message === "Decoding error!" || res.message === "Your token expired!") {
            console.log("Probleme cu token-ul la adaugare!");
          } else {
            console.log("Am adaugat produsul cu id-ul: " + res.id);
            data.id = res.id;
            this.$store.dispatch("addProduct", data);
            this.$router.push("/");
            /* products.push(data);
            renderProducts(products); */
          }
        });
    },
  },
};
</script>

<style>
</style>