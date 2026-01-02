import Topbar from '../components/Topbar';
import Navbar from '../components/Navbar';
import DiscountClub from '../components/DiscountClub';
import Newsletter from '../components/Newsletter';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';

import ContactForm from '../components/ContactForm';

const Contact = () => {
    return (
        <>
            <Topbar/>
            <Navbar/>

            {/* Contact form */}
            <ContactForm/>

            <DiscountClub/>
            <Newsletter/>
            <Footer/>
            <ScrollToTop/>
        </>
    )
}

export default Contact;