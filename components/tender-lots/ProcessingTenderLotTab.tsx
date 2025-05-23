"use client";
import React from "react";
import {
  BidType,
  queryTenderLot,
  TenderLot,
  TenderLotStatus,
  TenderPackage,
  TenderPackageStatus,
} from "@bidpro-frontend/shared";
import usePagination from "@/hooks/usePagination";
import { useTranslations } from "next-intl";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Spinner,
  Button,
  Input,
  Link,
  Select,
  SelectItem,
} from "@heroui/react";
import CountDown from "../count-down";

export default function ProcessingTenderLotTab(props: {
  userId: string | null;
  tenderPackage: TenderPackage;
  type: "All" | "Watching" | "Closed";
  filter: {
    items: string[];
    grades: string[];
    lockConditions: string[];
  };
}) {
  const { userId, tenderPackage, type, filter } = props;
  const t = useTranslations("TenderLot");
  const locale = window.location.pathname.split("/")[1];
  
  const [page, setPage] = React.useState(1);

  const renderCell = React.useCallback((tenderLot: any, columnKey: any) => {
    const cellValue = tenderLot[columnKey as keyof TenderLot];
    switch (columnKey) {
      case "title":
        return (
          <Link
            href={`/${locale}/tender-lot?id=${tenderLot.id}`}
            className="font-semibold"
          >
            {tenderLot.title}
          </Link>
        );
      case "grade":
        return <p>{tenderLot.grade}</p>;
      case "closeTime":
        return (
          <CountDown targetTime={tenderLot.closeTime} endText={t("closed")} />
        );
      case "actions":
        return (
          <section className="flex gap-1 justify-end">
            <Input
              className="w-[180px]"
              placeholder={
                tenderLot.bidType == BidType.SEALED
                  ? t("actions.bid.placeholder")
                  : tenderLot.askingMinBidPrice
              }
              startContent={
                <div className="pointer-events-none flex items-center">
                  <span className="text-default-400 text-small">$</span>
                </div>
              }
            />
            <Button color="primary">{t("actions.bid.label")}</Button>
          </section>
        );
      default:
        return cellValue;
    }
  }, []);

  const {
    data,
    total,
    pages,
    refreshing,
    loadingMore,
    handleRefresh,
    loadMore,
    initialLoader,
  } = usePagination(queryTenderLot, {
    tenderPackageId: tenderPackage.id,
    ...filter,
    status:
      type == "Closed" ? TenderLotStatus.CLOSED : TenderLotStatus.PROCESSING,
  });

  const loadingState = loadingMore ? "loading" : "idle";

  const columns = [
    { key: "title", label: t("title") },
    { key: "grade", label: t("grade") },
    { key: "quantity", label: t("quantity") },
    { key: "lockCondition", label: t("lock-condition") },
  ];

  if (tenderPackage.status === TenderPackageStatus.PROCESSING) {
    columns.push({ key: "closeTime", label: t("close-time") });
    if (tenderPackage.bidType === BidType.SEALED) {
      columns.push({ key: "currentPrice", label: t("current-price") });
    }
    if (userId) {
      columns.push({ key: "bidPrice", label: t("bid-price") });
      columns.push({ key: "actions", label: t("actions.label") });
    }
  }
  if (tenderPackage.status === TenderPackageStatus.CLOSED) {
    if (userId) {
      columns.push({ key: "bidPrice", label: t("bid-price") });
      columns.push({ key: "bidStatus", label: t("bid-status") });
      columns.push({ key: "actions", label: t("actions.label") });
    }
  }

  return (
    <Table
      aria-label="Example table with client side pagination"
      topContent={
        <div>
          {tenderPackage.filter && (
            <Select>
              {tenderPackage.filter.grades.map((grade) => (
                <SelectItem key={grade} textValue={grade}>
                  {grade}
                </SelectItem>
              ))}
            </Select>
          )}
          {pages > 1 && (
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
          )}
        </div>
      }
    >
      <TableHeader>
        {columns.map((column, index) => (
          <TableColumn
            key={column.key}
            align={index === columns.length - 1 ? "end" : "start"}
          >
            {column.label}
          </TableColumn>
        ))}
      </TableHeader>
      <TableBody
        items={data}
        loadingContent={<Spinner />}
        loadingState={loadingState}
        emptyContent={
          <p className="font-extralight text-center py-4">
            {t("no-tender-lots")}
          </p>
        }
      >
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
