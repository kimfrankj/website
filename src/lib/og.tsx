import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };

/** One shared card design: warm stone, oversized serif, terracotta rule. */
export function ogImage({ title, kicker }: { title: string; kicker: string }) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#efe9df",
          color: "#1b1814",
          padding: 72,
        }}
      >
        <div style={{ fontSize: 26, letterSpacing: 4, textTransform: "uppercase", color: "#62594e", display: "flex" }}>
          {kicker}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ width: 120, height: 8, background: "#a8401f", marginBottom: 40 }} />
          <div style={{ fontSize: title.length > 40 ? 84 : 112, lineHeight: 1, letterSpacing: -3, fontFamily: "serif", display: "flex" }}>
            {title}
          </div>
        </div>
      </div>
    ),
    ogSize,
  );
}
