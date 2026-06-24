import { useNavigate } from "react-router-dom";
import { Header, Actions } from "@/shared/components/Header/Header";
import { Button } from "@/shared/components/ui/button";
import { TaskUrls } from "../../utils/urls";
import { useTaskList } from "./useTaskList";
import { TaskCard } from "@/shared/components/TaskCard/TaskCard";
import { GetStartedCard } from "@/shared/components/GetStartedCard/GetStartedCard";
import TaskCreationIllustration from "@/assets/images/site-creation-illustration.png";
import { SearchBar } from "@/shared/components/SearchBar/SearchBar";  // ADD
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";

const TaskListPage = () => {
  const navigate = useNavigate();

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
        <p className="text-gray-500 text-sm">Loading...</p>
      </div>
    );
  }

  if (!taskDetails.length) return (
    <GetStartedCard
      imgSrc={TaskCreationIllustration}
      buttonClick={TaskUrls.create}
      buttonLabel="Create Task"
    >
      Dive into the heart of construction site management. Create, edit, and
      view site information effortlessly. Assign workers, supervisors, and
      track project progress.
    </GetStartedCard>
  );

  return (
    <div className="min-h-screen w-full px-4 py-6">
      {/* Header */}
      <Header title="Tasks">
        <Actions>
          <Button onClick={() => navigate(TaskUrls.create)}>
            New Task
          </Button>
        </Actions>
      </Header>

      {/* SearchBar — ClientListPage pattern */}
      <div className="flex justify-end mt-4 mb-4">
        <div className="w-full md:w-3/12">
          <SearchBar
            searchText={searchText}
            setSearchText={setSearchText}
            searchCategory="Tasks"
          />
        </div>
      </div>

      {/* Task Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
        {filteredTaskList.length === 0 ? (
          <div className="col-span-full my-4 text-center text-muted-foreground">
            No tasks found
          </div>
        ) : (
          filteredTaskList.map(item => (
            <TaskCard
              key={item.id}
              taskName={item.taskName}
              siteId={item.site?.name}
              supervisor={item.supervisor?.name}
              date={item.date}
              priority={item.priority}
              status={item.status}
              onPress={() => handleTaskSelect(item.id)}
              onDelete={() => confirmDelete(item.id)}
            />
          ))
        )}
      </div>

      {/* Delete Confirm Dialog */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={val => !val && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base">
              Confirm Delete
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm">
              Are you sure you want to delete this task?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button variant="outline" onClick={() => setDeleteId(null)}>
                Cancel
              </Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                variant="destructive"
                onClick={() => deleteId && handleTaskDelete(deleteId)}
              >
                Delete
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export { TaskListPage };