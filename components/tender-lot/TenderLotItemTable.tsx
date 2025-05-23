"use client";
import React from "react";
import { queryTenderLotItem } from "@bidpro-frontend/shared";
import usePagination from "@/hooks/usePagination";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  Pagination,
  Spinner,
  TableRow,
  TableCell,
} from "@heroui/react";

export default function TenderLotItemTable(props: { tenderLotId: string }) {
  const { tenderLotId } = props;
  const [page, setPage] = React.useState(1);
  const {
    data,
    total,
    pages,
    refreshing,
    loadingMore,
    handleRefresh,
    loadMore,
    initialLoader,
  } = usePagination(queryTenderLotItem, {
    tenderLotId: tenderLotId,
  });
  const loadingState = loadingMore || data?.length === 0 ? "loading" : "idle";

  return (
    <Table
      aria-label="Example table with client side pagination"
      bottomContent={
        pages > 1 && (
          <div className="flex w-full justify-end">
            <Pagination
              isCompact
              showControls
              showShadow
              page={page}
              total={pages}
              onChange={(page) => setPage(page)}
            />
          </div>
        )
      }
    >
      <TableHeader>
        <TableColumn key="id">ABC</TableColumn>
        <TableColumn key="item">ITEM</TableColumn>
        <TableColumn key="grade">GRADE</TableColumn>
        <TableColumn key="lockCondition">LOCK CONDITION</TableColumn>
        <TableColumn key="quantity">QUANTITY</TableColumn>
      </TableHeader>
      <TableBody
        items={data}
        loadingContent={<Spinner />}
        loadingState={loadingState}
      >
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => <TableCell>{item[columnKey]}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
