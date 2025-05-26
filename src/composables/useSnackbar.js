import { useStore } from "vuex";

export default function useSnackbar() {
  const store = useStore();

  const showMessage = (response) => {
    store.dispatch("snackbar/showSnackbar", {
      text:
        response?.message ||
        (response?.success ? "Operação realizada com sucesso!" : "Erro ao realizar operação!"),
      color: response?.success ? "success" : "error",
    });
  };

  return { showMessage };
}
