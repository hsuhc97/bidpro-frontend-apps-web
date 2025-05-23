"use client";

import usePagination from "@/hooks/usePagination";
import { queryTender } from "@bidpro-frontend/shared";
import { Pagination } from "@heroui/react";
import React from "react";
import TenderCard from "./TenderCard";

export default function TendersComponent() {
  const {
    data,
    total,
    pages,
    refreshing,
    handleRefresh,
    loadMore,
    initialLoader,
  } = usePagination(queryTender, {});

  return (
    <div className="flex flex-col items-center">
      {pages > 1 && (
        <Pagination className={"justify-end"} initialPage={1} total={pages} />
      )}
      <div className="flex flex-col gap-4">
        {data.map((tender) => (
          <TenderCard key={tender.id} {...tender} />
        ))}
      </div>
    </div>
  );
}
