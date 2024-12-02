import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const deployments = [
    {
        status: "fail",
        name: "Cloudinator",
        description: "feat: add new dashboard",
        timeAgo: "10 min ago"
    },
    {
        status: "success",
        name: "Cloudinator",
        description: "feat: add new dashboard",
        timeAgo: "19 min ago"
    },
    {
        status: "success",
        name: "Cloudinator",
        description: "feat: add new dashboard",
        timeAgo: "20 min ago"
    },
    {
        status: "fail",
        name: "Cloudinator",
        description: "feat: add new dashboard",
        timeAgo: "10 hour ago"
    },
    {
        status: "success",
        name: "Cloudinator",
        description: "feat: add new dashboard",
        timeAgo: "2 hour ago"
    },
    {
        status: "fail",
        name: "Cloudinator",
        description: "feat: add new dashboard",
        timeAgo: "2 day ago"
    },
]

export function DeploymentHistory() {
    return (
        <div className="space-y-4">
            {deployments.map((deployment, index) => (
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
                        <p className="text-sm font-medium leading-none">{deployment.name}</p>
                        <p className="text-sm text-muted-foreground">{deployment.description}</p>
                    </div>
                    <div className="text-sm text-muted-foreground">{deployment.timeAgo}</div>
                </div>
            ))}
        </div>
    )
}

