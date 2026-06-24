import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import { cn } from '@/shared/components/lib/utils';

interface Remark {
  id: number;
  remark: string;
  createdBy: number;
  createdByName: string;
  roleName: string;
}

interface Props {
  remarks: Remark[];
  newRemark: string;
  setNewRemark: (val: string) => void;
  taskCreatorId: number;
}

const RemarkSection: React.FC<Props> = ({
  remarks,
  newRemark,
  setNewRemark,
  taskCreatorId,
}) => {
  const isLeft = (item: Remark) => item.createdBy === taskCreatorId;

  return (
    <div className="flex flex-col gap-3">
      <Label className="text-base font-bold">Remark</Label>

      {/* Chat List */}
      <div className="flex flex-col gap-4">
        {remarks.map(item => (
          <div
            key={item.id}
            className={cn(
              'flex flex-col gap-1 w-4/5',
              isLeft(item) ? 'self-start items-start' : 'self-end items-end',
            )}
          >
            {/* Name */}
            <span
              className="text-sm font-semibold"
              style={{ color: 'var(--secondary)' }}
            >
              {item.createdByName} ({item.roleName})
            </span>

            {/* Disabled Textarea — mobile style */}
            <Textarea
              value={item.remark}
              readOnly
              rows={3}
              className={cn(
                'w-full resize-none bg-gray-100 border border-gray-200 rounded-2xl text-sm text-gray-700 cursor-default focus-visible:ring-0 focus-visible:ring-offset-0',
                !isLeft(item) && 'rounded-tr-none',
                isLeft(item) && 'rounded-tl-none',
              )}
            />
          </div>
        ))}
      </div>

      {/* Add Remark Input */}
      <div className="mt-2 flex flex-col gap-1.5">
        <Label className="text-base font-bold">Add Remark</Label>
        <Textarea
          value={newRemark}
          onChange={e => setNewRemark(e.target.value)}
          placeholder="Type your remark..."
          rows={3}
          className="rounded-2xl"
        />
      </div>
    </div>
  );
};

export default RemarkSection;