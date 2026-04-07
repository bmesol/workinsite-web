
import { createContext, useContext } from "react";

interface LoadingContextValues {
  show: () => void;
  hide: () => void;
}

const defaultLoadingContextValues: LoadingContextValues = {
  show: () => {},
  hide: () => {},
};

const LoadingContext = createContext<LoadingContextValues>(defaultLoadingContextValues);

const useLoadingContext = () => useContext(LoadingContext);

export { LoadingContext, useLoadingContext };