interface ContactCardProps {
  name: string;
  imgURL?: string;
  phone?: string;
  email?: string;
  workType?: string;
  workerRole?: string;
  onDelete: (e: React.MouseEvent) => void;  // ← revert back to original
  onPress?: () => void;
  permissionKey?: string;
}

export type { ContactCardProps };