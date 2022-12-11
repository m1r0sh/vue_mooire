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
          <router-link :to="{name: 'cart'}" class="breadcrumbs__link" >
            Корзина
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link">
            Оформление заказа
          </a>
        </li>
      </ul>

      <div class="content__row">
        <h1 class="content__title">
          Оформление заказа
        </h1>
      </div>
    </div>

    <section class="cart">
      <form class="cart__form form" action="#" method="POST" @submit.prevent="order">
        <div class="cart__field">
          <div class="cart__data">
            <BaseFormText v-model="formData.name" :error="formError.name" title="ФИО" placeholder="Введите ваше полное имя"/>
            <BaseFormText v-model="formData.address" :error="formError.address" title="Адрес доставки" placeholder="Введите ваш адрес"/>
            <BaseFormText v-model="formData.phone" :error="formError.phone" title="Телефон" placeholder="Введите ваш телефон"/>
            <BaseFormText v-model="formData.email" :error="formError.email" title="Email" placeholder="Введи ваш Email"/>
            <BaseFormTextarea title="Комментарий к заказу" v-model="formData.comment" :error="formError.comment" placeholder="Ваши пожелания"/>
          </div>
          <div class="cart__options">
            <h3 class="cart__title">Доставка</h3>
            <ul class="cart__options options">
              <li class="options__item" v-for="item in deliveries" :key="item.id">
                <label class="options__label">
                  <input class="options__radio sr-only" type="radio" required :value="item.id" v-model="currentDeliveryId">
                  <span class="options__value">
                    {{ item.title }} <b>{{ item.price == 0 ? 'бесплатно' : `${item.price} ₽` }} </b>
                  </span>
                </label>
              </li>
            </ul>

            <h3 class="cart__title">Оплата</h3>
            <ul class="cart__options options">
              <li class="options__item" v-for="item in payments">
                <label class="options__label">
                  <input class="options__radio sr-only" type="radio" :value="item.id" v-model="currentPayment">
                  <span class="options__value">
                    {{ item.title }}
                  </span>
                </label>
              </li>
            </ul>
          </div>
        </div>

        <CartListProducts :payload="dataForSidebar" :show-order-btn="true" :deliverPrice="currentDelivery.price" />

        <div class="cart__error form__error-block" v-if="formErrorMessage">
          <h4>Заявка не отправлена!</h4>
          <p>
            {{formErrorMessage}}}
          </p>
        </div>
      </form>
    </section>
  </main>
</template>

<script>
import BaseFormText from "../components/BaseFormText";
import BaseFormTextarea from "../components/BaseFormTextarea";
import CartListProducts from "../components/CartListProducts";
import axios from "axios";
import {mapGetters} from "vuex";


export default {
  components: {BaseFormTextarea, BaseFormText, CartListProducts},
  data() {
    return{
      formData: {},
      formError: {},
      formErrorMessage: '',

      deliveries: [],
      payments: [],
      currentDeliveryId: null,
      currentPayment: null
    }
  },
  computed:{
    ...mapGetters({products: 'cartDetailProducts', totalPrice: 'cartTotalPrice'}),
    dataForSidebar(){
      return {
        items: this.products,
        totalPrice: this.totalPrice,
      }
    },
    currentDelivery () {
      return this.deliveries.find(e => e.id === this.currentDeliveryId) || {}
    }
  },
  methods: {
    order(){
      this.formError = {};
      this.formErrorMessage = '';

      axios
          .post('https://vue-moire.skillbox.cc/api/orders', {
            ...this.formData,
            deliveryTypeId: this.currentDeliveryId,
            paymentTypeId: this.currentPayment
          }, {
            params: {
              userAccessKey: this.$store.state.userAccessKey
            }
          })
          .then(response => {
            this.$store.commit('resetCart');
            this.$store.commit('updateOrderInfo', response.data);
            this.$router.push({name:'orderInfo', params: {id: response.data.id}});
          })
          .catch(error => {
            this.formError = error.response.data.error.request || {};
            this.formErrorMessage = error.response.data.error.message;
          })
    },
    loadDeliveries() {
      return axios.get('https://vue-moire.skillbox.cc/api/deliveries')
          .then(response => this.deliveries = response.data)
    },
    loadPayments() {
      return axios.get('https://vue-moire.skillbox.cc/api/payments', {
        params: {
          deliveryTypeId: this.currentDeliveryId
        }})
          .then(response => this.payments = response.data)
    }
  },
  async created() {
    // грузим варианты доставки
    await this.loadDeliveries()
    // выбираем по умолчанию первый
    this.currentDeliveryId = this.deliveries[0].id
  },
  watch: {
    async currentDeliveryId () {
      // следим за изменением типа доставки, и при изменении грузим возможные варианты оплаты
      await this.loadPayments()
      // выбираем по умолчанию первый
      this.currentPayment = this.payments[0].id
    }
  }
}
</script>
