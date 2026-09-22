import { useAPIHelper } from '@/shared/helpers/ApiHelper';
import { buildQueryParams } from '@/shared/utils/buildQueryParams';

export interface Pages {
  name: string;
  note: string;
  isActive: boolean;
  id: number;
}

export interface PageRequest {
  name: string;
  note?: string;
}

type GetPagesParams = {
  name?: string;
  pageNumber?: number;
  pageSize?: number;
  ignorePagination?: boolean;
};

const usePageService = () => {
  const baseUrl = import.meta.env.VITE_USER_SERVICE_BASE_URL || '';
  const apiHelper = useAPIHelper(baseUrl, true);

  const getPages = async (params: GetPagesParams = {}) => {
    const { data } = await apiHelper.get(`pages?${buildQueryParams({
      name: params.name,
      pageNumber: params.pageNumber,
      pageSize: params.pageSize,
      ignorePagination: params.ignorePagination,
    })}`);
    return data;
  };

  const createPage = async (page: PageRequest) => {
    const { data } = await apiHelper.post('pages', page);
    return data;
  };

  const getPage = async (id: number) => {
    const { data } = await apiHelper.get(`pages/${id}`);
    return data;
  };

  const updatePage = async (id: number, page: PageRequest) => {
    await apiHelper.put(`pages/${id}`, page);
  };

  const deletePage = async (id: number) => {
    await apiHelper.delete(`pages/${id}`);
  };

  return {
    getPages,
    createPage,
    getPage,
    updatePage,
    deletePage,
  };
};

export { usePageService };