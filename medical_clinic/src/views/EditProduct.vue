<template>
    <div>
    <h1> Edit</h1>
    <form @submit.prevent="editProduct(product.id)">
      <input v-bind:value="formProduct.name" id="productName">
      <select v-bind:value="formProduct.status" id="productStatus">
        <option value=true>In Stock</option>
        <option value=false>Out of Stock</option>
      </select>
      <button v-bind:id=product.id  class="editeaza">Edit</button>
    </form>
  </div>
</template>

<script>
import utils from "../utils.js";

export default {
  name: "EditProduct",
  data() {
    return {
      formProduct: {},
    }
  },
  props: {
    product: Object,
  },
  updated() {
    this.formProduct = this.product;
  },
  computed: {
    products() {
      return this.$store.state.products;
    },
  },
  methods: {
    editProduct(id) {
        if(document.getElementById('productName').value === "") {
          console.log('Alegeti un obiect pe care doriti sa il editati!');
        } 
        else {
          let requestParameters = utils.globalRequestParameters;
          let token = window.localStorage.getItem('token');
          requestParameters.headers.Authorization = 'Bearer ' + token;
          requestParameters.method = 'PUT';
          let data = {};
          data.id = id;
          data.name = document.getElementById('productName').value;
          data.status = document.getElementById('productStatus').value === 'true' ? true : false;
          requestParameters.body = JSON.stringify(data);

          console.log("Vreau sa editez produsul: " + data.id);

          fetch(utils.url + 'products/' + id, requestParameters)
          .then( res => res.json())
          .then( res => {
            if (res.message === 'Decoding error!' || res.message === "Your token expired!")
              console.log('Probleme cu token-ul la editare!');
            else {
              console.log(res.message);
              document.getElementById('productName').value = "";
              document.getElementById("productStatus").selectedIndex = -1;
              document.getElementsByClassName('editeaza')[0].removeAttribute('id');
              this.$store.dispatch("editProduct", data);
            }
          })
         }
    },
  }
}
</script>

<style>
button {
  padding: 5px;
}
</style>