import HeroSection from "../../Components/Hero/Hero"
import Categories from "../../Components/Categories/Categories"
import Collection from "../../Components/Collection/Collection"
import NewArrivals from "../../Components/Newarrivals/Newarrivals"
import Location from "../Location/Location"




function Home() {
 

  return (
    <>

 <HeroSection/>
  <NewArrivals/>
 <Categories/>
 <Collection/>
 <Location/>
    </>
  )
}

export default Home