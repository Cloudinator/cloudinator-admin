"use client"

import { useState } from "react"
import {Plus, Trash2, Search, UserCheck, UserMinus, ChevronLeft, ChevronRight, Eye} from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
    useDeleteUserMutation,
    useDisableUserMutation,
    useEnableUserMutation,
    useGetAllUserProfileQuery
} from "@/redux/api/userApi"
import Link from "next/link";

interface User {
    username: string
    email: string
    profileImage: string
    isEnabled: boolean
    roles: string[] | null
}

export function UserManagement() {
    const [searchTerm, setSearchTerm] = useState("")
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [newUser, setNewUser] = useState({ username: "", email: "", password: "", role: "", isEnabled: true })
    const [currentPage, setCurrentPage] = useState(1)
    const usersPerPage = 10

    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
    const [confirmAction, setConfirmAction] = useState<{ type: 'enable' | 'disable' | 'delete', username: string } | null>(null)

    const { data: users = [], refetch } = useGetAllUserProfileQuery()
    const [disableUser] = useDisableUserMutation();
    const [enableUser] = useEnableUserMutation();
    const [deleteUser] = useDeleteUserMutation();

    const filteredUsers = users.filter(
        (user: User) =>
            user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            String(user.isEnabled).toLowerCase().includes(searchTerm.toLowerCase())
    )

    const indexOfLastUser = currentPage * usersPerPage
    const indexOfFirstUser = indexOfLastUser - usersPerPage
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser)
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage)

    const handleAddUser = () => {
        // Implement user addition logic here
        console.log("Adding user:", newUser)
        setIsAddDialogOpen(false)
    }

    const handleDeleteUser = async (username: string) => {
        const user = users.find((u: User) => u.username === username);
        if (user && user.isEnabled) {
            alert("Please disable the user before deleting.");
            return;
        }
        setConfirmAction({ type: 'delete', username });
        setIsConfirmDialogOpen(true);
    }

    const handleDisableUser = async (username: string) => {
        setConfirmAction({ type: 'disable', username });
        setIsConfirmDialogOpen(true);
    }

    const handleEnableUser = async (username: string) => {
        setConfirmAction({ type: 'enable', username });
        setIsConfirmDialogOpen(true);
    }

    const handleConfirmAction = async () => {
        if (!confirmAction) return;

        try {
            switch (confirmAction.type) {
                case 'enable':
                    await enableUser({ username: confirmAction.username }).unwrap();
                    console.log(`User ${confirmAction.username} enabled successfully`);
                    break;
                case 'disable':
                    await disableUser({ username: confirmAction.username }).unwrap();
                    console.log(`User ${confirmAction.username} disabled successfully`);
                    break;
                case 'delete':
                    await deleteUser({ username: confirmAction.username });
                    console.log(`User ${confirmAction.username} deleted successfully`);
                    break;
            }
        } catch (error) {
            refetch();
            console.log(`Error ${confirmAction.type}ing user:`, error);
        }

        setIsConfirmDialogOpen(false);
        setConfirmAction(null);
    }

    const activeUsers = users.filter((user: User) => user.isEnabled).length
    const inactiveUsers = users.length - activeUsers
    const activePercentage = (activeUsers / users.length) * 100

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <UserCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{users.length}</div>
                        <Progress value={activePercentage} className="mt-2" />
                        <p className="text-xs text-muted-foreground mt-2">{activePercentage.toFixed(1)}% active users</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                        <UserCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{activeUsers}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Inactive Users</CardTitle>
                        <UserMinus className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{inactiveUsers}</div>
                    </CardContent>
                </Card>
            </div>
            <div className="flex justify-between">
                <div className="relative w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                    />
                </div>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add User
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New User</DialogTitle>
                            <DialogDescription>
                                Enter the details of the new user below.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="username" className="text-right">
                                    Username
                                </Label>
                                <Input
                                    id="username"
                                    value={newUser.username}
                                    onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="email" className="text-right">
                                    Email
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={newUser.email}
                                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="password" className="text-right">
                                    Password
                                </Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={newUser.password}
                                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="role" className="text-right">
                                    Role
                                </Label>
                                <Select
                                    onValueChange={(value) => setNewUser({ ...newUser, role: value })}
                                >
                                    <SelectTrigger className="col-span-3">
                                        <SelectValue placeholder="Select a role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Admin">Admin</SelectItem>
                                        <SelectItem value="User">User</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleAddUser}>Add User</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {currentUsers.map((user: User) => (
                            <TableRow key={user.username}>
                                <TableCell className="font-medium">
                                    <div className="flex items-center">
                                        <Avatar className="h-8 w-8 mr-2">
                                            <AvatarImage src={user.profileImage} alt={user.username} />
                                            <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        {user.username}
                                    </div>
                                </TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.roles ? user.roles.join(', ') : 'No roles'}</TableCell>
                                <TableCell>
                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                        user.isEnabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                        {user.isEnabled ? 'Active' : 'Inactive'}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                    >
                                        <Link href={`/users/${user.username}`}>
                                            <Eye className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => user.isEnabled ? handleDisableUser(user.username) : handleEnableUser(user.username)}
                                        disabled={user.isEnabled === undefined}
                                    >
                                        {user.isEnabled ? <UserMinus className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDeleteUser(user.username)}
                                        disabled={user.isEnabled}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                    Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} users
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

            <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Action</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to {confirmAction?.type} user {confirmAction?.username}?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsConfirmDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleConfirmAction}>Confirm</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

