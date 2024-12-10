"use client";

import { Upload, User } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
// import DashboardSubNavbar from "@/components/navbar/DashboardSubNavbar";

const Setting = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [avatarSrc, setAvatarSrc] = useState("/placeholder.svg?height=100&width=100");

    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setAvatarSrc(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gray-50">
            {/* Top Navigation */}
            {/* <DashboardSubNavbar /> */}
            {/* Profile Settings Content */}
            <div className="px-10 py-6 ">
                <h1 className="text-2xl font-semibold mb-4 text-purple-600 flex items-center">
                    <User className="mr-2 h-8 w-8 text-purple-600" />
                    Personal Information
                </h1>
                <p className="text-gray-700 mb-6">Use a permanent address where you can receive mail.</p>

                <div className="space-y-8">
                    {/* Avatar Section */}
                    <div className="flex items-start space-x-4">
                        <div className="h-20 w-20 rounded-full bg-gray-200 overflow-hidden border border-purple-300">
                            {/* <img src={avatarSrc} alt="Profile" className="h-full w-full object-cover" /> */}
                            <Image src={avatarSrc} alt="Profile" className="h-full w-full object-cover" />
                        </div>
                        <div>
                            <button
                                onClick={() => document.getElementById('avatar-upload')?.click()}
                                className="inline-flex items-center px-4 py-2 border border-purple-500 rounded-lg text-sm font-medium text-purple-500 bg-white hover:bg-purple-50 transition duration-200 ease-in-out mb-1"
                            >
                                <Upload className="w-4 h-4 mr-2" />
                                Change avatar
                            </button>
                            <p className="text-sm text-gray-500">JPG, GIF or PNG. 1MB max.</p>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarChange}
                                className="hidden"
                                id="avatar-upload"
                            />
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* First Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                First name
                            </label>
                            <input
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring focus:ring-purple-500 focus:border-transparent transition duration-200 ease-in-out"
                            />
                        </div>

                        {/* Last Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Last name
                            </label>
                            <input
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring focus:ring-purple-500 focus:border-transparent transition duration-200 ease-in-out"
                            />
                        </div>

                        {/* Email Address */}
                        <div className="col-span-full">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring focus:ring-purple-500 focus:border-transparent transition duration-200 ease-in-out"
                            />
                        </div>

                        {/* Username */}
                        <div className="col-span-full">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Username
                            </label>
                            <div className="flex">
                                <span
                                    className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-purple-300 bg-purple-100 text-purple-600 text-sm">
                                    example.com/
                                </span>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="flex-grow px-4 py-2 border border-purple-300 rounded-none rounded-r-lg focus:outline-none focus:ring focus:ring-purple-500 focus:border-transparent transition duration-200 ease-in-out"
                                />
                            </div>
                        </div>

                        {/* Timezone */}
                        <div className="col-span-full">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Timezone
                            </label>
                            <select
                                defaultValue=""
                                className="w-full px-[0.475rem] py-[0.475rem] border border-purple-300 rounded-lg focus:outline-none focus:ring focus:ring-purple-500 focus:border-transparent transition duration-200 ease-in-out"
                            >
                                <option value="" disabled>Select your timezone</option>
                                <option value="pst">Pacific Standard Time</option>
                                <option value="mst">Mountain Standard Time</option>
                                <option value="cst">Central Standard Time</option>
                                <option value="est">Eastern Standard Time</option>
                            </select>
                        </div>

                        {/* Save Button */}
                        <div className="col-span-full flex justify-end">
                            <button
                                className="px-[1.5rem] py-[0.475rem] bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-200 ease-in-out font-medium shadow-md transform hover:scale-[1.02]"
                                onClick={() => alert('Settings saved!')} // Placeholder for save functionality
                            >
                                Save Changes
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
export default Setting;