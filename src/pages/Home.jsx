import Topbar from '../components/Topbar';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import BestCategory from '../components/BestCategory';
import WhyUs from '../components/WhyUs';
import BestSelling from '../components/BestSelling';
import Starta from '../components/Starter';
import EcoFriendly from '../components/EcoFriendly';
import DiscountClub from '../components/DiscountClub';
import Newsletter from '../components/Newsletter';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';

const Home = () => {

    // set window title
    window.document.title = "The Cleaning Supplies Co. | Smart solutions for everyday cleaning."
    return (
        <>
            <Topbar/>
            <Navbar/>
            <Hero/>
            <BestCategory/>
            <WhyUs/>
            <BestSelling/>
            <Starta/>
            <DiscountClub/>
            <EcoFriendly/>
            <Newsletter/>
            <Footer/>
            <ScrollToTop/>
        </>
    )
}

export default Home;
