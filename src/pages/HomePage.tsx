import CategorySection from "../components/HomePage/body/categories"
import FeaturedProducts from "../components/HomePage/body/FuturedProducts/FuturedProducts"
import LatestProducts from "../components/HomePage/body/LatestProducts/LatestProducts"
import Offers from "../components/HomePage/body/Offers/OurOffers"
import Hero from "../components/HomePage/Header/Hero/Hero"
import Footer from "../components/SharedComp/footer"
import Navbar from "../components/SharedComp/navabaritems/NavBar"



const HomePage = () => {
  return (
    <>
      <div className="h-screen">
        <Navbar />
        <Hero />
        <CategorySection />
        <FeaturedProducts />
        <LatestProducts />
        <Offers />
        <Footer />
      </div>
    </>
  )
}

export default HomePage
