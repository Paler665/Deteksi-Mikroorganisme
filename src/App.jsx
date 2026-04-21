import { Routes, Route, Navigate } from "react-router-dom"
import { useState, useEffect } from "react"
import Home from "./pages/Home"
import Login from "./pages/Login"

function App() {
  const [isLogin, setIsLogin] = useState(
    localStorage.getItem("isLogin")
  )

  useEffect(() => {
    const handleStorage = () => {
      setIsLogin(localStorage.getItem("isLogin"))
    }

    window.addEventListener("storage", handleStorage)
    return () => window.removeEventListener("storage", handleStorage)
  }, [])

  return (
    <Routes>
      <Route 
        path="/" 
        element={isLogin ? <Home /> : <Navigate to="/login" />} 
      />
      <Route path="/login" element={<Login />} />
    </Routes>
  )
}

export default App