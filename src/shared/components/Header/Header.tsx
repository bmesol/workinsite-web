import type { ReactNode } from "react";

const Actions = (props: { children: ReactNode }) => {
  return (
    <div className="flex items-center gap-2">
      {props.children}
    </div>
  );
};

const Header = (props: { title: string; children?: ReactNode; leading?: ReactNode }) => {
  return (
    <div className="flex justify-between items-center pt-4">
      {/* Leading + Title */}
      <div className="flex items-center gap-2">
        {props.leading}
        <h2 className="text-secondary font-bold text-xl">
          {props.title}
        </h2>
      </div>

      {/* Actions */}
      {props.children}
    </div>
  );
};
export { Header, Actions };