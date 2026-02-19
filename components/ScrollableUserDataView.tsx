import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Eye } from "lucide-react";
import { Users } from "@/redux/slices/userDataSlice";

// ─── Label map ───────────────────────────────────────────────────────────────
const LABELS = {
  interestedPosi: "Interested Positions",
  specificDaysAndTime: "Availability",
  interestedChildcare: "Childcare Type",
  ageGroupsExp: "Experienced Age Groups",
  avaiForWorking: "Available To Start",
  experience: "Years of Experience",
  salaryExp: "Salary Expectations (per child)",
  salaryRange: "Salary Range",
  backgroundCheck: "Background Check",
  FamilyExp: "Family Experience",
  cookFor: "Cooking For",
  helpWithHousekeeping: "Housekeeping",
  certification: "Certifications",
  usePerTransport: "Personal Transport",
  watchChildWhenTheyAreSick: "Sick Child Care",
  references: "References Available",
  language: "Languages Spoken",
  resOrPreAboutWorkEnv: "Work Environment Preferences",
  preferredMetOfTran: "Preferred Transport Method",
  jobDescription: "About",
  tutorPrivateEducator: "Tutoring / Private Educator",
  specializedCaregiver: "Specialized Care",
  sportCoach: "Sports Coaching",
  musicInstructor: "Music Instruction",
  swimInstructor: "Swim Instruction",
  houseManager: "House Management",
};

// ─── Readable text transform ──────────────────────────────────────────────────
const WORD_MAP = {
  nanny: "Nanny",
  babysitter: "Babysitter",
  privateEducator: "Private Educator",
  specializedCaregiver: "Specialized Caregiver",
  sportsCoaches: "Sports Coach",
  musicInstructor: "Music Instructor",
  swimInstructor: "Swim Instructor",
  houseManager: "House Manager",
  fullHousekeeping: "Full Housekeeping",
  lightDutiesOnly: "Light Duties Only",
  noHousekeeping: "No Housekeeping",
  mealpreparation: "Meal Preparation",
  educationalactivities: "Educational Activities",
  staffManagement: "Staff Management",
  eventPlanning: "Event Planning",
  budgeting: "Budgeting",
  lecturebased: "Lecture Based",
  interactive: "Interactive",
  oneonone: "One-on-One",
  groupTutoring: "Group Tutoring",
  blendedLearning: "Blended Learning",
  remoteOnly: "Remote Only",
  inpersonOnly: "In-Person Only",
  both: "Both",
  elementary: "Elementary",
  middleSchool: "Middle School",
  highSchool: "High School",
  college: "College",
  mathematics: "Mathematics",
  science: "Science",
  english: "English",
  history: "History",
  languageSpecify: "Language (Specify)",
  computerScience: "Computer Science",
  doula: "Doula",
  nightNurse: "Night Nurse",
  specialNeedsCare: "Special Needs Care",
  elderCare: "Elder Care",
  soccer: "Soccer",
  basketball: "Basketball",
  tennis: "Tennis",
  swimming: "Swimming",
  golf: "Golf",
  teams: "Teams",
  individuals: "Individuals",
  piano: "Piano",
  guitar: "Guitar",
  violin: "Violin",
  drums: "Drums",
  voice: "Voice",
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
  toddlers: "Toddlers",
  children: "Children",
  teens: "Teens",
  adults: "Adults",
  weekdays: "Weekdays",
  weekends: "Weekends",
  evenings: "Evenings",
  flexible: "Flexible",
  bilingual: "Bilingual",
  mandarin: "Mandarin",
  spanish: "Spanish",
  french: "French",
  newborn: "Newborn",
};

