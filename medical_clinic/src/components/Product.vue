<template>
  <div>
    <b>{{ product.name }} </b>
    {{ product.status ? "In Stock" : "Out of Stock" }}
    <button v-if="isAuthenticated" v-bind:id="product.id"  @click="edit">Edit</button>
    <button v-if="isAuthenticated" v-bind:id="'DELETE_'+product.id" @click="deleteProduct">Delete</button>
  </div>
</template>

<script>
import utils from "../utils.js";

export default {
  name: "Product",
  props: {
    product: Object,
  },
  data() {
    return {};
  },
  computed: {
    isAuthenticated() {
      return this.$store.state.isAuthenticated;
    },
  },
  methods: {
    edit() {
      this.$emit("edit", this.product);
    },
    deleteProduct() {
      let idDelete = document.getElementById(`DELETE_${this.product.id}`).getAttribute('id').split('_')[1];
      console.log('Vreau sa sterg produsul: ' + idDelete);
      let requestParameters = utils.globalRequestParameters;
      let token = window.localStorage.getItem('token');
      requestParameters.headers.Authorization = 'Bearer ' + token;
      requestParameters.method = 'DELETE';

      fetch(utils.url + 'products/' + idDelete, requestParameters)
      .then(res => res.json())
      .then(res => {
        if (res.message === 'Decoding error!' || res.message === "Your token expired!") {
          console.log('nu ai voie!')
        } else {
          console.log(res.message);
          this.$store.dispatch("deleteProduct", idDelete);
        }
      })
    }
  },
};
</script>

<style>
</style>
