import React, { useState } from 'react';
import { Trash2, Download, X } from 'lucide-react';
import { usePermission } from '@/shared/hooks/usePermission';
import {
  Dialog,
  DialogContent,
} from '@/shared/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/shared/components/ui/alert-dialog';
import { Button } from '@/shared/components/ui/button';

interface NewImage {
  uri: string;
  name?: string;
  type?: string;
  file?: File;
}

interface OldImage {
  id: number;
  staticBaseUrl: string;
  imagePath: string;
}

interface RemovedImage {
  id: number;
  imagePath: string;
}

interface Props {
  photo: NewImage[];
  setPhoto: React.Dispatch<React.SetStateAction<NewImage[]>>;
  showImages?: OldImage[];
  setShowImages?: React.Dispatch<React.SetStateAction<OldImage[]>>;
  removeImages?: RemovedImage[];
  setRemoveImages?: React.Dispatch<React.SetStateAction<RemovedImage[]>>;
  permissionKey?: string;
}

export default function PurchasePhoto({
  photo,
  setPhoto,
  showImages = [],
  setShowImages,
  removeImages = [],
  setRemoveImages,
  permissionKey,
}: Props) {
  const { canEdit } = usePermission();
  const hasPermission = permissionKey ? canEdit(permissionKey) : true;

  const [selected, setSelected] = useState<{
    type: 'new' | 'old';
    data: NewImage | OldImage | null;
  }>({ type: 'new', data: null });

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const getImageUri = () => {
    if (!selected.data) return '';
    if (selected.type === 'new') return (selected.data as NewImage).uri;
    const img = selected.data as OldImage;
    return `${img.staticBaseUrl}${img.imagePath}`;
  };

  const handleDownload = () => {
    const uri = getImageUri();
    if (!uri) return;
    const a = document.createElement('a');
    a.href = uri;
    a.download = `image_${Date.now()}.jpg`;
    a.click();
  };

  const handleDelete = () => {
    if (!selected.data) return;

    if (selected.type === 'new') {
      setPhoto(prev =>
        prev.filter(i => i.uri !== (selected.data as NewImage).uri)
      );
    } else {
      const oldImg = selected.data as OldImage;
      setShowImages?.(prev => prev.filter(i => i.id !== oldImg.id));
      setRemoveImages?.(prev => [
        ...prev,
        { id: oldImg.id, imagePath: oldImg.imagePath },
      ]);
    }

    setShowDeleteDialog(false);
    setSelected({ type: selected.type, data: null });
  };

  const hasImages =
    photo.filter(img => typeof img?.uri === 'string' && img.uri.length > 0).length > 0 ||
    showImages.filter(img => img?.staticBaseUrl && img?.imagePath).length > 0;

  if (!hasImages) return null;

  return (
    <div className="py-2">

      {/* Thumbnail Row */}
      <div className="flex flex-row gap-2 overflow-x-auto pb-2">

        {/* New Images */}
        {photo
          .filter(img => typeof img?.uri === 'string' && img.uri.length > 0)
          .map((img, index) => (
            <div
              key={`new-${img.uri}-${index}`}
              className="relative shrink-0 cursor-pointer"
              onClick={() => setSelected({ type: 'new', data: img })}
            >
              <img
                src={img.uri}
                alt="new"
                className="w-24 h-24 rounded-lg object-cover border border-border"
              />
              <span className="absolute bottom-1 right-1 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded">
                New
              </span>
            </div>
          ))}

        {/* Old Images */}
        {showImages
          .filter(img => img?.staticBaseUrl && img?.imagePath)
          .map((img, index) => (
            <div
              key={`old-${img.id}-${index}`}
              className="relative shrink-0 cursor-pointer"
              onClick={() => setSelected({ type: 'old', data: img })}
            >
              <img
                src={`${img.staticBaseUrl}${img.imagePath}`}
                alt="existing"
                className="w-24 h-24 rounded-lg object-cover border border-border"
              />
            </div>
          ))}
      </div>

      {/* Full Image Dialog */}
      <Dialog
        open={!!selected.data}
        onOpenChange={(val) => {
          if (!val) setSelected({ type: selected.type, data: null });
        }}
      >
        <DialogContent className="max-w-2xl bg-black border-none p-0">

          {/* Full Image */}
          <div className="flex justify-center items-center w-full h-[70vh]">
            <img
              src={getImageUri()}
              alt="full"
              className="max-w-full max-h-full object-contain"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-around items-center py-4 bg-black">

            {/* Close */}
            <button
              onClick={() => setSelected({ type: selected.type, data: null })}
              className="flex flex-col items-center gap-1 text-white"
            >
              <X className="w-7 h-7" />
              <span className="text-xs">Close</span>
            </button>

            {/* Download */}
            <button
              onClick={handleDownload}
              className="flex flex-col items-center gap-1 text-white"
              style={{ opacity: hasPermission ? 1 : 0.4 }}
              disabled={!hasPermission}
            >
              <Download className="w-7 h-7" />
              <span className="text-xs">Download</span>
            </button>

            {/* Delete */}
            <button
              onClick={() => setShowDeleteDialog(true)}
              className="flex flex-col items-center gap-1"
              style={{ opacity: hasPermission ? 1 : 0.4 }}
              disabled={!hasPermission}
            >
              <Trash2 className="w-7 h-7 text-red-500" />
              <span className="text-xs text-red-500">Delete</span>
            </button>

          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Image</AlertDialogTitle>
            <AlertDialogDescription>
              Do you want to delete this image?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}