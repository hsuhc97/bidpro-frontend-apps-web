"use client";

import { TenderPackage } from "@bidpro-frontend/shared";
import { Card, CardBody, CardFooter, CardHeader, Divider } from "@heroui/react";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

export default function TenderPackageCard(tenderPackage: TenderPackage) {
  const t = useTranslations("TenderPackage");
  const router = useRouter();

  return (
    <Card
      className="border-[1px] border-gray-200"
      shadow="none"
      isPressable
      onPress={() => {
        const locale = window.location.pathname.split("/")[1];
        router.push(`/${locale}/tender-package?id=${tenderPackage.id}`);
      }}
    >
      <CardHeader>
        <div className="flex flex-col">
          <p className="font-medium">{tenderPackage.name}</p>
          <p className="font-light text-sm">{tenderPackage.description}</p>
        </div>
      </CardHeader>
      <Divider className="bg-gray-100" />
      <CardBody>
        <p className="font-light">
          {t("summary", {
            count: tenderPackage.numberOfLots,
            quantity: tenderPackage.quantity,
          })}
        </p>
      </CardBody>
      <Divider className="bg-gray-100" />
      <CardFooter>
        <p className="font-light">
          {dayjs(tenderPackage.closeTime * 1000).format("YYYY-MM-DD HH:mm")}
        </p>
      </CardFooter>
    </Card>
  );
}
