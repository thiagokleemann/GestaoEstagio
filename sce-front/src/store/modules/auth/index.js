import mutations from './mutations.js';
import actions from './actions.js';
import getters from './getters.js';

export default {
  state() {
    return {
      uid: null,
      email: null,
      nome: null,
      tipo: null,
      campus: null,
      googleLoginUrl: null,
    };
  },
  mutations,
  actions,
  getters
};