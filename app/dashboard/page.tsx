import { Card, CardContent } from "@/components/ui/card"
import { AreaChart } from "@/components/dashboard/area-chart"
import { DeploymentHistory } from "@/components/dashboard/deployment-history"
import { ProjectOverview } from "@/components/dashboard/project-overview"
import { Users, Cloud, Activity, FolderKanban } from 'lucide-react'

export default function DashboardPage() {
    return (
        <div className="flex-1 space-y-6 p-8">
            <div className="flex items-center space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Hi, Welcome back 👋</h1>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between space-y-0 pb-2">
                            <p className="text-sm font-medium text-muted-foreground">Overall Project</p>
                            <FolderKanban className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-2xl font-bold">+2350</div>
                                <p className="text-xs text-muted-foreground">
                                    +180.1% from last month
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between space-y-0 pb-2">
                            <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-2xl font-bold">200</div>
                                <p className="text-xs text-muted-foreground">
                                    +20.1% from last month
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between space-y-0 pb-2">
                            <p className="text-sm font-medium text-muted-foreground">Cloud Resources</p>
                            <Cloud className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-2xl font-bold">+12,234</div>
                                <p className="text-xs text-muted-foreground">
                                    +15% from last month
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between space-y-0 pb-2">
                            <p className="text-sm font-medium text-muted-foreground">Active Now</p>
                            <Activity className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-2xl font-bold">+573</div>
                                <p className="text-xs text-muted-foreground">
                                    +201 since last hour
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-7">
                <Card className="col-span-4">
                    <CardContent className="p-6">
                        <div className="flex flex-col space-y-2">
                            <h3 className="font-semibold">Area Chart - Interactive</h3>
                            <p className="text-sm text-muted-foreground">Showing total visitors for the last 3 months</p>
                            <div className="h-[350px]">
                                <AreaChart />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <div className="col-span-3 grid gap-4">
                    <Card>
                        <CardContent className="p-6">
                            <h3 className="font-semibold mb-4">Recent Deployment</h3>
                            <DeploymentHistory />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <h3 className="font-semibold mb-4">Project Overall</h3>
                            <ProjectOverview />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

