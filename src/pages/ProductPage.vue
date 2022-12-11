<template>
  <main class="content container" v-if="productData">
    <div class="content__top">
      <ul class="breadcrumbs">
        <li class="breadcrumbs__item">
          <router-link class ="breadcrumbs__link" :to="{name: 'main'}">
            Каталог
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <router-link class="breadcrumbs__link" :to="{name: `mainFilter`, params: {id:product.category.id}}">
            {{ product.category.title }}
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link">
            {{product.title}}
          </a>
        </li>
      </ul>
    </div>

    <section class="item">
      <div class="item__pics pics">
        <div class="pics__wrapper">
          <img width="570" height="570" :src="mainImage" :alt="product.title">
        </div>
        <ul class="pics__list">
          <li class="pics__item"
              v-for="image in productColors"
              :key="image.id"
          >
            <a href="#" class="pics__link"
               @click.prevent="mainImage = image.gallery[0].file.url"
               :class="{'pics__link--current': mainImage === image.gallery[0].file.url}"
            >
              <img width="98" height="98" :src="image.gallery[0].file.url" alt="Название товара">
            </a>
          </li>
        </ul>
      </div>

      <div class="item__info">
        <span class="item__code">Артикул: {{ product.id }}</span>
        <h2 class="item__title">
          {{ product.title }}
        </h2>
        <div class="item__form">
          <form class="form" action="#" method="POST" @submit.prevent="addToCart">
            <div class="item__row item__row--center">
              <div class="form__counter">
                <button type="button" aria-label="Убрать один товар" @click.prevent = "productAmount-- <= 0 ? productAmount++ : 1">
                  <svg width="12" height="12" fill="currentColor">
                    <use xlink:href="#icon-minus"></use>
                  </svg>
                </button>

                <input type="text" v-model.number="productAmount">

                <button type="button" aria-label="Добавить один товар" @click.prevent = "productAmount++">
                  <svg width="12" height="12" fill="currentColor">
                    <use xlink:href="#icon-plus"></use>
                  </svg>
                </button>
              </div>

              <b class="item__price">
                {{ product.price | numberFormat }} ₽
              </b>
            </div>

            <div class="item__row">
              <fieldset class="form__block">
                <legend class="form__legend">Цвет</legend>
                <ul class="colors colors--black">
                  <li class="colors__item"
                      v-for="color in productColors"
                      :key="color.color.id"
                      @click="mainImage = color.gallery[0].file.url"
                  >
                    <label class="colors__label">
                      <input class="colors__radio sr-only" type="radio" name="color-item" checked="" required
                             v-model="productApiColors"
                             :value="color.color.id"
                      >
                      <span class="colors__value" :style="`background-color: ${color.color.code}`">
                      </span>
                    </label>
                  </li>
                </ul>
              </fieldset>


              <fieldset class="form__block">
                <legend class="form__legend">Размер</legend>
                <label class="form__label form__label--small form__label--select">
                  <select class="form__select" type="text" name="category"
                          v-model="productApiSize"
                          required
                  >
                    <option :value="size.id"
                            v-for="size in productSize "
                            :key="size.id">{{ size.title }}</option>
                  </select>
                </label>
              </fieldset>
            </div>

            <button class="item__button button button--primery" type="submit" :disabled="productAddSending">
              В корзину
            </button>
            <div v-show="productAdded">Product added in the basket</div>
            <div v-show="productAddSending">Wait proccessing</div>
          </form>
        </div>
      </div>

      <FeatureChange/>

    </section>
  </main>
</template>

<script>
import axios from "axios";
import FeatureChange from "../components/FeatureChange";
import {mapActions} from 'vuex';
import numberFormat from "../helpers/numberFormat";

export default {
  components: {FeatureChange},
  filters: {numberFormat},
  data(){
    return {
      productData: null,
      mainImage: null,

      productAmount: 1,
      productApiSize: null,
      productApiColors: null,

      productAdded: false,
      productAddSending: false,
    }
  },
  computed: {
    product(){
      return this.productData
    },
    productImage() {
      return this.product && this.product.colors[0].gallery ? this.product.colors[0].gallery[0].file.url : "https://brilliant24.ru/files/cat/template_01.png";
    },
    productSize() {
      return this.product.sizes;
    },
    productColors() {
      return this.product.colors.map(color=> {
        return color
      })
    },
  },
  methods: {
    ...mapActions(['addProductToCart']),

    loadProduct(){
      axios.get(`https://vue-moire.skillbox.cc/api/products/` + this.$route.params.id)
          .then(response => {
            this.productData = response.data
            this.productApiColors = this.productColors[0].color.id
            this.productApiSize = this.productSize[0].id
          })
    },
    addToCart() {
      this.addProductToCart({
        productId: this.product.id,
        amount: this.productAmount,
        colorId: this.productApiColors,
        sizeId: this.productApiSize
      })
        .then(() => {
          this.productAdded = true;
          this.productAddSending = false;
        })
    }
  },
  watch: {
    '$route.params.id': {
      handler(){
        this.loadProduct();
      },
      immediate:true
    },
    productImage() {
      this.mainImage = this.productImage;
    }
  }
}
</script>
