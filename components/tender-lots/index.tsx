"use client";
import React from "react";
import {
  Alert,
  Chip,
  Select,
  SelectItem,
  Spinner,
  Tab,
  Tabs,
} from "@heroui/react";
import { useTranslations } from "next-intl";
import {
  formatMoneyNumber,
  getTenderPackage,
  TenderPackage,
  TenderPackageStatus,
  User,
} from "@bidpro-frontend/shared";
import ProcessingTenderLotTab from "./ProcessingTenderLotTab";
import ClosedTenderLotTab from "./ClosedTenderLotTab";

export default function TenderLotsComponent(props: {
  tenderPackageId: string;
}) {
  const { tenderPackageId } = props;
  const t = useTranslations("TenderLot");
  const tCurrency = useTranslations("Currency");
  const [selected, setSelected] = React.useState("All");

  const [loading, setLoading] = React.useState(false);
  const [tenderPackage, setTenderPackage] =
    React.useState<TenderPackage | null>(null);
  const [user, setUser] = React.useState<User | null>(null);

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
      setUser(user);
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
      {!user && <Alert hideIconWrapper title={t("alerts.login-required")} />}
      {user && (
        <div className="flex w-full p-4 bg-gray-100 rounded-lg my-4">
          <p className="flex-1 text-primary">
            {t("alerts.available-quota")}:{" "}
            {formatMoneyNumber(user.quota.available)}
          </p>
          <p className="text-primary">
            {t("alerts.currency")}: {tCurrency(user.currency)}
          </p>
        </div>
      )}
      {tenderPackage.filter && (
        <>
          {tenderPackage.filter && (
            <div className="flex flex-col rounded-lg py-4 px-1 mb-4">
              <div className="flex flex-wrap items-center gap-2">
                <p className="flex-1 font-medium">{t("actions.filter")}</p>
                {tenderPackage.filter.items &&
                  tenderPackage.filter.items.length > 0 && (
                    <Select
                      className="w-[240px]"
                      size="sm"
                      label={t("model")}
                      selectedKeys={filter.items}
                      onChange={(e) => {
                        if (e.target.value) {
                          setFilter({
                            ...filter,
                            items: e.target.value.split(","),
                          });
                        } else {
                          setFilter({ ...filter, items: [] });
                        }
                      }}
                      selectionMode="multiple"
                    >
                      {tenderPackage.filter.items.map((item) => (
                        <SelectItem key={item} textValue={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </Select>
                  )}
                {tenderPackage.filter.grades &&
                  tenderPackage.filter.grades.length > 0 && (
                    <Select
                      className="w-[240px]"
                      size="sm"
                      label={t("grade")}
                      selectedKeys={filter.grades}
                      onChange={(e) => {
                        if (e.target.value) {
                          setFilter({
                            ...filter,
                            grades: e.target.value.split(","),
                          });
                        } else {
                          setFilter({ ...filter, grades: [] });
                        }
                      }}
                      selectionMode="multiple"
                    >
                      {tenderPackage.filter.grades.map((grade) => (
                        <SelectItem key={grade} textValue={grade}>
                          {grade}
                        </SelectItem>
                      ))}
                    </Select>
                  )}
                {tenderPackage.filter.lockConditions &&
                  tenderPackage.filter.lockConditions.length > 0 && (
                    <Select
                      className="w-[240px]"
                      size="sm"
                      label={t("lock-condition")}
                      selectedKeys={filter.lockConditions}
                      onChange={(e) => {
                        if (e.target.value) {
                          setFilter({
                            ...filter,
                            lockConditions: e.target.value.split(","),
                          });
                        } else {
                          setFilter({ ...filter, lockConditions: [] });
                        }
                      }}
                    >
                      {tenderPackage.filter.lockConditions.map(
                        (lockCondition) => (
                          <SelectItem
                            key={lockCondition}
                            textValue={lockCondition}
                          >
                            {lockCondition}
                          </SelectItem>
                        )
                      )}
                    </Select>
                  )}
              </div>
              {(filter.items.length > 0 ||
                filter.grades.length > 0 ||
                filter.lockConditions.length > 0) && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {filter.items.length > 0 && (
                    <Chip
                      radius="sm"
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
              )}
            </div>
          )}
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
                userId={user?.id}
                tenderPackage={tenderPackage}
                type="All"
                filter={filter}
              />
            </Tab>
            {user && (
              <Tab className="flex-1" key="Watching" title={t("watching")}>
                <ProcessingTenderLotTab
                  userId={user.id}
                  tenderPackage={tenderPackage}
                  type="Watching"
                  filter={filter}
                />
              </Tab>
            )}
            <Tab className="flex-1" key="Closed" title={t("closed")}>
              <ProcessingTenderLotTab
                userId={user?.id}
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
                userId={user?.id}
                tenderPackage={tenderPackage}
                type="Closed"
                filter={filter}
              />
            </Tab>
            <Tab className="flex-1" key="Lost" title={t("lost")}>
              <ClosedTenderLotTab
                userId={user?.id}
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
