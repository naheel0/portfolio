import type { ArchitectureLayout, ArchitectureLevel, ArchitectureStack } from "@/lib/api";
import { iconMap, DefaultIcon } from "@/lib/icon-map";
import { techBrandColor, iconKeyBrandColor } from "@/lib/brand-colors";
import "./architecture.css";

const DEFAULT_ACCENT = "#58a6ff";

const NAMED_COLORS: Record<string, string> = {
  red: "#ef4444", blue: "#3b82f6", green: "#22c55e", yellow: "#eab308",
  orange: "#f97316", purple: "#a855f7", pink: "#ec4899", cyan: "#06b6d4",
  teal: "#14b8a6", lime: "#84cc16", amber: "#f59e0b", indigo: "#6366f1",
  violet: "#8b5cf6", fuchsia: "#d946ef", rose: "#f43f5e", sky: "#0ea5e9",
  emerald: "#10b981", slate: "#64748b", gray: "#6b7280",
};

function normalizeHex(hex: string): string {
  if (/^#[0-9a-f]{6}$/i.test(hex)) return hex;
  if (/^#[0-9a-f]{3}$/i.test(hex)) {
    return "#" + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
  }
  return DEFAULT_ACCENT;
}

function nodeColor(node: { title: string; icon?: string | null; color?: string | null }): string {
  if (node.color) {
    if (/^#[0-9a-f]{3,8}$/i.test(node.color)) return normalizeHex(node.color);
    const named = NAMED_COLORS[node.color.trim().toLowerCase()];
    if (named) return named;
  }
  const fromIcon = iconKeyBrandColor(node.icon);
  if (fromIcon) return fromIcon;
  const fromTitle = techBrandColor(node.title);
  if (fromTitle) return fromTitle;
  return DEFAULT_ACCENT;
}

const TIER_PALETTE = ["#58a6ff", "#a371f7", "#2f81f7", "#3fb950", "#e3b341", "#d29922", "#ec8e2c", "#db61a2"];

function tierColor(level: ArchitectureLevel, index: number): string {
  for (const node of level.nodes) {
    const c = nodeColor(node);
    if (c !== DEFAULT_ACCENT) return c;
  }
  return TIER_PALETTE[index % TIER_PALETTE.length];
}

function NodeBox({ node, index }: { node: { title: string; icon?: string | null; color?: string | null }; index: number }) {
  const color = nodeColor(node);
  const Icon = node.icon && iconMap[node.icon] ? iconMap[node.icon] : DefaultIcon;
  return (
    <div
      className="arch-node"
      style={
        {
          "--arch-delay": `${index * 55}ms`,
          borderColor: `${color}55`,
          background: `linear-gradient(160deg, ${color}16 0%, ${color}0a 55%, rgba(13,17,23,0) 100%)`,
          boxShadow: `0 10px 26px -18px ${color}`,
        } as React.CSSProperties
      }
    >
      <span className="arch-node-accent" style={{ backgroundColor: color }} aria-hidden="true" />
      <span
        className="arch-node-icon"
        style={{ backgroundColor: `${color}1c`, color, borderColor: `${color}33` }}
        aria-hidden="true"
      >
        <Icon />
      </span>
      <span className="arch-node-label">{node.title}</span>
    </div>
  );
}

function TierHead({ level, index, centered }: { level: ArchitectureLevel; index: number; centered?: boolean }) {
  const label = level.label?.trim() || `Layer ${index + 1}`;
  const color = tierColor(level, index);
  return (
    <span className={centered ? "arch-level-label" : "arch-column-label"}>
      <span className="arch-label-dot" style={{ backgroundColor: color }} aria-hidden="true" />
      {label}
    </span>
  );
}

export default function ArchitectureDiagram({
  stack,
  layout = "stack",
}: {
  stack: ArchitectureStack;
  layout?: ArchitectureLayout;
}) {
  if (!stack.length) return null;

  if (layout === "flow") {
    return (
      <div className="arch-flow" aria-label="Architecture diagram">
        {stack.map((level, li) => (
          <div className="arch-col" key={li}>
            {li > 0 && (
              <div className="arch-col-link" aria-hidden="true">
                <span className="arch-arrow-right" />
              </div>
            )}
            <div className="arch-col-nodes">
              <TierHead level={level} index={li} />
              {level.nodes.map((node, i) => (
                <NodeBox key={i} node={node} index={i} />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  const clustered = layout === "clustered";

  return (
    <div className={`arch-stack${clustered ? " arch-clustered" : ""}`} aria-label="Architecture diagram">
      {stack.map((level, li) => (
        <div className="arch-level" key={li}>
          {li > 0 && <div className="arch-connector" aria-hidden="true" />}
          {clustered ? (
            <div className="arch-tier">
              <span className="arch-tier-head">
                <TierHead level={level} index={li} />
              </span>
              <div className="arch-tier-nodes">
                {level.nodes.map((node, i) => (
                  <NodeBox key={i} node={node} index={i} />
                ))}
              </div>
            </div>
          ) : (
            <>
              <TierHead level={level} index={li} centered />
              <div className="arch-level-nodes">
                {level.nodes.map((node, i) => (
                  <NodeBox key={i} node={node} index={i} />
                ))}
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}