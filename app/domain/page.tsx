import { Metadata } from "next"
import {DomainManagement} from "@/components/domain/domain-management";

export const metadata: Metadata = {
    title: "Domain Management",
    description: "Manage domains associated with your account or organization",
}

export default function DomainsPage() {
    return (
        <div className="flex-1 space-y-6 p-8">
            <DomainManagement />
        </div>
    )
}
