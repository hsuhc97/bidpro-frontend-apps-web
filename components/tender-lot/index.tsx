"use client";
import {
  BidType,
  getTenderLot,
  getTenderPackage,
  TenderLot,
} from "@bidpro-frontend/shared";
import React from "react";
import { useTranslations } from "next-intl";
import { Button, Input, Spinner } from "@heroui/react";
import TenderLotItemTable from "./TenderLotItemTable";

export default function TenderLotComponent(props: { tenderLotId: string }) {
  const { tenderLotId } = props;
  const t = useTranslations("TenderLot");

  const [loading, setLoading] = React.useState(false);
  const [tenderLot, setTenderLot] = React.useState<TenderLot | null>(null);
  const [userId, setUserId] = React.useState<string | null>(null);

  React.useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setUserId(user.id);
    }

    const fetchTenderLot = async () => {
      try {
        setLoading(true);
        const tenderLot = await getTenderLot(tenderLotId);
        setTenderLot(tenderLot);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchTenderLot();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  if (!tenderLot) {
    return <p>Error</p>;
  }

  return (
    <div className="flex flex-col gap-4 mx-auto max-w-3xl">
      <section className="flex flex-col gap-2">
        <p className="text-2xl font-bold">{tenderLot?.title}</p>
      </section>
      <section className="flex flex-col gap-2">
        <p>
          {t("quantity")}: {tenderLot?.quantity}
        </p>
        <p>
          {t("grade")}: {tenderLot?.grade}
        </p>
        <p>
          {t("lock-condition")}: {tenderLot?.lockCondition}
        </p>
      </section>
      <section className="flex gap-2">
        <Input
          className="w-[180px]"
          placeholder={
            tenderLot.bidType == BidType.SEALED
              ? t("actions.bid.placeholder")
              : tenderLot.askingMinBidPrice?.toString()
          }
          startContent={
            <div className="pointer-events-none flex items-center">
              <span className="text-default-400 text-small">$</span>
            </div>
          }
        />
        <Button color="primary">{t("actions.bid.label")}</Button>
      </section>
      <section className="flex flex-col gap-2">
        <TenderLotItemTable tenderLotId={tenderLotId} />
      </section>
    </div>
  );
}
