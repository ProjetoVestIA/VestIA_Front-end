import { BrowserRouter, Route, Routes } from "react-router-dom"
import Footer from "./components/layout/Footer"
import Navbar from "./components/layout/Navbar"
import Home from "./pages/Home/Home"
import Register from "./pages/Register/Register"

function App() {

  return (
    <>
      <BrowserRouter>
        <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-blue-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/*" element={<Home />} />
            <Route path="/register" element={<Register />} />
          </Routes>
          <Footer />
        </div>
      </BrowserRouter>
    </>
  )
}

export default App
