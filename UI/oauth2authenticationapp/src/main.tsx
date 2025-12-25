import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter, Routes, Route } from 'react-router'
import Login from './pages/Login.tsx'
import Services from './pages/Services.tsx'
import About from './pages/About.tsx'
import RouteLayout from './pages/RouteLayout.tsx'
import Signup from './pages/SignUp.tsx'
import UserLayout from './pages/UserLayout.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<RouteLayout />} >
        <Route index element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/services" element={<Services />} />
        <Route path="/about" element={<About />} />
        <Route path="/dashboard" element={<UserLayout />} /> 
      </Route>
    </Routes>
  </BrowserRouter>
)
