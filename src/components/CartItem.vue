<template>
  <li class="cart__item product">
    <div class="product__pic">
      <img :src="item.image" width="120" height="120"  :alt="item.product.title">
    </div>
    <h3 class="product__title">
      {{ item.product.title }}
    </h3>
    <p class="product__info product__info--color">
      Цвет:
      <span>
        <i :style="`background-color: ${item.color.color.code}`"></i>
      </span>
    </p>
    <span class="product__code">
                Артикул: {{ item.product.slug }}
              </span>

    <div class="product__counter form__counter">
      <button type="button" aria-label="Убрать один товар" @click.prevent = "amount-- <= 0 ? amount++ : 1">
        <svg width="10" height="10" fill="currentColor">
          <use xlink:href="#icon-minus"></use>
        </svg>
      </button>

      <input type="text" v-model.number="amount" name="count">

      <button type="button" aria-label="Добавить один товар" @click.prevent = "amount++">
        <svg width="10" height="10" fill="currentColor">
          <use xlink:href="#icon-plus"></use>
        </svg>
      </button>
    </div>

    <b class="product__price">
      {{ item.quantity * item.product.price }} ₽
    </b>

    <button class="product__del button-del" type="button" aria-label="Удалить товар из корзины" @click.prevent="deleteCartData(item.id)">
      <svg width="20" height="20" fill="currentColor">
        <use xlink:href="#icon-close"></use>
      </svg>
    </button>
  </li>
</template>

<script>
import {mapMutations} from 'vuex';
import {mapActions} from  'vuex';

export default {
  props: ['item'],
  methods: {
    ...mapMutations({deleteProduct: 'deleteCartProduct'}),
    ...mapActions({deleteCartData: 'deleteCartProductAmount'}),

  },
  computed: {
    amount: {
      get(){
        return this.item.quantity
      },
      set(value){
        this.$store.dispatch('updateCartProductAmount', {productId: this.item.id, amount: value})
      }
    },
  }

}
</script>
