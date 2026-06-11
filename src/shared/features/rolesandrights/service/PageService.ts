import { useAPIHelper } from '@/shared/helpers/ApiHelper';

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

  const GetPages = async (params: GetPagesParams = {}) => {
    const queryParams = new URLSearchParams();
    if (params.name) queryParams.append('name', params.name);
    if (params.pageNumber)
      queryParams.append('pageNumber', params.pageNumber.toString());
    if (params.pageSize)
      queryParams.append('pageSize', params.pageSize.toString());
    if (params.ignorePagination)
      queryParams.append('ignorePagination', String(params.ignorePagination));

    const { data } = await apiHelper.get(`pages?${queryParams.toString()}`);
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
    GetPages,
    createPage,
    getPage,
    updatePage,
    deletePage,
  };
};

export { usePageService };