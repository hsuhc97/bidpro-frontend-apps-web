"use client";
import React from "react";
import { Input } from "@heroui/input";
import {
  addToast,
  Button,
  Checkbox,
  InputOtp,
  Select,
  SelectItem,
} from "@heroui/react";
import { sendVerificationCode } from "@bidpro-frontend/shared/src/api/services/sms/sms.service";

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

export default function LoginPage() {
  const [regionCode, setRegionCode] = React.useState("86");
  const [mobileNo, setMobileNo] = React.useState("");
  const [otp, setOtp] = React.useState("");
  const [checked, setChecked] = React.useState(false);

  const [loading, setLoading] = React.useState(false);
  const [otpSent, setOtpSent] = React.useState(false);

  const sendOtp = async () => {
    try {
      if (!regionCode || !mobileNo) {
        addToast({
          title: "Toast title",
          description: "Toast displayed successfully",
        });
        return;
      }
      setLoading(true);
      await sendVerificationCode({
        regionCode: regionCode,
        phoneNumber: mobileNo,
      } as SmsSendVerificationCodeRequest);
      addToast({
        title: "Toast title",
        description: "Toast displayed successfully",
      });
      setOtpSent(true);
    } catch (error) {
      addToast({
        title: "Toast title",
        description: "Toast displayed successfully",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col max-w-[500px] mx-auto">
      <section className="flex flex-col my-4 gap-2">
        <section className="flex flex-col">
          <span className="text-3xl text-primary font-bold">
            Welcome to Orient AI
          </span>
          <span className="text-sm text-gray-500">
            Please enter your mobile number and sms code you received to login.
          </span>
        </section>
        <section className="flex flex-col gap-2">
          <Select
            label="Region Code"
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
            label="Mobile Number"
            name="mobileNo"
            placeholder="Enter your mobile number"
            type="text"
          />
          <Checkbox
            isRequired
            classNames={{
              label: "text-small",
            }}
            name="terms"
            validationBehavior="aria"
          >
            I agree to the terms and conditions
          </Checkbox>
        </section>

        <Button
          className="my-2"
          color="primary"
          onPress={sendOtp}
          isLoading={loading}
        >
          确认
        </Button>
      </section>
    </div>
  );
}
