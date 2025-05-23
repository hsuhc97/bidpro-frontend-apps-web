"use client";

import React from "react";
import { useTranslations } from "next-intl";
import {
  addToast,
  Button,
  Input,
  InputOtp,
  Select,
  SelectItem,
} from "@heroui/react";
import { ApiClient, AuthType, login, sendOTP } from "@bidpro-frontend/shared";
import { useRouter } from "next/navigation";

interface RegionCode {
  code: string;
  country: string;
}

const RegionCodes: RegionCode[] = [
  { code: "86", country: "CN" },
  { code: "852", country: "HK" },
  { code: "853", country: "MC" },
  { code: "84", country: "VN" },
  { code: "60", country: "MY" },
  { code: "63", country: "PH" },
  { code: "65", country: "SG" },
  { code: "66", country: "TH" },
  { code: "81", country: "JP" },
  { code: "82", country: "KR" },
  { code: "1", country: "US" },
  { code: "44", country: "UK" },
  { code: "33", country: "FR" },
  { code: "966", country: "SA" },
  { code: "971", country: "AE" },
];

export default function LoginComponent() {
  const t = useTranslations("LoginComponent");
  const router = useRouter();

  const [regionCode, setRegionCode] = React.useState("86");
  const [mobileNo, setMobileNo] = React.useState("");
  const [otp, setOtp] = React.useState("");

  const [loading, setLoading] = React.useState(false);
  const [otpSent, setOtpSent] = React.useState(false);

  React.useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      ApiClient.getInstance().setToken(token);
      const locale = window.location.pathname.split("/")[1];
      router.replace(`/${locale}/`);
    }
  }, []);

  const onSendOtp = async () => {
    try {
      if (!mobileNo) {
        addToast({
          title: t("message.empty-mobileNo"),
          hideIcon: true,
        });
        return;
      }
      if (!regionCode) {
        addToast({
          title: t("message.empty-regionCode"),
          hideIcon: true,
        });
        return;
      }
      setLoading(true);
      await sendOTP({
        mobileNo: `+${regionCode}-${mobileNo}`,
      });
      setOtpSent(true);
      addToast({
        title: t("message.send-otp-success"),
        color: "success",
        hideIcon: true,
      });
    } catch (err) {
      addToast({
        title: (err as Error).message,
        hideIcon: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async () => {
    if (!otp) {
      addToast({
        title: t("message.empty-otp"),
        hideIcon: true,
      });
      return;
    }
    try {
      setLoading(true);
      const result = await login({
        type: AuthType.SMS_OTP,
        identifier: `+${regionCode}-${mobileNo}`,
        credential: otp,
        config: JSON.stringify({}),
      });
      localStorage.setItem("token", result.token);
      ApiClient.getInstance().setToken(result.token);
      const locale = window.location.pathname.split("/")[1];
      router.replace(`/${locale}/`);
      addToast({
        title: t("message.login-success"),
        color: "success",
        hideIcon: true,
      });
    } catch (err) {
      addToast({
        title: (err as Error).message,
        hideIcon: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col max-w-[400px] mx-auto">
      <section className="flex flex-col my-4 gap-2">
        <section className="flex flex-col">
          <span className="text-3xl text-primary font-bold">{t("title")}{process.env.NEXT_PUBLIC_APP_NAME}</span>
        </section>
        {!otpSent && (
          <section className="flex flex-col gap-2">
            <span className="text-sm text-gray-500">
              {t("mobileNo-instruction")}
            </span>
            <Select
              label={`${t("regionCode.label")}`}
              placeholder={`${t("regionCode.placeholder")}`}
              name="regionCode"
              defaultSelectedKeys={["86"]}
              onChange={(e) => setRegionCode(e.target.value)}
            >
              {RegionCodes.map((regionCode) => (
                <SelectItem
                  key={regionCode.code}
                  textValue={`+${regionCode.code}`}
                >
                  <div className="flex items-center justify-between">
                    <span>+{regionCode.code}</span>
                    <span>{regionCode.country}</span>
                  </div>
                </SelectItem>
              ))}
            </Select>
            <Input
              label={`${t("mobileNo.label")}`}
              name="mobileNo"
              placeholder={`${t("mobileNo.placeholder")}`}
              type="text"
              value={mobileNo}
              onValueChange={setMobileNo}
            />
            <Button color="primary" onPress={onSendOtp} isLoading={loading}>
              {t("button.confirm")}
            </Button>
          </section>
        )}
        {otpSent && (
          <section className="flex flex-col gap-2">
            <span className="text-sm text-gray-500">
              {t("otp-instruction")}
            </span>
            <InputOtp className="mx-auto" length={4} size="lg"  onValueChange={setOtp}/>
            <Button onPress={() => setOtpSent(false)}>
              {t("button.back")}
            </Button>
            <Button color="primary" onPress={onSubmit} isLoading={loading}>
              {t("button.confirm")}
            </Button>
          </section>
        )}
      </section>
    </div>
  );
}
