"use client";

import LocaleSwitcher from "@/components/header/LocaleSwitcher";
import { ApiClient } from "@bidpro-frontend/shared";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
// import { ThemeToggle } from "@/components/ThemeToggle";

const Header = () => {
  const pathname = usePathname();
  const isLogin = pathname.includes("login");
  const router = useRouter();
  useEffect(() => {
    console.log("Header", process.env.NEXT_PUBLIC_BASE_URL);
    ApiClient.getInstance({
      baseURL: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:9999/",
      onUnauthorized: () => {
        const locale = window.location.pathname.split("/")[1];
        router.replace(`/${locale}/login`);
      },
      onRedirect: (url) => {
        const locale = window.location.pathname.split("/")[1];
        router.replace(`/${locale}${url}`);
      },
    });
  }, []);

  return (
    <header className="py-4">
      <div className="mx-auto px-2 sm:px-4 lg:px-12">
        <nav className="relative z-50 flex justify-between">
          <div className="flex items-center gap-x-2 md:gap-x-4 lg:gap-x-6 flex-1 justify-end">
            {/* PC */}
            <div className="hidden md:flex items-center gap-x-4">
              <LocaleSwitcher />
              {/* <ThemeToggle /> */}
            </div>

            {/* Mobile */}
            {/* <MobileMenu /> */}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
