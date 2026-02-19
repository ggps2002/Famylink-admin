import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Eye,
  Star,
  ShieldCheck,
  ShieldAlert,
  Mail,
  Phone,
  MapPin,
  BadgeCheck,
} from "lucide-react";
import { Users } from "@/redux/slices/userDataSlice";
import Image from "next/image";

// ─── Data shape matching the mapped family object ─────────────────────────────

// export interface ParentUser {
//   id: string;
//   username: string;
//   email: string;
//   firstName: string;
//   lastName: string;
//   role: "Parents";
//   profileImage: string | null;
//   phone: string;
//   city: string;
//   state: string;
//   hourlyRate: undefined;
//   bio: string;
//   avgRating: number;
//   totalReviews: number;
//   isVerifiedEmail: boolean;
//   isVerifiedID: boolean;
//   isActive: boolean;
//   createdAt: string | { $date: string };
// }

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseDate(d: string | { $date: string } | undefined): string {
  if (!d) return "—";
  const raw = typeof d === "object" ? d.$date : d;
  return new Date(raw).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function initials(first: string, last: string): string {
  return `${first?.[0] ?? ""}${last?.[0] ?? ""}`.toUpperCase();
}

// ─── Design tokens ────────────────────────────────────────────────────────────

const ACCENT = {
  violet: "#7c3aed",
  amber: "#d97706",
  teal: "#0d9488",
  sky: "#0369a1",
  rose: "#e11d48",
  green: "#16a34a",
} as const;

const SECTION_COLOR = {
  basic: "#7c3aed",
  location: "#0369a1",
  account: "#0d9488",
} as const;

// ─── UI primitives ────────────────────────────────────────────────────────────

function SectionHeading({ title, color }: { title: string; color: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        margin: "22px 0 10px",
      }}
    >
      <div
        style={{
          width: 4,
          height: 18,
          borderRadius: 2,
          background: color,
          flexShrink: 0,
        }}
      />
      <p
        style={{
          fontSize: 11,
          fontWeight: 800,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          color,
          margin: 0,
        }}
      >
        {title}
      </p>
      <div style={{ flex: 1, height: 1, background: `${color}25` }} />
    </div>
  );
}

// InfoCard: `value` for plain strings, `children` for rich content — no unknown in JSX tree
interface InfoCardProps {
  label: string;
  accent?: string;
  value?: string;
  children?: React.ReactNode;
}
function InfoCard({
  label,
  value,
  children,
  accent = "#6366f1",
}: InfoCardProps) {
  if (value == null && children == null) return null;
  return (
    <div
      style={{
        borderRadius: 12,
        border: "1px solid #f1f5f9",
        background: "white",
        padding: "12px 14px",
        borderLeft: `3px solid ${accent}`,
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
      }}
    >
      <p
        style={{
          fontSize: 10,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: accent,
          marginBottom: 6,
        }}
      >
        {label}
      </p>
      <div
        style={{
          fontSize: 13,
          color: "#1e293b",
          fontWeight: 500,
          lineHeight: 1.6,
        }}
      >
        {value !== undefined ? value : children}
      </div>
    </div>
  );
}

// ─── Star rating ──────────────────────────────────────────────────────────────

function StarRating({ rating, total }: { rating: number; total: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <div style={{ display: "flex", gap: 2 }}>
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            size={14}
            fill={s <= Math.round(rating) ? "#f59e0b" : "none"}
            stroke={s <= Math.round(rating) ? "#f59e0b" : "#d1d5db"}
          />
        ))}
      </div>
      <span style={{ fontSize: 13, fontWeight: 700, color: "#1e293b" }}>
        {rating.toFixed(1)}
      </span>
      <span style={{ fontSize: 12, color: "#94a3b8" }}>
        ({total} review{total !== 1 ? "s" : ""})
      </span>
    </div>
  );
}

// ─── Verification badge ───────────────────────────────────────────────────────

