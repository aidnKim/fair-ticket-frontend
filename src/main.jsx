// src/main.jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
//SPA 를 구현하기 위한 RouterProvider 를 import
import { RouterProvider } from 'react-router-dom'
// routing 정보를 담고 있는 router import
import router from './router'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
