"use client";

import { useState } from "react";
import { UserSummary } from "./UserSummary";
import { SearchAndAddUser } from "./SearchAndAddUser";
import { UserTable } from "./UserTable";
import { Pagination } from "./Pagination";
import { EditUserModal } from "./EditUserModal";

interface User {
    id: number;
    username: string;
    email: string;
    role: string;
    status: string;
    avatar: string;
    lastActive: string;
}

export function UserManagement() {
    const [users, setUsers] = useState<User[]>(
        Array.from({ length: 50 }, (_, i) => ({
            id: i + 1,
            username: `user${i + 1}`,
            email: `user${i + 1}@example.com`,
            role: i % 5 === 0 ? "Admin" : "User",
            status: i % 3 === 0 ? "Active" : i % 3 === 1 ? "Inactive" : "Pending",
            avatar: `/placeholder.svg?height=40&width=40`,
            lastActive: new Date(
                Date.now() - Math.floor(Math.random() * 10000000000)
            ).toISOString(),
        }))
    );
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    const usersPerPage = 10;

    const filteredUsers = users.filter(
        (user) =>
            user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.status.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    const handleAddUser = (newUser: Omit<User, "id" | "avatar" | "lastActive">) => {
        setUsers([
            ...users,
            {
                id: users.length + 1,
                ...newUser,
                avatar: `/placeholder.svg?height=40&width=40`,
                lastActive: new Date().toISOString(),
            },
        ]);
    };

    const handleDeleteUser = (id: number) => {
        setUsers(users.filter((user) => user.id !== id));
    };

    // const handleEditUser = (user: User) => {
    //     setEditingUser(user);
    // };

    const handleUpdateUser = (updatedUser: Partial<User> & { id: number }) => {
        setUsers(users.map((user) => (user.id === updatedUser.id ? { ...user, ...updatedUser } : user)));
        setEditingUser(null);
    };

    const userStatusCount = users.reduce((acc, user) => {
        acc[user.status] = (acc[user.status] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    return (
        <div className="space-y-6">
            {/* User Summary */}
            <UserSummary totalUsers={users.length} userStatusCount={userStatusCount} />

            {/* Search and Add User */}
            <SearchAndAddUser onSearch={setSearchTerm} onAddUser={handleAddUser} />

            {/* Table of Users */}
            <UserTable
                users={currentUsers}
                onDeleteUser={handleDeleteUser}
                onUpdateUser={handleUpdateUser}
            />

            {/* Modal for Editing User */}
            {editingUser && (
                <EditUserModal
                    isOpen={!!editingUser}
                    user={editingUser}
                    onClose={() => setEditingUser(null)}
                    onSave={handleUpdateUser}
                />
            )}

            {/* Pagination */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
        </div>
    );
}
