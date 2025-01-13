'use client'

import { useEffect, useMemo, useState } from "react";
import {
    useDeleteServiceDeploymentMutation,
    useGetServiceDeploymentQuery,
    useGetSubWorkspacesQuery,
    useStartServiceDeploymentMutation,
    useStopServiceDeploymentMutation
} from "@/redux/api/projectApi";
import { ChevronLeft, ChevronRight, LayoutDashboard, Database, ExternalLink, Eye, Folder, GitBranch, Globe, Layout, Power, Search, Server, Share2, Trash2, StopCircle, Loader2 } from 'lucide-react';
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
                        <span className="text-sm font-medium text-gray-500">{item.name}</span>
                    ) : (
                        <Link href={item.href} className="text-sm font-medium text-gray-700 hover:text-purple-600">
                            {item.name}
                        </Link>
                    )}
                </li>
            ))}
        </ol>
    </nav>
);

const EmptyState = () => (
    <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-lg bg-purple-50 h-[600px]">
        <Folder className="w-12 h-12 text-purple-500 mb-4" />
        <h3 className="text-xl font-semibold text-purple-600">No Services Found</h3>
        <p className="text-sm text-purple-500">There are no services or sub-workspaces in this project.</p>
    </div>
);


const WorkSpaceDetailPage = ({ params }: PropsParams) => {
    const [projectName, setProjectName] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedType, setSelectedType] = useState<ServiceType['type'] | 'all'>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 10;
    const [selectedWorkspace, setSelectedWorkspace] = useState(projectName);
    const [deleteService] = useDeleteServiceDeploymentMutation();
    const [stopService] = useStopServiceDeploymentMutation();
    const [startService] = useStartServiceDeploymentMutation();
    const [loadingService, setLoadingService] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const { toast } = useToast();

    useEffect(() => {
        params.then(({ name }) => setProjectName(name));
    }, [params]);

    // Define breadcrumb items dynamically
    const breadcrumbItems = [
        { name: 'Workspace', href: '/workspace' },
        { name: projectName, href: `/workspace/${projectName}` },
    ];


    const { data: servicesData, refetch: refetchServices, isLoading: isServicesLoading, isFetching: isServicesFetching } = useGetServiceDeploymentQuery({
        workspaceName: projectName,
        size: 10,
        page: 0,
    }) as unknown as { data: ServiceDeploymentResponse, refetch: () => void, isLoading: boolean, isFetching: boolean };

    const { data: subWorkspaceData, refetch: refetchSubWorkspaces, isLoading: isSubWorkspacesLoading, isFetching: isSubWorkspacesFetching } = useGetSubWorkspacesQuery({
        workspaceName: projectName,
        size: 10,
        page: 0,
    }) as unknown as { data: SubWorkSpaceResponse, refetch: () => void, isLoading: boolean, isFetching: boolean };

    useEffect(() => {
        // Set isLoading to false when both services and sub-workspaces data are loaded
        if (!isServicesLoading && !isSubWorkspacesLoading && !isServicesFetching && !isSubWorkspacesFetching) {
            setIsLoading(false);
        }
    }, [isServicesLoading, isSubWorkspacesLoading, isServicesFetching, isSubWorkspacesFetching]);

    const handleDeleteService = async (name: string) => {
        setLoadingService(name); // Set loading state for the specific service

        try {
            await deleteService({ name: name }).unwrap();
            toast({
                title: "Success",
                description: `Service "${name}" has been deleted successfully.`,
                variant: "success",
                duration: 3000,
            });

            refetchServices(); // Refetch services data
            refetchSubWorkspaces(); // Refetch sub-workspaces data
        } catch (err) {
            const error = err as ErrorResponse;
            toast({
                title: "Error",
                description: error?.data?.message || "Failed to delete service. Please try again.",
                variant: "error",
                duration: 5000,
            });
        } finally {
            setLoadingService(null); // Clear loading state
        }
    };

    const handleToggleStopAndStartService = async (service: ServiceType) => {
        setLoadingService(service.name); // Set loading state for the specific service

        try {
            if (service.status) {
                await stopService({ name: service.name }).unwrap();
            } else {
                await startService({ name: service.name }).unwrap();
            }

            toast({
                title: "Success",
                description: `Service "${service.name}" has been ${service.status ? "stopped" : "started"} successfully.`,
                variant: "success",
                duration: 3000,
            });

            refetchServices(); // Refetch services data
            refetchSubWorkspaces(); // Refetch sub-workspaces data
        } catch (err) {
            const error = err as ErrorResponse;

            if (error?.status === "PARSING_ERROR" && error?.originalStatus === 200) {
                toast({
                    title: "Success",
                    description: error?.data?.message || `Service "${service.name}" has been ${service.status ? "stopped" : "started"} successfully.`,
                    variant: "success",
                    duration: 3000,
                });
                refetchServices(); // Refetch services data
                refetchSubWorkspaces(); // Refetch sub-workspaces data
            } else {
                toast({
                    title: "Error",
                    description: error?.data?.message || `Failed to ${service.status ? "stop" : "start"} service. Please try again.`,
                    variant: "error",
                    duration: 5000,
                });
            }
        } finally {
            setLoadingService(null); // Clear loading state
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
        params.then(({ name }) => setProjectName(name));
    }, [params]);

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredServices.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredServices.length / usersPerPage);

    // Loading state
    if (isLoading) return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="flex flex-col items-center gap-2">
                <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
                <Loading />
            </div>
        </div>
    );

    return (
        <div className="p-8">
            <Breadcrumb items={breadcrumbItems} />

            <h1 className="text-3xl font-bold mt-4 mb-6 text-purple-500 font-bold">{projectName}</h1>

            <div className="flex gap-4 mb-6">
                <Select
                    value={selectedWorkspace}
                    onValueChange={setSelectedWorkspace}
                >
                    <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder={projectName} />
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


            {filteredServices.length === 0 ? (
                <EmptyState />
            ) : (
                <>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-purple-500 ">Name</TableHead>
                                <TableHead className="text-purple-500 ">Type</TableHead>
                                <TableHead className="text-purple-500 ">Git URL</TableHead>
                                <TableHead className="text-purple-500 ">Branch</TableHead>
                                <TableHead className="text-purple-500 ">Subdomain</TableHead>
                                <TableHead className="text-purple-500 ">Actions</TableHead>
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
                                                    <Button variant="ghost" size="icon" className="text-purple-600 hover:bg-purple-100">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent className="bg-white border-purple-300">
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>View Subworkspace</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Are you sure you want to view the subworkspace &#34;{service.name}&#34;?
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel className="border-purple-300 text-purple-600 hover:bg-purple-50">Cancel</AlertDialogCancel>
                                                        <AlertDialogAction asChild>
                                                            <Link href={`/`}>
                                                                <Button variant="default" className="bg-purple-600 hover:bg-purple-700">View</Button>
                                                            </Link>
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        )}
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    {service.status ? <Power className="h-4 w-4 text-red-500" /> : <Power className="h-4 w-4 text-green-500" />}
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent className="bg-white border-purple-300">
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle className="text-purple-500 font-semibold">
                                                        {service.status ? "Stop" : "Start"} Service
                                                    </AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Are you sure you want to {service.status ? "stop" : "start"} the service &#34;{service.name}&#34;?
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel className="border-purple-300 text-purple-600 hover:bg-purple-50">Cancel</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={(e) => {
                                                            e.stopPropagation(); // Prevent row click when clicking the action
                                                            handleToggleStopAndStartService(service);
                                                        }}
                                                        className={service.status ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}
                                                    >
                                                        {service.status ? "Stop" : "Start"}
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="ghost" size="icon" className="text-purple-600 hover:bg-purple-100">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent className="bg-white border-purple-300">
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Delete Service</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Are you sure you want to delete the service &#34;{service.name}&#34;? This action cannot be undone.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel className="border-purple-300 text-purple-600 hover:bg-purple-50">Cancel</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={(e) => {
                                                            e.stopPropagation(); // Prevent row click when clicking the action
                                                            handleToggleStopAndStartService(service);
                                                        }}
                                                        className={service.status ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}
                                                        disabled={loadingService === service.name} // Disable button while loading
                                                    >
                                                        {loadingService === service.name ? (
                                                            <Loader2 className="h-4 w-4 animate-spin" /> // Show loading spinner
                                                        ) : (
                                                            service.status ? "Stop" : "Start"
                                                        )}
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </>
            )}
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

export default WorkSpaceDetailPage

