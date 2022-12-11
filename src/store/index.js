import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);
export default new Vuex.Store({
    state: {
        cartProducts: [],
        userAccessKey: null,
        cartProductsData: [],
        orderInfo: null,
    },
    mutations: {
        updateOrderInfo(state, orderInfo){
            state.orderInfo = orderInfo;
        },
        resetCart(state){
            state.cartProducts = [];
            state.cartProductsData = [];
        },
        updateUserAccessKey(state, accessKey) {
            state.userAccessKey = accessKey;
        },
        updateCartProductsData(state, items){
            state.cartProductsData = items;
        },
        deleteCartProductsData(state, items){
            state.cartProductsData = items;
        },
        syncCartProducts(state){
            state.cartProducts = state.cartProductsData.map(item => {
                return {
                    productId: item.id,
                    amount: item.quantity,
                }
            })
        },
        updateCartProductAmount(state, {productId, amount}){
            const item = state.cartProducts.find(item => item.productId === productId);
            if(item) {
                item.amount = amount;
            }
        },
        deleteCartProduct(state, productId){
            state.cartProducts = state.cartProducts.filter(item => item.productId !== productId)
        },
    },
    actions: {
        loadOrderInfo(context, orderId){
            return axios.get('https://vue-moire.skillbox.cc/api/orders/' + orderId, {
                params: {
                    userAccessKey: context.state.userAccessKey,
                }
            })
                .then(response => {
                    context.commit('updateOrderInfo', response.data)
                });
        },
        loadCart(context){
            return axios.get('https://vue-moire.skillbox.cc/api/baskets/', {
                params: {
                    userAccessKey: context.state.userAccessKey
                }
            })
                .then(response => {
                    if(!context.state.userAccessKey) {
                        localStorage.setItem('userAccessKey', response.data.user.accessKey);
                        context.commit('updateUserAccessKey', response.data.user.accessKey);
                    }
                    context.commit('updateCartProductsData', response.data.items);
                    context.commit('syncCartProducts');
                })
        },
        loadUserKey() {
            return axios.get('https://vue-moire.skillbox.cc/api/users/accessKey')
                .then(response => {
                    localStorage.setItem('userAccessKey', response.data.accessKey)
                })
        },

        addProductToCart(context, {productId, amount, colorId, sizeId}) {
            return axios.post('https://vue-moire.skillbox.cc/api/baskets/products', {
                productId: productId,
                quantity: amount,
                colorId: colorId,
                sizeId: sizeId,
            }, {
                params: {
                    userAccessKey: context.state.userAccessKey
                }
            })
                .then(response => {
                    context.commit('updateCartProductsData', response.data.items);
                    context.commit('syncCartProducts');
                });
        },
        updateCartProductAmount(context, {productId, amount}){
            context.commit('updateCartProductAmount', {productId, amount});

            if(amount < 1) {return;}

            return axios.put('https://vue-moire.skillbox.cc/api/baskets/products', {
                basketItemId: productId,
                quantity: amount
            }, {
                params: {
                    userAccessKey: context.state.userAccessKey,
                }
            })
                .then(response => {
                    context.commit('updateCartProductsData', response.data.items);
                })
                .catch(()=> {
                    context.commit('syncCartProducts');
                });
        },

        deleteCartProductAmount(context, productId) {
            context.commit('deleteCartProduct', productId)

            return axios.delete('https://vue-moire.skillbox.cc/api/baskets/products', {
                params: {
                    userAccessKey: context.state.userAccessKey,
                },
                data: {
                    basketItemId: productId
                }
            })
                .then(response => {
                    context.commit('updateCartProductsData', response.data.items)
                })
                .catch(()=> {
                    context.commit('syncCartProducts');
                })
        }
    },
    getters: {
        cartDetailProducts(state){
            return state.cartProductsData.map(p => {
                const image = p.color.gallery ? p.color.gallery[0].file.url : "https://brilliant24.ru/files/cat/template_01.png"
                return {
                    ...p,
                    image
                }
            })
        },
        cartTotalPrice(state, getters){
            return getters.cartDetailProducts.reduce((acc, item) => (item.price * item.quantity) + acc, 0);
        }

    },
})
