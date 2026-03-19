import { StatusState } from "../types";

type StatusBannerProps = {
  status: StatusState;
};

function StatusBanner({ status }: StatusBannerProps) {
  if (!status.message) {
    return null;
  }

  return (
    <p className={`status-banner ${status.kind}`} role="status" aria-live="polite">
      {status.message}
    </p>
  );
}

export default StatusBanner;