function humanize(str) {
  if (!str) return "";
  if (WORD_MAP[str]) return WORD_MAP[str];
  return str
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
    .replace(/[_-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function humanizeList(arr) {
  return [].concat(arr).map(humanize);
}

function parseDate(d) {
  if (!d) return "";
  const raw = d?.$date ?? d;
  return new Date(raw).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// ─── Tag palettes ─────────────────────────────────────────────────────────────
const TAG_PALETTES = [
  { bg: "#eff6ff", border: "#bfdbfe", text: "#1d4ed8" },
  { bg: "#f0fdf4", border: "#bbf7d0", text: "#15803d" },
  { bg: "#fdf4ff", border: "#e9d5ff", text: "#7e22ce" },
  { bg: "#fff7ed", border: "#fed7aa", text: "#c2410c" },
  { bg: "#ecfdf5", border: "#6ee7b7", text: "#065f46" },
  { bg: "#fef3c7", border: "#fcd34d", text: "#92400e" },
  { bg: "#fce7f3", border: "#f9a8d4", text: "#9d174d" },
  { bg: "#e0f2fe", border: "#7dd3fc", text: "#0369a1" },
];

const SECTION_COLORS = {
  basic: "#6366f1",
  profile: "#0ea5e9",
  services: "#10b981",
};

// ─── Components ───────────────────────────────────────────────────────────────
function Tag({ label, palette }) {
  const p = palette ?? TAG_PALETTES[0];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        background: p.bg,
        border: `1px solid ${p.border}`,
        color: p.text,
        fontSize: 11,
        fontWeight: 600,
        padding: "3px 9px",
        borderRadius: 999,
        lineHeight: 1.4,
      }}
    >
      {label}
    </span>
  );
}

function TagList({ items, paletteIndex = 0 }) {
  if (!items?.length) return null;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 4 }}>
      {items.map((item, i) => (
        <Tag
          key={i}
          label={item}
          palette={TAG_PALETTES[(paletteIndex + i) % TAG_PALETTES.length]}
        />
      ))}
    </div>
  );
}

function InfoCard({ label, children, accent = "#6366f1" }) {
  if (!children) return null;
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
        {children}
      </div>
    </div>
  );
}

function SectionHeading({ title, color }) {
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

function FamilyExpCard({ exp }) {
  return (
    <div
      style={{
        border: "1px solid #bae6fd",
        borderRadius: 14,
        padding: 14,
        background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: 6,
          marginBottom: 10,
        }}
      >
        <div>
          <p
            style={{
              fontWeight: 700,
              color: "#0c4a6e",
              fontSize: 14,
              margin: 0,
            }}
          >
            {exp.familyIdentifiernicknameOptional || "Family"}
          </p>
          <p style={{ fontSize: 12, color: "#0369a1", margin: "2px 0 0" }}>
            {exp.typeOfCareProvided}
          </p>
        </div>
        <Tag
          label={exp.durationOfEmployment}
          palette={{ bg: "#fef3c7", border: "#fcd34d", text: "#92400e" }}
        />
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 6,
          fontSize: 12,
          marginBottom: 10,
        }}
      >
        {[
          ["👶 Children", exp.numberOfChildren],
          ["📍 Location", exp.locationOfWork],
          ["🔍 BG Check", exp.backgroundCheck],
          ["📋 References", exp.referencesAvailable],
          ["🚪 Reason Left", exp.reasonForLeavingOptional],
        ].map(
          ([lbl, val]) =>
            val && (
              <div key={lbl}>
                <span style={{ color: "#94a3b8", fontWeight: 500 }}>
                  {lbl}:{" "}
                </span>
                <span style={{ color: "#1e293b", fontWeight: 600 }}>{val}</span>
              </div>
            ),
        )}
      </div>
      {exp.ageGroupsOfChildren?.length > 0 && (
        <div style={{ marginBottom: 6 }}>
          <p
            style={{
              fontSize: 10,
              color: "#7dd3fc",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              marginBottom: 4,
              fontWeight: 700,
            }}
          >
            Age Groups
          </p>
          <TagList
            items={humanizeList(exp.ageGroupsOfChildren)}
            paletteIndex={2}
          />
        </div>
      )}
      {exp.keyResponsibilities?.length > 0 && (
        <div>
          <p
            style={{
              fontSize: 10,
              color: "#7dd3fc",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              marginBottom: 4,
              fontWeight: 700,
            }}
          >
            Responsibilities
          </p>
          <TagList
            items={humanizeList(exp.keyResponsibilities)}
            paletteIndex={5}
          />
        </div>
      )}
    </div>
  );
}

