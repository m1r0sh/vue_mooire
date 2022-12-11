<template>
  <div class="cart__block">
    <ul class="cart__orders">
      <li class="cart__order" v-for="item in payload.items" :key="item.productId">
        <h3>{{ item.product.title }}</h3>
        <b>{{ item.product.price }} ₽</b>
        <span>{{ item.product.id }}</span>
      </li>
    </ul>

    <div class="cart__total">
      <p>Доставка: <b>{{ deliverPrice == 0 ? 'бесплатно' : deliverPrice + " ₽"}} </b></p>
      <p>Итого: <b>{{ payload.items.length }}</b> товара на сумму <b>{{ payload.totalPrice | numberFormat }} ₽</b></p>
    </div>

    <button v-if="showOrderBtn" class="cart__button button button--primery " type="submit" >
      Оформить заказ
    </button>
  </div>
</template>

<script>
import numberFormat from "../helpers/numberFormat";

export default {
  props: ['payload', 'showOrderBtn', 'deliverPrice'],
  filters: {numberFormat},
}
</script>
