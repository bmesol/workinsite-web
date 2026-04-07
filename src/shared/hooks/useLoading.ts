import { useState, useMemo } from "react";

const useLoading = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const contextValue = useMemo(
    () => ({
      show: () => setIsLoading(true),
      hide: () => setIsLoading(false),
    }),
    []
  );

  return { 
    contextValue, 
    isLoading,
    show: () => setIsLoading(true),  
    hide: () => setIsLoading(false), 
  };
};

export { useLoading };