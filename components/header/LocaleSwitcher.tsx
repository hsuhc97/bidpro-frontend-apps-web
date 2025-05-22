"use client";

import {
  Locale,
  LOCALE_NAMES,
  routing,
  usePathname,
  useRouter,
} from "@/i18n/routing";
import { Select, SelectItem } from "@heroui/react";
import { useLocale } from "next-intl";
import { useParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

export default function LocaleSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const locale = useLocale();
  const [, startTransition] = useTransition();
  const [currentLocale, setCurrentLocale] = useState("locale");

  useEffect(() => {
    setCurrentLocale(locale);
  }, [locale, setCurrentLocale]);

  function onSelectChange(nextLocale: Locale) {
    setCurrentLocale(nextLocale);

    startTransition(() => {
      router.replace(
        // @ts-expect-error -- TypeScript will validate that only known `params`
        // are used in combination with a given `pathname`. Since the two will
        // always match for the current route, we can skip runtime checks.
        // { pathname: "/", params: params || {} }, // if your want to redirect to the home page
        { pathname, params: params || {} }, // if your want to redirect to the current page
        { locale: nextLocale }
      );
    });
  }

  return (
    <Select
      className="w-[120px]"
      defaultSelectedKeys={[locale]}
      onChange={(e) => onSelectChange(e.target.value)}
    >
      {routing.locales.map((cur) => (
        <SelectItem key={cur} textValue={LOCALE_NAMES[cur]}>
          {LOCALE_NAMES[cur]}
        </SelectItem>
      ))}
    </Select>
  );
}
