import Offers from "../components/HomePage/body/Offers/OurOffers";
import ProductDetails from "../components/ProductViewDetails/ProductmainDetails";
import Footer from "../components/SharedComp/footer";
import Navbar from "../components/SharedComp/navabaritems/NavBar";


export default function ViewProductDetails() {
    return (
        <>
            <Navbar />
            <ProductDetails />
            <Offers />
            <Footer />
        </>
    )
}
