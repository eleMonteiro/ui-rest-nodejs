<script setup>
import { ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

const store = useStore();
const router = useRouter();

const handleClick = () => {
  if (store.getters["auth/isAuthenticated"]) {
    store.getters["auth/roleUser"] === "admin" ? router.push("/home") : router.push("/");
  } else {
    router.push("/login");
  }
};
</script>

<template>
  <div>
    <div class="container" @click="handleClick">
      <div class="left">
        <div class="half-circle left-circle"></div>
      </div>
      <div class="right">
        <div class="half-circle right-circle"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  width: 100vw;
  height: 100vh;
}

.left {
  flex: 1;
}

.right {
  flex: 1;
  background-color: var(--color-primary);
}

.half-circle {
  width: 500px;
  height: 500px;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
}

.right-circle {
  background-color: var(--color-primary);
  clip-path: inset(0 48.5% 0 0);
}

.left-circle {
  background-color: var(--color-accent);
  clip-path: inset(0 0 0 50%);
}
</style>
