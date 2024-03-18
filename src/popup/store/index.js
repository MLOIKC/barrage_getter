import { createStore } from 'vuex';

export default createStore({
  state: {
    danmuDetail: {
      type: null,
      data: null,
    },
  },
  mutations: {
    setDanmuDetail(state, { type, data }) {
      state.danmuDetail.type = type;
      state.danmuDetail.data = data;
    }
  },
});
