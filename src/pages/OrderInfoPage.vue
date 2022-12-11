<template>
  <main class="content container">
    <div class="content__top">
      <ul class="breadcrumbs">
        <li class="breadcrumbs__item">
          <router-link :to="{name: 'main'}" class="breadcrumbs__link">
            Каталог
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <router-link :to="{name: 'cart'}" class="breadcrumbs__link">
            Корзина
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <router-link :to="{name: 'order'}" class="breadcrumbs__link">
            Оформление заказа
          </router-link>
        </li>
      </ul>

      <h1 class="content__title">
        Заказ оформлен <span>№ 23621</span>
      </h1>
    </div>

    <section class="cart">
      <form class="cart__form form" action="#" method="POST">
        <div class="cart__field">
          <p class="cart__message">
            Благодарим за&nbsp;выбор нашего магазина. На&nbsp;Вашу почту придет письмо с&nbsp;деталями заказа.
            Наши менеджеры свяжутся с&nbsp;Вами в&nbsp;течение часа для уточнения деталей доставки.
          </p>

          <ul class="dictionary">
            <li class="dictionary__item">
              <span class="dictionary__key">
                Получатель
              </span>
              <span class="dictionary__value">
                {{orderInfo.name}}
              </span>
            </li>
            <li class="dictionary__item">
              <span class="dictionary__key">
                Адрес доставки
              </span>
              <span class="dictionary__value">
                {{orderInfo.address}}
              </span>
            </li>
            <li class="dictionary__item">
              <span class="dictionary__key">
                Телефон
              </span>
              <span class="dictionary__value">
                {{orderInfo.phone}}
              </span>
            </li>
            <li class="dictionary__item">
              <span class="dictionary__key">
                Email
              </span>
              <span class="dictionary__value">
                {{orderInfo.email}}
              </span>
            </li>
            <li class="dictionary__item">
              <span class="dictionary__key">
                Способ оплаты
              </span>
              <span class="dictionary__value">
                картой при получении
              </span>
            </li>
          </ul>
        </div>
        <CartListProducts  :payload="dataForSidebar" :show-order-btn="false" :deliverPrice="orderInfo.deliveryType.price"/>
      </form>
    </section>
  </main>
</template>

<script>
import CartListProducts from "../components/CartListProducts";
import {mapGetters} from "vuex";
import axios from "axios";

export default {
  components: {CartListProducts},
  computed: {
    ...mapGetters({products: 'cartDetailProducts', totalPrice: 'cartTotalPrice'}),
    orderInfo() {
      return this.$store.state.orderInfo;
    },
    dataForSidebar(){
      if (!this.orderInfo) return {}
      return {
        items: this.orderInfo.basket.items,
        totalPrice: this.orderInfo.totalPrice,
      }
    }
  },
  methods: {
    loadCheckList(){
      axios.get('https://vue-moire.skillbox.cc/api/orders')
    },
  },
  created() {
    if(this.$store.state.orderInfo && this.$store.state.orderInfo.id === this.$route.params.id){
      return;
    }
    this.$store.dispatch('loadOrderInfo', this.$route.params.id)
  }
}
</script>
