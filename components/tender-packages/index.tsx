"use client";
import React from "react";
import { Tab, Tabs } from "@heroui/react";
import { useTranslations } from "next-intl";
import TenderPackageTab from "./TenderPackageTab";

export default function TenderPackagesComponent(props: { tenderId: string }) {
  const { tenderId } = props;
  const t = useTranslations("TenderPackage");
  const [selected, setSelected] = React.useState("Processing");

  return (
    <div className="mx-auto max-w-3xl">
      <Tabs
        aria-label="Options"
        isVertical
        selectedKey={selected}
        onSelectionChange={(key) => setSelected(key as string)}
      >
        <Tab className="flex-1" key="Processing" title={t("processing")}>
          <TenderPackageTab tenderId={tenderId} status="Processing" />
        </Tab>
        <Tab className="flex-1" key="Closed" title={t("closed")}>
          <TenderPackageTab tenderId={tenderId} status="Closed" />
        </Tab>
      </Tabs>
    </div>
  );
}
