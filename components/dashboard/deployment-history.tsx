import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { parseTimeSince } from "@/lib/timeUtils";
import { BuildHistoryResponse } from "@/components/dashboard/DashboardComponent";
import { CheckCircle, XCircle, Clock, Loader, Loader2 } from "lucide-react"; // Icons for status
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"; // Tooltip for additional info

type BuildHistoryProps = {
  buildHistory: BuildHistoryResponse | undefined;
  isLoading: boolean; // Add isLoading prop to handle loading state
  error?: string; // Add error prop to handle error state
};

export function DeploymentHistory({
  buildHistory,
  isLoading,
  error,
}: BuildHistoryProps) {
  // Show a loading state if data is being fetched
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="p-4 border rounded-lg animate-pulse">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-shrink-0">
                <div className="w-5 h-5 bg-gray-200 rounded-full" />
              </div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-200 rounded-full" />
                <div className="h-3 bg-gray-200 rounded w-8" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Show an error message if there's an error
  if (error) {
    return (
      <div className="flex items-center justify-center h-[200px]">
        <div className="flex flex-col items-center gap-2 text-center text-muted-foreground">
          <XCircle className="w-8 h-8 text-red-500" />
          <p>Failed to fetch deployments: {error}</p>
        </div>
      </div>
    );
  }

  // Show a message if no data is available
  if (!buildHistory || buildHistory.length === 0) {
    return (
      <div className="flex items-center justify-center h-[200px]">
        <div className="flex flex-col items-center gap-2 text-center text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
          <p>Deployments has found is building...</p>
        </div>
      </div>
    );
  }

  // Filter out deployments with names containing "long id"
  const filteredBuildHistory = buildHistory.filter(
    (deployment) => !deployment.jobName.toLowerCase().includes("long id"),
  );

  // Filter out deployments with UUID-like names
  const nonUUIDFilteredBuildHistory = filteredBuildHistory.filter(
    (deployment) =>
      !/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
        deployment.jobName,
      ),
  );

  // Filter deployments to show only those whose names start with an alphabet
  const alphabetFilteredBuildHistory = nonUUIDFilteredBuildHistory.filter(
    (deployment) => /^[a-zA-Z]/.test(deployment.jobName),
  );

  // Sort the buildHistory array by timestamp (most recent first)
  const sortedBuildHistory = [...alphabetFilteredBuildHistory].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );

  // Slice the data to get the 10 latest entries
  const latestBuildHistory = sortedBuildHistory.slice(0, 20);

  return (
    <div className="space-y-4 max-h-[400px] overflow-y-hidden relative scroll-container">
      <div className="auto-scroll">
        {latestBuildHistory.map((deployment, index) => (
          <a
            key={index}
            href={deployment.buildUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "block p-4 border rounded-lg transition-transform transform hover:translate-y-1 hover:scale-105 hover:shadow-lg cursor-pointer mb-4",
              deployment.status === "success"
                ? "hover:bg-emerald-50 hover:border-emerald-500/20" // Success hover styles
                : deployment.status === "failure"
                  ? "hover:bg-red-50 hover:border-red-500/20" // Failure hover styles
                  : "hover:bg-blue-50 hover:border-blue-500/20", // Building hover styles
            )}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex-shrink-0">
                {deployment.status === "success" ? (
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                ) : deployment.status === "failure" ? (
                  <XCircle className="w-5 h-5 text-red-500" />
                ) : (
                  <div className="flex items-center gap-2">
                    <Loader className="w-5 h-5 text-blue-500 animate-spin" />
                    <span className="text-sm text-blue-500">Building...</span>
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">
                  {deployment.jobName}
                </p>
                {deployment.triggeredBy && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Badge variant="outline" className="text-sm">
                          Triggered by: {deployment.triggeredBy}
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Triggered by: {deployment.triggeredBy}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Clock className="w-4 h-4" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Duration</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <span>
                  {deployment.status === "building"
                    ? "In progress"
                    : parseTimeSince(deployment.timeSince)}
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