function VerifBadge({ label, verified }: { label: string; verified: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 7,
        padding: "8px 12px",
        borderRadius: 10,
        background: verified ? "#f0fdf4" : "#fff1f2",
        border: `1px solid ${verified ? "#bbf7d0" : "#fecdd3"}`,
      }}
    >
      {verified ? (
        <ShieldCheck size={15} color="#16a34a" />
      ) : (
        <ShieldAlert size={15} color="#e11d48" />
      )}
      <span
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: verified ? "#15803d" : "#be123c",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: 11,
          color: verified ? "#4ade80" : "#fb7185",
          marginLeft: "auto",
        }}
      >
        {verified ? "Verified" : "Unverified"}
      </span>
    </div>
  );
}

// ─── Import React for ReactNode ───────────────────────────────────────────────
import React from "react";

// ─── Main export ──────────────────────────────────────────────────────────────

export function ParentDialogScrollableContent({ user }: { user: Users }) {
  const fullName = `${user.firstName} ${user.lastName}`.trim();
  const location = [user.city, user.state].filter(Boolean).join(", ");
  const statusActive = user.isActive;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Eye className="w-4 h-4 mr-2" />
          View Profile
        </Button>
      </DialogTrigger>

      <DialogContent
        style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif" }}
        className="max-w-2xl max-h-[90vh] flex flex-col gap-0 p-0 overflow-hidden rounded-2xl"
      >
        <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');`}</style>

        {/* ── Fixed Header ── */}
        <div
          style={{
            background:
              "linear-gradient(135deg, #1e1b4b 0%, #3b0764 55%, #4c1d95 100%)",
            padding: "22px 24px 18px",
            flexShrink: 0,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -30,
              right: -30,
              width: 140,
              height: 140,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.05)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: -20,
              left: 50,
              width: 90,
              height: 90,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.04)",
            }}
          />

          <DialogHeader>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 16,
                flexWrap: "wrap",
              }}
            >
              {/* Avatar or profile image */}
              {user.profileImage ? (
                <Image
                  src={user.profileImage}
                  alt={fullName}
                  width={56}
                  height={56}
                  style={{
                    borderRadius: 14,
                    objectFit: "cover",
                    flexShrink: 0,
                    border: "2px solid rgba(255,255,255,0.2)",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 14,
                    flexShrink: 0,
                    background: "linear-gradient(135deg,#a78bfa,#7c3aed)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 20,
                    fontWeight: 800,
                    color: "white",
                    border: "2px solid rgba(255,255,255,0.2)",
                  }}
                >
                  {initials(user.firstName, user.lastName)}
                </div>
              )}

              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    flexWrap: "wrap",
                    marginBottom: 4,
                  }}
                >
                  <DialogTitle
                    style={{ color: "white", fontSize: 19, margin: 0 }}
                  >
                    {fullName}
                  </DialogTitle>

                  <span
                    style={{
                      background: statusActive ? "#10b981" : "#ef4444",
                      color: "white",
                      fontSize: 10,
                      fontWeight: 700,
                      padding: "2px 8px",
                      borderRadius: 999,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                    }}
                  >
                    {statusActive ? "Active" : "Inactive"}
                  </span>

                  <p
                    style={{
                      color: "rgba(255,255,255,0.38)",
                      fontSize: 11,
                      margin: 0,
                    }}
                  >
                    {user.online ? "🟢 Online" : "⚫ Offline"}
                  </p>

                  <span
                    style={{
                      background: "rgba(255,255,255,0.12)",
                      color: "rgba(255,255,255,0.85)",
                      fontSize: 10,
                      fontWeight: 600,
                      padding: "2px 8px",
                      borderRadius: 999,
                    }}
                  >
                    Parent
                  </span>

                  {user.isVerifiedID && (
                    <span
                      style={{
                        background: "#10b981",
                        color: "white",
                        fontSize: 10,
                        fontWeight: 700,
                        padding: "2px 8px",
                        borderRadius: 999,
                        display: "flex",
                        alignItems: "center",
                        gap: 3,
                      }}
                    >
                      <BadgeCheck size={11} /> ID Verified
                    </span>
                  )}

                  {/* no premium field in this shape but guard anyway */}
                </div>

                {/* contact row */}
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 12,
                    marginBottom: 4,
                  }}
                >
                  {user.email && (
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        color: "rgba(255,255,255,0.55)",
                        fontSize: 12,
                      }}
                    >
                      <Mail size={12} /> {user.email}
                    </span>
                  )}
                  {user.phone && (
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        color: "rgba(255,255,255,0.55)",
                        fontSize: 12,
                      }}
                    >
                      <Phone size={12} /> {user.phone}
                    </span>
                  )}
                  {location && (
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        color: "rgba(255,255,255,0.55)",
                        fontSize: 12,
                      }}
                    >
                      <MapPin size={12} /> {location}
                    </span>
                  )}
                </div>

                <p
                  style={{
                    color: "rgba(255,255,255,0.35)",
                    fontSize: 11,
                    margin: 0,
                  }}
                >
                  @{user.username} · Joined {parseDate(user.createdAt)}
                </p>
              </div>

              {/* Rating stat */}
              {user.totalReviews > 0 && (
                <div style={{ textAlign: "center", flexShrink: 0 }}>
                  <p
                    style={{
                      fontSize: 26,
                      fontWeight: 800,
                      color: "#fcd34d",
                      margin: 0,
                      lineHeight: 1,
                    }}
                  >
                    {user.avgRating.toFixed(1)}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      gap: 1,
                      justifyContent: "center",
                      margin: "3px 0 2px",
                    }}
                  >
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={10}
                        fill={
                          s <= Math.round(user.avgRating) ? "#fcd34d" : "none"
                        }
                        stroke={
                          s <= Math.round(user.avgRating)
                            ? "#fcd34d"
                            : "rgba(255,255,255,0.3)"
                        }
                      />
                    ))}
                  </div>
                  <p
                    style={{
                      fontSize: 10,
                      color: "rgba(255,255,255,0.4)",
                      margin: 0,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    {user.totalReviews} review
                    {user.totalReviews !== 1 ? "s" : ""}
                  </p>
                </div>
              )}
            </div>
          </DialogHeader>
        </div>

        {/* ── Scrollable body ── */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "4px 24px 28px",
            minHeight: 0,
            background: "#f8fafc",
          }}
        >
          {/* Bio */}
          {user.bio && (
            <>
              <SectionHeading title="About" color={SECTION_COLOR.basic} />
              <InfoCard
                label="Bio"
                value={user.bio}
                accent={SECTION_COLOR.basic}
              />
            </>
          )}

          {/* BASIC INFO */}
          <SectionHeading title="Basic Info" color={SECTION_COLOR.basic} />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill,minmax(190px,1fr))",
              gap: 10,
            }}
          >
            <InfoCard
              label="Email"
              value={user.email}
              accent={SECTION_COLOR.basic}
            />
            <InfoCard
              label="Username"
              value={`@${user.username}`}
              accent={SECTION_COLOR.basic}
            />
            {user.phone && (
              <InfoCard
                label="Phone"
                value={user.phone}
                accent={SECTION_COLOR.basic}
              />
            )}
            <InfoCard
              label="Member Since"
              value={parseDate(user.createdAt)}
              accent={SECTION_COLOR.basic}
            />
          </div>

          {/* LOCATION */}
          {location && (
            <>
              <SectionHeading title="Location" color={SECTION_COLOR.location} />
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill,minmax(190px,1fr))",
                  gap: 10,
                }}
              >
                {user.city && (
                  <InfoCard
                    label="City"
                    value={user.city}
                    accent={SECTION_COLOR.location}
                  />
                )}
                {user.state && (
                  <InfoCard
                    label="State"
                    value={user.state}
                    accent={SECTION_COLOR.location}
                  />
                )}
              </div>
            </>
          )}

          {/* REVIEWS */}
          {user.totalReviews > 0 && (
            <>
              <SectionHeading title="Reviews & Rating" color={ACCENT.amber} />
              <InfoCard label="Average Rating" accent={ACCENT.amber}>
                <StarRating rating={user.avgRating} total={user.totalReviews} />
              </InfoCard>
            </>
          )}

          {/* ACCOUNT & VERIFICATION */}
          <SectionHeading
            title="Account & Verification"
            color={SECTION_COLOR.account}
          />
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <VerifBadge
              label="Email Verification"
              verified={user.isVerifiedEmail}
            />
            <VerifBadge
              label="National ID Verification"
              verified={user.isVerifiedID}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
