const useListItemDelete = <T>(
  items: T[],
  setItems: (updated: T[]) => void
) => {
  const handleDelete = (id: number) => {
    setItems(items.filter((_, index) => index !== id));
  };

  return { handleDelete };
};

export { useListItemDelete };
