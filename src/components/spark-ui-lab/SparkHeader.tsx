interface Props {
  appName: string;
  appId: string;
  user: string;
  status: string;
  duration: string;
}

export default function SparkHeader({ appName, appId, user, status, duration }: Props) {
  const statusColor =
    status === "FAILED" ? "var(--spark-status-failed)" :
    status === "RUNNING" ? "var(--spark-status-running)" :
    "var(--spark-status-success)";

  return (
    <div style={{ background: "var(--spark-header-bg)", color: "var(--spark-header-text)", padding: "12px 20px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
        {/* Spark Logo */}
        <svg width="32" height="32" viewBox="0 0 24 24" fill="#e25a1c">
          <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm0 3l2.5 5.5L20 11l-5.5 2.5L12 19l-2.5-5.5L4 11l5.5-2.5L12 3z"/>
        </svg>
        <div>
          <div style={{ fontSize: "16px", fontWeight: 700 }}>{appName}</div>
          <div style={{ fontSize: "11px", color: "var(--spark-header-subtext)" }}>
            Application: {appId} &middot; User: {user} &middot; Started: 2026-05-28
          </div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "11px", color: "var(--spark-header-subtext)" }}>Status</div>
            <div style={{ fontWeight: 700, color: statusColor }}>{status === "FAILED" ? "FAILED" : "COMPLETED"}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "11px", color: "var(--spark-header-subtext)" }}>Duration</div>
            <div style={{ fontWeight: 600 }}>{duration}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
