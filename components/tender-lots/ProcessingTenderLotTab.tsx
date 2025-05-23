"use client";
import React from "react";
import {
  BidType,
  queryTenderLot,
  TenderLot,
  TenderLotStatus,
  TenderPackage,
  bidTenderLot,
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
  Link,
  useDisclosure,
} from "@heroui/react";
import { Input } from "@heroui/input";
import CountDown from "../count-down";
import TenderLotBidModal from "./TenderLotBidModal";

export default function ProcessingTenderLotTab(props: {
  userId: string | undefined;
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

  const [tenderLot, setTenderLot] = React.useState<TenderLot | null>(null);
  const bidPricesRef = React.useRef<Record<string, string>>({});

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

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
          <div className="flex gap-1 justify-end">
            <Input
              className="w-[180px]"
              placeholder={
                tenderLot.bidType == BidType.SEALED
                  ? t("actions.bid.placeholder")
                  : tenderLot.askingMinBidPrice
              }
              value={bidPricesRef.current[tenderLot.id]}
              onValueChange={(value) => {
                bidPricesRef.current[tenderLot.id] = value;
              }}
              startContent={
                <div className="pointer-events-none flex items-center">
                  <span className="text-default-400 text-small">$</span>
                </div>
              }
            />
            <Button
              color="primary"
              onPress={() => {
                const price = bidPricesRef.current[tenderLot.id];
                if (!price) {
                  return;
                }
                setTenderLot(tenderLot);
                onOpen();
              }}
            >
              {t("actions.bid.label")}
            </Button>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  const [pageNum, setPageNum] = React.useState(1);

  const { data, pages, loading } = usePagination(queryTenderLot, pageNum, {
    packageId: tenderPackage.id,
    ...(type == "Watching" && { isWatching: true }),
    ...filter,
    status:
      type == "Closed" ? TenderLotStatus.CLOSED : TenderLotStatus.PROCESSING,
  });

  const loadingState = loading ? "loading" : "idle";

  const columns = [
    { key: "title", label: t("title") },
    { key: "grade", label: t("grade") },
    { key: "quantity", label: t("quantity") },
    { key: "lockCondition", label: t("lock-condition") },
  ];

  if (type != "Closed") {
    columns.push({ key: "closeTime", label: t("close-time") });
    if (tenderPackage.bidType === BidType.OPEN) {
      columns.push({ key: "currentPrice", label: t("current-price") });
    }
    if (userId) {
      columns.push({ key: "bidPrice", label: t("bid-price") });
      columns.push({ key: "actions", label: t("actions.label") });
    }
  }
  if (type == "Closed") {
    if (userId) {
      columns.push({ key: "bidPrice", label: t("bid-price") });
      columns.push({ key: "bidStatus", label: t("bid-status") });
    }
  }

  return (
    <>
      <Table
        shadow="none"
        className="border-1 rounded-lg my-1"
        aria-label="Example table with client side pagination"
        topContent={
          <>
            {pages > 1 && (
              <div className="flex w-full justify-end">
                <Pagination
                  isCompact
                  showControls
                  showShadow
                  page={pageNum}
                  total={pages}
                  onChange={(page) => setPageNum(page)}
                />
              </div>
            )}
          </>
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
            <p className="font-light text-center py-4">{t("no-tender-lots")}</p>
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
      <TenderLotBidModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        tenderLot={tenderLot}
        price={bidPricesRef.current[tenderLot?.id ?? ""]}
      />
    </>
  );
}
