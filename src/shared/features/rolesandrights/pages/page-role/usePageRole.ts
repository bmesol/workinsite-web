import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { usePageRightsService } from '../../service/PageRightsService';
import { usePageService } from '../../service/PageService';
import type { Pages } from '../../service/PageService';
import { parseApiError } from '@/shared/utils/parseApiError';

interface PageRightItem {
  id: number;
  roleLevel: number;
}

interface PagesApiResponse {
  items?: Pages[];
}
interface PageRightsGroup {
  pageRights?: PageRightItem[];
}
interface PageRightsApiResponse {
  items?: PageRightsGroup[];
  pageRights?: PageRightItem[];
}

export const usePageRole = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const role = location.state?.role;

  const { getPages } = usePageService();
  const { getPageRights, createPageRights } = usePageRightsService();

  const [pages, setPages] = useState<Pages[]>([]);
  const [pageRights, setPageRights] = useState<Record<number, number>>({});
  const [originalRights, setOriginalRights] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);

  const fetchPageData = async () => {
    if (!role) return;
    try {
      setLoading(true);

      const [pagesRes, rightsRes] = await Promise.all([
        getPages({ ignorePagination: true }) as Promise<PagesApiResponse & Pages[]>,
        getPageRights(role.id) as Promise<PageRightsApiResponse>,
      ]);

      const allPages = pagesRes?.items || pagesRes || [];
      const rightsList =
        rightsRes?.items?.[0]?.pageRights || rightsRes?.pageRights || [];

      const rightsMap: Record<number, number> = {};
      allPages.forEach((page: Pages) => {
        const existingRight = rightsList.find((r: PageRightItem) => r.id === page.id);
        rightsMap[page.id] = existingRight ? existingRight.roleLevel : 0;
      });

      setPages(allPages);
      setPageRights(rightsMap);
      setOriginalRights(rightsMap);
    } catch (error: unknown) {
      toast.error(parseApiError(error, 'Failed to load pages or rights.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPageData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    } catch (error: unknown) {
      toast.error(parseApiError(error, 'Failed to save rights.'));
    }
  };

  const hasUnsavedChanges = useCallback(() => {
    return JSON.stringify(originalRights) !== JSON.stringify(pageRights);
  }, [originalRights, pageRights]);

  const handleBackPress = () => {
    if (hasUnsavedChanges()) {
      setShowUnsavedDialog(true);
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

  const getDisabledLevels = (page: Pages): number[] => {
    if (page.id === 1 || page.name === 'Users') return [1, 2];
    return [];
  };

  return {
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
    hasUnsavedChanges,
  };
};