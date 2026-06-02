import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/components/lib/utils";

interface ListItemAction {
  type: "edit" | "delete";
  onClick: () => void;
  disabled?: boolean;
}

interface ListItemProps {
  label: string;
  sublabel?: string;       // e.g. shift multiplier [1.50]
  isEditing?: boolean;
  actions?: ListItemAction[];
}

const ListItem = ({ label, sublabel, isEditing = false, actions = [] }: ListItemProps) => {
  return (
    <div
      className={cn(
        "flex items-center justify-between px-4 py-3 rounded-md border",
        isEditing ? "bg-gray-100 opacity-50" : "bg-white"
      )}
    >
      {/* Label */}
      <span className="text-base font-medium text-black truncate flex-1">
        {label}
        {sublabel && (
          <span className="font-semibold text-[var(--secondary)]"> [{sublabel}]</span>
        )}
      </span>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 shrink-0">
        {actions.map((action, index) =>
          action.type === "edit" ? (
            <Button
              key={index}
              variant="ghost"
              size="icon"
              disabled={action.disabled}
              onClick={action.onClick}
              className="h-8 w-8"
            >
              <Pencil className="h-4 w-4 text-secondary" />
            </Button>
          ) : (
            <Button
              key={index}
              variant="ghost"
              size="icon"
              disabled={action.disabled}
              onClick={action.onClick}
              className="h-8 w-8"
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          )
        )}
      </div>
    </div>
  );
};

export { ListItem };