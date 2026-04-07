interface ContactCardProps {
  name: string;
  imgURL?: string;
  phone?: string;
  email?: string;
  onDelete: (e: React.MouseEvent) => void;
}

export type  { ContactCardProps };