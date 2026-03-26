import type { ReactNode } from "react";

const Actions = (props: { children: ReactNode }) => {
  return (
    <div className="flex items-center">
      {props.children}
    </div>
  );
};

const Header = (props: { title: string; children?: ReactNode }) => {
  return (
    <div className="flex justify-between items-center pt-4">
      {/* Title */}
      <h2 className="text-secondary font-bold text-xl">
        {props.title}
      </h2>

      {/* Actions */}
      {props.children}
    </div>
  );
};

export { Header, Actions };