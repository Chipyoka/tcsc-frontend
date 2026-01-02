import React, { useState, useEffect } from "react";

import useAuthStore from '../../store/auth.store.js';
import axiosInstance from '../../api/axiosInstance'; 

const Settings = () => {
    const {accessToken, user} = useAuthStore();
    const [email, setEmail] = useState(user.email);
    const [name, setName] = useState(user.fullName);

    const [streetAddress, setStreetAddress] = useState("");
    const [postcode, setPostcode] = useState("");
    const [cityTown, setCityTown] = useState("");
    const [phone, setPhone] = useState("");

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");


     // Fetch addresses
    useEffect(() => {
          if (!accessToken) {
            return;
            }
        const fetchAddresses = async () => {
            try {
                  const response = await axiosInstance.get('/profile/addresses');
                  console.log("Fetched Addresses:", response);
            } catch (error) {
                console.error("Error fetching addresses:",error);
            }
        }

        fetchAddresses()
    }, []);


    return (
        <>
             {/* Profile Information Section */}
            <div
                className="bg-white border border-gray-200 rounded-md w-[90%] max-w-full md:w-full p-6 md:py-4 mx-4 my-2 md:my-4 md:mx-auto flex flex-col justify-start items-start gap-6"
            >
                <div>
                    <h2 className="text-xl font-semibold text-gray-600">Profile Information</h2>
                    <p className="text-sm text-gray-600 mt-1">
                        Update your account's profile information and email address.
                    </p>
                </div>

                {/* form */}
                <form action="" className="w-full">
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

                    <button type="button" className="w-full md:w-fit btn-primary-sm" >Save Profile</button>

                </form>

            </div>

             {/* Shipping Information Section */}
            <div
                className="bg-white border border-gray-200 rounded-md w-[90%] max-w-full md:w-full p-6 md:py-4 mx-4 my-2 md:my-4 md:mx-auto flex flex-col justify-start items-start gap-6"
            >
                <div>
                    <h2 className="text-xl font-semibold text-gray-600">Shipping Information</h2>
                    <p className="text-sm text-gray-600 mt-1">
                        Update your account's shipping information.
                    </p>
                </div>

                {/* form */}
                <form action="" className="w-full">
                    {/* street address */}
                     <div className="my-2 md:my-4 md:w-lg">
                        <label htmlFor="streetAddress" className="text-gray-600">Street Address:</label>
                        <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-md px-3 py-3 md:py-4 w-full max-w-full md:max-w-lg focus-within:shadow-sm focus-within:border-[var(--color-primary)]">
                            <input
                                type="text"
                                name="streetAddress"
                                placeholder=""
                                value={streetAddress}
                                onChange={(e) => setStreetAddress(e.target.value)}
                                className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400 w-full"
                                required
                            />
                        </div>
                    </div>

                    {/* Postcode and Town/City side by side */}
                    <div className="flex flex-col md:flex-row max-w-full md:max-w-lg gap-4 ">
                        <div className="my-2 md:my-4 w-full md:w-md mr-4">

                            <label htmlFor="postcode" className="text-gray-600">Postcode:</label>
                            <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-md px-3 py-3 md:py-4 w-full max-w-full md:max-w-lg focus-within:shadow-sm focus-within:border-[var(--color-primary)]">
                                <input
                                    type="text"
                                    name="postcode"
                                    placeholder=""
                                    value={postcode}
                                    onChange={(e) => setPostcode(e.target.value)}
                                    className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400 w-full"
                                    required
                                />
                            </div>
                        </div>

                        <div className="my-2 md:my-4 w-full md:w-md ">

                            <label htmlFor="cityTown" className="text-gray-600">City/Town:</label>
                            <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-md px-3 py-3 md:py-4 w-full max-w-full md:max-w-lg focus-within:shadow-sm focus-within:border-[var(--color-primary)]">
                                <input
                                    type="text"
                                    name="cityTown"
                                    placeholder=""
                                    value={cityTown}
                                    onChange={(e) => setCityTown(e.target.value)}
                                    className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400 w-full"
                                    required
                                />
                            </div>
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

                    <button type="button" className="w-full md:w-fit btn-primary-sm" >Save Changes</button>

                </form>

            </div>

            {/* Change Password Section */}
            <div
                className="bg-white border border-gray-200 rounded-md w-[90%] max-w-full md:w-full p-6 md:py-4 mx-4 my-2 md:my-4 md:mx-auto flex flex-col justify-start items-start gap-6"
            >
                <div>
                    <h2 className="text-xl font-semibold text-gray-600">Change Password</h2>
                    <p className="text-sm text-gray-600 mt-1">
                        Update your account's password.
                    </p>
                </div>

                {/* form */}
                <form action="" className="w-full">
                     <div className="my-2 md:my-4 md:w-lg">

                        <label htmlFor="currentPassword" className="text-gray-600">Current Password:</label>
                        <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-md px-3 py-3 md:py-4 w-full max-w-full md:max-w-lg focus-within:shadow-sm focus-within:border-[var(--color-primary)]">
                            <input
                                type="password"
                                name="currentPassword"
                                placeholder=""
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400 w-full"
                                required
                            />
                        </div>
                    </div>
                     <div className="my-2 md:my-4 md:w-lg">

                        <label htmlFor="newPassword" className="text-gray-600">New Password:</label>
                        <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-md px-3 py-3 md:py-4 w-full max-w-full md:max-w-lg focus-within:shadow-sm focus-within:border-[var(--color-primary)]">
                            <input
                                type="password"
                                name="newPassword"
                                placeholder=""
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400 w-full"
                                required
                            />
                        </div>
                    </div>
                     <div className="my-2 md:my-4 md:w-lg">

                        <label htmlFor="confirmNewPassword" className="text-gray-600">Confirm New Password:</label>
                        <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-md px-3 py-3 md:py-4 w-full max-w-full md:max-w-lg focus-within:shadow-sm focus-within:border-[var(--color-primary)]">
                            <input
                                type="password"
                                name="confirmNewPassword"
                                placeholder=""
                                value={confirmNewPassword}
                                onChange={(e) => setConfirmNewPassword(e.target.value)}
                                className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400 w-full"
                                required
                            />
                        </div>
                    </div>

                    <button type="button" className="w-full md:w-fit btn-primary-sm" >Save Password</button>

                </form>

            </div>
            
        </>
    )
}

export default Settings;


/**
 * TODO:
 * - Billing information update linking to Stripe customer portal
 * - Two-factor authentication setup
 * - Notification preferences
 * - Delete account option with confirmation
 */