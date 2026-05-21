interface UploadedImage {
  uri: string;       
  type: string;      
  name: string;      
}

interface AttendancePhotoProps {
  setUploadedImages: (images: UploadedImage[]) => void;
  uploadedImages: UploadedImage[];
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void; 
  deleteImage: (index: number) => void;
}

export type { AttendancePhotoProps, UploadedImage };