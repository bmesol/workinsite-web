import { Card } from "@/shared/components/ui/card";
import {
  Calendar,
  Trash2,
  Banknote,
  CreditCard,
  Landmark,
  Smartphone,
} from "lucide-react";
import { PaymentMethodEnum } from "@/shared/features/transaction/DTOs/ClientTransaction";
import { usePermission } from "@/shared/hooks/usePermission";

interface Props {
  id: number;
  name: string;
  amount: string;
  date: string;
  paymentMethod: (typeof PaymentMethodEnum)[keyof typeof PaymentMethodEnum];
  onDelete: (id: number) => void;
  onPress: (id: number) => void;
  permissionKey?: string;
}

const paymentMethodColors: Record<string, string> = {
  [PaymentMethodEnum.CASH]: "var(--success-color)",
  [PaymentMethodEnum.CHEQUE]: "var(--active-color)",
  [PaymentMethodEnum.BANK_TRANSFER]: "var(--warning-color)",
  [PaymentMethodEnum.UPI]: "var(--primary)",
};

const paymentMethodIcons: Record<string, React.ReactNode> = {
  [PaymentMethodEnum.CASH]: <Banknote className="h-3.5 w-3.5 shrink-0" />,
  [PaymentMethodEnum.CHEQUE]: <CreditCard className="h-3.5 w-3.5 shrink-0" />,
  [PaymentMethodEnum.BANK_TRANSFER]: <Landmark className="h-3.5 w-3.5 shrink-0" />,
  [PaymentMethodEnum.UPI]: <Smartphone className="h-3.5 w-3.5 shrink-0" />,
};

const TransactionCard: React.FC<Props> = ({
  id,
  name,
  amount,
  date,
  paymentMethod,
  onDelete,
  onPress,
  permissionKey,
}) => {
  const { canEdit } = usePermission();
  const hasPermission = permissionKey ? canEdit(permissionKey) : true;

  return (
    <Card
      className="w-full flex flex-col gap-2 p-4 cursor-pointer hover:shadow-sm transition-shadow"
      onClick={() => onPress(id)}
    >
      {/* ── Top Row: Name + Delete ── */}
      <div className="flex items-center justify-between">
        <span className="font-semibold text-base text-black truncate flex-1 ">
          {name}
        </span>
        <div
          className="shrink-0 p-2 rounded-md hover:bg-destructive/10 transition-colors"
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            if (hasPermission) onDelete(id);
          }}
          style={{
            opacity: hasPermission ? 1 : 0.5,
            cursor: hasPermission ? "pointer" : "not-allowed",
          }}
        >
          <Trash2
            className="h-5 w-5"
            style={{ color: "var(--danger-color)" }}
          />
        </div>
      </div>

      {/* ── Date ── */}
      <div className="flex items-center gap-1">
        <Calendar className="h-3 w-3 text-black shrink-0" />
        <span className="text-sm text-black truncate">{date}</span>
      </div>

      {/* ── Bottom Row: Amount + Payment Method ── */}
      <div className="flex items-center justify-between">
      <span className="text-sm font-semibold" style={{ color: 'var(--success-color)' }}>
  ₹{parseFloat(amount).toLocaleString('en-IN')}
</span>

        <div
          className="flex items-center gap-1"
          style={{ color: paymentMethodColors[paymentMethod] }}
        >
          {paymentMethodIcons[paymentMethod]}
          <span
            className="text-sm font-medium"
            style={{ color: paymentMethodColors[paymentMethod] }}
          >
            {paymentMethod.replace("_", " ")}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default TransactionCard;
