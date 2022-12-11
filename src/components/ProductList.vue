<template>

  <div class="content__catalog">
    <aside class="filter">
      <ProductFilter :price-from.sync = "filterPriceFrom"
                     :price-to.sync = "filterPriceTo"
                     :category-id.sync = "filterCategoryId"
                     :materialIds.sync = "filterMaterialIds"
                     :seasonIds.sync = "filterSeasonIds"
      />
    </aside>

    <section class="catalog">

      <ul class="catalog__list">
        <ProductsItem
            v-for="product in products"
            :key="product.id"
            :product="product"/>
      </ul>

      <Pagination
          v-model="page"
          :productsPerPage="productsPerPage"
          :count="countProducts"
      />

    </section>
  </div>


</template>

<script>
import axios from "axios";
import ProductsItem from "./ProductsItem";
import Pagination from "./Pagination";
import ProductFilter from "./ProductFilter";

export default {
  components: {Pagination, ProductsItem, ProductFilter},
  data() {
    return {
      productsData: null,

      page: 1,
      productsPerPage: 6,

      filterPriceFrom: 0,
      filterPriceTo: 0,
      filterCategoryId: 0,
      filterMaterialIds: [],
      filterSeasonIds: [],

      requestProductsTimer: null,
    };
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
    countProducts(){
      return this.productsData ? this.productsData.pagination.total : 0;
    },
  },
  methods: {
    loadProducts() {
      clearTimeout(this.requestProductsTimer);
      this.requestProductsTimer = setTimeout(() =>{
        axios.get(`https://vue-moire.skillbox.cc/api/products`, {
          params: {
            page: this.page,
            limit: this.productsPerPage,
            categoryId: this.filterCategoryId,
            maxPrice: this.filterPriceTo,
            minPrice: this.filterPriceFrom,
            materialIds: this.filterMaterialIds,
            seasonIds: this.filterSeasonIds
          }
        })
            .then((response) => { this.productsData = response.data; })
      }, 100)
    },
  },
  watch: {
    page() {
      this.loadProducts()
    },
    filterPriceFrom(){
      this.loadProducts();
    },
    filterPriceTo(){
      this.loadProducts();
    },
    filterCategoryId(){
      this.loadProducts();
    },
    filterMaterialIds(){
      this.loadProducts();
    },
    filterSeasonIds(){
      this.loadProducts();
    }
  },
  created() {
    if (this.$route.params.id) {
      this.filterCategoryId = this.$route.params.id
    }
    this.loadProducts();
  }

}
</script>
