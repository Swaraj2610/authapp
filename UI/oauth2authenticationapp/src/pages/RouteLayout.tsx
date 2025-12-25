import React from 'react'
import { Outlet } from 'react-router'
import Navbar from '../components/Navbar'

function RouteLayout() {
  return (
    <div>
        <Navbar />
        <Outlet />
    </div>
  )
}

export default RouteLayout
