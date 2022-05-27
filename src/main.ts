import 'uno.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// Component library
import '@carlosdevpereira/mr-components/dist/style.css'
import UseMrComponents from '@carlosdevpereira/mr-components'

// Application bootstrap
const app = createApp(App)
app.use(createPinia())
app.use(router)

UseMrComponents(app)

app.mount('#app')
