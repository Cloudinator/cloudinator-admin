import { Metadata } from "next"
import {WorkspaceManagement} from "@/components/workspace/workspace-management";


export const metadata: Metadata = {
    title: "Workspace Management",
    description: "Manage workspaces in your application",
}

export default function WorkspacesPage() {
    return (
        <div className="flex-1 space-y-6 p-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Workspace Management</h1>
            </div>
            <WorkspaceManagement />
        </div>
    )
}

