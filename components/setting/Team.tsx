"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

const teamMembers = [
    { name: "Alice Johnson", role: "DevOps Engineer", avatar: "/placeholder.svg?height=32&width=32" },
    { name: "Bob Smith", role: "Frontend Developer", avatar: "/placeholder.svg?height=32&width=32" },
    { name: "Charlie Brown", role: "Backend Developer", avatar: "/placeholder.svg?height=32&width=32" },
]

export default function Team() {
    return (
        <div>
            {/* <DashboardSubNavbar /> */}
            <div className="px-8 py-4 max-w-4xl">
                <Card className="border border-purple-300">
                    <CardHeader>
                        <CardTitle className="text-purple-600">Team Management</CardTitle>
                        <CardDescription className="text-gray-700">Manage your team members and their roles.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {teamMembers.map((member) => (
                                <div key={member.name} className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <Avatar>
                                            <AvatarImage src={member.avatar} alt={member.name} />
                                            <AvatarFallback>{member.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium text-purple-600">{member.name}</p>
                                            <p className="text-sm text-gray-500">{member.role}</p>
                                        </div>
                                    </div>
                                    <Button variant="outline" className="border-purple-500 text-purple-500 hover:bg-purple-100">
                                        Manage
                                    </Button>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6">
                            <Button className="bg-purple-600 text-white hover:bg-purple-700">
                                Invite Team Member
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}