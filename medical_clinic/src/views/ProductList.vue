<template>
  <div>

    <Product
      @edit="editProduct"
      :product="elem"
      v-for="elem in products"
      :key="elem"

    />
    <edit-product :product="formProduct" />
  </div>
</template>

<script>
import Product from "../components/Product.vue";
import EditProduct from "./EditProduct.vue"
import utils from "../utils.js";

export default {
  name: "ProductList",
  components: {
    Product,
    EditProduct,
  },
  data() {
    return {
      formProduct: {},
    };
  },
  created() {
    let url = utils.url;
    let requestParam = utils.globalRequestParameters;
    if (!this.products.length) {
      fetch(url + "products", requestParam).then((res) =>
        res.json().then((res) => {
          this.$store.dispatch("fetchProducts", res);
        })
      );
    }
  },
  computed: {
    products() {
      return this.$store.state.products;
    },
  },
  methods: {
    editProduct(product) {
      this.formProduct = product;
    },
  },
};
</script>

<style></style>
