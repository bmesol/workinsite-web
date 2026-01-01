import { Spinner } from "./shared/components/ui/spinner";

const App = () => {
  return (
    <div className="w-screen h-screen flex items-center justify-center gap-4 bg-[rgb(245,245,245)]">
      Comming soon <Spinner className="size-8" />
    </div>
  );
};

export default App;
