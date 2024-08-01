import { Outlet, } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import "../../src/App.css"
import React, { useContext } from 'react'
import { AuthContext } from '../context/AuthProvider'
import LoadingSpinner from '../components/LoadingSpinner'

const Main = () => {
  const { loading } = useContext(AuthContext)
  return (
    <div>
      {
        loading ? <LoadingSpinner /> : 
        <div>
          <Navbar />
          <div className="min-h-screen">
            <Outlet />
          </div>
          <Footer />
        </div>
      }
    </div>
  )
}

export default Main