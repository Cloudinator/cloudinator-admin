"use client";

import { useState, useEffect } from "react";
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
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { User } from "./SearchAndAddUser";

interface EditUserModalProps {
  isOpen: boolean;
  user: User | null;
  onUpdate: (updatedUser: User) => void;
  onClose: () => void;
}

export const EditUserModal: React.FC<EditUserModalProps> = ({
  isOpen,
  user,
  onUpdate,
  onClose,
}) => {
  const [formData, setFormData] = useState<User | null>(user);

  // Sync formData with user props when the modal opens
  useEffect(() => {
    setFormData(user);
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (formData) {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSelectChange = (name: keyof User, value: string) => {
    if (formData) {
      setFormData({ ...formData, [name]: value });
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
            {/* Username Field */}
            <label className="block text-sm font-medium mb-[-10px] text-gray-600">Username</label>
            <Input
              aria-label="Username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Username"
            />

            {/* Email Field */}
            <label className="block text-sm font-medium mb-[-10px] text-gray-600">Email</label>
            <Input
              aria-label="Email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email"
            />
            {/* Role Dropdown */}
            <div>
                <label className="block text-sm font-medium mb-1 text-gray-600" id="role">Role</label>
                <Select
                value={formData?.role || ""}
                onValueChange={(value) => handleSelectChange("role", value)}
                >
                <SelectTrigger>
                    <SelectValue placeholder="Select Role">
                    {formData?.role ? formData.role.charAt(0).toUpperCase() + formData.role.slice(1) : ""}
                    </SelectValue>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                </SelectContent>
                </Select>

            </div>
            {/* Status Dropdown */}
            <div>
                <label className="block text-sm font-medium mb-1 text-gray-600">Status</label>
                <Select
                value={formData?.status || ""}
                onValueChange={(value) => handleSelectChange("status", value)}
                >
                <SelectTrigger>
                    <SelectValue placeholder="Select Status">
                    {formData?.status ? formData.status.charAt(0).toUpperCase() + formData.status.slice(1) : ""}
                    </SelectValue>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
                </Select>
            </div>
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
