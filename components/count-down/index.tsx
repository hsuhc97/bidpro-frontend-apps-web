import React from "react";

export type CountDownProps = {
  targetTime: number;
  onEnd?: () => void;
  endText?: string;
};

const formatTime = (seconds: number): string => {
  if (seconds <= 0) return "00:00:00";

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
};

export default function CountDown(props: CountDownProps) {
  const { targetTime, onEnd, endText } = props;
  const [remainingSeconds, setRemainingSeconds] = React.useState(
    targetTime - Date.now() / 1000
  );

  React.useEffect(() => {
    if (targetTime - Date.now() / 1000 <= 0) {
      onEnd?.();
      return;
    }

    const update = () => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onEnd?.();
          return -1;
        }
        return targetTime - Date.now() / 1000;
      });
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [targetTime]);

  return (
    <p
      className={
        remainingSeconds > 0
          ? remainingSeconds <= 10 * 60
            ? "text-red-500"
            : ""
          : ""
      }
    >
      {remainingSeconds > 0 ? formatTime(remainingSeconds) : endText}
    </p>
  );
}
