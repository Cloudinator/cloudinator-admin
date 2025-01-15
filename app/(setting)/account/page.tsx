'use client'

import { Upload} from "lucide-react";
import { useState, useCallback } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const SettingPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const [formData, setFormData] = useState({
        firstName: 'Ing',
        lastName: 'Muyleang',
        email: 'muyleanging@gmail.com',
        username: 'sen sen',
        avatarSrc: "/avatars/cher-leang.jpg"
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleAvatarChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setFormData(prevState => ({ ...prevState, avatarSrc: e.target?.result as string }));
            };
            reader.readAsDataURL(file);
        }
    }, []);

    const handleLogout = () => {
        // window.location.href = "https://oauth2.cloudinator.istad.co/identity/logout";
        window.location.href = "http://localhost:8081/logout";
    };

    return (
        <div>
            {/* Top Navigation */}
            <div className="p-12 w-full">
                <div className="flex justify-between">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold mb-2 text-purple-500">Personal Information</h1>
                        <p className="text-gray-600 mb-8">Use a permanent address where you can receive mail.</p>
                    </div>
                    <div>
                        {/* Logout Button */}
                        <Button
                            className="bg-red-500 hover:bg-red-600 text-white transition-all ease-in-out shadow-md hover:shadow-lg"
                            onClick={() => setIsModalOpen(true)}
                        >
                            Logout
                        </Button>
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Avatar Section */}
                    <div className="flex items-start space-x-4">
                        <div className="h-20 w-20 rounded-full bg-gray-200 overflow-hidden">
                            <Image
                                src={formData.avatarSrc || "/avatars/cher-leang.jpg"}
                                alt="Profile"
                                className="object-cover"
                                width={500}
                                height={500}
                            />
                        </div>
                        <div>
                            <button
                                onClick={() => document.getElementById('avatar-upload')?.click()}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 mb-1 shadow-sm"
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
                    <div className="grid grid-cols-2 gap-6">
                        <FormField
                            label="First name"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                        />
                        <FormField
                            label="Last name"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                        />
                    </div>

                    <FormField
                        label="Email address"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                    />

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Username
                        </label>
                        <div className="flex">
                            <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                                example.com/
                            </span>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-none rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                    <div>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-md hover:shadow-lg">
                            Save
                        </button>
                    </div>
                </div>
            </div>

            {/* Confirmation Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-purple-500 font-bold">Confirm Logout</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to log out?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={closeModal}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleLogout}>
                            Logout
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

type User = {
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const FormField = ({ label, name, value, onChange }: User) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
        </label>
        <input
            type="text"
            name={name}
            value={value}
            onChange={onChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
    </div>
);

export default SettingPage;