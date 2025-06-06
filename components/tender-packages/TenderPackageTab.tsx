"use client";
import React from "react";
import { queryTenderPackage, TenderPackage } from "@bidpro-frontend/shared";
import usePagination from "@/hooks/usePagination";
import TenderPackageCard from "./TenderPackageCard";
import { Spinner, Tabs, Tab } from "@heroui/react";
import { useTranslations } from "next-intl";

export default function TenderPackageTab(props: { tenderId: string, status: string }) {
  const { tenderId, status } = props;
  const t = useTranslations("TenderPackage");
  const {
    data,
    total,
    pages,
    loading
  } = usePagination(queryTenderPackage, 1, {
    tenderId: tenderId,
    status: status,
  });

    if (loading) {
      return <Spinner />;
    }

  if (data.length === 0) {
    return (
      <p className="font-light text-center py-4">{t("no-tender-packages")}</p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {data.map((tenderPackage) => (
        <TenderPackageCard key={tenderPackage.id} {...tenderPackage} />
      ))}
    </div>
  );
}
