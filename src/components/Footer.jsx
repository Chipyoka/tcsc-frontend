
import Logo from '../assets/images/logo-l-w.png'

import {Phone, Mail} from 'lucide-react';

const Footer = () => {

    // handle year display in copyright text
    function getCopyrightYear() {
        const startYear = 2025;
        const currentYear = new Date().getFullYear();
        return currentYear === startYear ? `${startYear}` : `${startYear} - ${currentYear}`;
    }


    return(
        <>
            <footer className="bg-[var(--color-primary-h)] px-8 md:px-16 py-12 md:py-20 flex flex-col md:flex-row justify-between items-start gap-12">
                <div className="flex flex-col gap-4 justify-start items-start max-w-full md:max-w-1/4">
                    <div>
                        <img src={Logo} alt="" width="200px" />
                    </div>
                    <div className="text-white text-sm my-4 max-w-full ">
                        <p>
                            Premier wholesaler of cleaning supplies,
                            helping small businesses maintain clean, compliant, and efficient environments. 
                        </p>
            
                        <p className="my-4">
                                15 De Havilland House, <br />
                                Endymion Mews, <br />
                                Hatfield.
                           
                        </p>

                        {/* <h6>The Cleaning Supplies Co. is a Trademark of <strong>BRIMU VENTURES</strong>.</h6> */}
                    </div>

                </div>
                <div className="text-white flex flex-col md:flex-row justify-between items-start gap-12 md:gap-32 max-w-full md:max-w-3/4">
                    <div>
                        <h4 className="text-lg font-medium mb-6">Company</h4>
                        <ul className="flex flex-col gap-y-4 w-full text-sm">
                            <li className="hover:underline"><a href="">Shop</a></li>
                            <li className="hover:underline"><a href="">The Discount Club</a></li>
                            <li className="hover:underline"><a href="">Blog</a></li>
                            <li className="hover:underline"><a href="">About</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-lg font-medium mb-6">Legal</h4>
                        <ul className="flex flex-col gap-y-4 w-full text-sm">
                            <li className="hover:underline"><a href="">Terms and Conditions</a></li>
                            <li className="hover:underline"><a href="">Shipping and Returns Policy</a></li>
                            <li className="hover:underline"><a href="">Cookie Policy</a></li>
                            <li className="hover:underline"><a href="">Privacy Policy</a></li>

                        </ul>
                    </div>
                    <div>
                        <h4 className="text-lg font-medium mb-6">Get in Touch</h4>
                        <ul className="flex flex-col gap-y-4 w-full text-sm">
                            <li className="flex justify-start items-center gap-4">
                                <div className="bg-white rounded-full p-2 text-[var(--color-primary)]">
                                    <Phone/>
                                </div>
                                +44 7877 673877 | +44 7734 337836
                            </li>
                            <li className="flex justify-start items-center gap-4">
                                <div className="bg-white rounded-full p-2 text-[var(--color-primary)]">
                                    <Mail/>
                                </div>
                                info@thecleaningsupplies.co.uk
                            </li>
                        </ul>
                    </div>
                </div>
            </footer>
            <div className="bg-black px-4  md:px-16 py-4 text-white flex flex-col md:flex-row gap-2 justify-between items-start md:items-center text-sm text-left">
                <p>Copyright © {getCopyrightYear()}. All Rights Reserved.</p>
                <p>🪄 Magic by: <strong className="hover:underline"><a href="https://chipyoka.vercel.app/" target="_blank" >Moontipo</a></strong></p>
            </div>
        </>
    )
}

export default Footer;