"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface EditUserModalProps {
  isOpen: boolean; // Controls dialog visibility
  user: {
    id: number;
    username: string;
    email: string;
    role: string;
    status: string;
  };
  onClose: () => void; // Callback for closing the modal
  onSave: (updatedUser: {
    id: number;
    username: string;
    email: string;
    role: string;
    status: string;
  }) => void; // Callback for saving the user
}

export const EditUserModal: React.FC<EditUserModalProps> = ({
  isOpen,
  user,
  onClose,
  onSave,
}) => {
  const [updatedUser, setUpdatedUser] = useState(user);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave(updatedUser);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="grid gap-y-6 text-[16px]">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>Modify the user details below:</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            name="username"
            aria-label="Username"
            value={updatedUser.username}
            onChange={handleChange}
          />
          <Input
            name="email"
            aria-label="Email"
            value={updatedUser.email}
            onChange={handleChange}
          />
          <Input
            name="role"
            aria-label="Role"
            value={updatedUser.role}
            onChange={handleChange}
          />
          <Input
            name="status"
            aria-label="Status"
            value={updatedUser.status}
            onChange={handleChange}
          />
        </div>
        <DialogFooter>
          <div className="flex justify-end space-x-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
