"use client"

import { useState } from "react"
import { Plus, Search, Globe, CheckCircle, RefreshCw,MoreVertical, ExternalLink, AlertTriangle } from 'lucide-react'
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

// Mock domain data
const initialDomains = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    name: `example${i + 1}.com`,
    status: i % 3 === 0 ? "Active" : i % 3 === 1 ? "Pending" : "Inactive",
    ssl: i % 2 === 0,
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
    expiresAt: new Date(Date.now() + Math.floor(Math.random() * 31536000000)).toISOString(), // Random date within next year
    traffic: Math.floor(Math.random() * 10000),
    health: Math.floor(Math.random() * 100),
}))

export function DomainManagement() {
    const [domains, setDomains] = useState(initialDomains)
    const [searchTerm, setSearchTerm] = useState("")
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [newDomain, setNewDomain] = useState({ name: "" })

    const filteredDomains = domains.filter(
        (domain) =>
            domain.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            domain.status.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleAddDomain = () => {
        setDomains([...domains, {
            id: domains.length + 1,
            name: newDomain.name,
            status: "Pending",
            ssl: false,
            createdAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 31536000000).toISOString(), // 1 year from now
            traffic: 0,
            health: 100,
        }])
        setNewDomain({ name: "" })
        setIsAddDialogOpen(false)
    }

    const handleDeleteDomain = (id: number) => {
        setDomains(domains.filter((domain) => domain.id !== id))
    }

    const handleRefreshSSL = (id: number) => {
        setDomains(domains.map(domain =>
            domain.id === id ? { ...domain, ssl: true } : domain
        ))
    }

    const totalDomains = domains.length
    const activeDomains = domains.filter(domain => domain.status === "Active").length
    const sslProtectedDomains = domains.filter(domain => domain.ssl).length

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold tracking-tight">Domain Overview</h2>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="">
                            <Plus className="mr-2 h-4 w-4 " />
                            Add Domain
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Domain</DialogTitle>
                            <DialogDescription>
                                Enter the domain name you want to add.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">
                                    Domain Name
                                </Label>
                                <Input
                                    id="name"
                                    value={newDomain.name}
                                    onChange={(e) => setNewDomain({ name: e.target.value })}
                                    className="col-span-3"
                                    placeholder="example.com"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleAddDomain}>Add Domain</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Domains</CardTitle>
                        <Globe className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalDomains}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Domains</CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{activeDomains}</div>
                        <p className="text-xs text-muted-foreground mt-2">{((activeDomains / totalDomains) * 100).toFixed(1)}% of total domains</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">SSL Protected</CardTitle>
                        <Globe className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{sslProtectedDomains}</div>
                        <p className="text-xs text-muted-foreground mt-2">{((sslProtectedDomains / totalDomains) * 100).toFixed(1)}% of total domains</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg. Health</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{(domains.reduce((acc, domain) => acc + domain.health, 0) / totalDomains).toFixed(1)}%</div>
                    </CardContent>
                </Card>
            </div>
            <div className="flex justify-between items-center">
                <div className="relative w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search domains..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                    />
                </div>
                <Tabs defaultValue="all" className="w-[400px]">
                    <TabsList>
                        <TabsTrigger value="all">All Domains</TabsTrigger>
                        <TabsTrigger value="active">Active</TabsTrigger>
                        <TabsTrigger value="pending">Pending</TabsTrigger>
                        <TabsTrigger value="inactive">Inactive</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {filteredDomains.map((domain) => (
                    <Card key={domain.id} className="overflow-hidden">
                        <CardHeader className="border-b bg-muted/40 p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Globe className="h-4 w-4 text-muted-foreground" />
                                    <CardTitle className="text-sm font-medium">{domain.name}</CardTitle>
                                </div>
                                <Badge
                                    variant={domain.status === "Active" ? "default" : domain.status === "Pending" ? "secondary" : "destructive"}
                                >
                                    {domain.status}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4 space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">SSL:</span>
                                {domain.ssl ? (
                                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Secure</Badge>
                                ) : (
                                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Not Secure</Badge>
                                )}
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Created:</span>
                                <span className="text-sm">{new Date(domain.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Expires:</span>
                                <span className="text-sm">{new Date(domain.expiresAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Traffic:</span>
                                <span className="text-sm">{domain.traffic.toLocaleString()} visits</span>
                            </div>
                            <div className="space-y-1">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Health:</span>
                                    <span>{domain.health}%</span>
                                </div>
                                <div className="h-2 bg-muted rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${
                                            domain.health > 80 ? 'bg-green-500' :
                                                domain.health > 50 ? 'bg-yellow-500' : 'bg-red-500'
                                        }`}
                                        style={{ width: `${domain.health}%` }}
                                    />
                                </div>
                            </div>
                        </CardContent>
                        <div className="border-t bg-muted/40 p-4 flex justify-end space-x-2">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="outline" size="icon" onClick={() => window.open(`https://${domain.name}`, '_blank')}>
                                            <ExternalLink className="h-4 w-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Visit Site</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="outline" size="icon" onClick={() => handleRefreshSSL(domain.id)}>
                                            <RefreshCw className="h-4 w-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Refresh SSL</p>
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
                                    <DropdownMenuItem>Edit Domain</DropdownMenuItem>
                                    <DropdownMenuItem>View Analytics</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={() => handleDeleteDomain(domain.id)}
                                        className="text-red-600"
                                    >
                                        Delete Domain
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    )
}

