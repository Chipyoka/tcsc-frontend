import React, { useState } from "react";
import useAuthStore from '../../store/auth.store.js';
import { useProfileStore } from "../../store/profile.store.js";
import axiosInstance from '../../api/axiosInstance'; 
import { toast } from 'react-toastify';

const Settings = () => {
    const { setAddress, address } = useProfileStore();
    const { accessToken, user, updateUser } = useAuthStore();

    // Profile fields
    const [email, setEmail] = useState(user.email);
    const [name, setName] = useState(user.fullName);

    // Address fields
    const [streetAddress, setStreetAddress] = useState(address?.data?.line1 || "");
    const [postcode, setPostcode] = useState(address?.data?.postal_code || "");
    const [cityTown, setCityTown] = useState(address?.data?.city || "");
    const [phone, setPhone] = useState(address?.data?.phone || "");
    const [loadingA, setLoadingA] = useState(false);

    // Password fields
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [loadingP, setLoadingP] = useState(false);
    const [loadingProfile, setLoadingProfile] = useState(false);

    /** HANDLE SAVE ADDRESS (CREATE OR UPDATE) */
    const handleSaveAddress = async (e) => {
        e.preventDefault();
        setLoadingA(true);

        if (!streetAddress || !postcode || !cityTown || !phone) {
            toast.error('All shipping information fields are required');
            setLoadingA(false);
            return;
        }

        const payload = {
            line1: streetAddress,
            line2: streetAddress,
            postal_code: postcode,
            city: cityTown,
            state: cityTown,
            phone,
            country: "uk",
            full_name: user?.fullName || "unknown",
            company: user?.fullName || "unknown",
            metadata: { message: "updated via settings page" }
        };

        try {
            let response;
            if (address?.data?.id) {
                // Update existing address
                response = await axiosInstance.put(`/profile/addresses/${address.data.id}`, payload);
            } else {
                // Add new address
                response = await axiosInstance.post('/profile/addresses', payload);
            }
              const saveAddress = {
                    loading: false,
                    status: "found",
                    data: response.data,
                  }

            setAddress(saveAddress); // update store
            toast.success("Address saved successfully!");
        } catch (err) {
            console.error("Address save failed:", err);
            toast.error("Failed to save address. Try again later.");
        } finally {
            setLoadingA(false);
        }
    };

    /** HANDLE PROFILE UPDATE */
    const handleSaveProfile = async () => {
        setLoadingProfile(true);
        try {
            const payload = { full_name: name, metadata: { email } };
            const response = await axiosInstance.put('/profile', payload);
            toast.success("Profile updated successfully!");
            console.log(response.data);
            updateUser(response.data);
        } catch (err) {
            console.error("Profile update failed:", err);
            toast.error("Failed to update profile. Try again later.");
        } finally {
            setLoadingProfile(false);
        }
    };

    /** HANDLE PASSWORD CHANGE */
    const handleChangePassword = async () => {
        if (!currentPassword || !newPassword || !confirmNewPassword) {
            toast.error("All password fields are required");
            return;
        }

        if (newPassword.length < 8) {
            toast.error("New password must be at least 8 characters");
            return;
        }

        if (newPassword !== confirmNewPassword) {
            toast.error("New passwords do not match");
            return;
        }

        setLoadingP(true);
        try {
            await axiosInstance.post('/profile/change-password', {
                currentPassword,
                newPassword
            });
            toast.success("Password updated successfully!");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmNewPassword("");
        } catch (err) {
            console.error("Password update failed:", err);
            if (err.response?.status === 401) {
                toast.error("Current password incorrect");
            } else {
                toast.error("Failed to update password. Try again later.");
            }
        } finally {
            setLoadingP(false);
        }
    };

    return (
        <>
            {/* Shipping Information */}
            <div className="bg-white border border-gray-200 rounded-md w-[90%] max-w-full md:w-full p-6 md:py-4 mx-4 my-2  md:mx-auto flex flex-col">
                <h2 className="text-xl font-semibold text-gray-600">Shipping Information</h2>
                <p className="text-sm text-gray-600 mt-1">Update your account's shipping information.</p>
                <form onSubmit={handleSaveAddress} className="w-full">
                <div className="my-2  md:w-lg">
                        <label className="text-gray-600">Street Address:</label>
                        <input
                            type="text"
                            value={streetAddress}
                            onChange={(e) => setStreetAddress(e.target.value)}
                            className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400 w-full border border-gray-300 rounded-md px-3 py-3 md:py-4"
                            required
                        />
                    </div>
                    <div className="flex flex-col md:flex-row gap-4 md:w-lg">
                        <div className="my-2  md:w-1/2">
                            <label className="text-gray-600">Postal Code:</label>
                            <input
                                type="text"
                                value={postcode}
                                onChange={(e) => setPostcode(e.target.value)}
                                placeholder="Postcode"
                                className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400 w-full border border-gray-300 rounded-md px-3 py-3 md:py-4"
                                required
                            />
                        </div>
                        <div className="my-2  md:w-1/2">
                              <label className="text-gray-600">City/Town:</label>
                            <input
                                type="text"
                                value={cityTown}
                                onChange={(e) => setCityTown(e.target.value)}
                                placeholder="City/Town"
                                className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400 w-full border border-gray-300 rounded-md px-3 py-3 md:py-4"
                                required
                            />
                        </div>
                    </div>
                    <div className="my-2  md:w-lg">
                        <label className="text-gray-600">Phone:</label>
                        <input
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Phone"
                            className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400 w-full border border-gray-300 rounded-md px-3 py-3 md:py-4"
                            required
                        />
                    </div>
                    <button type="submit" className="w-full md:w-fit btn-primary-sm" disabled={loadingA}>
                        {loadingA ? 'Saving...' : 'Save Address'}
                    </button>
                </form>
            </div>

            {/* Profile Information */}
            <div className="bg-white border border-gray-200 rounded-md w-[90%] max-w-full md:w-full p-6 md:py-4 mx-4 my-2  md:mx-auto flex flex-col">
                <h2 className="text-xl font-semibold text-gray-600">Profile Information</h2>
                <p className="text-sm text-gray-600 mt-1">Update your account's profile information and email address.</p>
                <div className="my-2  md:w-lg">
                    <label className="text-gray-600">Fullname:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400 w-full border border-gray-300 rounded-md px-3 py-3 md:py-4"
                        required
                    />
                </div>
                <div className="my-2  md:w-lg">
                    <label className="text-gray-600">Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400 w-full border border-gray-300 rounded-md px-3 py-3 md:py-4"
                        required
                    />
                </div>
                <button type="button" className="w-full md:w-fit btn-primary-sm" onClick={handleSaveProfile} disabled={loadingProfile}>
                    {loadingProfile ? 'Saving...' : 'Save Profile'}
                </button>
            </div>

            {/* Change Password */}
            <div className="bg-white border border-gray-200 rounded-md w-[90%] max-w-full md:w-full p-6 md:py-4 mx-4 my-2  md:mx-auto flex flex-col">
                <h2 className="text-xl font-semibold text-gray-600">Change Password</h2>
                <p className="text-sm text-gray-600 mt-1">Update your account's password.</p>
                <div className="my-2  md:w-lg">
                    <label className="text-gray-600">Current Password:</label>
                    <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400 w-full border border-gray-300 rounded-md px-3 py-3 md:py-4"
                        required
                    />
                </div>
                <div className="my-2  md:w-lg">
                    <label className="text-gray-600">New Password:</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400 w-full border border-gray-300 rounded-md px-3 py-3 md:py-4"
                        required
                    />
                </div>
                <div className="my-2  md:w-lg">
                    <label className="text-gray-600">Confirm New Password:</label>
                    <input
                        type="password"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400 w-full border border-gray-300 rounded-md px-3 py-3 md:py-4"
                        required
                    />
                </div>
                <button type="button" className="w-full md:w-fit btn-primary-sm" onClick={handleChangePassword} disabled={loadingP}>
                    {loadingP ? 'Saving...' : 'Save Password'}
                </button>
            </div>
        </>
    );
};

export default Settings;
