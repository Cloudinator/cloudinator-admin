"use client"

import { useState } from "react"
import { Plus, HardDrive, Clock, Download, MoreVertical} from 'lucide-react'
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
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs,TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Progress } from "@/components/ui/progress"

interface Backup {
    id: string
    name: string
    createdAt: string
    size: string
    status: "completed" | "in-progress" | "failed"
    type: "full" | "incremental"
}

const initialBackups: Backup[] = [
    { id: "1", name: "Weekly Backup", createdAt: "2023-06-15T10:30:00Z", size: "5.2 GB", status: "completed", type: "full" },
    { id: "2", name: "Daily Backup", createdAt: "2023-06-16T00:00:00Z", size: "1.7 GB", status: "completed", type: "incremental" },
    { id: "3", name: "Emergency Backup", createdAt: "2023-06-16T15:45:00Z", size: "5.5 GB", status: "completed", type: "full" },
    { id: "4", name: "Scheduled Backup", createdAt: "2023-06-17T02:00:00Z", size: "1.8 GB", status: "in-progress", type: "incremental" },
    { id: "5", name: "Failed Backup", createdAt: "2023-06-14T22:15:00Z", size: "0 GB", status: "failed", type: "full" },
]

export function ServerBackupManagement() {
    const [backups, setBackups] = useState<Backup[]>(initialBackups)
    const [searchTerm, setSearchTerm] = useState("")
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
    const [newBackup, setNewBackup] = useState({ name: "", type: "full" as "full" | "incremental" })

    const filteredBackups = backups.filter(
        (backup) =>
            backup.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            backup.type.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleCreateBackup = () => {
        const createdBackup: Backup = {
            id: (backups.length + 1).toString(),
            name: newBackup.name,
            createdAt: new Date().toISOString(),
            size: "0 GB",
            status: "in-progress",
            type: newBackup.type,
        }
        setBackups([createdBackup, ...backups])
        setNewBackup({ name: "", type: "full" })
        setIsCreateDialogOpen(false)
    }

    const handleDeleteBackup = (id: string) => {
        setBackups(backups.filter((backup) => backup.id !== id))
    }

    const totalBackups = backups.length
    const completedBackups = backups.filter(backup => backup.status === "completed").length
    const totalSize = backups.reduce((acc, backup) => acc + parseFloat(backup.size), 0).toFixed(1)

    return (
        <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Backups</CardTitle>
                        <HardDrive className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalBackups}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Completed Backups</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{completedBackups}</div>
                        <p className="text-xs text-muted-foreground">
                            {((completedBackups / totalBackups) * 100).toFixed(0)}% success rate
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Backup Size</CardTitle>
                        <HardDrive className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalSize} GB</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Latest Backup</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {new Date(backups[0]?.createdAt || Date.now()).toLocaleDateString()}
                        </div>
                        <p className="text-xs text-muted-foreground">{backups[0]?.name || "No backups"}</p>
                    </CardContent>
                </Card>
            </div>

            <div className="flex items-center justify-between">
                <div className="flex flex-1 items-center space-x-2">
                    <Input
                        placeholder="Search backups..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-[150px] lg:w-[250px]"
                    />
                    <Tabs defaultValue="all" className="w-[400px]">
                        <TabsList>
                            <TabsTrigger value="all">All Backups</TabsTrigger>
                            <TabsTrigger value="completed">Completed</TabsTrigger>
                            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
                            <TabsTrigger value="failed">Failed</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Create Backup
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create New Backup</DialogTitle>
                            <DialogDescription>
                                Enter the details for your new server backup.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">
                                    Name
                                </Label>
                                <Input
                                    id="name"
                                    value={newBackup.name}
                                    onChange={(e) => setNewBackup({ ...newBackup, name: e.target.value })}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="type" className="text-right">
                                    Type
                                </Label>
                                <select
                                    id="type"
                                    value={newBackup.type}
                                    onChange={(e) => setNewBackup({ ...newBackup, type: e.target.value as "full" | "incremental" })}
                                    className="col-span-3 flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <option value="full">Full</option>
                                    <option value="incremental">Incremental</option>
                                </select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleCreateBackup}>Create Backup</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredBackups.map((backup) => (
                    <Card key={backup.id} className="flex flex-col">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{backup.name}</CardTitle>
                            <Badge
                                variant={backup.status === "completed" ? "default" : backup.status === "in-progress" ? "secondary" : "destructive"}
                            >
                                {backup.status}
                            </Badge>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{backup.size}</div>
                            <p className="text-xs text-muted-foreground">
                                Created on {new Date(backup.createdAt).toLocaleString()}
                            </p>
                            <Badge variant="outline" className="mt-2">
                                {backup.type}
                            </Badge>
                            {backup.status === "in-progress" && (
                                <div className="mt-2">
                                    <Progress value={45} className="w-full" />
                                </div>
                            )}
                        </CardContent>
                        <CardFooter className="flex justify-between mt-auto">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="outline" size="icon" disabled={backup.status !== "completed"}>
                                            <Download className="h-4 w-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Download Backup</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="icon">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuItem disabled={backup.status !== "completed"}>
                                        Restore Backup
                                    </DropdownMenuItem>
                                    <DropdownMenuItem disabled={backup.status !== "failed"}>
                                        Retry Backup
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={() => handleDeleteBackup(backup.id)}
                                        className="text-red-600"
                                    >
                                        Delete Backup
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )
}

