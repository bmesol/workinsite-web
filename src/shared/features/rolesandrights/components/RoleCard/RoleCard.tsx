import { Pencil, Trash2, ChevronRight } from 'lucide-react';
import type { Roles } from '../../DTOs/DTOs';

interface RoleCardProps {
  role: Roles;
  onEdit: (role: Roles) => void;
  onDelete: (id: number) => void;
  handlePress: (role: Roles) => void;
  isSuperAdmin: boolean;
}

const RoleCard: React.FC<RoleCardProps> = ({
  role,
  onEdit,
  onDelete,
  handlePress,
  isSuperAdmin,
}) => {
  // Avatar initials
  const initials = role.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      onClick={() => handlePress(role)}
      className="bg-white dark:bg-[var(--card)] rounded-xl p-3 flex items-center justify-between cursor-pointer hover:shadow-sm transition-shadow border"
      style={{ borderColor: 'var(--border)' }}
    >
      {/* ── Left: Avatar + Name ── */}
      <div className="flex items-center gap-3 flex-1 min-w-0">

        {/* Avatar */}
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-sm font-semibold"
          style={{
            backgroundColor: 'var(--primary)',
            color: 'var(--secondary)',
          }}
        >
          {initials}
        </div>

        {/* Role Name */}
        <span
          className="text-sm font-semibold truncate"
          style={{ color: 'var(--foreground)' }}
        >
          {role.name}
        </span>
      </div>

      {/* ── Right: Actions + Chevron ── */}
      <div className="flex items-center gap-1.5 shrink-0">

        {isSuperAdmin && (
          <>
            {/* Edit */}
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(role); }}
              className="w-8 h-8 rounded-md flex items-center justify-center transition-colors hover:bg-gray-100"
            >
              <Pencil
                className="w-4 h-4"
                style={{ color: 'var(--secondary)' }}
              />
            </button>

            {/* Delete */}
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(role.id); }}
              className="w-8 h-8 rounded-md flex items-center justify-center transition-colors hover:bg-red-50"
            >
              <Trash2
                className="w-4 h-4"
                style={{ color: 'var(--danger-color)' }}
              />
            </button>
          </>
        )}

        {/* Chevron */}
        <ChevronRight
          className="w-5 h-5 ml-1"
          style={{ color: '#9CA3AF' }}
        />
      </div>
    </div>
  );
};

export default RoleCard;