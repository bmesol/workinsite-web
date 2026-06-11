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
      cursor: onClick ? 'pointer' : 'default',
    }}
  >
    <span
      className="text-xl font-extrabold mb-1 truncate"
      style={{ color: textColor }}
    >
      {value}
    </span>
    <span
      className="text-[10px] font-semibold uppercase text-center leading-tight"
      style={{ color: textColor, opacity: 0.8 }}
    >
      {label}
    </span>
  </div>
);

export default StatCard;