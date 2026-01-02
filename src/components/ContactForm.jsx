import {useState, useEffect} from 'react';
import {toast} from 'react-toastify';
import axiosInstance from '../api/axiosInstance'; 


const ContactForm = () => {

    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

      const handleSubmitForm = async (e) => {
            e.preventDefault();

            // validate inputs
            if(name.length < 3){
                toast.error("Name must be longer than 3 Characters");
                return;
            }
            if(phone.length < 10){
                toast.error("Name must be longer than 9 Characters");
                return;
            }
            if(message.length < 10){
                toast.error("Message must be longer than 15 Characters");
                return;
            }
     
 

            setLoading(true)

            try {
                const subject = "Website Inquiry";

                const response = await axiosInstance.post('/contacts', {
                    email,
                    phone,
                    message,
                    name,
                    subject,
                });

                console.log("Contact Submitted: ", response);
                toast.success("Form submited !")
                
            } catch (error) {
                toast.error("Something went wrong. Try again later");
                console.error("Error Submitting contact form: ", error);
            }finally{
                setLoading(false);
                setEmail("");
                setPhone("");
                setName("");
                setMessage("");
            }

      }
    return(
        <>
            <section className ="mb-16 mt-6 md:mt-12 mx-auto flex flex-col md:flex-row justify-center items-start px-4 md:px-12">
                <aside className="pb-6 w-full px-3">
                    <h4 className="md:text-2xl my-2 md:my-4 font-semibold uppercase text-gray-400">Get In Touch</h4>
                    <h2 className=" text-4xl md:text-5xl font-semibold text-[var(--color-primary)]">Send us a Message.</h2>
                    <p className="text-lg mt-6 md:max-w-[90%] max-w-full"> Whether it's just an inquiry or an appointment, we are happy to be at your service.</p>
                </aside>

                {/* form */}
                <aside className="border-t-12 border-gray-100 pt-6 w-full px-5">
                    <h4 className="text-2xl my-4 md:my-2 font-medium text-gray-500">Contact Form</h4>
                    <form className="w-full" onSubmit={handleSubmitForm}>
                        <div className="my-2 md:my-4 md:w-lg">
                            <label htmlFor="name" className="text-gray-600">Fullname:</label>
                            <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-md px-3 py-3 md:py-4 w-full max-w-full md:max-w-lg focus-within:shadow-sm focus-within:border-[var(--color-primary)]">
                                <input
                                    type="text"
                                    name="name"
                                    placeholder=""
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400 w-full"
                                    required
                                />
                            </div>
                        </div>

                        <div className="my-2 md:my-4 md:w-lg">
                            <label htmlFor="phone" className="text-gray-600">Phone:</label>
                            <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-md px-3 py-3 md:py-4 w-full max-w-full md:max-w-lg focus-within:shadow-sm focus-within:border-[var(--color-primary)]">
                                <input
                                    type="text"
                                    name="phone"
                                    placeholder=""
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400 w-full"
                                    required
                                />
                            </div>
                        </div>

                        <div className="my-2 md:my-4 md:w-lg">
                            <label htmlFor="email" className="text-gray-600">Email:</label>
                            <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-md px-3 py-3 md:py-4 w-full max-w-full md:max-w-lg focus-within:shadow-sm focus-within:border-[var(--color-primary)]">
                                <input
                                    type="email"
                                    name="email"
                                    placeholder=""
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400 w-full"
                                    required
                                />
                            </div>
                        </div>

                        {/* Message */}
                        <div className="my-2 md:my-4 md:w-lg">
                        <label htmlFor="message" className="text-gray-600">
                            Message:
                        </label>

                        <div className="flex items-start gap-2 bg-white border border-gray-300 rounded-md px-3 py-3 md:py-4 w-full max-w-full md:max-w-lg focus-within:shadow-sm focus-within:border-[var(--color-primary)]">
                            <textarea
                            id="message"
                            name="message"
                            rows={4}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400 w-full resize-none"
                            required
                            />
                        </div>
                        </div>

                        <button type="submit" className="w-full md:w-fit btn-primary-sm"   disabled={loading}>
                            {loading ? "Submitting..." : "Submit"}
                        </button>

                    </form>
                </aside>
            </section>
        </>
    )
}

export default ContactForm;