const SERVICE_STYLES = {
  tutorPrivateEducator: {
    icon: "📚",
    color: "#7c3aed",
    bg: "linear-gradient(135deg,#fdf4ff,#ede9fe)",
  },
  specializedCaregiver: {
    icon: "🏥",
    color: "#dc2626",
    bg: "linear-gradient(135deg,#fff1f2,#ffe4e6)",
  },
  sportCoach: {
    icon: "⚽",
    color: "#d97706",
    bg: "linear-gradient(135deg,#fffbeb,#fef3c7)",
  },
  musicInstructor: {
    icon: "🎵",
    color: "#0891b2",
    bg: "linear-gradient(135deg,#ecfeff,#cffafe)",
  },
  swimInstructor: {
    icon: "🏊",
    color: "#0369a1",
    bg: "linear-gradient(135deg,#eff6ff,#dbeafe)",
  },
  houseManager: {
    icon: "🏡",
    color: "#059669",
    bg: "linear-gradient(135deg,#ecfdf5,#d1fae5)",
  },
};

function ServiceCard({ svcKey, label, rows }) {
  const style = SERVICE_STYLES[svcKey] ?? {
    icon: "🛠️",
    color: "#6366f1",
    bg: "white",
  };
  return (
    <div
      style={{
        border: `1px solid ${style.color}30`,
        borderRadius: 14,
        background: style.bg,
        padding: 14,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 12,
        }}
      >
        <span style={{ fontSize: 20 }}>{style.icon}</span>
        <p
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: style.color,
            margin: 0,
          }}
        >
          {label}
        </p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {rows.map(([rowLabel, items]) => {
          const cleaned = [].concat(items || []).filter(Boolean);
          if (!cleaned.length) return null;
          return (
            <div key={rowLabel}>
              <p
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.07em",
                  color: `${style.color}99`,
                  marginBottom: 4,
                }}
              >
                {rowLabel}
              </p>
              <TagList
                items={humanizeList(cleaned)}
                paletteIndex={Object.keys(SERVICE_STYLES).indexOf(svcKey) * 2}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export function DialogScrollableContent({ nanny }: { nanny: Users }) {
  const getInfo = (key) =>
    nanny.additionalInfo?.find((i) => i.key === key)?.value;

  const interestedPosi = getInfo("interestedPosi");
  const avail = getInfo("specificDaysAndTime");
  const childcareType = getInfo("interestedChildcare");
  const ageGroups = getInfo("ageGroupsExp");
  const availToStart = getInfo("avaiForWorking");
  const experience = getInfo("experience");
  const salaryExp = getInfo("salaryExp");
  const salaryRange = getInfo("salaryRange");
  const bgCheck = getInfo("backgroundCheck");
  const familyExp = getInfo("FamilyExp");
  const cookFor = getInfo("cookFor");
  const housekeeping = getInfo("helpWithHousekeeping");
  const certification = getInfo("certification");
  const transport = getInfo("usePerTransport");
  const sickChild = getInfo("watchChildWhenTheyAreSick");
  const references = getInfo("references");
  const language = getInfo("language");
  const workEnv = getInfo("resOrPreAboutWorkEnv");
  const prefTransport = getInfo("preferredMetOfTran");
  const jobDesc = getInfo("jobDescription");

  const SERVICE_KEYS = [
    "tutorPrivateEducator",
    "specializedCaregiver",
    "sportCoach",
    "musicInstructor",
    "swimInstructor",
    "houseManager",
  ];
  const SERVICE_ROWS = {
    tutorPrivateEducator: (v) => [
      ["Subjects", v.qualSubject?.option],
      ["Levels", v.eduLevel?.option],
      ["Style", v.teachStyle?.option],
      ["Availability", v.ava?.option],
      ["Mode", v.remOrPerson?.option],
    ],
    specializedCaregiver: (v) => [
      ["Care Types", [].concat(v.specializedCare?.option || [])],
      ["Certified", [v.cert?.option]],
      ["Special Needs", [v.expManagNeed?.option]],
    ],
    sportCoach: (v) => [
      ["Sports", [].concat(v.sportType?.option || [])],
      ["Certified", [v.cert?.option]],
      ["Coaching Style", [].concat(v.preCoachingTeam?.option || [])],
    ],
    musicInstructor: (v) => [
      ["Instruments", [].concat(v.musicalInstruments?.option || [])],
      ["Levels", [].concat(v.level?.option || [])],
      ["Performance Prep", [v.perPreparation?.option]],
    ],
    swimInstructor: (v) => [
      ["Certified", [v.cert?.option]],
      ["Age Groups", [].concat(v.ageGroup?.option || [])],
      ["Levels", [].concat(v.level?.option || [])],
    ],
    houseManager: (v) => [
      ["Skills", [].concat(v.experience?.option || [])],
      ["Housekeeping", [].concat(v.performHouseKeeping?.option || [])],
      ["Budget Mgmt", [v.expMangeHouseholdBudget?.option]],
    ],
  };

  const availDays = avail
    ? Object.entries(avail)
        .filter(([, v]) => v?.checked)
        .map(([day, v]) => {
          const s = new Date(v.start).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });
          const e = new Date(v.end).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });
          return `${day}  ${s} – ${e}`;
        })
    : [];

  const salaryRows = salaryExp
    ? [
        ["1 Child", salaryExp.firstChild],
        ["2 Children", salaryExp.secChild],
        ["3 Children", salaryExp.thirdChild],
        ["4 Children", salaryExp.fourthChild],
        ["5+ Children", salaryExp.fiveOrMoreChild],
      ]
    : [];

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
        className="max-w-3xl max-h-[90vh] flex flex-col gap-0 p-0 overflow-hidden rounded-2xl"
      >
        <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');`}</style>

        {/* ── Fixed Header ── */}
        <div
          style={{
            background:
              "linear-gradient(135deg, #0f172a 0%, #1e3a5f 60%, #0c4a6e 100%)",
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
              width: 130,
              height: 130,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.05)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: -20,
              left: 60,
              width: 80,
              height: 80,
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
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  flexShrink: 0,
                  background: "linear-gradient(135deg,#38bdf8,#0ea5e9)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                  fontWeight: 800,
                  color: "white",
                  border: "2px solid rgba(255,255,255,0.2)",
                }}
              >
                {nanny.firstName[0]} {nanny.lastName[0]}
              </div>
              <div style={{ flex: 1 }}>
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
                    {nanny.firstName} {nanny.lastName}
                  </DialogTitle>
                  {/* <span style={{ background: nanny.status==="Active" ? "#10b981":"#ef4444", color:"white", fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:999, textTransform:"uppercase", letterSpacing:"0.08em" }}>
                    {nanny.status}
                  </span> */}
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
                    Nanny
                  </span>
                  {nanny.premium && (
                    <span
                      style={{
                        background: "#f59e0b",
                        color: "white",
                        fontSize: 10,
                        fontWeight: 700,
                        padding: "2px 8px",
                        borderRadius: 999,
                      }}
                    >
                      ⭐ Premium
                    </span>
                  )}
                </div>
                {/* <p style={{ color:"rgba(255,255,255,0.55)", fontSize:12, margin:"0 0 2px" }}>
                  📍 {nanny.location?.format_location}
                </p> */}
                <p
                  style={{
                    color: "rgba(255,255,255,0.38)",
                    fontSize: 11,
                    margin: 0,
                  }}
                >
                  Joined {parseDate(nanny.createdAt)} · Last active{" "}
                  {parseDate(nanny.ActiveAt)} ·{" "}
                  {nanny.online ? "🟢 Online" : "⚫ Offline"}
                </p>
              </div>
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
          {/* BASIC INFO */}
          <SectionHeading title="Basic Info" color={SECTION_COLORS.basic} />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill,minmax(190px,1fr))",
              gap: 10,
            }}
          >
            <InfoCard label="Email" accent={SECTION_COLORS.basic}>
              {nanny.email}
            </InfoCard>
            <InfoCard label="Zip Code" accent={SECTION_COLORS.basic}>
              {nanny.zipCode}
            </InfoCard>
            <InfoCard label="Date of Birth" accent={SECTION_COLORS.basic}>
              {parseDate(nanny.dob)}
            </InfoCard>
            <InfoCard label="Last Active" accent={SECTION_COLORS.basic}>
              {parseDate(nanny.ActiveAt)}
            </InfoCard>
          </div>

          {/* PROFILE DETAILS */}
          <SectionHeading
            title="Profile Details"
            color={SECTION_COLORS.profile}
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill,minmax(190px,1fr))",
              gap: 10,
              marginBottom: "10px"
            }}
          >
            <InfoCard
              label="Years of Experience"
              accent={SECTION_COLORS.profile}
            >
              {experience?.option}
            </InfoCard>
            <InfoCard label="Childcare Type" accent={SECTION_COLORS.profile}>
              {childcareType?.option}
            </InfoCard>
            <InfoCard
              label="Available To Start"
              accent={SECTION_COLORS.profile}
            >
              {availToStart?.option}
            </InfoCard>
            <InfoCard label="Background Check" accent={SECTION_COLORS.profile}>
              <span
                style={{
                  color: bgCheck?.option === "Yes" ? "#16a34a" : "#dc2626",
                  fontWeight: 700,
                }}
              >
                {bgCheck?.option === "Yes" ? "✅ Yes" : "❌ No"}
              </span>
            </InfoCard>
            <InfoCard
              label="References Available"
              accent={SECTION_COLORS.profile}
            >
              <span
                style={{
                  color: references?.option === "Yes" ? "#16a34a" : "#dc2626",
                  fontWeight: 700,
                }}
              >
                {references?.option === "Yes" ? "✅ Yes" : "❌ No"}
              </span>
            </InfoCard>
            <InfoCard label="Cooking For" accent={SECTION_COLORS.profile}>
              {cookFor?.option}
            </InfoCard>
            <InfoCard label="Housekeeping" accent={SECTION_COLORS.profile}>
              {housekeeping?.option}
            </InfoCard>
            <InfoCard label="Sick Child Care" accent={SECTION_COLORS.profile}>
              {sickChild?.option}
            </InfoCard>
            <InfoCard
              label="Personal Transport"
              accent={SECTION_COLORS.profile}
            >
              {transport?.option}
            </InfoCard>
            <InfoCard
              label="Preferred Transport"
              accent={SECTION_COLORS.profile}
            >
              {prefTransport?.option}
            </InfoCard>
          </div>
          {jobDesc && (
            <InfoCard label="About" accent={SECTION_COLORS.profile}>
              {humanize(jobDesc)}
            </InfoCard>
          )}

          {/* Positions */}
          {interestedPosi && (
            <div style={{ marginTop: 10 }}>
              <InfoCard label="Interested Positions" accent="#7c3aed">
                <TagList
                  items={[
                    ...humanizeList([].concat(interestedPosi.option || [])),
                    ...(interestedPosi.typeHere
                      ? [interestedPosi.typeHere]
                      : []),
                  ]}
                  paletteIndex={0}
                />
              </InfoCard>
            </div>
          )}

          {/* Availability */}
          {availDays.length > 0 && (
            <div style={{ marginTop: 10 }}>
              <InfoCard label="Availability" accent="#0891b2">
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {availDays.map((d) => (
                    <span
                      key={d}
                      style={{
                        background: "#ecfeff",
                        border: "1px solid #a5f3fc",
                        color: "#0e7490",
                        fontSize: 12,
                        fontWeight: 600,
                        padding: "5px 12px",
                        borderRadius: 10,
                      }}
                    >
                      📅 {d}
                    </span>
                  ))}
                </div>
              </InfoCard>
            </div>
          )}

          {/* Age Groups */}
          {ageGroups?.option && (
            <div style={{ marginTop: 10 }}>
              <InfoCard label="Experienced Age Groups" accent="#d97706">
                <TagList
                  items={humanizeList([].concat(ageGroups.option))}
                  paletteIndex={3}
                />
              </InfoCard>
            </div>
          )}

          {/* Languages */}
          {language?.option && (
            <div style={{ marginTop: 10 }}>
              <InfoCard label="Languages Spoken" accent="#0369a1">
                <TagList
                  items={humanizeList([].concat(language.option))}
                  paletteIndex={7}
                />
              </InfoCard>
            </div>
          )}

          {/* Work Environment */}
          {workEnv?.option && (
            <div style={{ marginTop: 10 }}>
              <InfoCard label="Work Environment Preferences" accent="#9333ea">
                <TagList
                  items={[]
                    .concat(workEnv.option)
                    .map((v) => v.replace(/\b\w/g, (c) => c.toUpperCase()))}
                  paletteIndex={1}
                />
              </InfoCard>
            </div>
          )}

          {/* Certifications */}
          {certification?.option && (
            <div style={{ marginTop: 10 }}>
              <InfoCard label="Certifications" accent="#0d9488">
                <TagList
                  items={[]
                    .concat(certification.option)
                    .map((v) => v.replace(/\b\w/g, (c) => c.toUpperCase()))}
                  paletteIndex={4}
                />
              </InfoCard>
            </div>
          )}

          {/* Salary */}
          {salaryRows.length > 0 && (
            <div style={{ marginTop: 10 }}>
              <InfoCard label="Salary Expectations" accent="#16a34a">
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 8,
                    marginTop: 2,
                  }}
                >
                  {salaryRows
                    .filter(([, v]) => v)
                    .map(([lbl, val]) => (
                      <div
                        key={lbl}
                        style={{
                          background: "#f0fdf4",
                          border: "1px solid #bbf7d0",
                          borderRadius: 10,
                          padding: "8px 14px",
                          textAlign: "center",
                        }}
                      >
                        <p
                          style={{
                            fontSize: 18,
                            fontWeight: 800,
                            color: "#15803d",
                            margin: 0,
                          }}
                        >
                          ${val}
                        </p>
                        <p
                          style={{
                            fontSize: 10,
                            color: "#4ade80",
                            fontWeight: 600,
                            margin: "1px 0 0",
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                          }}
                        >
                          {lbl}
                        </p>
                      </div>
                    ))}
                  {salaryRange && (
                    <div
                      style={{
                        background: "#dcfce7",
                        border: "1px solid #4ade80",
                        borderRadius: 10,
                        padding: "8px 14px",
                        textAlign: "center",
                        alignSelf: "center",
                      }}
                    >
                      <p
                        style={{
                          fontSize: 14,
                          fontWeight: 800,
                          color: "#15803d",
                          margin: 0,
                        }}
                      >
                        ${salaryRange.min} – ${salaryRange.max}
                      </p>
                      <p
                        style={{
                          fontSize: 10,
                          color: "#4ade80",
                          fontWeight: 600,
                          margin: "1px 0 0",
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                        }}
                      >
                        Range
                      </p>
                    </div>
                  )}
                </div>
              </InfoCard>
            </div>
          )}

          {/* Family Experience */}
          {familyExp?.length > 0 && (
            <>
              <SectionHeading title="Family Experience" color="#0369a1" />
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill,minmax(270px,1fr))",
                  gap: 10,
                }}
              >
                {familyExp.map((f, i) => (
                  <FamilyExpCard key={i} exp={f} />
                ))}
              </div>
            </>
          )}

          {/* SERVICES */}
          {SERVICE_KEYS.some((k) => getInfo(k)) && (
            <>
              <SectionHeading
                title="Services & Specializations"
                color={SECTION_COLORS.services}
              />
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill,minmax(270px,1fr))",
                  gap: 10,
                }}
              >
                {SERVICE_KEYS.map((key) => {
                  const val = getInfo(key);
                  if (!val) return null;
                  return (
                    <ServiceCard
                      key={key}
                      svcKey={key}
                      label={LABELS[key]}
                      rows={SERVICE_ROWS[key](val)}
                    />
                  );
                })}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
