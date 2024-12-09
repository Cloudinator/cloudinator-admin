"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
// import DashboardSubNavbar from "@/components/navbar/DashboardSubNavbar";

export const metadata = {
    title: "Deployments Dashboard",
    description: "Track and manage project deployments efficiently.",
    keywords: ["Deployments", "Dashboard", "Project Management", "Status Tracker"],
    openGraph: {
        title: "Deployments Dashboard",
        description: "Track and manage project deployments efficiently.",
        url: "https://yourwebsite.com/deployments",
        images: [
            {
                url: "https://yourwebsite.com/assets/deployments-preview.png",
                width: 800,
                height: 600,
                alt: "Deployments Dashboard Preview",
            },
        ],
    },
}

export default function Notifications() {
    return (
        <>
            <div>
                {/* Top Navigation */}
                {/* <DashboardSubNavbar /> */}
                <div className="px-8 py-4 max-w-4xl">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-purple-500">Notification Preferences</CardTitle>
                            <CardDescription>Manage how you receive notifications.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between space-x-2">
                                <Label htmlFor="email-notifications" className="flex flex-col space-y-1">
                                    <span>Email Notifications</span>
                                    <span className="font-normal text-sm text-gray-500">Receive notifications via email</span>
                                </Label>
                                <Switch id="email-notifications" className="bg-purple-500 border-purple-300" />
                            </div>
                            <div className="flex items-center justify-between space-x-2">
                                <Label htmlFor="push-notifications" className="flex flex-col space-y-1">
                                    <span>Push Notifications</span>
                                    <span className="font-normal text-sm text-gray-500">Receive notifications on your device</span>
                                </Label>
                                <Switch id="push-notifications" className="bg-purple-500 border-purple-300" />
                            </div>
                            <div className="flex items-center justify-between space-x-2">
                                <Label htmlFor="sms-notifications" className="flex flex-col space-y-1">
                                    <span>SMS Notifications</span>
                                    <span className="font-normal text-sm text-gray-500">Receive notifications via SMS</span>
                                </Label>
                                <Switch id="sms-notifications" className="bg-purple-500 border-purple-300" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}   