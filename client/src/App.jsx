import { BrowserRouter, Routes, Route } from "react-router-dom"
import './App.css'
import Template from "./components/Template"
import Error from "./pages/Error"
import Home from "./pages/Home"
import Stocks from "./pages/Stocks"
import AllTransactions from "./pages/AllTransections"
import { ToastContainer, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const toastConfig  = {
  position: "bottom-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick : true,
  newestOnTop: false,
  rtl: false,
  pauseOnFocusLoss : true,
  pauseOnHover: true,
  draggable: true,
  theme: "dark",
  transition: Bounce,
};

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Template />}>
        <Route index element={<Home />} />
        <Route path="stocks" element={<Stocks />} />
        <Route path="/all-transactions" element={<AllTransactions />} />
        <Route path="*" element={<Error />} />
        </Route>
      </Routes>
      <ToastContainer {...toastConfig}/>
    </BrowserRouter>
  )
}

export default App
