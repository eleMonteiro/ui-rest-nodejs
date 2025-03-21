<script setup>
import { computed, ref, defineProps } from 'vue';

const props = defineProps({
  menuItems: {
    type: Object,
    required: true
  },
  user: {
    type: String,
    required: true
  }
});

const itemMenu = ref(Object.keys(props.menuItems)[0]);

const activeComponent = computed(() => props.menuItems[itemMenu.value]);
</script>

<template>

  <div class="container">

    <div class="user-section">
      <div class="avatar">A</div>
      <div class="user-info">
        <div>Olá, {{ user }}!</div>
        <div>Bem-vindo de volta!</div>
      </div>
    </div>

    <div class="content">
      <div class="sidebar">
        <nav>
          <ul>
            <li v-for="(item, key) in props.menuItems" :key="key" :class="{ active: activeComponent.name === key }"
              @click="itemMenu = key">
              <v-icon :class="item.icon" :color="activeComponent.name === key ? '#d58936' : '#69140e'"
                size="35"></v-icon>
            </li>
          </ul>
        </nav>
      </div>

      <Component :is="activeComponent.component" class="content-body" />
    </div>
  </div>
</template>

<style scoped>
.container {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.user-section {
  width: 100%;
  display: flex;
  align-items: center;
  padding: 20px;
}

.avatar {
  width: 50px;
  height: 50px;
  background: #823b19;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
  margin-right: 15px;
}

.user-info {
  font-size: 14px;
  color: #823b19;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.sidebar {
  width: 80px;
  height: 90%;
  background: #f6eee8;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  border-radius: 10px;
}

nav {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  width: 100%;
}

nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
}

nav ul li {
  width: 100%;
  padding: 15px;
  text-align: center;
  font-size: 20px;
  color: #823b19;
  cursor: pointer;
}

nav ul li.active {
  height: auto;
  background: var(--color-primary);
  border-radius: 0px 20px 20px 0px;
}

.content {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  padding: 20px;
}

.content-body {
  width: 90%;
  height: 90%;
  background-color: var(--color-primary);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px;
  border-radius: 10px;
}
</style>
