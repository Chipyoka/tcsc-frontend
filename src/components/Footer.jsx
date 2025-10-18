
import Logo from '../assets/images/logo-l-w.png'

import {Phone, Mail} from 'lucide-react';

const Footer = () => {
    return(
        <>
            <footer className="bg-[var(--color-primary-h)] px-8 md:px-16 py-12 md:py-20 flex flex-col md:flex-row justify-between items-start gap-12">
                <div className="flex flex-col gap-4 justify-start items-start max-w-full md:max-w-1/4">
                    <div>
                        <img src={Logo} alt="" width="200px" />
                    </div>
                    <div className="text-white my-4 max-w-full ">
                        <p>
                            Premier supplier of cleaning supplies in Hertfordshire,
                            helping small businesses maintain clean, compliant, and efficient environments. 
                        </p>
            
                        <p className="my-4">
                          
                                123 Street, Town, <br />
                                United Kingdom
                           
                        </p>

                        <h6>The Cleaning Supplies Co. is a Trademark of <strong>BRIMU VENTURES</strong>.</h6>
                    </div>

                </div>
                <div className="text-white flex flex-col md:flex-row justify-between items-start gap-16 md:gap-24 max-w-full md:max-w-3/4">
                    <div>
                        <h4 className="text-2xl font-medium mb-6">Company</h4>
                        <ul className="flex flex-col gap-y-4 w-full">
                            <li className="hover:underline"><a href="">Shop</a></li>
                            <li className="hover:underline"><a href="">The Discount Club</a></li>
                            <li className="hover:underline"><a href="">Blog</a></li>
                            <li className="hover:underline"><a href="">About</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-2xl font-medium mb-6">Legal</h4>
                        <ul className="flex flex-col gap-y-4 w-full">
                            <li className="hover:underline"><a href="">Terms and Conditions</a></li>
                            <li className="hover:underline"><a href="">Privacy Policy</a></li>
                            <li className="hover:underline"><a href="">Cookie Policy</a></li>
                            <li className="hover:underline"><a href="">Shipping & Returns Policy</a></li>

                        </ul>
                    </div>
                    <div>
                        <h4 className="text-2xl font-medium mb-6">Get in Touch</h4>
                        <ul className="flex flex-col gap-y-4 w-full">
                            <li className="flex justify-start items-center gap-4">
                                <div className="bg-white rounded-full p-2 text-[var(--color-primary)]">
                                    <Phone/>
                                </div>
                                +44 7877 673877
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
            <div className="bg-black px-16 py-4 text-white flex flex-col md:flex-row gap-4 justify-between items-center text-sm text-center md:text-left">
                <p>Copyright © 2025 All Rights Reserved.</p>
                <p>🪄 Magic by: <strong className="hover:underline"><a href="https://chipyoka.vercel.app/" target="_blank" >Moontipo</a></strong></p>
            </div>
        </>
    )
}

export default Footer;