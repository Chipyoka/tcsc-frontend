import Topbar from '../components/Topbar';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import BestCategory from '../components/BestCategory';
import WhyUs from '../components/WhyUs';
import BestSelling from '../components/BestSelling';
import Starta from '../components/Starter';
import EcoFriendly from '../components/EcoFriendly';
import DiscountClub from '../components/DiscountClub';
import OurStory from '../components/OurStory';
import Newsletter from '../components/Newsletter';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';

import {useReadyStore} from "../store/ready.store.js";

const Home = () => {

    const {bestSellersReady} = useReadyStore();

    // set window title
    window.document.title = "The Cleaning Supplies Co. | Smart solutions for everyday cleaning."
    return (
        <>
            <Topbar/>
            <Navbar/>
            <Hero/>
            <BestCategory/>
            <WhyUs/>
            {bestSellersReady &&  <BestSelling/>}  
            <Starta/>
            <DiscountClub/>
            <EcoFriendly/>
            <OurStory/>
            <Newsletter/>
            <Footer/>
            <ScrollToTop/>
        </>
    )
}

export default Home;
