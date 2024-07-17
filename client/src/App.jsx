import { BrowserRouter, Routes, Route } from "react-router-dom"
import './App.css'
import Template from "./components/Template"
import Error from "./pages/Error"
import Home from "./pages/Home"
import SigninPage from "./pages/Signin"
import SignupPage from "./pages/Signup"

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Template />}>
        <Route index element={<Home />} />
        <Route path="/signin" element={<SigninPage />} />
        <Route path="signup" element={<SignupPage />} />

        <Route path="*" element={<Error />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
