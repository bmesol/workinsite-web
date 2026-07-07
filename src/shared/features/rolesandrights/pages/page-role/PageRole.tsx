import { Ban, Eye, Pencil } from 'lucide-react';
import { Header } from '@/shared/components/Header/Header';
import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';
import { FormSubmissionButtons } from '@/shared/components/FormFields/FormSubmissionButton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/components/ui/alert-dialog';
import { usePageRole } from './usePageRole';
import { cn } from '@/shared/components/lib/utils';
import { useLanguage } from '@/shared/hooks/useLanguageContext'; 

const PageRolePage = () => {
  const { t } = useLanguage(); // ✅ ADD

  const ROLE_LEVELS = [
    { label: t('No Rights'), value: 0, icon: <Ban className="w-4 h-4" />,    color: '#EF4444' },
    { label: t('View'),      value: 1, icon: <Eye className="w-4 h-4" />,    color: '#F59E0B' },
    { label: t('Edit'),      value: 2, icon: <Pencil className="w-4 h-4" />, color: '#10B981' },
  ];

  const {
    role,
    pages,
    pageRights,
    loading,
    showUnsavedDialog,
    setShowUnsavedDialog,
    handleSelectRight,
    handleSave,
    handleSaveAndBack,
    handleDiscardAndBack,
    handleBackPress,
    getDisabledLevels,
  } = usePageRole();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground text-sm">{t('Loading...')}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full px-4 py-6 pb-24">

      {/* ── Header ── */}
      {/* ✅ dynamic: role name + translated "Rights" */}
      <Header title={`${role?.name} ${t('Rights')}`} />

      {/* ── Page Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
        {pages.map(page => {
          const disabledLevels = getDisabledLevels(page);

          return (
            <Card key={page.id} className="p-4">

              {/* Page Name — API data, translate வேண்டாம் */}
              <p className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>
                {page.name}
              </p>

              {/* Role Level Buttons */}
              <div className="flex flex-wrap gap-2">
                {ROLE_LEVELS.map(level => {
                  const isSelected = pageRights[page.id] === level.value;
                  const isDisabled = disabledLevels.includes(level.value);

                  return (
                    <button
                      key={level.value}
                      disabled={isDisabled}
                      onClick={() => !isDisabled && handleSelectRight(page.id, level.value)}
                      className={cn(
                        'flex items-center gap-1.5 px-3 py-2 rounded-lg border-[1.5px] text-xs font-semibold transition-all',
                        isSelected
                          ? 'border-transparent text-white'
                          : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300',
                        isDisabled && 'opacity-50 cursor-not-allowed',
                      )}
                      style={isSelected ? { backgroundColor: level.color } : undefined}
                    >
                      <span
                        style={{
                          color: isDisabled ? '#D1D5DB' : isSelected ? '#fff' : '#6B7280',
                        }}
                      >
                        {level.icon}
                      </span>
                      {/* ✅ label already t() apply பண்ணியிருக்கோம் — ROLE_LEVELS ல் */}
                      {level.label}
                    </button>
                  );
                })}
              </div>

            </Card>
          );
        })}
      </div>

      {/* ── Footer Save / Cancel Buttons ── */}
      <div
        className="fixed bottom-0 left-0 right-0 px-4 py-4 bg-white dark:bg-[var(--card)] border-t"
        style={{ borderColor: 'var(--border)' }}
      >
        <FormSubmissionButtons
          label={t('Save Rights')} // ✅
          onSave={handleSave}
          onCancel={handleBackPress}
        />
      </div>

      {/* ── Unsaved Changes Dialog ── */}
      <AlertDialog open={showUnsavedDialog} onOpenChange={setShowUnsavedDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('Unsaved Changes')}</AlertDialogTitle> {/* ✅ */}
            <AlertDialogDescription>
              {t('You have unsaved changes. What would you like to do?')} {/* ✅ */}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-col sm:flex-row gap-2">
            <AlertDialogCancel onClick={() => setShowUnsavedDialog(false)}>
              {t('Cancel')} {/* ✅ */}
            </AlertDialogCancel>
            <Button variant="destructive" onClick={handleDiscardAndBack}>
              {t('Discard')} {/* ✅ */}
            </Button>
            <AlertDialogAction asChild>
              <Button onClick={handleSaveAndBack}>
                {t('Save')} {/* ✅ */}
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
};

export default PageRolePage;