import { Metadata } from "next"
import {UserManagement} from "@/components/user/user-management";


export const metadata: Metadata = {
    title: "User Management",
    description: "Manage user of your application",
}

export default function UsersPage() {
    return (
        <div className="flex-1 space-y-6 p-8">
            <UserManagement />
        </div>
    )
}
