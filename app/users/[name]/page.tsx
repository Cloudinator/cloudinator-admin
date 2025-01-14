'use client'

import { useEffect, useMemo, useState } from "react";
import {
    useDeleteServiceDeploymentMutation,
    useGetServiceDeploymentQuery,
    useGetSubWorkspacesQuery,
    useGetWorkSpaceByUserNameQuery,
    useStartServiceDeploymentMutation,
    useStopServiceDeploymentMutation
} from "@/redux/api/projectApi";
import { ChevronLeft, ChevronRight, Database, ExternalLink, Eye, Folder, GitBranch, Globe, Layout, LayoutDashboard, Loader2, Power, Search, Server, Share2, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { useToast } from "@/hooks/use-toast";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Loading from "@/components/Loading";

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

type Workspace = {
    name: string;
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
            return <Folder className="w-5 h-5 text-yellow-500" />;
        case 'frontend':
            return <Layout className="w-5 h-5 text-purple-600" />;
        case 'backend':
            return <Server className="w-5 h-5 text-pink-600" />;
        case 'database':
            return <Database className="w-5 h-5 text-orange-600" />;
        case 'subworkspace':
            return <Share2 className="w-5 h-5 text-blue-600" />;
    }
}

const Breadcrumb = ({ items }: { items: { name: string; href: string }[] }) => (
    <nav className="flex" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
                <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-purple-600">
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Dashboard
                </Link>
            </li>
            {items.map((item, index) => (
                <li key={item.name} className="inline-flex items-center">
                    <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
                    {index === items.length - 1 ? (
                        <span className="text-sm font-medium text-gray-500">{decodeURIComponent(item.name).split(' ').map(word => <span key={word}>{word} </span>)}</span>
                    ) : (
                        <Link href={item.href} className="text-sm font-medium text-gray-700 hover:text-purple-600">
                            {decodeURIComponent(item.name).split(' ').map(word => <span key={word}>{word} </span>)}
                        </Link>
                    )}
                </li>
            ))}
        </ol>
    </nav>
);

