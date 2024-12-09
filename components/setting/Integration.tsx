"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
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

const integrations = [
    { name: "GitHub", description: "Connect your GitHub repositories", connected: true },
    { name: "Jira", description: "Sync issues with Jira", connected: false },
    { name: "Slack", description: "Get notifications in Slack", connected: true },
]

export default function Integrations() {
    return (
        <div>
            {/* Top Navigation */}
            {/* <DashboardSubNavbar /> */}
            <div className="px-8 py-4 max-w-4xl">
                <Card className="border border-purple-300">
                    <CardHeader>
                        <CardTitle className="text-purple-600">Integrations</CardTitle>
                        <CardDescription className="text-gray-700">Manage your connected services and tools.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {integrations.map((integration) => (
                                <div key={integration.name} className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-medium text-purple-600">{integration.name}</h3>
                                        <p className="text-sm text-gray-500">{integration.description}</p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Switch checked={integration.connected} className="bg-purple-500 border-purple-300" />
                                        <Button
                                            variant="outline"
                                            className="border-purple-500 text-purple-500 hover:bg-purple-100">
                                            {integration.connected ? "Configure" : "Connect"}
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}