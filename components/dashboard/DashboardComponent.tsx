"use client";
import { Card, CardContent } from "@/components/ui/card";
import { AreaChart } from "@/components/dashboard/area-chart";
import { DeploymentHistory } from "@/components/dashboard/deployment-history";
import { ProjectOverview } from "@/components/dashboard/project-overview";
import { Users, Cloud, Activity, FolderKanban, Loader2 } from "lucide-react";
import { useCountUserQuery, useGetMeQuery } from "@/redux/api/userApi";
import {
  useCountProjectsQuery,
  useCountSubWorkspacesQuery,
  useGetBuildAnalysisQuery,
  useGetBuildHistoryQuery,
} from "@/redux/api/projectApi";
import Loading from "../Loading";
import { motion } from "framer-motion";
import Link from "next/link";

export type BuildAnalysisItem = {
  success: number;
  fail: number;
};

type BuildHistory = {
  jobName: string;
  buildNumber: string;
  status: string;
  timeSince: string;
  duration: string;
  buildUrl: string;
  triggeredBy?: string;
  timestamp: string;
};

export type BuildHistoryResponse = BuildHistory[];

export type BuildAnalysisResponse = BuildAnalysisItem[];

export default function DashboardPageComponent() {
  const { data } = useGetMeQuery();

  const { data: count, isLoading: isCountProjectsLoading } =
    useCountProjectsQuery();

  const { data: countSubWorkspaces, isLoading: isCountSubWorkspaceLoading } =
    useCountSubWorkspacesQuery();

  const { data: countUsers, isLoading: isCountUserLoading } =
    useCountUserQuery();

  const { data: buildAnalysis } = useGetBuildAnalysisQuery() as {
    data: BuildAnalysisResponse | undefined;
  };

  const { data: buildHistory } = useGetBuildHistoryQuery() as {
    data: BuildHistoryResponse | undefined;
  };

  const totalSuccess =
    buildAnalysis?.reduce((sum, item) => sum + item.success, 0) ?? 0;
  const totalFail =
    buildAnalysis?.reduce((sum, item) => sum + item.fail, 0) ?? 0;

  const total = Number(count) + Number(countSubWorkspaces);

  const successRate =
    totalSuccess + totalFail > 0
      ? ((totalSuccess / (totalSuccess + totalFail)) * 100).toFixed(2)
      : "...";

  console.log(buildHistory);

  console.log(totalSuccess, totalFail);

  const isLoading =
    isCountProjectsLoading || isCountSubWorkspaceLoading || isCountUserLoading;

  // Loading state
  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
          <Loading />
        </div>
      </div>
    );

  return (
    <div className="flex-1 space-y-6 p-8">
      <div className="flex flex-col items-center space-y-4 p-6 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg shadow-lg transform transition-all  hover:shadow-xl">
        <h1 className="text-4xl font-semibold tracking-tight text-white">
          Hi, Welcome back,{" "}
          <span className="text-purple-200 font-bold hover:text-purple-300 transition-colors duration-300">
            {data?.username}
          </span>
          <span role="img" aria-label="wave" className="animate-wave">
            👋
          </span>
        </h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="animated-gradient border border-purple-500/20 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <Link href="/workspace">
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-y-0 pb-2">
                <p className="text-sm font-medium text-white font-semibold">
                  Overall Project
                </p>
                <FolderKanban className="h-4 w-4 text-purple-300 animated-icon" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-white">
                    + {total ? total : 0}
                  </div>
                </div>
              </div>
            </CardContent>
          </Link>
        </Card>
        <Card className="animated-gradient border border-purple-500/20 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <Link href="/users">
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-y-0 pb-2">
                <p className="text-sm font-medium text-white font-semibold">
                  Total Users
                </p>
                <Users className="h-4 w-4 text-purple-300 animated-icon" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-white">
                    {countUsers ? countUsers : 0}
                  </div>
                </div>
              </div>
            </CardContent>
          </Link>
        </Card>
        <Card className="animated-gradient border border-purple-500/20 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium text-white font-semibold">
                Total Success Rate
              </p>
              <Cloud className="h-4 w-4 text-purple-300 animated-icon" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <motion.div
                  className={`text-2xl font-bold ${Number(successRate) > 50 ? "text-green-500" : "text-red-400"}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {successRate ? successRate : 0} %
                </motion.div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="animated-gradient border border-purple-500/20 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium text-white font-semibold">
                Active Now
              </p>
              <div className="relative inline-block">
                <div className="animate-pulse rounded-full bg-green-500 h-4 w-4 opacity-75"></div>
                <Activity className="absolute top-0 left-0 h-4 w-4 text-green-500 animated-icon" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl text-green-400 font-bold">
                  + {count ? count : 0}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-7">
        <Card className="col-span-4">
          <CardContent className="p-6">
            <div className="flex flex-col space-y-2">
              <h3 className="font-semibold text-purple-500">
                Area Chart - Interactive build history
              </h3>
              <p className="text-sm text-muted-foreground">
                Showing total build for the last 3 months
              </p>
              <div className="h-[350px]">
                <AreaChart buildAnalysis={buildAnalysis} isLoading={isLoading} />
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="col-span-3 grid gap-4">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4 text-purple-500 font-bold ">
                Recent Deployment
              </h3>
              <DeploymentHistory
                buildHistory={buildHistory}
                isLoading={false}
              />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4 text-purple-500 font-bold">
                Project Overall
              </h3>
              <ProjectOverview />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
