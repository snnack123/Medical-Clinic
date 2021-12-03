import { createStore } from 'vuex'

export default createStore({
  state: {
    products: [],
    isAuthenticated: false,
  },
  getters: {
    products: state => {
      return state.products;
    }
  },
  mutations: {
    SET_PRODUCTS: (state, products) => {
      state.products = products;
    },
    SET_AUTH: (state, status) => {
      state.isAuthenticated = status;
    },
    ADD_PRODUCT: (state, product) => {
      state.products.push(product);
    },
    DELETE_PRODUCT: (state, id) => {
      state.products = state.products.filter(element => element.id !== id);
    },
    EDIT_PRODUCT: (state, product) => {
      state.products = state.products.map(element => {       
         if(element.id === product.id) {       
          if( element.name !== product.name )    
            element.name = product.name;
          if( element.status !== product.status ) {
            if (product.status === true) {
              element.status = true;
            } else {
              element.status = false;
            }
          }           
         }
         return element;
      })
    },CHECK_AUTHENTICATED: (state) => {
      if(window.localStorage.getItem('token')){
        state.isAuthenticated = true;
      }
    }
  },
  actions: {
    fetchProducts: ({ commit }, payload) => {
      commit('SET_PRODUCTS', payload);
    },
    login: ({ commit }, payload) => {
      commit('SET_AUTH', payload);
    },
    addProduct: ({ commit }, payload) => {
      commit('ADD_PRODUCT', payload);
    },
    deleteProduct: ({ commit }, payload) => {
      commit('DELETE_PRODUCT', payload);
    },
    editProduct: ({commit}, payload) => {
      commit('EDIT_PRODUCT', payload);
    },
    checkAuthenticated: ({commit}) => {
      commit('CHECK_AUTHENTICATED');
    }
  },
  modules: {
  }
})
