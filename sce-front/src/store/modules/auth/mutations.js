export default {

    setSession(state, payload) {
      state.uid = payload.uid;
      state.email = payload.email;
      state.nome = payload.nome;
      state.tipo = payload.tipo;
      state.campus = payload.campus;
    },

    setGoogleLoginUrl(state, payload) {
      state.googleLoginUrl = payload.googleLoginUrl;
    },

    destroySession(state) {
      state.uid = null;
      state.nome = null;
      state.email = null;
      state.tipo = null;
      state.campus = null;
      state.googleLoginUrl = null;
    },

  };