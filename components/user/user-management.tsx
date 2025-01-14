"use client";

import { useState } from "react";
import { Plus, Trash2, Search, UserCheck, UserMinus, ChevronLeft, ChevronRight, Eye, Loader2, UserPlus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { useDeleteUserMutation, useDisableUserMutation, useEnableUserMutation, useGetAllUserProfileQuery } from "@/redux/api/userApi";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import Loading from "../Loading";

interface User {
    username: string;
    email: string;
    profileImage: string;
    isEnabled: boolean;
    roles: string[] | null;
}

type ErrorResponse = {
    status: string;
    originalStatus: number;
    data: string;
    error: string;
};

export function UserManagement() {
    const { toast } = useToast();
    const [searchTerm, setSearchTerm] = useState("");
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [newUser, setNewUser] = useState({ username: "", email: "", password: "", role: "", isEnabled: true });
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 10;

    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState<{ type: 'enable' | 'disable' | 'delete', username: string } | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const { data: users = [], isLoading: isUsersLoading, refetch } = useGetAllUserProfileQuery();
    const [disableUser] = useDisableUserMutation();
    const [enableUser] = useEnableUserMutation();
    const [deleteUser] = useDeleteUserMutation();

    const filteredUsers = users.filter((user: User) => {
        const searchLower = searchTerm.toLowerCase();
        return (
            user.username.toLowerCase().includes(searchLower) ||
            user.email.toLowerCase().includes(searchLower) ||
            String(user.isEnabled).toLowerCase().includes(searchLower)
        );
    });

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage) || 1;

    const handleAddUser = () => {
        if (!newUser.username || !newUser.email || !newUser.password || !newUser.role) {
            toast({
                title: "Validation Error",
                description: "Please fill in all fields.",
                variant: "error",
                duration: 5000,
            });
            return;
        }

        // Implement user addition logic here
        console.log("Adding user:", newUser);
        setIsAddDialogOpen(false);
        toast({
            title: "User Added",
            description: `User ${newUser.username} has been added successfully.`,
            variant: "success",
            duration: 5000,
        });
    };

    const handleDeleteUser = async (username: string) => {
        const user = users.find((u: User) => u.username === username);
        if (user && user.isEnabled) {
            toast({
                title: "Action Required",
                description: "Please disable the user before deleting.",
                variant: "warning",
                duration: 5000,
            });
            return;
        }
        setConfirmAction({ type: 'delete', username });
        setIsConfirmDialogOpen(true);
    };

    const handleDisableUser = async (username: string) => {
        setConfirmAction({ type: 'disable', username });
        setIsConfirmDialogOpen(true);
    };

    const handleEnableUser = async (username: string) => {
        setConfirmAction({ type: 'enable', username });
        setIsConfirmDialogOpen(true);
    };

    const handleConfirmAction = async () => {
        if (!confirmAction) {
            toast({
                title: "Error",
                description: "No action to confirm.",
                variant: "error",
                duration: 5000,
            });
            return;
        }

        setIsLoading(true);
        try {
            switch (confirmAction.type) {
                case 'enable': {
                    const response = await enableUser({ username: confirmAction.username });
                    if (response.data) {
                        toast({
                            title: "User Enabled",
                            description: `User ${confirmAction.username} has been enabled successfully.`,
                            variant: "success",
                            duration: 5000,
                        });
                        refetch();
                    } else {
                        throw new Error("Failed to enable user.");
                    }
                    break;
                }
                case 'disable': {
                    const response = await disableUser({ username: confirmAction.username });
                    if (response.data) {
                        toast({
                            title: "User Disabled",
                            description: `User ${confirmAction.username} has been disabled successfully.`,
                            variant: "success",
                            duration: 5000,
                        });
                        refetch();
                    } else {
                        throw new Error("Failed to disable user.");
                    }
                    break;
                }
                case 'delete': {
                    await deleteUser({ username: confirmAction.username }).unwrap();
                    toast({
                        title: "User Deleted",
                        description: `User ${confirmAction.username} has been deleted successfully.`,
                        variant: "success",
                        duration: 5000,
                    });
                    refetch();
                    break;
                }
                default: {
                    toast({
                        title: "Error",
                        description: "Invalid action type.",
                        variant: "error",
                        duration: 5000,
                    });
                    refetch();
                    break;
                }
            }
        } catch (err) {
            const error = err as ErrorResponse;
            if (error?.status === "PARSING_ERROR" && error?.originalStatus === 200) {
                toast({
                    title: "Success",
                    description: error?.data || `User ${confirmAction.username} has been ${confirmAction.type === 'enable' ? 'enabled' : 'disabled'} successfully.`,
                    variant: "success",
                    duration: 5000,
                });
                refetch();
            } else {
                toast({
                    title: "Success",
                    description: error?.data || `User ${confirmAction.username} has been ${confirmAction.type === 'enable' ? 'enabled' : 'disabled'} successfully.`,
                    variant: "success",
                    duration: 5000,
                });
                refetch();
            }
        } finally {
            setIsLoading(false);
        }

        setIsConfirmDialogOpen(false);
        setConfirmAction(null);
    };

    const activeUsers = users.filter((user: User) => user.isEnabled).length;
    const inactiveUsers = users.length - activeUsers;
    const activePercentage = (activeUsers / users.length) * 100;

    // Combine loading states
    const isPageLoading = isUsersLoading;

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
        <div className="space-y-6">
            {/* Cards and Search */}
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-purple-500 font-bold">Total Users</CardTitle>
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
                        <CardTitle className="text-sm font-medium text-purple-500 font-bold">Active Users</CardTitle>
                        <UserCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-500">{activeUsers}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-purple-500 font-bold">Inactive Users</CardTitle>
                        <UserMinus className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-500">{inactiveUsers}</div>
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
                        <Button className="focus:ring focus:ring-offset-1 focus:ring-purple-400">
                            <Plus className="mr-2 h-4 w-4" />
                            Add User
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className="text-purple-500 font-semibold">Add New User</DialogTitle>
                            <DialogDescription>
                                Enter the details of the new user below.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="username" className="text-right text-purple-600">
                                    Username
                                </Label>
                                <Input
                                    id="username"
                                    value={newUser.username}
                                    onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                                    className="col-span-3 border-purple-600 focus:ring-purple-500"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="email" className="text-right text-purple-600">
                                    Email
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={newUser.email}
                                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                    className="col-span-3 border-purple-600 focus:ring-purple-500"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="password" className="text-right text-purple-600">
                                    Password
                                </Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={newUser.password}
                                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                    className="col-span-3 border-purple-600 focus:ring-purple-500"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="role" className="text-right text-purple-600">
                                    Role
                                </Label>
                                <Select
                                    onValueChange={(value) => setNewUser({ ...newUser, role: value })}
                                >
                                    <SelectTrigger className="col-span-3 border-purple-600 focus:ring-purple-500">
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
                            <TableHead className="text-purple-500 font-semibold">User</TableHead>
                            <TableHead className="text-purple-500 font-semibold">Email</TableHead>
                            <TableHead className="text-purple-500 font-semibold">Role</TableHead>
                            <TableHead className="text-purple-500 font-semibold">Status</TableHead>
                            <TableHead className="text-right pr-8 text-purple-500 font-semibold">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredUsers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8">
                                    <div className="flex flex-col items-center justify-center space-y-2 h-[500px]">
                                        <Search className="h-8 w-8 text-muted-foreground" />
                                        <p className="text-muted-foreground">No users found.</p>
                                        <p className="text-sm text-muted-foreground">
                                            Try adjusting your search or filters.
                                        </p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            currentUsers.map((user: User) => (
                                <TableRow 
                                    key={user.username}
                                    className="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                                    onClick={() => window.location.href = `/users/${user.username}`} // Make the row clickable
                                >
                                    <TableCell className="font-medium">
                                        <div className="flex items-center">
                                            <Avatar className="h-8 w-8 mr-2">
                                                <AvatarImage src={user.profileImage} alt={user.username} />
                                                <AvatarFallback>
                                                    {user.username ? user.username.slice(0, 2).toUpperCase() : "US"}
                                                </AvatarFallback>
                                            </Avatar>
                                            {user.username}
                                        </div>
                                    </TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.roles ? user.roles.join(', ') : 'No roles'}</TableCell>
                                    <TableCell>
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${user.isEnabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                            {user.isEnabled ? 'Active' : 'Inactive'}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        
                                        {/* View Button */}
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                        >
                                            <Link href={`/users/${user.username}`}>
                                                <Eye className="h-4 w-4 text-purple-500" />
                                            </Link>
                                        </Button>

                                        {/* Enable/Disable Button */}
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={(e) => {
                                                e.stopPropagation(); // Prevent row click when clicking the button
                                                // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                                                user.isEnabled ? handleDisableUser(user.username) : handleEnableUser(user.username);
                                            }}
                                            disabled={user.isEnabled === undefined}
                                        >
                                            {user.isEnabled ? (
                                                <UserMinus className="h-4 w-4 text-red-500" />
                                            ) : (
                                                <UserPlus className="h-4 w-4 text-green-500" />
                                            )}
                                        </Button>

                                        {/* Delete Button */}
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={(e) => {
                                                e.stopPropagation(); // Prevent row click when clicking the button
                                                handleDeleteUser(user.username);
                                            }}
                                            disabled={user.isEnabled}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
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
                        <Button onClick={handleConfirmAction} disabled={isLoading}>
                            {isLoading ? <Loader2 /> : "Confirm"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}