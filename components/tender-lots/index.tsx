"use client";
import React from "react";
import { Spinner, Tab, Tabs } from "@heroui/react";
import { useTranslations } from "next-intl";
import {
  getTenderPackage,
  TenderPackage,
  TenderPackageStatus,
} from "@bidpro-frontend/shared";
import ProcessingTenderLotTab from "./ProcessingTenderLotTab";
import ClosedTenderLotTab from "./ClosedTenderLotTab";

export default function TenderLotsComponent(props: {
  tenderPackageId: string;
}) {
  const { tenderPackageId } = props;
  const t = useTranslations("TenderLot");
  const [selected, setSelected] = React.useState("All");

  const [loading, setLoading] = React.useState(false);
  const [tenderPackage, setTenderPackage] =
    React.useState<TenderPackage | null>(null);
  const [userId, setUserId] = React.useState<string | null>(null);

  React.useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setUserId(user.id);
    }

    const fetchTenderPackage = async () => {
      try {
        setLoading(true);
        const tenderPackage = await getTenderPackage(tenderPackageId);
        setTenderPackage(tenderPackage);
        if (tenderPackage.status === TenderPackageStatus.CLOSED) {
          setSelected("Won");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchTenderPackage();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  if (tenderPackage === null) {
    return <p>Error</p>;
  }

  return (
    <div className="mx-auto max-w-7xl">
      <Tabs
        aria-label="Options"
        isVertical
        selectedKey={selected}
        onSelectionChange={(key) => setSelected(key as string)}
      >
        {tenderPackage.status === TenderPackageStatus.PROCESSING && (
          <>
            <Tab className="flex-1" key="All" title={t("all")}>
              <ProcessingTenderLotTab
                userId={userId}
                tenderPackage={tenderPackage}
                type="All"
              />
            </Tab>
            {userId && (
              <Tab className="flex-1" key="Watching" title={t("watching")}>
                <ProcessingTenderLotTab
                  userId={userId}
                  tenderPackage={tenderPackage}
                  type="Watching"
                />
              </Tab>
            )}
            <Tab className="flex-1" key="Closed" title={t("closed")}>
              <ProcessingTenderLotTab
                userId={userId}
                tenderPackage={tenderPackage}
                type="Closed"
              />
            </Tab>
          </>
        )}
        {tenderPackage.status === TenderPackageStatus.CLOSED && (
          <>
            <Tab className="flex-1" key="Won" title={t("won")}>
              <ClosedTenderLotTab
                userId={userId}
                tenderPackage={tenderPackage}
                type="Closed"
              />
            </Tab>
            <Tab className="flex-1" key="Lost" title={t("lost")}>
              <ClosedTenderLotTab
                userId={userId}
                tenderPackage={tenderPackage}
                type="Closed"
              />
            </Tab>
          </>
        )}
      </Tabs>
    </div>
  );
}
