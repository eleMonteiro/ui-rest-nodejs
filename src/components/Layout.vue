<script setup>
import { computed, ref, defineProps } from "vue";

const props = defineProps({
  menuItems: {
    type: Object,
    required: true,
  },
  user: {
    type: String,
    required: true,
  },
});

const itemMenu = ref(Object.keys(props.menuItems)[0]);

const activeComponent = computed(() => props.menuItems[itemMenu.value]);

const handleMenuClick = (key) => {
  if (key === "logout") {
    props.menuItems[key].action();
  } else {
    itemMenu.value = key;
  }
};
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
            <li
              v-for="(item, key) in props.menuItems"
              :key="key"
              :class="{ active: activeComponent.name === key }"
              @click="handleMenuClick(key)"
            >
              <v-icon
                :class="item.icon"
                :color="activeComponent.name === key ? '#d58936' : '#69140e'"
                size="35"
              ></v-icon>
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
  margin: 0 auto;
  padding: 10px;

  max-width: 100vw;
  max-height: 100vh;
}

.user-section {
  width: 100%;
  height: 80px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  box-sizing: border-box;
}

.avatar {
  width: 50px;
  height: 50px;
  min-width: 50px;
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

.content {
  width: 100%;
  height: calc(100vh - 80px);
  display: flex;
  box-sizing: border-box;
  gap: 10px;
}

.sidebar {
  width: 80px;
  height: 100%;
  background: #f6eee8;
  border-radius: 10px;
  flex-shrink: 0;
}

nav {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
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
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-sizing: border-box;
}

nav ul li.active {
  background: var(--color-primary);
}

.content-body {
  flex-grow: 1;
  background-color: var(--color-primary);
  border-radius: 10px;
  padding: 20px;
  overflow: auto;
  box-sizing: border-box;
}

@media (max-width: 768px) {
  .container {
    width: 100%;
    min-width: 320px;
  }

  .content {
    flex-direction: column;
    height: auto;
  }

  .content-body {
    padding: 10px;
  }

  .sidebar {
    width: 100%;
    height: 60px;
  }

  nav ul {
    flex-direction: row;
  }

  nav ul li {
    height: 60px;
    width: 60px;
  }
}
</style>
