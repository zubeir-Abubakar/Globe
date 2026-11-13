import { ImageResponse } from "next/og";

export const alt = "Globe Harvest — premium fresh produce import and export";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "linear-gradient(135deg, #17402f 0%, #0d271d 100%)",
          color: "#faf7ef",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div
            style={{
              width: 82,
              height: 82,
              borderRadius: 999,
              border: "2px solid #c08a3e",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 40,
              color: "#c08a3e",
            }}
          >
            GH
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 34, letterSpacing: 8 }}>GLOBE HARVEST</span>
            <span
              style={{
                fontFamily: "Helvetica, Arial, sans-serif",
                fontSize: 17,
                letterSpacing: 4,
                color: "#c9d6b8",
                marginTop: 8,
              }}
            >
              FRESH PRODUCE TRADING
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 76, lineHeight: 1.05, maxWidth: 920 }}>
            Premium fresh produce.
            <br />
            Sourced with precision.
          </span>
          <div
            style={{
              width: 220,
              height: 3,
              background: "#c08a3e",
              marginTop: 34,
              marginBottom: 26,
            }}
          />
          <span
            style={{
              fontFamily: "Helvetica, Arial, sans-serif",
              fontSize: 24,
              color: "#d9e3d0",
            }}
          >
            Import · Export · Wholesale
          </span>
        </div>
      </div>
    ),
    size,
  );
}
