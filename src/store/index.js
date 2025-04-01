import { createStore } from "vuex";
import auth from "@/store/modules/auth";
import user from "@/store/modules/user";
import dish from "@/store/modules/dish";
import demand from "@/store/modules/demand";
import item from "@/store/modules/item";
import cep from "@/store/modules/cep";

const store = createStore({
  modules: {
    auth,
    user,
    dish,
    demand,
    item,
    cep,
  },
});

export default store;
