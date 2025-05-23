import { useEffect, useRef, useState } from "react";
import { PaginationApi } from "@bidpro-frontend/shared/src/api/types";

const initialData = {
  data: [],
  total: 0,
  pages: 1,
  pageNum: 1,
};

const usePagination = (
  api: PaginationApi<any>,
  pageNum: number,
  requestBody: Record<string, any>
) => {
  const [data, setData] = useState<any[]>(initialData.data);
  const [total, setTotal] = useState(initialData.total);
  const [pages, setPages] = useState(initialData.pages);
  const [loading, setLoading] = useState(false);

  const prevRequestBody = useRef(requestBody);

  // Fetch data for a given page
  const fetchData = async (pageNum: number, pageSize = 15) => {
    try {
      setLoading(true);
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
      setData(result.data);
      setTotal(result.total);
      setPages(result.pages);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
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
      fetchData(1); // Reload from the first page
    }
  }, [requestBody]);

  useEffect(() => {
    fetchData(pageNum);
  }, [pageNum]);

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
    updateItem,
    loading,
  };
};

export default usePagination;
