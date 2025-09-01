import CategorySection from "../components/HomePage/body/categories"

import Offers from "../components/HomePage/body/Offers/OurOffers"
import Hero from "../components/HomePage/Header/Hero/Hero"
import Footer from "../components/SharedComp/footer"
import Navbar from "../components/SharedComp/navabaritems/NavBar"
import { productsData } from "../constants/ProductsData/ProductData"



const HomePage = () => {
  return (
    <>
      <div className="h-screen">
        <Navbar />
        <Hero />
        <CategorySection />
        <Offers
          title="Featured Products"
          subtitle="Our handpicked selection of premium items just for you"
          showLoadMore={false}
          products={productsData.filter(product => product.isFeatured)}
          />
        <Offers
          title="Top Picks"
          subtitle="Our customers' top picks just for you"
          showLoadMore={false}
          products={productsData.filter(product => product.isFeatured === false)}
          />
        <Offers
          title="Latest Products"
          subtitle="Don't miss out on our newest arrivals"
          showLoadMore={true}
          products={productsData.filter(product => product.isNew)}
          initialDisplayCount={4}
        />
        <Offers
          title="Re used Products"
          subtitle="Grab these deals before they're gone"
          showLoadMore={true}
          products={productsData.filter(product => !product.isNew)}
        />
        {/* <FeaturedProducts /> */}
        {/* <LatestProducts /> */}
        <Footer />
      </div>
    </>
  )
}

export default HomePage
