import { useCallback, useEffect, useRef, useState } from "react";
import { PaginationApi } from "@bidpro-frontend/shared/src/api/types";

const initialData = {
  data: [],
  total: 0,
  pages: 1,
  pageNum: 1,
};

const usePagination = (
  api: PaginationApi<any>,
  requestBody: Record<string, any>
) => {
  const [initialLoader, setInitialLoader] = useState(true);
  const [data, setData] = useState<any[]>(initialData.data);
  const [total, setTotal] = useState(initialData.total);
  const [pages, setPages] = useState(initialData.pages);
  const [pageNum, setPageNum] = useState(initialData.pageNum);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const prevRequestBody = useRef(requestBody);

  // Fetch data for a given page
  const fetchData = async (pageNum: number, pageSize = 15) => {
    try {
      const response = await api({
        ...requestBody,
        pageNum,
        pageSize,
      });
      const result = {
        data: response?.list,
        total: response?.total,
        pages: response?.pages,
        pageNum: pageNum,
      };
      // Create new object references for each item in the list
      const newData = pageNum === 1 
        ? result.data.map(item => ({...item}))
        : [...data, ...result.data.map(item => ({...item}))];
      setData(newData);
      setTotal(result.total);
      setPageNum(result.pageNum);
      setPages(result.pages);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setRefreshing(false);
      setLoadingMore(false);
      setInitialLoader(false);
    }
  };

  useEffect(() => {
    fetchData(pageNum);
  }, []);

  useEffect(() => {
    if (
      JSON.stringify(prevRequestBody.current) !== JSON.stringify(requestBody)
    ) {
      prevRequestBody.current = requestBody;
      setInitialLoader(true);
      fetchData(1); // Reload from the first page
    }
  }, [requestBody]);

  // Pull-to-refresh
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData(1); // Refresh from the first page
  }, []);

  // Load more data
  const loadMore = () => {
    if (!loadingMore && pageNum < pages) {
      setLoadingMore(true);
      fetchData(pageNum + 1);
    }
  };

  const insertItem = (insert: any) => {};

  const deleteItem = (id: string) => {};

  const updateItem = (id: string, update: any) => {
    setData((prev) => {
      return prev.map((item) => {
        if (item.id === id) {
          return { ...item, ...update };
        }
        return item;
      });
    });
  };

  return {
    data,
    total,
    pages,
    refreshing,
    loadingMore,
    handleRefresh,
    loadMore,
    initialLoader,
    updateItem,
  };
};

export default usePagination;
