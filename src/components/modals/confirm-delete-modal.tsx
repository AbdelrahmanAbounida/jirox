"use client";
import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Loader } from "lucide-react";
import { Button } from "../ui/button";

const ConfirmDeleteModal = ({
  children,
  onDelete,
  title,
  description,
  deleteButtonTitle,
}: {
  children?: React.ReactNode;
  onDelete: any;
  title?: string;
  description?: string;
  deleteButtonTitle?: string;
}) => {
  const [deleteLoading, setdeleteLoading] = useState(false);
  const [open, setopen] = useState(false);
  return (
    <AlertDialog open={open} onOpenChange={setopen}>
      <AlertDialogTrigger>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {title ?? "Are you absolutely sure?"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {description ??
              `This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="h-8">Cancel</AlertDialogCancel>

          {deleteLoading ? (
            <Button variant={"destructive"} disabled>
              <Loader className="w-h h-4 animate-spin" /> Deleting
            </Button>
          ) : (
            <Button
              className="bg-red-600/90 h-8 hover:bg-red-600 hover:opacity-95"
              onClick={async () => {
                setdeleteLoading(true);
                await onDelete();
                setdeleteLoading(false);
                setopen(false);
              }}
            >
              {deleteButtonTitle || title || "Delete"}
            </Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmDeleteModal;
