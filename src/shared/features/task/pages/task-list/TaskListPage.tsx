// 

import { useNavigate } from "react-router-dom";
import { Header, Actions } from "@/shared/components/Header/Header";
import { Button } from "@/shared/components/ui/button";
import { TaskUrls } from "../../utils/urls";
import { useTaskList } from "./useTaskList";
import { useLanguage } from '@/shared/hooks/useLanguageContext';
import { usePermission } from '@/shared/hooks/usePermission';
import { TaskCard } from "@/shared/components/TaskCard/TaskCard";
import { GetStartedCard } from "@/shared/components/GetStartedCard/GetStartedCard";
import TaskCreationIllustration from "@/assets/images/site-creation-illustration.png";
import { SearchBar } from "@/shared/components/SearchBar/SearchBar";
import { DeleteConfirmDialog } from "@/shared/components/DeleteConfirmDialog/DeleteConfirmDialog";

const TaskListPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { canEdit } = usePermission();
  const editable = canEdit('Task');

  const {
    taskDetails,
    handleTaskSelect,
    handleTaskDelete,
    confirmDelete,
    deleteId,
    setDeleteId,
    loading,
    searchText,
    setSearchText,
  } = useTaskList();

  const filteredTaskList = (taskDetails || []).filter(item =>
    item.taskName?.toLowerCase().includes(searchText.trim().toLowerCase()),
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 text-sm">{t('Loading...')}</p>
      </div>
    );
  }

  if (!taskDetails.length) return (
    <GetStartedCard
      imgSrc={TaskCreationIllustration}
      buttonClick={TaskUrls.create}
      buttonLabel={t('Create Task')}
    >
      Dive into the heart of construction site management. Create, edit, and
      view site information effortlessly. Assign workers, supervisors, and
      track project progress.
    </GetStartedCard>
  );

  return (
    <div className="min-h-screen w-full px-4 py-6">
      <Header title={t('Task List')}>
        <Actions>
          <Button onClick={() => navigate(TaskUrls.create)} disabled={!editable}>
            {t('New Task')}
          </Button>
        </Actions>
      </Header>

      <div className="flex justify-end mt-4 mb-4">
        <div className="w-full md:w-3/12">
          <SearchBar
            searchText={searchText}
            setSearchText={setSearchText}
            searchCategory={t('Search Tasks')}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
        {filteredTaskList.length === 0 ? (
          <div className="col-span-full flex w-full flex-col items-center justify-center py-16 px-4">
            <p className="text-center text-muted-foreground text-sm break-words">{t('No tasks found')}</p>
          </div>
        ) : (
          filteredTaskList.map(item => (
            <TaskCard
              key={item.id}
              id={item.id}
              taskName={item.taskName}
              siteId={item.site?.name}
              supervisor={item.assignedTo?.name}
              date={item.date}
              priority={item.priority}
              status={item.status}
              onPress={() => handleTaskSelect(item.id)}
              onDelete={() => confirmDelete(item.id)}
              permissionKey="Task"
            />
          ))
        )}
      </div>

      <DeleteConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && handleTaskDelete(deleteId)}
        description={t('Are you sure you want to delete this task?')}
      />
    </div>
  );
};

export { TaskListPage };