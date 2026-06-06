import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      toastOptions={{
        classNames: {
          toast: 'font-["Outfit",sans-serif] rounded-xl border shadow-sm',
          success: '!bg-white !text-[var(--success-color)] !border-[var(--success-color)]',
          error: '!bg-white !text-[var(--danger-color)] !border-[var(--danger-color)]',
          warning: '!bg-white !text-[var(--warning-color)] !border-[var(--warning-color)]',
          info: '!bg-white !text-[var(--foreground)] !border-[var(--border)]',
          icon: 'size-4',
          description: '!text-[var(--gray-color)] text-sm',
        },
      }}
      style={
        {
          "--normal-bg": "#ffffff",
          "--normal-text": "var(--foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
          "--success-bg": "#ffffff",
          "--success-border": "var(--success-color)",
          "--success-text": "var(--success-color)",
          "--error-bg": "#ffffff",
          "--error-border": "var(--danger-color)",
          "--error-text": "var(--danger-color)",
          "--warning-bg": "#ffffff",
          "--warning-border": "var(--warning-color)",
          "--warning-text": "var(--warning-color)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };