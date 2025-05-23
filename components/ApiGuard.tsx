"use client";
import React from "react";
import { ApiClient, getUser } from "@bidpro-frontend/shared";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Spinner } from "@heroui/react";

export default function ApiGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [inited, setInited] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    if (!inited) {
      init();
      setInited(true);
    }
    const userData = localStorage.getItem("user");
    if (!userData) {
      loadUser();
    }
  }, [pathname]);

  const loadUser = async () => {
    setLoading(true);
    try {
      const user = await getUser();
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      }
    } finally {
      setLoading(false);
    }
  };

  const init = async () => {
    const baseURL =
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:9999/";
    const token = localStorage.getItem("token");
    ApiClient.getInstance({
      baseURL: baseURL,
      token: token || undefined,
      onUnauthorized: () => {
        const locale = window.location.pathname.split("/")[1];
        router.replace(`/${locale}/login`);
      },
      onRedirect: (url) => {
        if (url == "/(onboarding)/agreement") {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          url = "/login";
        }
        if (url == "/(onboarding)/profile") {
          url = "/profile";
        }
        const locale = window.location.pathname.split("/")[1];
        router.replace(`/${locale}${url}`);
      },
    });
  };

  if (!inited) {
    return null;
  }

  if (loading) {
    return <Spinner />;
  }

  return <>{children}</>;
}
