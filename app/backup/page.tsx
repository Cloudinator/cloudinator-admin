import { Metadata } from "next"
import {ServerBackupManagement} from "@/components/backup/server-backup-management";


export const metadata: Metadata = {
    title: "Server Backup Management",
    description: "Manage server backups to ensure data safety and quick recovery",
}

export default function ServerBackupsPage() {
    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Server Backup Management</h2>
            </div>
            <ServerBackupManagement />
        </div>
    )
}

