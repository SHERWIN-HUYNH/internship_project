import { StatusIcon } from "@/constants";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import clsx from "clsx";
import { useState } from "react";
import Image from "next/image";
interface StatusSelectProps {
  value: string;
  postId: string;
  onStatusChange: (newStatus: string) => void;
}

export const StatusSelect = ({ value, postId, onStatusChange }: StatusSelectProps) => {
  const [selectedStatus, setSelectedStatus] = useState(value);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<string | null>(null);

  // Hàm gọi API để cập nhật trạng thái
  const updateStatus = async (newStatus: string) => {
    try {
      console.log('API CALL')
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) {
        throw new Error('Failed to update status');
      }
      const result = await response.json();
      console.log('Status updated:', result);
      setSelectedStatus(newStatus); 
      onStatusChange(newStatus); 
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status. Please try again.');
    }
  };

  const handleStatusChange = (newStatus: string) => {
    if (newStatus !== selectedStatus) {
      setPendingStatus(newStatus); 
      setOpenConfirm(true); 
    }
  };

  // Xử lý xác nhận
  const handleConfirm = () => {
    if (pendingStatus) {
      updateStatus(pendingStatus); 
    }
    setOpenConfirm(false); 
    setPendingStatus(null); 
  };

  // Xử lý hủy
  const handleCancel = () => {
    setOpenConfirm(false); 
    setPendingStatus(null); 
  };

  return (
    <>
      <Select value={selectedStatus} onValueChange={handleStatusChange} >
        <SelectTrigger
          className={clsx('status-badge')}
        >
          <div className="flex items-center gap-2">
            <Image
              src={StatusIcon[selectedStatus as keyof typeof StatusIcon] || StatusIcon.pending}
              alt={selectedStatus}
              width={24}
              height={24}
              className="h-fit w-3"
            />
            <SelectValue />
          </div>
        </SelectTrigger>
        <SelectContent className="bg-white">
          <SelectItem value="pending" className=" text-blue-500">Pending</SelectItem>
          <SelectItem value="finding" className=" text-yellow-500">Finding</SelectItem>
          <SelectItem value="found" className=" text-green-500">Found</SelectItem>
          <SelectItem value="disable" className=" text-red-500">Disable</SelectItem>
        </SelectContent>
      </Select>

      {/* Dialog xác nhận */}
      <AlertDialog open={openConfirm} onOpenChange={setOpenConfirm}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader className="text-primary">
            <AlertDialogTitle>Confirm Status Change</AlertDialogTitle>
            <AlertDialogDescription className="text-primary">
              Are you sure you want to change the status to <strong>{pendingStatus}</strong>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter >
            <AlertDialogCancel className="text-primary" onClick={handleCancel}>Cancel</AlertDialogCancel>
            <AlertDialogAction className="text-white bg-secondaryPriamry" onClick={handleConfirm}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};