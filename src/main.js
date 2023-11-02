
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import './assets/main.scss'
import router from './router'

import App from './App.vue'
import Header from './components/HeaderComponent.vue'
import Navigation from './components/NavigationComponent.vue'
import AudioPlayer from './components/AudioPlayerComponent.vue'

const app = createApp(App)

app
  .component('Header', Header)
  .component('AudioPlayer', AudioPlayer)
  .component('Navigation', Navigation)

app.use(router)

app.mount('#app')

