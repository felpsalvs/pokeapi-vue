import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import "./index.css";

const app = createApp(App);
app.use(createPinia());

app.directive("fade-in", {
  mounted(el) {
    el.style.opacity = "0";
    el.style.transition = "opacity 0.5s ease-in-out";
    setTimeout(() => {
      el.style.opacity = "1";
    }, 0);
  },
});

app.mount("#app");
