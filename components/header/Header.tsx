"use client";
import React from "react";
import LocaleSwitcher from "@/components/header/LocaleSwitcher";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/navbar";
import { useTranslations } from "next-intl";
import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import { usePathname, useRouter } from "next/navigation";
import { ApiClient } from "@bidpro-frontend/shared";

// import { ThemeToggle } from "@/components/ThemeToggle";

const Header = () => {
  const t = useTranslations("Header");
  const router = useRouter();
  const pathname = usePathname();

  const [userId, setUserId] = React.useState<string | null>(null);

  React.useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setUserId(user.id);
    } else {
      setUserId(null);
    }
  }, [pathname]);

  const onLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    ApiClient.getInstance().setToken("");
    const locale = window.location.pathname.split("/")[1];
    router.replace(`/${locale}/login`);
  }

  return (
    <Navbar isBordered>
      <NavbarBrand>
        <p className="font-bold text-xl">{process.env.NEXT_PUBLIC_APP_NAME}</p>
      </NavbarBrand>
      {/* {!isLogin && (
        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          <NavbarItem isActive>
            <Link color="foreground" href="#">
              {t("tender")}
            </Link>
          </NavbarItem>
        </NavbarContent>
      )} */}
      <NavbarContent justify="end">
        <NavbarItem>
          <LocaleSwitcher />
        </NavbarItem>
        {!userId && !pathname.includes("/login") && (
          <NavbarItem>
            <Button color="primary" variant="ghost" onPress={() => {
              const locale = window.location.pathname.split("/")[1];
              router.push(`/${locale}/login`);
            }}>
              {t("log-in")}
            </Button>
          </NavbarItem>
        )}
        {userId && (
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform"
                color="secondary"
                name="Jason Hughes"
                size="sm"
                src="https://bidpro.oss-cn-shenzhen.aliyuncs.com/static/images/avatar-placeholder.png"
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem key="settings">{t("settings")}</DropdownItem>
              <DropdownItem key="logout" color="danger" onPress={onLogout}>
                {t("log-out")}
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        )}
      </NavbarContent>
    </Navbar>
  );
};

export default Header;
