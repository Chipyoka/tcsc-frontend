import Topbar from '../components/Topbar';
import Navbar from '../components/Navbar';
import Newsletter from '../components/Newsletter';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';

import Hero from '../components/discount_club/Hero.jsx';

const DiscountClub = () => {

    // set window title
    window.document.title = "The Discount Club | The Cleaning Supplies Co."
    return(
        <>
            <Topbar/>
            <Navbar/>

            {/* Discount Club Hero Section */}
            <Hero />

            <Newsletter/>
            <Footer/>
            <ScrollToTop/>
            <p>Hello from the discount club.</p>
        </>
    )
}

export default DiscountClub;