interface SupervisorAddFormProps {
  supervisorIds: number[];
  setSupervisorIds: React.Dispatch<React.SetStateAction<number[]>>;
  redirectUrl: string | ((id: number) => string);
  redirectParams: URLSearchParams;
  onClose?: () => void;
}

export type { SupervisorAddFormProps };