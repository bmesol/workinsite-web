import { Phone, Trash2 } from "lucide-react";
import { useSupervisorListForm } from "./useSupervisorListForm";
import type { SupervisorListFormProps } from "./DTOs";

const SupervisorListForm = (props: SupervisorListFormProps) => {
  const { supervisorList, handleSupervisorDelete } = useSupervisorListForm(props);

  return (
    <>
      {supervisorList.map((supervisor) => (
        <div className="flex items-center justify-between " key={supervisor.id}>

          <div className="flex items-center gap-3">
            {/* Badge — first letter avatar */}
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-medium shrink-0">
              {supervisor.name[0]}
            </div>
            <span className="text-sm text-foreground">{supervisor.name}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => (window.location.href = `tel:${supervisor.phone}`)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Phone className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleSupervisorDelete(supervisor.id)}
              className="text-muted-foreground hover:text-destructive transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

        </div>
      ))}
    </>
  );
};

export { SupervisorListForm };