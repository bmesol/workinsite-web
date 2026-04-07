import { LoadingContext } from "@/shared/context/LoadingContext";
import { useLoading } from "@/shared/hooks/useLoading";
import { Loader } from "@/shared/components/ui/loader";  
const LoadingProvider = ({ children }: { children: React.ReactNode }) => {
  const { contextValue, isLoading } = useLoading();

  return (
    <LoadingContext.Provider value={contextValue}>
      {children}
      {isLoading && <Loader size="large" />}  
    </LoadingContext.Provider>
  );
};

export { LoadingProvider };