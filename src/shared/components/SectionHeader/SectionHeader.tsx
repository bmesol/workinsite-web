type SectionHeaderProps = {
  title: string;
  linkLabel?: string;
  onLink?: () => void;
  /** Pass a number to show "(n)" in red next to title */
  urgentCount?: number;
};

const SectionHeader = ({ title, linkLabel = 'View all →', onLink, urgentCount }: SectionHeaderProps) => (
  <div className="flex items-center justify-between mb-3">
    <p className={`text-xs font-bold uppercase tracking-widest ${urgentCount !== undefined ? 'text-red-500' : 'text-gray-500'}`}>
      {title}
      {urgentCount !== undefined && urgentCount > 0 && (
        <span className="ml-1 text-red-400">({urgentCount})</span>
      )}
    </p>
    {onLink && (
      <button
        onClick={onLink}
        className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
      >
        {linkLabel}
      </button>
    )}
  </div>
);

export default SectionHeader;