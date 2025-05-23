"use client";
import React from "react";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Chip,
  Divider,
  Select,
  SelectItem,
  Spinner,
  Tab,
  Tabs,
} from "@heroui/react";
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

  const [filter, setFilter] = React.useState<{
    items: string[];
    grades: string[];
    lockConditions: string[];
  }>({
    items: [],
    grades: [],
    lockConditions: [],
  });

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
      {tenderPackage.filter && (
        <>
          <div className="flex flex-wrap items-center gap-2">
            <p className="flex-1 font-medium">{t("actions.filter")}</p>
            <Select
              className="w-[240px]"
              size="sm"
              label={t("model")}
              selectedKeys={filter.items}
              onChange={(e) => {
                setFilter({ ...filter, items: e.target.value.split(",") });
              }}
              selectionMode="multiple"
            >
              {tenderPackage.filter.items.map((item) => (
                <SelectItem key={item} textValue={item}>
                  {item}
                </SelectItem>
              ))}
            </Select>
            <Select
              className="w-[240px]"
              size="sm"
              label={t("grade")}
              selectedKeys={filter.grades}
              onChange={(e) => {
                setFilter({ ...filter, grades: e.target.value.split(",") });
              }}
              selectionMode="multiple"
            >
              {tenderPackage.filter.grades.map((grade) => (
                <SelectItem key={grade} textValue={grade}>
                  {grade}
                </SelectItem>
              ))}
            </Select>
            <Select
              className="w-[240px]"
              size="sm"
              label={t("lock-condition")}
              selectedKeys={filter.lockConditions}
              onChange={(e) => {
                setFilter({
                  ...filter,
                  lockConditions: e.target.value.split(","),
                });
              }}
            >
              {tenderPackage.filter.lockConditions.map((lockCondition) => (
                <SelectItem key={lockCondition} textValue={lockCondition}>
                  {lockCondition}
                </SelectItem>
              ))}
            </Select>
          </div>
          <div className="flex flex-wrap gap-1 my-4">
            {filter.items.length > 0 && (
              <Chip
                variant="flat"
                onClose={() => {
                  setFilter({ ...filter, items: [] });
                }}
              >
                {filter.items.map((item) => item).join(", ")}
              </Chip>
            )}
            {filter.grades.length > 0 && (
              <Chip
                variant="flat"
                onClose={() => {
                  setFilter({ ...filter, grades: [] });
                }}
              >
                {filter.grades.map((grade) => grade).join(", ")}
              </Chip>
            )}
            {filter.lockConditions.length > 0 && (
              <Chip
                variant="flat"
                onClose={() => {
                  setFilter({ ...filter, lockConditions: [] });
                }}
              >
                {filter.lockConditions
                  .map((lockCondition) => lockCondition)
                  .join(", ")}
              </Chip>
            )}
          </div>
          <Divider className="my-4" />
        </>
      )}
      <Tabs
        aria-label="Options"
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
                filter={filter}
              />
            </Tab>
            {userId && (
              <Tab className="flex-1" key="Watching" title={t("watching")}>
                <ProcessingTenderLotTab
                  userId={userId}
                  tenderPackage={tenderPackage}
                  type="Watching"
                  filter={filter}
                />
              </Tab>
            )}
            <Tab className="flex-1" key="Closed" title={t("closed")}>
              <ProcessingTenderLotTab
                userId={userId}
                tenderPackage={tenderPackage}
                type="Closed"
                filter={filter}
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
                filter={filter}
              />
            </Tab>
            <Tab className="flex-1" key="Lost" title={t("lost")}>
              <ClosedTenderLotTab
                userId={userId}
                tenderPackage={tenderPackage}
                type="Closed"
                filter={filter}
              />
            </Tab>
          </>
        )}
      </Tabs>
    </div>
  );
}
