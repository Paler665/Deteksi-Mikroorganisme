import { useState } from "react"
import { useNavigate } from "react-router-dom"

function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  const handleLogin = () => {
  console.log("Klik login")
  console.log(username, password)

  if (username === "admin" && password === "123") {
    console.log("LOGIN BERHASIL")
    localStorage.setItem("isLogin", "true")
    navigate("/")
  } else {
    console.log("LOGIN GAGAL")
    alert("Login gagal")
  }
}

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Login</h2>

      <input 
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      /><br /><br />

      <input 
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      /><br /><br />

      <button onClick={handleLogin}>Login</button>
    </div>
  )
}

export default Login