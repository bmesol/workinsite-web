interface SupervisorListFormProps {
  supervisorIds: number[];
  setSupervisorIds: React.Dispatch<React.SetStateAction<number[]>>;
  isDisabled?: boolean;
}

export type { SupervisorListFormProps };