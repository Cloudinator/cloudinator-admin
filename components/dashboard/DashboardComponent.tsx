'use client'
import { Card, CardContent } from "@/components/ui/card"
import { AreaChart } from "@/components/dashboard/area-chart"
import { DeploymentHistory } from "@/components/dashboard/deployment-history"
import { ProjectOverview } from "@/components/dashboard/project-overview"
import { Users, Cloud, Activity, FolderKanban } from 'lucide-react'
import {useCountUserQuery, useGetMeQuery} from "@/redux/api/userApi";
import {
    useCountProjectsQuery,
    useCountSubWorkspacesQuery,
    useGetBuildAnalysisQuery,
    useGetBuildHistoryQuery
} from "@/redux/api/projectApi";

export type BuildAnalysisItem = {
    success: number;
    fail: number;
};

type BuildHistory = {
    jobName: string,
    buildNumber: string,
    status: string,
    timeSince: string,
}

export type BuildHistoryResponse = BuildHistory[];

export type BuildAnalysisResponse = BuildAnalysisItem[];

export default function DashboardPageComponent() {

    const {data} = useGetMeQuery();

    const {data:count} = useCountProjectsQuery();

    const {data:countSubWorkspaces} = useCountSubWorkspacesQuery();

    const {data:countUsers} = useCountUserQuery()

    const { data: buildAnalysis } = useGetBuildAnalysisQuery() as { data: BuildAnalysisResponse | undefined }

    const { data: buildHistory } = useGetBuildHistoryQuery() as {data: BuildHistoryResponse | undefined}

    const totalSuccess = buildAnalysis?.reduce((sum, item) => sum + item.success, 0) ?? 0
    const totalFail = buildAnalysis?.reduce((sum, item) => sum + item.fail, 0) ?? 0

    const total = Number(count) + Number(countSubWorkspaces);

    const successRate = (totalSuccess / (totalSuccess + totalFail) * 100).toFixed(2);

    console.log(buildHistory);



    console.log(totalSuccess, totalFail);

    return (
        <div className="flex-1 space-y-6 p-8">
            <div className="flex items-center space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight">Hi, Welcome back, <span className="text-purple-500 font-bold">{data?.username}</span> 👋</h1>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between space-y-0 pb-2">
                            <p className="text-sm font-medium text-muted-foreground text-purple-500 font-semibold">Overall Project</p>
                            <FolderKanban className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-2xl font-bold">+ {total ? total : 0}</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between space-y-0 pb-2">
                            <p className="text-sm font-medium text-muted-foreground text-purple-500 font-semibold">Total Users</p>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-2xl font-bold">{countUsers ? countUsers : 0}</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between space-y-0 pb-2 ">
                            <p className="text-sm font-medium text-muted-foreground text-purple-500 font-semibold">Total SuccessRate</p>
                            <Cloud className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-2xl font-bold">{successRate ? successRate : 0 } % </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between space-y-0 pb-2">
                            <p className="text-sm font-medium text-muted-foreground text-purple-500 font-semibold">Active Now</p>
                            <Activity className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-2xl font-bold">+ {count ? count : 0}</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-7">
                <Card className="col-span-4">
                    <CardContent className="p-6">
                        <div className="flex flex-col space-y-2">
                            <h3 className="font-semibold text-purple-500">Area Chart - Interactive build history</h3>
                            <p className="text-sm text-muted-foreground">Showing total build for the last 3 months</p>
                            <div className="h-[350px]">
                                <AreaChart buildAnalysis={buildAnalysis} />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <div className="col-span-3 grid gap-4">
                    <Card>
                        <CardContent className="p-6">
                            <h3 className="font-semibold mb-4 text-purple-500 font-semibold">Recent Deployment</h3>
                            <DeploymentHistory buildHistory={buildHistory}/>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <h3 className="font-semibold mb-4 text-purple-500 font-semibold">Project Overall</h3>
                            <ProjectOverview />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

