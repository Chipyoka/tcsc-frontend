import React, { useState } from 'react';
import Topbar from '../components/Topbar';
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";


const Legal = () => {
  const [activeSection, setActiveSection] = useState('terms');

  const sections = [
    { id: 'terms', label: 'Terms & Conditions' },
    { id: 'shipping', label: 'Shipping & Returns' },
    { id: 'privacy', label: 'Privacy Policy' },
    { id: 'cookies', label: 'Cookie Policy' },
  ];

      const navigate = useNavigate();

     // set title
     window.document.title = "Terms of Service | The Cleaning Supplies Co.";

  return (
    <>
        <Topbar/>
        <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-700">Legal Information</h1>
            <p className="mt-2 text-gray-600">
                The Cleaning Supplies Co. (Brimu Ventures)
            </p>
            <div className="mt-4 w-full md:w-fit hover:bg-blue-50 px-4 py-2 rounded-md cursor-pointer transition-all duration-300 ease-in-out">
                    <p onClick={() => navigate("/")} className="text-sm font-medium text-(--color-primary) border-b-2 border-transparent hover:text-(--color-primary-h) transition duration-300 ease-in-out cursor-pointer">Return to Home <ChevronRight className="h-4 w-4 inline border-none hover:border-none" /></p>
                </div>
            </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:w-1/4">
                <div className="bg-white rounded-sm border border-gray-200 p-6 sticky top-8">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">Page Sections</h2>
                <nav className="space-y-2">
                    {sections.map((section) => (
                    <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`w-full text-left px-4 py-3 transition-colors ${
                        activeSection === section.id
                            ? 'bg-blue-50 text-(--color-primary) border-l-4 border-text-(--color-primary-h)'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        {section.label}
                    </button>
                    ))}
                </nav>
                
                <div className="mt-8 p-4 bg-gray-50 rounded-sm border border-gray-200">
                    <h3 className="font-medium text-gray-600 mb-2">Business Information</h3>
                    <p className="text-sm text-gray-600">
                    Registered Company: <br /> <span className="font-medium">Brimu Ventures</span> <br /><br />
                    Trading as: <br /><span className="font-medium">The Cleaning Supplies Co.</span> <br /><br />
                    Location: <br /><span className="font-medium">United Kingdom</span><br /><br />
                    Contact: <br /><span className="font-medium">info@thecleaningsupplies.co.uk</span><br />
                    </p>
                </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="lg:w-3/4">
                <div className="bg-white rounded-sm border border-gray-200 p-6 md:p-8">
                {/* Terms & Conditions */}
                {activeSection === 'terms' && (
                    <div>
                    <h2 className="text-2xl font-bold text-gray-700 mb-6">Terms & Conditions</h2>
                    
                    <div className="space-y-6 text-gray-700">
                        <section>
                        <h3 className="text-lg font-semibold text-gray-700 mb-3">1. Agreement to Terms</h3>
                        <p>
                            By accessing and purchasing from The Cleaning Supplies Co. (trading name of Brimu Ventures), you agree to be bound by these Terms and Conditions. These terms apply exclusively to business-to-business (B2B) transactions.
                        </p>
                        </section>

                        <section>
                        <h3 className="text-lg font-semibold text-gray-700 mb-3">2. Account Registration</h3>
                        <p>
                            To place orders, businesses must register an account providing accurate company information. You are responsible for maintaining the confidentiality of your login credentials and for all activities under your account.
                        </p>
                        </section>

                        <section>
                        <h3 className="text-lg font-semibold text-gray-700 mb-3">3. Pricing & Payment</h3>
                        <p>
                            All prices are in GBP (£) and exclude VAT unless stated otherwise. We reserve the right to adjust prices due to market conditions. Payments are processed securely through Stripe.
                        </p>
                        <ul className="mt-2 space-y-1 list-disc pl-5">
                            <li>All major credit/debit cards accepted via Stripe</li>
                            <li>Business invoicing available for approved accounts</li>
                            <li>Payment terms: Net 30 for qualified businesses</li>
                            <li>Credit terms may be withdrawn at any time</li>
                        </ul>
                        <p className="my-2">Late payments may accrue statutory interest and recovery costs under the Late Payment of Commercial Debts (Interest) Act 1998.</p>
                        <p><strong>Brimu Ventures reserves the right to suspend deliveries, subscriptions, or account access where payment is overdue.</strong></p>
                        
                        </section>

                        <section>
                        <h3 className="text-lg font-semibold text-gray-700 mb-3">4. Discount Club Subscriptions</h3>
                        <div className="bg-blue-50 p-4 rounded-sm mb-4">
                            <h4 className="font-semibold text-blue-900 mb-2">Subscription Features:</h4>
                            <ul className="space-y-1 list-disc pl-5 text-blue-800">
                            <li>Exclusive member pricing on all products</li>
                            <li>Buy Now, Pay Later access for qualified businesses</li>
                            <li>Automated recurring deliveries</li>
                            <li>Flexible delivery frequency options</li>
                            </ul>
                        </div>
                        <p>
                            Subscriptions may be modified or cancelled with seven (7) days’ notice prior to the next billing or delivery cycle.
                        </p>
                        </section>

                        <section>
                        <h3 className="text-lg font-semibold text-gray-700 mb-3">5. Order Processing</h3>
                        <p>
                            Orders are processed within 1-2 business days. You will receive email confirmation upon order placement and shipping. We reserve the right to refuse or cancel any order at our discretion.
                        </p>
                        </section>

                        <section>
                        <h3 className="text-lg font-semibold text-gray-700 mb-3">6. Risk & Title</h3>
                        <p>
                            Risk in the goods passes to the customer upon delivery.
                        </p>
                        <p>

                            Title to the goods remains with Brimu Ventures until full payment of all outstanding sums has been received.
                        </p>
                        </section>

                        <section>
                        <h3 className="text-lg font-semibold text-gray-700 mb-3">7. Product Use & Safety</h3>
                        <p>
                            All products must be used strictly in accordance with manufacturer instructions, safety data sheets, and applicable regulations.
                        </p>
                        <br />
                        <p>

                            Where stated, products are intended for professional or commercial use only.
                        </p>
                        <br />
                        <p>Brimu Ventures accepts no liability for loss, damage, or injury arising from misuse, improper storage, or failure to follow safety guidance.</p>
                        </section>

                        <section>
                        <h3 className="text-lg font-semibold text-gray-700 mb-3">8. Limitation of Liability</h3>
                        <p>
                            Brimu Ventures (The Cleaning Supplies Co.) shall not be liable for any indirect, incidental, or consequential 
                            damages arising from the use of our products. Our total liability shall not exceed the purchase price of the products supplied.
                        </p>
                        <br />
                        <p>
                            Nothing in these terms limits liability for death or personal injury caused by negligence or for fraud.
                        </p>
                        </section>

                        <section>
                        <h3 className="text-lg font-semibold text-gray-700 mb-3">9. Force Majeure</h3>
                        <p>
                            We shall not be liable for failure or delay in performance caused by events beyond our reasonable control, including but 
                            not limited to supplier failure, transport disruption, strikes, extreme weather, pandemics, or government action.
                        </p>
                    
                        </section>

                        <section>
                        <h3 className="text-lg font-semibold text-gray-700 mb-3">10. Governing Law</h3>
                        <p>
                          These Terms and Conditions are governed by the laws of England and Wales.
                        The courts of England and Wales shall have exclusive jurisdiction.
                        </p>
                    
                        </section>
                    </div>
                    </div>
                )}

                {/* Shipping & Returns */}
                {activeSection === 'shipping' && (
                    <div>
                    <h2 className="text-2xl font-bold text-gray-700 mb-6">Shipping & Returns Policy</h2>
                    
                    <div className="space-y-6 text-gray-700">
                        <section>
                        <h3 className="text-lg font-semibold text-gray-700 mb-3">1. Shipping Methods & Times</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Delivery Time</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cost</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                <tr>
                                <td className="px-4 py-3 text-sm">Standard Delivery</td>
                                <td className="px-4 py-3 text-sm">2-5 business days</td>
                                <td className="px-4 py-3 text-sm">£9.99 (Free over £250)</td>
                                </tr>
                                <tr>
                                <td className="px-4 py-3 text-sm">Next Day Delivery</td>
                                <td className="px-4 py-3 text-sm">1 business day</td>
                                <td className="px-4 py-3 text-sm">£14.99</td>
                                </tr>
                                <tr>
                                <td className="px-4 py-3 text-sm">Subscription Orders</td>
                                <td className="px-4 py-3 text-sm">As per schedule</td>
                                <td className="px-4 py-3 text-sm">Free</td>
                                </tr>
                            </tbody>
                            </table>
                        </div>
                        </section>

                        <section>
                        <h3 className="text-lg font-semibold text-gray-700 mb-3">2. Shipping Restrictions</h3>
                        <p>
                            We currently ship exclusively within the United Kingdom. Some cleaning chemicals may have shipping restrictions due to hazardous materials regulations. These will be clearly indicated on product pages.
                        </p>
                        </section>

                        <section>
                        <h3 className="text-lg font-semibold text-gray-700 mb-3">3. Damaged or Incorrect Items</h3>
                        <p>
                            If you receive damaged or incorrect items, please notify us within 48 hours of delivery. Provide photos of the damaged goods and packaging. We will arrange collection and replacement at no additional cost.
                        </p>
                        </section>

                        <section>
                        <h3 className="text-lg font-semibold text-gray-700 mb-3">4. Returns Policy</h3>
                        <div className="bg-gray-50 p-4 rounded-sm mb-4">
                            <h4 className="font-semibold text-gray-700 mb-2">B2B Returns Conditions:</h4>
                            <ul className="space-y-1 list-disc pl-5 text-gray-700">
                            <li>Unopened products may be returned within 30 days</li>
                            <li>Returns require prior authorization via email</li>
                            <li>Customer responsible for return shipping costs</li>
                            <li>Restocking fee may apply (15% for opened items)</li>
                            </ul>
                        </div>
                        <p>
                            To initiate a return, contact our customer service team at returns@thecleaningsupplies.co.uk with your order number and reason for return.
                        </p>
                        </section>

                        <section>
                        <h3 className="text-lg font-semibold text-gray-700 mb-3">5. Cancellations</h3>
                        <p>
                            Orders may be cancelled within 2 hours of placement. Subscription orders can be cancelled with 7 days' notice before the next scheduled delivery.
                        </p>
                        </section>
                    </div>
                    </div>
                )}

                {/* Privacy Policy */}
                {activeSection === 'privacy' && (
                    <div>
                    <h2 className="text-2xl font-bold text-gray-700 mb-6">Privacy Policy</h2>
                    
                    <div className="space-y-6 text-gray-700">
                        <section>
                        <h3 className="text-lg font-semibold text-gray-700 mb-3">1. Data Controller</h3>
                        <p>
                            Brimu Ventures (trading as The Cleaning Supplies Co.) is the data controller for your personal information. Our registered address is available upon request to verified business customers.
                        </p>
                        </section>

                        <section>
                        <h3 className="text-lg font-semibold text-gray-700 mb-3">2. Information We Collect</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-4 rounded-sm">
                            <h4 className="font-semibold text-gray-700 mb-2">Business Information</h4>
                            <ul className="space-y-1 text-sm">
                                <li>• Company name</li>
                                <li>• Business address & contact details</li>
                                <li>• VAT number</li>
                                <li>• Purchase history relating to our site only</li>
                            </ul>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-sm">
                            <h4 className="font-semibold text-gray-700 mb-2">Contact Information</h4>
                            <ul className="space-y-1 text-sm">
                                <li>• Contact person details</li>
                                <li>• Email addresses</li>
                                <li>• Phone numbers</li>
                            </ul>
                            </div>
                        </div>
                        </section>

                        <section>
                        <h3 className="text-lg font-semibold text-gray-700 mb-3">3. How We Use Your Information</h3>
                        <ul className="space-y-2 list-disc pl-5">
                            <li>Process and fulfill your orders</li>
                            <li>Manage your Discount Club subscription</li>
                            <li>Send order confirmations and delivery updates</li>
                            <li>Provide customer support</li>
                            <li>Send marketing communications (with consent)</li>
                            <li>Comply with legal obligations</li>
                        </ul>
                        </section>

                        <section>
                        <h3 className="text-lg font-semibold text-gray-700 mb-3">4. Payment Processing with Stripe</h3>
                        <div className="bg-blue-50 p-4 rounded-sm">
                            <p className="text-blue-800">
                            All payment information is processed directly by Stripe. We do not store credit card details on our servers. Stripe's privacy policy governs the handling of your payment information.
                            </p>
                        </div>
                        <p className="mt-2">
                            For subscription management, Stripe stores billing information to facilitate recurring payments as part of our Discount Club service.
                        </p>
                        </section>

                        <section>
                        <h3 className="text-lg font-semibold text-gray-700 mb-3">5. Data Retention</h3>
                        <p>
                            We retain business customer data for 7 years to comply with HMRC requirements. Subscription data is retained while active and for 2 years after cancellation.
                        </p>
                        </section>

                        <section>
                        <h3 className="text-lg font-semibold text-gray-700 mb-3">6. Your Rights</h3>
                        <p>
                            Under GDPR, business representatives have the right to access, correct, or request deletion of their personal data. Contact us at privacy@thecleaningsupplies.co.uk to exercise these rights.
                        </p>
                        </section>
                    </div>
                    </div>
                )}

                {/* Cookie Policy */}
                {activeSection === 'cookies' && (
                    <div>
                    <h2 className="text-2xl font-bold text-gray-700 mb-6">Cookie Policy</h2>
                    
                    <div className="space-y-6 text-gray-700">
                        <section>
                        <h3 className="text-lg font-semibold text-gray-700 mb-3">1. What Are Cookies?</h3>
                        <p>
                            Cookies are small text files stored on your device when you visit our website. We use only essential cookies necessary for the functioning of our B2B e-commerce platform.
                        </p>
                        </section>

                        <section>
                        <h3 className="text-lg font-semibold text-gray-700 mb-3">2. Essential Cookies We Use</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cookie Name</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Purpose</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                <tr>
                                <td className="px-4 py-3 text-sm font-mono">session_id</td>
                                <td className="px-4 py-3 text-sm">Maintains your login session</td>
                                <td className="px-4 py-3 text-sm">Session</td>
                                </tr>
                                <tr>
                                <td className="px-4 py-3 text-sm font-mono">cart_token</td>
                                <td className="px-4 py-3 text-sm">Stores your shopping cart items</td>
                                <td className="px-4 py-3 text-sm">7 days</td>
                                </tr>
                                <tr>
                                <td className="px-4 py-3 text-sm font-mono">csrf_token</td>
                                <td className="px-4 py-3 text-sm">Security protection</td>
                                <td className="px-4 py-3 text-sm">Session</td>
                                </tr>
                                <tr>
                                <td className="px-4 py-3 text-sm font-mono">preferences</td>
                                <td className="px-4 py-3 text-sm">Stores business user preferences</td>
                                <td className="px-4 py-3 text-sm">30 days</td>
                                </tr>
                            </tbody>
                            </table>
                        </div>
                        </section>

                        <section>
                        <h3 className="text-lg font-semibold text-gray-700 mb-3">3. Third-Party Cookies</h3>
                        <div className="bg-gray-50 p-4 rounded-sm">
                            <h4 className="font-semibold text-gray-700 mb-2">Stripe Cookies:</h4>
                            <p className="text-gray-700 mb-2">
                            Stripe uses cookies for payment processing and fraud prevention. These are essential for secure transactions.
                            </p>
                            <h4 className="font-semibold text-gray-700 mb-2">Analytics:</h4>
                            <p className="text-gray-700">
                            We use basic analytics to understand how business customers use our site to improve our service.
                            </p>
                        </div>
                        </section>

                        <section>
                        <h3 className="text-lg font-semibold text-gray-700 mb-3">4. Cookie Management</h3>
                        <p>
                            As essential cookies are required for our B2B platform functionality, they cannot be disabled. By using our website, you consent to our use of these necessary cookies.
                        </p>
                        <div className="mt-4 p-4 bg-blue-50 rounded-sm">
                            <p className="text-blue-800">
                            <strong>Note:</strong> Disabling cookies will prevent you from logging in, adding items to your cart, or completing purchases.
                            </p>
                        </div>
                        </section>

                        <section>
                        <h3 className="text-lg font-semibold text-gray-700 mb-3">5. Updates to Cookie Policy</h3>
                        <p>
                            We may update this cookie policy as our services evolve. Business customers will be notified of significant changes via email.
                        </p>
                        </section>
                    </div>
                    </div>
                )}

                {/* Contact Information */}
                <div className="mt-12 pt-8 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Contact for Inquiries</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-4 rounded-sm">
                        <h4 className="font-medium text-gray-700 mb-2">General Questions</h4>
                        <p className="text-gray-600">Email: info@thecleaningsupplies.co.uk</p>
                        <p className="text-gray-600">Response Time: 3-5 business days</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-sm">
                        <h4 className="font-medium text-gray-700 mb-2">Technical Questions</h4>
                        <p className="text-gray-600">Email: support@thecleaningsupplies.co.uk</p>
                        <p className="text-gray-600">For Tech-related inquiries</p>
                    </div>
                    </div>
                    <p className="mt-4 text-sm text-gray-500">
                    Last Updated: 9th February 2026.
                    </p>
                </div>
                </div>
            </div>
            </div>
        </div>

        {/* Footer Note */}
        <div className="bg-white border-t border-gray-200 mt-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <p className="text-center text-gray-500 text-sm">
                The Cleaning Supplies Co. is a trading name of Brimu Ventures. Registered in England and Wales.
                These terms apply to all transactions and are subject to change.
            </p>
            </div>
        </div>
        </div>
    </>
  );
};

export default Legal;