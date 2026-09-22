interface ValueLabelProps {
  value: string | number;
  label: string;
  color: string;
  variant?: "stat" | "dashboard";
}

const ValueLabel = ({ value, label, color, variant = "stat" }: ValueLabelProps) => {
  if (variant === "dashboard") {
    return (
      <>
        <p className="text-xl font-extrabold leading-tight truncate" style={{ color }}>
          {value}
        </p>
        <p className="text-xs font-semibold mt-0.5 truncate" style={{ color: color + "cc" }}>
          {label}
        </p>
      </>
    );
  }

  return (
    <>
      <span className="text-xl font-extrabold mb-1 truncate" style={{ color }}>
        {value}
      </span>
      <span
        className="text-[10px] font-semibold uppercase text-center leading-tight"
        style={{ color, opacity: 0.8 }}
      >
        {label}
      </span>
    </>
  );
};

export { ValueLabel };
export type { ValueLabelProps };
