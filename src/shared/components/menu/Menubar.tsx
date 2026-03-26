import { Menu } from "lucide-react";

type MenuBarProps = {
  onOpen: () => void;
};

export const MenuBar = ({ onOpen }: MenuBarProps) => {
  return (
    <Menu
      onClick={onOpen}
      className="h-6 w-6 cursor-pointer"
    />
  );
};