const UserDetailPage = ({ params }: PropsParams) => {
    const [projectName, setProjectName] = useState<string>('')
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedType, setSelectedType] = useState<ServiceType['type'] | 'all'>('all');
    const [currentPage, setCurrentPage] = useState(1)
    const usersPerPage = 10
    const [deleteService] = useDeleteServiceDeploymentMutation();
    const [stopService] = useStopServiceDeploymentMutation();
    const [startService] = useStartServiceDeploymentMutation();
    const [isLoading, setIsLoading] = useState<boolean>(true);


    const { toast } = useToast();

    const { data, isLoading: isWorkspacesLoading } = useGetWorkSpaceByUserNameQuery(
        { username: projectName }
    )

    const workspaces: Workspace[] = Array.isArray(data) ? data : [];

    const [selectedWorkspace, setSelectedWorkspace] = useState(
        workspaces.length > 0 ? workspaces[0].name : ""
    );

    // Fetch services with loading state
    const { data: servicesData, isLoading: isServicesLoading, refetch: data1 } = useGetServiceDeploymentQuery({
        workspaceName: selectedWorkspace,
        size: 10,
        page: 0,
    }) as unknown as { data: ServiceDeploymentResponse, isLoading: boolean, refetch: () => void };

    // Fetch subworkspaces with loading state
    const { data: subWorkspaceData, isLoading: isSubWorkspacesLoading, refetch: data2 } = useGetSubWorkspacesQuery({
        workspaceName: selectedWorkspace,
        size: 10,
        page: 0,
    }) as unknown as { data: SubWorkSpaceResponse, isLoading: boolean, refetch: () => void };

    // Combine loading states
    const isPageLoading = isWorkspacesLoading || isServicesLoading || isSubWorkspacesLoading;

    useEffect(() => {
        // Set isLoading to false when all data is fetched
        if (!isWorkspacesLoading && !isServicesLoading && !isSubWorkspacesLoading) {
            setIsLoading(false);
        }
    }, [isWorkspacesLoading, isServicesLoading, isSubWorkspacesLoading]);

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
        params.then(({ name }) => setProjectName(name))
    }, [params])

    // Define breadcrumb items dynamically
    const breadcrumbItems = [
        { name: 'Users', href: '/users' },
        { name: projectName, href: `/users/${projectName}` },
    ];

    useEffect(() => {
        if (workspaces && workspaces.length > 0) {
            // Automatically select the first workspace
            setSelectedWorkspace(workspaces[0].name);
        }
    }, [workspaces]); 

    const indexOfLastUser = currentPage * usersPerPage
    const indexOfFirstUser = indexOfLastUser - usersPerPage
    const currentUsers = filteredServices.slice(indexOfFirstUser, indexOfLastUser)
    const totalPages = Math.ceil(filteredServices.length / usersPerPage)

    const handleDeleteService = async (name: string) => {
        try {
            await deleteService({ name: name }).unwrap();
            toast({
                title: "Success",
                description: `Service "${name}" has been deleted successfully.`,
                variant: "default",
                duration: 3000,
            });
            data1();
            data2();
        } catch (e) {
            const error = e as ErrorResponse;
            toast({
                title: "Error",
                description: error?.data?.message || "Failed to delete service. Please try again.",
                variant: "destructive",
                duration: 5000,
            });
            console.error(e);
            data1();
            data2();
        }
    }

    const handleToggleStopAndStartService = async (service: ServiceType) => {
        try {
            if (service.status) {
                await stopService({ name: service.name }).unwrap();
            } else {
                await startService({ name: service.name }).unwrap();
            }
            toast({
                title: "Success",
                description: `Service "${service.name}" has been ${service.status ? "stopped" : "started"} successfully.`,
                variant: "default",
                duration: 3000,
            });
            data1();
            data2();
        } catch (error) {
            const err = error as ErrorResponse;
            toast({
                title: "Error",
                description: err?.data?.message || `Failed to ${service.status ? "stop" : "start"} service. Please try again.`,
                variant: "destructive",
                duration: 5000,
            });
            console.error("Error toggling service status:", error);
        }
    };

    if (!workspaces) {
        return null;
    }

    // Loading state
    if (isPageLoading || isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="flex flex-col items-center gap-2">
                    <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
                    <Loading />
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <Breadcrumb items={breadcrumbItems} />

            <h1 className="text-3xl font-bold mt-4 mb-6 text-purple-500">{decodeURIComponent(projectName)}</h1>

            <div className="flex gap-4 mb-6">
                <Select
                    value={selectedWorkspace}
                    onValueChange={setSelectedWorkspace}
                >
                    <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Select Workspace" />
                    </SelectTrigger>
                    <SelectContent>
                        {Array.isArray(workspaces) && workspaces.map((workspace: Workspace) => (
                            <SelectItem key={workspace.name} value={workspace.name}>
                                {workspace.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
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
                        <TableHead className="text-purple-500 font-semibold">Name</TableHead>
                        <TableHead className="text-purple-500 font-semibold">Type</TableHead>
                        <TableHead className="text-purple-500 font-semibold">Git URL</TableHead>
                        <TableHead className="text-purple-500 font-semibold">Branch</TableHead>
                        <TableHead className="text-purple-500 font-semibold">Subdomain</TableHead>
                        <TableHead className="text-purple-500 font-semibold">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredServices.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center py-8">
                                <div className="flex flex-col items-center justify-center space-y-2 h-[500px]">
                                    <Folder className="h-8 w-8 text-muted-foreground" />
                                    <p className="text-muted-foreground">No projects or services found.</p>
                                    <p className="text-sm text-muted-foreground">
                                        Try adjusting your search or filters.
                                    </p>
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : (
                        currentUsers.map((service: ServiceType) => (
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
                                        <GitBranch className="w-4 h-4 mr-2" />
                                        <span className="truncate">{service.gitUrl}</span>
                                        <ExternalLink className="w-3 h-3 ml-1" />
                                    </a>
                                </TableCell>
                                <TableCell>{service.branch}</TableCell>
                                <TableCell>
                                    {service.type !== 'subworkspace' && (
                                        <a href={`https://${service.subdomain}.cloudinator.cloud`} target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center text-green-600 hover:underline">
                                            <Globe className="w-4 h-4 mr-2" />
                                            <span className="truncate">{service.subdomain}</span>
                                            <ExternalLink className="w-3 h-3 ml-1" />
                                        </a>
                                    )}
                                </TableCell>
                                <TableCell>
                                    {service.type === 'subworkspace' && (
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>View Subworkspace</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Are you sure you want to view the subworkspace &#34;{service.name}&#34;?
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction asChild>
                                                        <Link href={`/`}>
                                                            <Button variant="default">View</Button>
                                                        </Link>
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    )}
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <Power className="h-4 w-4 text-red-500" />
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>{service.status ? "Stop" : "Start"} Service</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Are you sure you want to {service.status ? "stop" : "start"} the service &#34;{service.name}&#34;?
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleToggleStopAndStartService(service)}>
                                                    {service.status ? "Stop" : "Start"}
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Delete Service</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Are you sure you want to delete the service &#34;{service.name}&#34;? This action cannot be undone.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleDeleteService(service.name)}>Delete</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
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
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        Next
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default UserDetailPage

