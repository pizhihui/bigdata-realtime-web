import { createApp } from 'vue'
import App from './App'

// reset css
import 'normalize.css'
import './assets/css/index.less'

// router
import router from '@/router'

// store
import pinia from '@/store'

// ant designe vue
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'

// naive
import naive from 'naive-ui'

const app = createApp(App)
app.use(router)
app.use(pinia)
app.use(naive)
app.use(Antd)
app.mount('#app')
