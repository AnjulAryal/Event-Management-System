export default function BrandLogo({
  className = "",
  eventClassName = "",
  ifyClassName = "",
  size = "24px",
}) {
  return (
    <span
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "baseline",
        gap: "0.18em",
        fontSize: size,
        fontWeight: 800,
        letterSpacing: "-0.04em",
        lineHeight: 1,
      }}
      aria-label="Eventify"
    >
      <span className={eventClassName} style={{ color: "#5CB85C" }}>
        EVENT
      </span>
      <span className={ifyClassName} style={{ color: "#111827" }}>
        IFY
      </span>
    </span>
  );
}
