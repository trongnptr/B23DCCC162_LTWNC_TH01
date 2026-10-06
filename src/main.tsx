import React from 'react'
import ReactDOM from 'react-dom/client' // Thêm dòng này để ứng dụng có thể render
import { Provider } from 'react-redux'
import { store } from './store/store'   // Trỏ chính xác vào file store.ts
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
)