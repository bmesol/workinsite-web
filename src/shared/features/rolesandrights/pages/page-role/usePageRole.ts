import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { usePageRightsService } from '../../service/PageRightsService';
import { usePageService } from '../../service/PageService';

export const usePageRole = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const role = location.state?.role;  // ✅ replaces route.params

  const { GetPages } = usePageService();
  const { getPageRights, createPageRights } = usePageRightsService();

  const [pages, setPages] = useState<any[]>([]);
  const [pageRights, setPageRights] = useState<Record<number, number>>({});
  const [originalRights, setOriginalRights] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false); // ✅ replaces Alert

  const fetchPageData = async () => {
    if (!role) return;
    try {
      setLoading(true);

      const [pagesRes, rightsRes] = await Promise.all([
        GetPages({ ignorePagination: true }),
        getPageRights(role.id),
      ]);

      const allPages = pagesRes?.items || pagesRes || [];
      const rightsList =
        rightsRes?.items?.[0]?.pageRights || rightsRes?.pageRights || [];

      const rightsMap: Record<number, number> = {};
      allPages.forEach((page: any) => {
        const existingRight = rightsList.find((r: any) => r.id === page.id);
        rightsMap[page.id] = existingRight ? existingRight.roleLevel : 0;
      });

      setPages(allPages);
      setPageRights(rightsMap);
      setOriginalRights(rightsMap);
    } catch (error: any) {
      const errorMsg =
        error?.response?.data?.message || 'Failed to load pages or rights.';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPageData();
  }, []);

  const handleSelectRight = (pageId: number, level: number) => {
    setPageRights(prev => ({ ...prev, [pageId]: level }));
  };

  const handleSave = async () => {
    try {
      const rightsPayload = Object.entries(pageRights).map(
        ([pageId, roleLevel]) => ({
          pageId: Number(pageId),
          roleLevel,
        }),
      );

      const payload = {
        roleId: role.id,
        pageRights: rightsPayload,
      };

      await createPageRights(payload);
      navigate('/roles-rights');
    } catch (error: any) {
      const errorMsg =
        error?.response?.data?.[0]?.message || 'Failed to save rights.';
      toast.error(errorMsg);
    }
  };

  const hasUnsavedChanges = useCallback(() => {
    return JSON.stringify(originalRights) !== JSON.stringify(pageRights);
  }, [originalRights, pageRights]);

  const handleBackPress = () => {
    if (hasUnsavedChanges()) {
      setShowUnsavedDialog(true); // ✅ opens AlertDialog instead of Alert
    } else {
      navigate('/roles-rights');
    }
  };

  const handleDiscardAndBack = () => {
    setShowUnsavedDialog(false);
    navigate('/roles-rights');
  };

  const handleSaveAndBack = async () => {
    setShowUnsavedDialog(false);
    await handleSave();
  };

  const getDisabledLevels = (page: any): number[] => {
    if (page.id === 1 || page.name === 'Users') return [1, 2];
    return [];
  };

  return {
    role,
    pages,
    pageRights,
    loading,
    showUnsavedDialog,      // ✅ for AlertDialog
    setShowUnsavedDialog,   // ✅ for AlertDialog
    handleSelectRight,
    handleSave,
    handleSaveAndBack,
    handleDiscardAndBack,
    handleBackPress,
    getDisabledLevels,
    hasUnsavedChanges,
  };
};