import { ValueLabel } from "../ValueLabel/ValueLabel";

type StatCardProps = {
  value: string | number;
  label: string;
  bgColor: string;
  textColor: string;
  onClick?: () => void;
};

const StatCard = ({ value, label, bgColor, textColor, onClick }: StatCardProps) => (
  <div
    onClick={onClick}
    className="flex-1 rounded-xl py-3 px-3 flex flex-col items-center justify-center min-h-[70px]"
    style={{
      backgroundColor: bgColor,
      cursor: onClick ? "pointer" : "default",
    }}
  >
    <ValueLabel value={value} label={label} color={textColor} variant="stat" />
  </div>
);

export default StatCard;
