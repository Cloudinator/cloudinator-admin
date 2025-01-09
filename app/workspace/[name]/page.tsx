'use client'
import {useEffect, useMemo, useState} from "react";
import {
    useDeleteServiceDeploymentMutation,
    useGetServiceDeploymentQuery,
    useGetSubWorkspacesQuery, useStartServiceDeploymentMutation, useStopServiceDeploymentMutation
} from "@/redux/api/projectApi";
import {
    ChevronLeft, ChevronRight,
    Database,
    ExternalLink, Eye,
    Folder,
    GitBranch,
    Globe,
    Layout, Power,
    Search,
    Server,
    Share2, Trash2
} from 'lucide-react';
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import {useToast} from "@/hooks/use-toast";

export type PropsParams = {
    params: Promise<{ name: string }>
}

type ServiceType = {
    name: string;
    gitUrl: string;
    branch: string;
    subdomain: string;
    status: boolean;
    type: 'all' | 'frontend' | 'backend' | 'database' | 'subworkspace';
};

export type ServiceDeploymentResponse = {
    next: boolean;
    previous: boolean;
    total: number;
    totalElements: number;
    results: ServiceType[];
};

type SubWorkspaceType = {
    name: string;
    type: 'subworkspace';
    uuid: string;
    gitUrl: string;
    branch: string;
    subdomain: string;
    status: boolean;
}

type SubWorkSpaceResponse = {
    next: boolean;
    previous: boolean;
    total: number;
    totalElements: number;
    results: SubWorkspaceType[];
};

interface ErrorResponse {
    status?: string;
    originalStatus?: number;
    data?: {
        message?: string;
    };
}


function getServiceIcon(type: ServiceType['type']) {
    switch (type) {
        case 'all':
            return <Folder className="w-5 h-5 text-yellow-500"/>;
        case 'frontend':
            return <Layout className="w-5 h-5 text-purple-600"/>;
        case 'backend':
            return <Server className="w-5 h-5 text-pink-600"/>;
        case 'database':
            return <Database className="w-5 h-5 text-orange-600"/>;
        case 'subworkspace':
            return <Share2 className="w-5 h-5 text-blue-600"/>;
    }
}

// Simple Breadcrumb components
const Breadcrumb = ({children}: { children: React.ReactNode }) => (
    <nav className="flex" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
            {children}
        </ol>
    </nav>
);

const BreadcrumbItem = ({children}: { children: React.ReactNode }) => (
    <li className="inline-flex items-center">
        <span className="mx-2 text-gray-400 text-sm">/</span>
        {children}
    </li>
);

const BreadcrumbLink = ({href, children}: { href: string; children: React.ReactNode }) => (
    <Link href={href} className="text-sm font-medium text-gray-700 hover:text-blue-600">
        {children}
    </Link>
);

