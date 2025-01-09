import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {parseTimeSince} from "@/lib/timeUtils";
import {BuildHistoryResponse} from "@/components/dashboard/DashboardComponent";


type BuildHistoryProps = {
    buildHistory: BuildHistoryResponse | undefined;
}

export function DeploymentHistory({ buildHistory }: BuildHistoryProps) {
    if (!buildHistory) {
        return null;
    }

    // Sort the buildHistory array by timeSince
    const sortedBuildHistory = [...buildHistory].sort((a, b) =>
        parseTimeSince(a.timeSince) - parseTimeSince(b.timeSince)
    );

    // Slice the data to get the 5 latest entries
    const latestBuildHistory = sortedBuildHistory.slice(0, 5);

    return (
        <div className="space-y-4">
            {latestBuildHistory.map((deployment, index) => (
                <div key={index} className="flex items-center gap-4">
                    <Badge
                        variant="outline"
                        className={cn(
                            "w-16 justify-center",
                            deployment.status === "success"
                                ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-500"
                                : "border-red-500/20 bg-red-500/10 text-red-500"
                        )}
                    >
                        {deployment.status}
                    </Badge>
                    <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">{deployment.jobName}</p>
                    </div>
                    <div className="text-sm text-muted-foreground">{deployment.timeSince}</div>
                </div>
            ))}
        </div>
    )
}

