"use client"

import { useState, useMemo } from "react"
import { Search, Briefcase, Users, Calendar, ChevronLeft, ChevronRight, Eye, Power, Trash2, Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
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
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    useCountAllServicesQuery,
    useCountAllSubWorkspaceQuery,
    useDisableWorkspaceMutation,
    useEnableWorkspaceMutation,
    useGetAllWorkSpacesQuery
} from "@/redux/api/projectApi"
import Link from "next/link"

type Workspace = {
    uuid: string
    name: string
    isActive: boolean
}

type Workspaces = Workspace[]

export function WorkspaceManagement() {
    const [searchTerm, setSearchTerm] = useState("")
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [newWorkspace, setNewWorkspace] = useState({ name: "", description: "" })
    const [currentPage, setCurrentPage] = useState(1)
    const workspacesPerPage = 8

    const [enableWorkspace] = useEnableWorkspaceMutation()
    const [disableWorkspace] = useDisableWorkspaceMutation()

    const { data: workspaces, isLoading, isError, refetch } = useGetAllWorkSpacesQuery() as {
        data: Workspaces | undefined,
        isLoading: boolean,
        isError: boolean,
        refetch: () => void
    }

    const { data: countService } = useCountAllServicesQuery()
    const { data: countSubWorkspaces } = useCountAllSubWorkspaceQuery()

    const filteredWorkspaces = useMemo(() => {
        return workspaces?.filter(
            (workspace) => workspace.name.toLowerCase().includes(searchTerm.toLowerCase())
        ) || []
    }, [workspaces, searchTerm])

    const indexOfLastWorkspace = currentPage * workspacesPerPage
    const indexOfFirstWorkspace = indexOfLastWorkspace - workspacesPerPage
    const currentWorkspaces = filteredWorkspaces.slice(indexOfFirstWorkspace, indexOfLastWorkspace)
    const totalPages = Math.ceil(filteredWorkspaces.length / workspacesPerPage)

    const handleAddWorkspace = () => {
        // Implement API call to add new workspace
        console.log("Adding new workspace:", newWorkspace)
        setNewWorkspace({ name: "", description: "" })
        setIsAddDialogOpen(false)
    }

    const handleDeleteWorkspace = (uuid: string) => {
        // Implement API call to delete workspace
        console.log("Deleting workspace:", uuid)
    }

    const handleToggleWorkspaceStatus = (workspace: Workspace) => {
        try {
            if (workspace.isActive) {
                disableWorkspace({ name: workspace.name })
            } else {
                enableWorkspace({ name: workspace.name })
            }
            refetch()
        } catch (error) {
            console.log("Error toggling workspace status:", error)
        }
    }

    const totalWorkspaces = workspaces?.length || 0
    const activeWorkspaces = workspaces?.filter(w => w.isActive).length || 0

    if (isLoading) return <div>Loading...</div>
    if (isError) return <div>Error loading workspaces</div>

    const total_projects = Number(countService) + Number(countSubWorkspaces)

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold tracking-tight">Workspace Management</h2>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Add Workspace
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Workspace</DialogTitle>
                            <DialogDescription>
                                Enter the details of the new workspace below.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">
                                    Name
                                </Label>
                                <Input
                                    id="name"
                                    value={newWorkspace.name}
                                    onChange={(e) => setNewWorkspace({ ...newWorkspace, name: e.target.value })}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="description" className="text-right">
                                    Description
                                </Label>
                                <Input
                                    id="description"
                                    value={newWorkspace.description}
                                    onChange={(e) => setNewWorkspace({ ...newWorkspace, description: e.target.value })}
                                    className="col-span-3"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleAddWorkspace}>Add Workspace</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Workspaces</CardTitle>
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalWorkspaces}</div>
                        <p className="text-xs text-muted-foreground">
                            {activeWorkspaces} active, {totalWorkspaces - activeWorkspaces} inactive
                        </p>
                        <Progress
                            value={(activeWorkspaces / totalWorkspaces) * 100}
                            className="mt-2"
                        />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Members</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">N/A</div>
                        <p className="text-xs text-muted-foreground mt-2">Data not available</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{total_projects}</div>
                        <p className="text-xs text-muted-foreground mt-2">Across all workspaces</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg Projects/Workspace</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {totalWorkspaces > 0 ? (total_projects / totalWorkspaces).toFixed(2) : 'N/A'}
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                            {totalWorkspaces > 0 ? 'Average across all workspaces' : 'No workspaces available'}
                        </p>
                    </CardContent>
                </Card>
            </div>
            <Tabs defaultValue="all" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="all">All Workspaces</TabsTrigger>
                    <TabsTrigger value="active">Active</TabsTrigger>
                    <TabsTrigger value="inactive">Inactive</TabsTrigger>
                </TabsList>
                <TabsContent value="all" className="space-y-4">
                    <div className="flex justify-between">
                        <div className="relative w-64">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search workspaces..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-8"
                            />
                        </div>
                    </div>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Workspace</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {currentWorkspaces.map((workspace) => (
                                    <TableRow key={workspace.uuid}>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center">
                                                <Avatar className="h-8 w-8 mr-2">
                                                    <AvatarFallback>{workspace.name.slice(0, 2)}</AvatarFallback>
                                                </Avatar>
                                                {workspace.name}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={workspace.isActive ? "default" : "secondary"}>
                                                {workspace.isActive ? "Active" : "Inactive"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>View Workspace</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Are you sure you want to view the workspace &#34;{workspace.name}&#34;?
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction asChild>
                                                            <Link href={`/workspace/${workspace.name}`}>
                                                                <Button variant="default">View</Button>
                                                            </Link>
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>

                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <Power className="h-4 w-4" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>{workspace.isActive ? "Stop" : "Start"} Workspace</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Are you sure you want to {workspace.isActive ? "stop" : "start"} the workspace &#34;{workspace.name}&#34;?
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleToggleWorkspaceStatus(workspace)}>
                                                            {workspace.isActive ? "Stop" : "Start"}
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
                                                        <AlertDialogTitle>Delete Workspace</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Are you sure you want to delete the workspace &#34;{workspace.name}&#34;? This action cannot be undone.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleDeleteWorkspace(workspace.uuid)}>Delete</AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            Showing {indexOfFirstWorkspace + 1} to {Math.min(indexOfLastWorkspace, filteredWorkspaces.length)} of {filteredWorkspaces.length} workspaces
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
                </TabsContent>
                <TabsContent value="active" className="space-y-4">
                    {/* Similar content as 'all' tab, but filtered for active workspaces */}
                </TabsContent>
                <TabsContent value="inactive" className="space-y-4">
                    {/* Similar content as 'all' tab, but filtered for inactive workspaces */}
                </TabsContent>
            </Tabs>
        </div>
    )
}