const UserDetailPage = ({params}: PropsParams) => {
    const [projectName, setProjectName] = useState<string>('')
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedType, setSelectedType] = useState<ServiceType['type'] | 'all'>('all');
    const [currentPage, setCurrentPage] = useState(1)
    const usersPerPage = 10
    const [selectedWorkspace, setSelectedWorkspace] = useState(projectName);
    const [deleteService] = useDeleteServiceDeploymentMutation();
    const [stopService] = useStopServiceDeploymentMutation();
    const [startService] = useStartServiceDeploymentMutation();

    const {toast} = useToast();

    const {data: servicesData,refetch:data1} = useGetServiceDeploymentQuery({
        workspaceName: projectName,
        size: 10,
        page: 0,
    }) as unknown as { data: ServiceDeploymentResponse, refetch: () => void };

    const {data: subWorkspaceData,refetch:data2} = useGetSubWorkspacesQuery({
        workspaceName: projectName,
        size: 10,
        page: 0,
    }) as unknown as { data: SubWorkSpaceResponse,refetch: () => void };

    const handleDeleteService = async (name:string) => {

        try {
            const response = await deleteService({name : name}).unwrap()

            console.log(response)

        }catch (e) {
            const error = e as ErrorResponse;
            if (error?.status === 'PARSING_ERROR' && error?.originalStatus === 200) {
                toast({
                    title: "Success",
                    description: error?.data?.message || `Service "${name}" has been stop successfully.`,
                    variant: "success",
                    duration: 3000,
                });

                data1();
                data2();
            } else {
                toast({
                    title: "Error",
                    description: error?.data?.message || "Failed to delete service. Please try again.",
                    variant: "error",
                    duration: 5000,
                });
            }
            console.log(e)
            data1();
            data2();
        }
    }

    const handleToggleStopAndStartService = (service: ServiceType) => {
        try {
            if (service.status) {
                stopService({name: service.name});
            } else {
                startService({name: service.name});
            }

        } catch (error) {
            data1();
            data2();
            console.log("Error toggling workspace status:", error)
        }
    };

    const combinedResults = useMemo(() => {
        const services = servicesData?.results || [];
        const subWorkspaces = subWorkspaceData?.results || [];
        return [...services, ...subWorkspaces];
    }, [servicesData, subWorkspaceData]);


    const filteredServices = useMemo(() => {
        return combinedResults.filter((service: ServiceType) =>
            service.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (selectedType === 'all' || service.type === selectedType)
        );
    }, [combinedResults, searchTerm, selectedType]);


    useEffect(() => {
        params.then(({name}) => setProjectName(name))
    }, [params])

    const indexOfLastUser = currentPage * usersPerPage
    const indexOfFirstUser = indexOfLastUser - usersPerPage
    const currentUsers = filteredServices.slice(indexOfFirstUser, indexOfLastUser)
    const totalPages = Math.ceil(filteredServices.length / usersPerPage)


    return (
        <div className="p-6">
            <Breadcrumb>
                <BreadcrumbItem>
                    <BreadcrumbLink href="/users">users</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbItem>
                    <span className="text-sm font-medium text-gray-500">{projectName}</span>
                </BreadcrumbItem>
            </Breadcrumb>

            <h1 className="text-2xl font-bold mt-4 mb-6">Profile Details for {projectName}</h1>

            <div className="flex gap-4 mb-6">
                <Select
                    value={selectedWorkspace}
                    onValueChange={setSelectedWorkspace}
                >
                    <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder={projectName}/>
                    </SelectTrigger>
                    <SelectContent>
                        {projectName && (
                            <SelectItem key={projectName} value={projectName}>
                                {projectName}
                            </SelectItem>
                        )}
                    </SelectContent>
                </Select>

                <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>
                    <Input
                        type="text"
                        placeholder="Search Projects..."
                        className="pl-10 w-full"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex gap-2 mb-6">
                {(['all', 'frontend', 'backend', 'database', 'subworkspace'] as const).map((type) => (
                    <Button
                        key={type}
                        variant={selectedType === type ? "default" : "outline"}
                        onClick={() => setSelectedType(type)}
                    >
                        {getServiceIcon(type)}
                        <span className="ml-2 capitalize">{type}</span>
                    </Button>
                ))}
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Git URL</TableHead>
                        <TableHead>Branch</TableHead>
                        <TableHead>Subdomain</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {currentUsers.map((service: ServiceType) => (
                        <TableRow key={service.name}>
                            <TableCell>{service.name}</TableCell>
                            <TableCell>
                                <div className="flex items-center">
                                    {getServiceIcon(service.type)}
                                    <span className="ml-2 capitalize">{service.type}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <a href={service.gitUrl} target="_blank" rel="noopener noreferrer"
                                   className="flex items-center text-blue-600 hover:underline">
                                    <GitBranch className="w-4 h-4 mr-2"/>
                                    <span className="truncate">{service.gitUrl}</span>
                                    <ExternalLink className="w-3 h-3 ml-1"/>
                                </a>
                            </TableCell>
                            <TableCell>{service.branch}</TableCell>
                            <TableCell>
                                {service.type !== 'subworkspace' && (
                                    <a href={`https://${service.subdomain}.cloudinator.cloud`} target="_blank"
                                       rel="noopener noreferrer"
                                       className="flex items-center text-green-600 hover:underline">
                                        <Globe className="w-4 h-4 mr-2"/>
                                        <span className="truncate">{service.subdomain}</span>
                                        <ExternalLink className="w-3 h-3 ml-1"/>
                                    </a>
                                )}
                            </TableCell>
                            <TableCell>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                >
                                    {service.type === 'subworkspace' && (
                                        <Link href={`/`}>
                                            <Eye className="h-4 w-4"/>
                                        </Link>
                                    )}
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleToggleStopAndStartService(service)}
                                >
                                    <Power className="h-4 w-4"/>
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDeleteService(service.name)}
                                >
                                    <Trash2 className="h-4 w-4"/>
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                    Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, filteredServices.length)} of {filteredServices.length} services
                </p>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        <ChevronLeft className="h-4 w-4"/>
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        Next
                        <ChevronRight className="h-4 w-4"/>
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default UserDetailPage

