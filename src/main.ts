import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import './style.css'

import { SafeArea } from '@capacitor-community/safe-area';
import { setupPurchase } from './plugins/purchase';

SafeArea.enable({
  config: {
    customColorsForSystemBars: true,
    statusBarColor: '#00000000', // transparent
    statusBarContent: 'light',
    navigationBarColor: '#00000000', // transparent
    navigationBarContent: 'light',
  },
});

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.mount('#app')

// // Initialize purchase plugin
// const purchase = setupPurchase();

// // Test the purchase functionality
// purchase.testPurchase().then(products => {
//   console.log('Products loaded successfully:', products);
// }).catch(error => {
//   console.error('Failed to load products:', error);
// });