
interface LoaderProps {
  size?: "small" | "large";
}

const Loader = ({ size = "large" }: LoaderProps) => {
  if (size === "large") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        <div className="h-10 w-10 rounded-full border-4 border-muted border-t-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center px-3 py-2">
      <div className="h-5 w-5 rounded-full border-2 border-muted border-t-primary animate-spin" />
    </div>
  );
};

export { Loader };