
import Topbar from '../components/Topbar';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import BestCategory from '../components/BestCategory';
import WhyUs from '../components/WhyUs';
import BestSelling from '../components/BestSelling';
import EcoFriendly from '../components/EcoFriendly';
import DiscountClub from '../components/DiscountClub';
import Newsletter from '../components/Newsletter';
import Footer from '../components/Footer';


const Home = () => {
    return(
        <>
            <Topbar/>
            <Navbar/>
            <Hero/>
            <BestCategory/>
            <WhyUs/>
            <BestSelling/>
            <EcoFriendly/>
            <DiscountClub/>
            <Newsletter/>
            <Footer/>
        </>
    )
}

export default Home;