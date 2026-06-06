import type { LucideIcon } from 'lucide-react';

export type SubDetail = {
  icon: LucideIcon;
  text: string;
};


interface ContactCardProps {
  name: string;
  displayName?: string;
  imgURL?: string;
  phone?: string;
  email?: string;
  workType?: string;
  workerRole?: string;
  onDelete: (e: React.MouseEvent) => void;  // ← revert back to original
  onPress?: () => void;
  permissionKey?: string;
  subDetails?: SubDetail[]; 
}

export type { ContactCardProps };