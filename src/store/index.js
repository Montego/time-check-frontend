import Vue from 'vue';
import Vuex from 'vuex';


Vue.use(Vuex);

export const store= new Vuex.Store({
  modules: {

  }
  ,
  strict: process.env.NODE_ENV !== 'production'
});