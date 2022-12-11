<template>
  <main class="content container">
    <div class="content__top">
      <div class="content__row">
        <h1 class="content__title">
          Каталог
        </h1>
        <span class="content__info">
          {{ products.length  }} товара
        </span>
      </div>
    </div>

    <ProductList/>

  </main>
</template>

<script>
import ProductList from "../components/ProductList";
import axios from "axios";

export default {
  components: {ProductList},
  data() {
    return {
      productsData: null,
    }
  },
  computed: {
    products(){
      return this.productsData ?
          this.productsData.items.map(product => {
            return {
              ...product,
              image: product.colors[0].gallery ? product.colors[0].gallery[0].file.url : "https://brilliant24.ru/files/cat/template_01.png"
            }
          })
          : [];
    },
  },
  methods: {
    loadProducts() {
      this.requestProductsTimer = setTimeout(() =>{
        axios.get(`https://vue-moire.skillbox.cc/api/products`, )
            .then((response) => { this.productsData = response.data; })
      }, 100)
    },
  },
  created() {
    this.loadProducts()
  }
}
</script>