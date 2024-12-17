"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User } from "./SearchAndAddUser";

interface UserDetailsModalProps {
  isOpen: boolean;
  user: User | null;
  onUpdate: (updatedUser: User) => void;
  onClose: () => void;
}

export const UserDetailsModal: React.FC<UserDetailsModalProps> = ({
  isOpen,
  user,
  onUpdate,
  onClose,
}) => {
  const [formData, setFormData] = useState(user);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (formData) {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleUpdateClick = () => {
    if (formData) {
      onUpdate(formData);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User Details</DialogTitle>
          <DialogDescription>Update the details for the selected user.</DialogDescription>
        </DialogHeader>
        {formData && (
          <div className="space-y-4">
            <Input
              aria-label="Username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
            />
            <Input
              aria-label="Email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
            <Input
              aria-label="Role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
            />
            <Input
              aria-label="Status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
            />
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleUpdateClick}>Update</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
