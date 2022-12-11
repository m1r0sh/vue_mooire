<template>
  <div id="app">
      <Header/>
      <router-view/>
      <Footer/>
  </div>
</template>

<script>

import Header from "./components/Header";
import Footer from "./components/Footer";
import {mapActions} from "vuex";
import {mapMutations} from "vuex";

export default {
  components: {Footer, Header},
  created() {
    const userAccessKey = localStorage.getItem('userAccessKey');
    if(userAccessKey){
      this.updateUserAccessKey(userAccessKey)
    }
    this.loadCart()
  },
  methods: {
    ...mapActions(['loadCart', 'loadUserKey']),
    ...mapMutations(['updateUserAccessKey']),
  }
}
</script>
