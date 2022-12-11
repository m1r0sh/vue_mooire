<template>
    <li class="catalog__item">

      <router-link class="catalog__pic" :to="{name: 'product', params: {id: product.id}}">
        <img :src="currentImage" :alt="product.title">
      </router-link>

      <h3 class="catalog__title">
        <a href="#">
          {{product.title}}
        </a>
      </h3>

      <span class="catalog__price">{{ product.price | numberFormat }} ₽</span>

      <ul class="colors colors--black">
        <li class="colors__item"
            v-for="color in product.colors"
            :key="color.id"
        >
          <label class="colors__label">
            <input class="colors__radio sr-only"
                   type="radio" name="color-1"
                   :value="color.color.code"
                   v-model="currentCode"
            >
            <span class="colors__value"
                  :style="`background-color: ${color.color.code};`"
            >
                  </span>
          </label>
        </li>
      </ul>
    </li>
</template>

<script>
import numberFormat from "../helpers/numberFormat";

  export default {
    props: ['product'],
    data() {
      return {
        currentCode: this.product.colors[0].color.code
      }
    },
    filters: {
     numberFormat
    },
    computed: {
      currentImage() {
        const color = this.product.colors.find(c => c.color.code === this.currentCode);
        return color.gallery ? color.gallery[0].file.url : "https://brilliant24.ru/files/cat/template_01.png";
      }
    }
  }
</script>
