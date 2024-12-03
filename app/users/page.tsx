import { Metadata } from "next"
import {UserManagement} from "@/components/user/user-management";


export const metadata: Metadata = {
    title: "User Management",
    description: "Manage user of your application",
}

export default function UsersPage() {
    return (
        <div className="flex-1 space-y-6 p-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
            </div>
            <UserManagement />
        </div>
    )
}
