import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';
import { Header } from '@/shared/components/Header/Header';
import { NameField } from '@/shared/components/FormFields/NameField';
import { TextareaField } from '@/shared/components/FormFields/TextareaField';
import { FormSubmissionButtons } from '@/shared/components/FormFields/FormSubmissionButton';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/shared/components/ui/alert-dialog';
import { useCuringTypeEdit } from './useCuringTypeEdit';
import { usePermission } from '@/shared/hooks/usePermission';
import { CuringTypeUrls } from '../../utils/urls';

export const CuringTypeEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { canEdit } = usePermission();
  const editable = canEdit('Curing Types');

  if (!id) return null;

  const {
    curingType, setCuringType,
    remark, setRemark,
    error,
    loading,
    handleSubmission,
    handleBack,
    showUnsavedDialog,
    setShowUnsavedDialog,
    fetchCuringType,
    setError,
    initialError,
  } = useCuringTypeEdit(id);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen px-4 pb-10">

      {/* ── Header (no back button) ── */}
      <Header title="Edit Curing Type" />

      <Card className="mt-4 p-6">
        <div className="flex flex-col gap-4">

          {/* ── Curing Type ── */}
          <NameField
            label="Curing Type"
            inputValue={curingType}
            setInputValue={setCuringType}
            placeholder="Enter Curing Type"
            required
            errorMessage={error.curingType}
            isDisabled={!editable}
          />

          {/* ── Remark ── */}
          <TextareaField
            label="Remark"
            inputValue={remark}
            setInputValue={setRemark}
            placeholder="Enter Remark"
            isDisabled={!editable}
          />

          {/* ── Save / Cancel ── */}
          <FormSubmissionButtons
            onSave={handleSubmission}
            onCancel={handleBack}
            disabled={!editable}
          />

        </div>
      </Card>

      {/* ── Unsaved Changes Dialog ── */}
      <AlertDialog open={showUnsavedDialog} onOpenChange={setShowUnsavedDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Do you want to save them before leaving?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                fetchCuringType();
                setError(initialError);
                navigate(CuringTypeUrls.list);
              }}
            >
              Exit without Saving
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                onClick={() => {
                  handleSubmission();
                  setShowUnsavedDialog(false);
                }}
              >
                Save
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
};