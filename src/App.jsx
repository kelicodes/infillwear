import './App.css'

import Navbar from './Components/Navbar/Navbar'
import Footer from './Components/Footer/Footer'
import HeroSection from './Components/Hero/Hero'
import Home from './Pages/Home/Home'
import { Route, Routes } from 'react-router-dom'
import ProductPage from './Pages/Productpage/Productpage'
import ScrollToTop from './Components/scroll/scroll'
import Collection from './Pages/Ourcollection/Ourcollection'

function App() {
 

  return (
    <>
 <Navbar/>
 <ScrollToTop/>
 <Routes>
    <Route path='/' element={<Home/>}/>
    <Route path='/product/:id' element={<ProductPage/>}/>
    <Route path='/collection' element={<Collection/>}/>
    
 </Routes>
 <Footer/>
 
    </>
  )
}

export default App
