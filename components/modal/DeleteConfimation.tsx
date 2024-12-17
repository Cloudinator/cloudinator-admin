"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type DeleteConfirmationDialogProps = {
  isOpen: boolean; // Controls dialog visibility
  itemToDelete?: string; // Optional item name for dynamic display
  onConfirm: () => void; // Callback when "Delete" is confirmed
  onCancel: () => void; // Callback when "Cancel" is clicked
};

export const DeleteConfirmationDialog = ({
  isOpen,
  itemToDelete,
  onConfirm,
  onCancel,
}: DeleteConfirmationDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent className="grid gap-y-10 text-[16px]">
        <DialogHeader className="flex flex-col space-y-4">
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            {`Do you really want to delete ${
                itemToDelete ? `"${itemToDelete}"` : "this item"
            }? This action cannot be undone.`}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <div className="flex justify-end space-x-4">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={onConfirm}>
              Delete
            </Button>
            </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
