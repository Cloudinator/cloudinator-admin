"use client"

import { useState } from "react"
import { UserSummary } from "./UserSummary"
import { SearchAndAddUser } from "./SearchAndAddUser"
import { UserTable } from "./UserTable"
import { Pagination } from "./Pagination"

// Mock user data
const initialUsers = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    username: `user${i + 1}`,
    email: `user${i + 1}@example.com`,
    role: i % 5 === 0 ? "Admin" : "User",
    status: i % 3 === 0 ? "Active" : i % 3 === 1 ? "Inactive" : "Pending",
    avatar: `/placeholder.svg?height=40&width=40`,
    lastActive: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
}))

export function UserManagement() {
    const [users, setUsers] = useState(initialUsers)
    const [searchTerm, setSearchTerm] = useState("")
    //const [setIsAddDialogOpen] = useState(false)
    const [newUser, setNewUser] = useState({ username: "", email: "", password: "", role: "", status: "Pending" })
    const [currentPage, setCurrentPage] = useState(1)
    const usersPerPage = 10

    const filteredUsers = users.filter(
        (user) =>
            user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.status.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const indexOfLastUser = currentPage * usersPerPage
    const indexOfFirstUser = indexOfLastUser - usersPerPage
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser)
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage)

    const handleAddUser = () => {
        setUsers([...users, { id: users.length + 1, ...newUser, avatar: `/placeholder.svg?height=40&width=40`, lastActive: new Date().toISOString() }])
        setNewUser({ username: "", email: "", password: "", role: "", status: "Pending" })
        //setIsAddDialogOpen(false)
    }

    const handleDeleteUser = (id: number) => {
        setUsers(users.filter((user) => user.id !== id))
    }

    const userStatusCount = users.reduce((acc, user) => {
        acc[user.status] = (acc[user.status] || 0) + 1
        return acc
    }, {} as Record<string, number>)

    //const totalUsers = users.length
    //const activePercentage = ((userStatusCount.Active || 0) / totalUsers) * 100

    return (
        <div className="space-y-6">

            {/* 4 carts for users summary */}
            <UserSummary totalUsers={users.length} userStatusCount={userStatusCount} />
            
            {/* Search and Add User */}
            <SearchAndAddUser onSearch={setSearchTerm} onAddUser={handleAddUser} />

            {/* Table of Users */}
            <UserTable users={currentUsers} onDeleteUser={handleDeleteUser} />

            {/* Pagination */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
            
        </div>
    )
}

