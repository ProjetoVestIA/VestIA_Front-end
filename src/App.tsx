import Footer from "./components/layout/Footer"
import Navbar from "./components/layout/Navbar"
import Home from "./pages/Home/Home"

function App() {

  return (
    <>
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-blue-50">
      <Navbar />
      <Home />
      <Footer />
    </div>
      
    </>
  )
}

export default App
