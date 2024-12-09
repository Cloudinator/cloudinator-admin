"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// import DashboardSubNavbar from "@/components/navbar/DashboardSubNavbar";

export default function Billing() {
    return (
        <div>
            {/* Top Navigation */}
            {/* <DashboardSubNavbar /> */}
            <div className="px-8 py-4 max-w-4xl">
                <Card className="border border-purple-300">
                    <CardHeader>
                        <CardTitle className="text-purple-600">Billing Information</CardTitle>
                        <CardDescription className="text-gray-700">Manage your billing details and subscription.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-medium text-purple-600">Current Plan</h3>
                                <p className="text-sm text-gray-500">Pro Plan - $29/month</p>
                            </div>
                            <Button variant="outline" className="border-purple-500 text-purple-500 hover:bg-purple-100">
                                Change Plan
                            </Button>
                        </div>
                        <div>
                            <h3 className="text-lg font-medium text-purple-600 mb-2">Payment Method</h3>
                            <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-purple-100 rounded flex items-center justify-center">
                                    <span className="text-xs font-bold text-purple-600">VISA</span>
                                </div>
                                <span>Visa ending in 4242</span>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-medium text-purple-600 mb-2">Billing History</h3>
                            <ul className="space-y-2">
                                <li className="flex justify-between">
                                    <span>Apr 1, 2023</span>
                                    <span>$29.00</span>
                                </li>
                                <li className="flex justify-between">
                                    <span>Mar 1, 2023</span>
                                    <span>$29.00</span>
                                </li>
                            </ul>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}