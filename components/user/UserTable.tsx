"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DeleteConfirmationDialog } from "@/components/modal/DeleteConfimation";
import { User } from "./SearchAndAddUser";
import { EditUserModal } from "./EditUserModal";

interface UserTableProps {
  users: User[];
  onDeleteUser: (id: number) => void;
  onUpdateUser: (updatedUser: User) => void;
}

export const UserTable: React.FC<UserTableProps> = ({ users, onDeleteUser, onUpdateUser }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedUser) {
      onDeleteUser(selectedUser.id);
    }
    setDialogOpen(false);
    setSelectedUser(null);
  };

  const handleCancelDelete = () => {
    setDialogOpen(false);
    setSelectedUser(null);
  };

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setDetailsModalOpen(true);
  };

  const handleUpdateUser = (updatedUser: User) => {
    onUpdateUser(updatedUser);
    setDetailsModalOpen(false);
    setSelectedUser(null);
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Active</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={user.avatar} alt={user.username} />
                      <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    {user.username}
                  </div>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.status}</TableCell>
                <TableCell>{new Date(user.lastActive).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditClick(user)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteClick(user)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedUser && (
        <DeleteConfirmationDialog
          isOpen={dialogOpen}
          itemToDelete={selectedUser.username}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}

      {selectedUser && (
        <EditUserModal
          isOpen={detailsModalOpen}
          user={selectedUser}
          onUpdate={handleUpdateUser}
          onClose={() => setDetailsModalOpen(false)}
        />
      )}
    </>
  );
};
