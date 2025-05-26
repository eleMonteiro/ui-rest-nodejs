import { createStore } from "vuex";
import auth from "@/store/modules/auth";
import user from "@/store/modules/user";
import dish from "@/store/modules/dish";
import demand from "@/store/modules/demand";
import item from "@/store/modules/item";
import cep from "@/store/modules/cep";
import card from "@/store/modules/card";
import payment from "@/store/modules/payment";
import address from "@/store/modules/address";
import snackbar from "@/store/modules/snackbar";

const store = createStore({
  modules: {
    auth,
    user,
    dish,
    demand,
    item,
    cep,
    snackbar,
    card,
    payment,
    address,
  },
});

export default store;
