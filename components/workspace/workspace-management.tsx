"use client"

import { useState } from "react"
import { Plus, Search, Briefcase, Users, Calendar, ChevronLeft, ChevronRight, MoreVertical, Activity, Layers } from 'lucide-react'
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
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

const initialWorkspaces = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    name: `Workspace ${i + 1}`,
    description: `Description for Workspace ${i + 1}`,
    members: Math.floor(Math.random() * 20) + 1,
    projects: Math.floor(Math.random() * 10) + 1,
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
    avatar: `/placeholder.svg?height=40&width=40&text=W${i+1}`,
    isActive: Math.random() > 0.2, // 80% chance of being active
    activityLevel: Math.floor(Math.random() * 100),
    recentActivity: Math.floor(Math.random() * 24),
}))

export function WorkspaceManagement() {
    const [workspaces, setWorkspaces] = useState(initialWorkspaces)
    const [searchTerm, setSearchTerm] = useState("")
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [newWorkspace, setNewWorkspace] = useState({ name: "", description: "" })
    const [currentPage, setCurrentPage] = useState(1)
    const workspacesPerPage = 12

    const filteredWorkspaces = workspaces.filter(
        (workspace) =>
            workspace.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            workspace.description.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const indexOfLastWorkspace = currentPage * workspacesPerPage
    const indexOfFirstWorkspace = indexOfLastWorkspace - workspacesPerPage
    const currentWorkspaces = filteredWorkspaces.slice(indexOfFirstWorkspace, indexOfLastWorkspace)
    const totalPages = Math.ceil(filteredWorkspaces.length / workspacesPerPage)

    const handleAddWorkspace = () => {
        setWorkspaces([...workspaces, {
            id: workspaces.length + 1,
            ...newWorkspace,
            members: 1,
            projects: 0,
            createdAt: new Date().toISOString(),
            avatar: `/placeholder.svg?height=40&width=40&text=${newWorkspace.name.slice(0, 2).toUpperCase()}`,
            isActive: true,
            activityLevel: 0,
            recentActivity: 0,
        }])
        setNewWorkspace({ name: "", description: "" })
        setIsAddDialogOpen(false)
    }

    const handleDeleteWorkspace = (id: number) => {
        setWorkspaces(workspaces.filter((workspace) => workspace.id !== id))
    }

    const handleToggleWorkspaceStatus = (id: number) => {
        setWorkspaces(workspaces.map(workspace =>
            workspace.id === id ? { ...workspace, isActive: !workspace.isActive } : workspace
        ))
    }

    const totalWorkspaces = workspaces.length
    const totalMembers = workspaces.reduce((acc, workspace) => acc + workspace.members, 0)
    const totalProjects = workspaces.reduce((acc, workspace) => acc + workspace.projects, 0)
    const averageProjectsPerWorkspace = totalProjects / totalWorkspaces

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Workspaces</CardTitle>
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalWorkspaces}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Members</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalMembers}</div>
                        <p className="text-xs text-muted-foreground mt-2">Across all workspaces</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                        <Layers className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalProjects}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg Projects/Workspace</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{averageProjectsPerWorkspace.toFixed(1)}</div>
                        <Progress value={averageProjectsPerWorkspace * 10} className="mt-2" />
                    </CardContent>
                </Card>
            </div>
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
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Workspace
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
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {currentWorkspaces.map((workspace) => (
                    <Card key={workspace.id} className={`overflow-hidden ${workspace.isActive ? "" : "opacity-60"}`}>
                        <CardHeader className="border-b bg-muted/40 p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Avatar className="h-9 w-9">
                                        <AvatarImage src={workspace.avatar} alt={workspace.name} />
                                        <AvatarFallback>{workspace.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <CardTitle className="text-sm font-medium line-clamp-1">{workspace.name}</CardTitle>
                                        <p className="text-xs text-muted-foreground">{new Date(workspace.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <Badge variant={workspace.isActive ? "default" : "secondary"}>
                                    {workspace.isActive ? "Active" : "Inactive"}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4">
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{workspace.description}</p>
                            <div className="flex justify-between text-sm mb-2">
                <span className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                    {workspace.members} members
                </span>
                                <span className="flex items-center">
                  <Layers className="h-4 w-4 mr-1" />
                                    {workspace.projects} projects
                </span>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span>Activity Level</span>
                                    <span className="font-medium">{workspace.activityLevel}%</span>
                                </div>
                                <Progress value={workspace.activityLevel} className="h-2" />
                            </div>
                        </CardContent>
                        <CardFooter className="border-t p-4 flex justify-between items-center bg-muted/40">
                            <div className="flex items-center text-sm text-muted-foreground">
                                <Activity className="h-4 w-4 mr-1" />
                                <span>Last active {workspace.recentActivity}h ago</span>
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                        <span className="sr-only">Open menu</span>
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuItem
                                        onClick={() => handleToggleWorkspaceStatus(workspace.id)}
                                    >
                                        {workspace.isActive ? 'Disable' : 'Enable'}
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={() => handleDeleteWorkspace(workspace.id)}
                                        className="text-red-600"
                                    >
                                        Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </CardFooter>
                    </Card>
                ))}
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

