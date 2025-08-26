import CategorySection from "../components/HomePage/body/categories"
import Hero from "../components/HomePage/Header/Hero/Hero"
import Navbar from "../components/SharedComp/navabaritems/NavBar"



const HomePage = () => {
  return (
    <>
      <div className="h-screen">
        <Navbar />
        <Hero />
        <CategorySection />
      </div>
    </>
  )
}

export default HomePage
