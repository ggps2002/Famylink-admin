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
import { ReactNode } from "react";

// ─── Label map ───────────────────────────────────────────────────────────────
const LABELS: Record<string, string> = {
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

// ─── Word map for humanizing camelCase ───────────────────────────────────────
const WORD_MAP: Record<string, string> = {
  nanny: "Nanny", babysitter: "Babysitter", privateEducator: "Private Educator",
  specializedCaregiver: "Specialized Caregiver", sportsCoaches: "Sports Coach",
  musicInstructor: "Music Instructor", swimInstructor: "Swim Instructor",
  houseManager: "House Manager", fullHousekeeping: "Full Housekeeping",
  lightDutiesOnly: "Light Duties Only", noHousekeeping: "No Housekeeping",
  mealpreparation: "Meal Preparation", educationalactivities: "Educational Activities",
  staffManagement: "Staff Management", eventPlanning: "Event Planning",
  budgeting: "Budgeting", lecturebased: "Lecture Based", interactive: "Interactive",
  oneonone: "One-on-One", groupTutoring: "Group Tutoring", blendedLearning: "Blended Learning",
  remoteOnly: "Remote Only", inpersonOnly: "In-Person Only", both: "Both",
  elementary: "Elementary", middleSchool: "Middle School", highSchool: "High School",
  college: "College", mathematics: "Mathematics", science: "Science", english: "English",
  history: "History", languageSpecify: "Language (Specify)", computerScience: "Computer Science",
  doula: "Doula", nightNurse: "Night Nurse", specialNeedsCare: "Special Needs Care",
  elderCare: "Elder Care", soccer: "Soccer", basketball: "Basketball", tennis: "Tennis",
  swimming: "Swimming", golf: "Golf", teams: "Teams", individuals: "Individuals",
  piano: "Piano", guitar: "Guitar", violin: "Violin", drums: "Drums", voice: "Voice",
  beginner: "Beginner", intermediate: "Intermediate", advanced: "Advanced",
  toddlers: "Toddlers", children: "Children", teens: "Teens", adults: "Adults",
  weekdays: "Weekdays", weekends: "Weekends", evenings: "Evenings", flexible: "Flexible",
  bilingual: "Bilingual", mandarin: "Mandarin", spanish: "Spanish", french: "French",
  newborn: "Newborn",
};

export function humanize(str: string): string {
  if (!str) return "";
  if (WORD_MAP[str]) return WORD_MAP[str];
  return str
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
    .replace(/[_-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c: string) => c.toUpperCase());
}

export function humanizeList(arr: string | string[]): string[] {
  return (Array.isArray(arr) ? arr : [arr]).map(humanize);
}

function parseDate(d: unknown): string {
  if (!d) return "";
  const raw = (d as { $date?: string })?.$date ?? (d as string);
  return new Date(raw).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

// ─── Strongly-typed value shapes ─────────────────────────────────────────────

interface OptionValue {
  option?: string | string[];
  typeHere?: string;
}

interface SalaryExpValue {
  firstChild?: string;
  secChild?: string;
  thirdChild?: string;
  fourthChild?: string;
  fiveOrMoreChild?: string;
}

interface SalaryRangeValue {
  min?: number;
  max?: number;
}

interface DayAvailability {
  checked?: boolean;
  start: string;
  end: string;
}

type AvailabilityValue = Record<string, DayAvailability>;

interface FamilyExperience {
  familyIdentifiernicknameOptional?: string;
  typeOfCareProvided?: string;
  durationOfEmployment?: string;
  numberOfChildren?: string | number;
  locationOfWork?: string;
  backgroundCheck?: string;
  referencesAvailable?: string;
  reasonForLeavingOptional?: string;
  ageGroupsOfChildren?: string[];
  keyResponsibilities?: string[];
}

interface TutorValue {
  qualSubject?: OptionValue;
  eduLevel?: OptionValue;
  teachStyle?: OptionValue;
  ava?: OptionValue;
  remOrPerson?: OptionValue;
}
interface SpecializedCaregiverValue {
  specializedCare?: OptionValue;
  cert?: OptionValue;
  expManagNeed?: OptionValue;
}
interface SportCoachValue {
  sportType?: OptionValue;
  cert?: OptionValue;
  preCoachingTeam?: OptionValue;
}
interface MusicInstructorValue {
  musicalInstruments?: OptionValue;
  level?: OptionValue;
  perPreparation?: OptionValue;
}
interface SwimInstructorValue {
  cert?: OptionValue;
  ageGroup?: OptionValue;
  level?: OptionValue;
}
interface HouseManagerValue {
  experience?: OptionValue;
  performHouseKeeping?: OptionValue;
  expMangeHouseholdBudget?: OptionValue;
}

// ─── Safe narrowing helpers ───────────────────────────────────────────────────

/** Safely narrows unknown → OptionValue */
function asOption(val: unknown): OptionValue | undefined {
  if (val !== null && typeof val === "object" && !Array.isArray(val)) {
    return val as OptionValue;
  }
  return undefined;
}

/** Converts string | string[] | undefined → string[] always */
function toStrArr(val: string | string[] | undefined): string[] {
  if (!val) return [];
  return Array.isArray(val) ? val : [val];
}

/** Converts string | string[] | undefined → string | undefined (safe as ReactNode) */
function optStr(val: string | string[] | undefined): string | undefined {
  if (!val) return undefined;
  return Array.isArray(val) ? val[0] : val;
}

/** Converts unknown → FamilyExperience[] safely */
function asFamilyExpArr(val: unknown): FamilyExperience[] {
  if (!Array.isArray(val)) return [];
  return val as FamilyExperience[];
}

// ─── Tag palettes ─────────────────────────────────────────────────────────────

interface TagPalette { bg: string; border: string; text: string }

const TAG_PALETTES: TagPalette[] = [
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
  basic:    "#6366f1",
  profile:  "#0ea5e9",
  services: "#10b981",
} as const;

// ─── UI components ────────────────────────────────────────────────────────────

function Tag({ label, palette }: { label: string; palette?: TagPalette }) {
  const p: TagPalette = palette ?? TAG_PALETTES[0];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", background: p.bg, border: `1px solid ${p.border}`, color: p.text, fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 999, lineHeight: 1.4 }}>
      {label}
    </span>
  );
}

function TagList({ items, paletteIndex = 0 }: { items?: string[]; paletteIndex?: number }) {
  if (!items?.length) return null;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 4 }}>
      {items.map((item, i) => (
        <Tag key={i} label={item} palette={TAG_PALETTES[(paletteIndex + i) % TAG_PALETTES.length]} />
      ))}
    </div>
  );
}

// InfoCard accepts EITHER a plain `value` string OR arbitrary `children`.
// Using `value` avoids passing unknown/string|string[] directly into JSX tree.
interface InfoCardProps {
  label: string;
  accent?: string;
  value?: string;
  children?: ReactNode;
}

function InfoCard({ label, value, children, accent = "#6366f1" }: InfoCardProps) {
  // render only if there's something to show
  if (value == null && children == null) return null;
  return (
    <div style={{ borderRadius: 12, border: "1px solid #f1f5f9", background: "white", padding: "12px 14px", borderLeft: `3px solid ${accent}`, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
      <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: accent, marginBottom: 6 }}>
        {label}
      </p>
      <div style={{ fontSize: 13, color: "#1e293b", fontWeight: 500, lineHeight: 1.6 }}>
        {value !== undefined ? value : children}
      </div>
    </div>
  );
}

function SectionHeading({ title, color }: { title: string; color: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "22px 0 10px" }}>
      <div style={{ width: 4, height: 18, borderRadius: 2, background: color, flexShrink: 0 }} />
      <p style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color, margin: 0 }}>
        {title}
      </p>
      <div style={{ flex: 1, height: 1, background: `${color}25` }} />
    </div>
  );
}

function FamilyExpCard({ exp }: { exp: FamilyExperience }) {
  const details: [string, string | number | undefined][] = [
    ["👶 Children",   exp.numberOfChildren],
    ["📍 Location",   exp.locationOfWork],
    ["🔍 BG Check",  exp.backgroundCheck],
    ["📋 References", exp.referencesAvailable],
    ["🚪 Reason Left",exp.reasonForLeavingOptional],
  ];
  return (
    <div style={{ border: "1px solid #bae6fd", borderRadius: 14, padding: 14, background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
        <div>
          <p style={{ fontWeight: 700, color: "#0c4a6e", fontSize: 14, margin: 0 }}>
            {exp.familyIdentifiernicknameOptional ?? "Family"}
          </p>
          <p style={{ fontSize: 12, color: "#0369a1", margin: "2px 0 0" }}>{exp.typeOfCareProvided}</p>
        </div>
        {exp.durationOfEmployment && (
          <Tag label={exp.durationOfEmployment} palette={{ bg: "#fef3c7", border: "#fcd34d", text: "#92400e" }} />
        )}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, fontSize: 12, marginBottom: 10 }}>
        {details.map(([lbl, val]) =>
          val !== undefined ? (
            <div key={String(lbl)}>
              <span style={{ color: "#94a3b8", fontWeight: 500 }}>{lbl}: </span>
              <span style={{ color: "#1e293b", fontWeight: 600 }}>{String(val)}</span>
            </div>
          ) : null,
        )}
      </div>
      {(exp.ageGroupsOfChildren?.length ?? 0) > 0 && (
        <div style={{ marginBottom: 6 }}>
          <p style={{ fontSize: 10, color: "#7dd3fc", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4, fontWeight: 700 }}>Age Groups</p>
          <TagList items={humanizeList(exp.ageGroupsOfChildren!)} paletteIndex={2} />
        </div>
      )}
      {(exp.keyResponsibilities?.length ?? 0) > 0 && (
        <div>
          <p style={{ fontSize: 10, color: "#7dd3fc", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4, fontWeight: 700 }}>Responsibilities</p>
          <TagList items={humanizeList(exp.keyResponsibilities!)} paletteIndex={5} />
        </div>
      )}
    </div>
  );
}

// ─── Service card ─────────────────────────────────────────────────────────────

interface ServiceStyle { icon: string; color: string; bg: string }
type ServiceRow = [string, string[]];

const SERVICE_STYLES: Record<string, ServiceStyle> = {
  tutorPrivateEducator: { icon: "📚", color: "#7c3aed", bg: "linear-gradient(135deg,#fdf4ff,#ede9fe)" },
  specializedCaregiver: { icon: "🏥", color: "#dc2626", bg: "linear-gradient(135deg,#fff1f2,#ffe4e6)" },
  sportCoach:           { icon: "⚽", color: "#d97706", bg: "linear-gradient(135deg,#fffbeb,#fef3c7)" },
  musicInstructor:      { icon: "🎵", color: "#0891b2", bg: "linear-gradient(135deg,#ecfeff,#cffafe)" },
  swimInstructor:       { icon: "🏊", color: "#0369a1", bg: "linear-gradient(135deg,#eff6ff,#dbeafe)" },
  houseManager:         { icon: "🏡", color: "#059669", bg: "linear-gradient(135deg,#ecfdf5,#d1fae5)" },
};

function ServiceCard({ svcKey, label, rows }: { svcKey: string; label: string; rows: ServiceRow[] }) {
  const style: ServiceStyle = SERVICE_STYLES[svcKey] ?? { icon: "🛠️", color: "#6366f1", bg: "white" };
  const svcIndex = Object.keys(SERVICE_STYLES).indexOf(svcKey);
  return (
    <div style={{ border: `1px solid ${style.color}30`, borderRadius: 14, background: style.bg, padding: 14 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <span style={{ fontSize: 20 }}>{style.icon}</span>
        <p style={{ fontSize: 13, fontWeight: 700, color: style.color, margin: 0 }}>{label}</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {rows.map(([rowLabel, items]) => {
          if (!items.length) return null;
          return (
            <div key={rowLabel}>
              <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: `${style.color}99`, marginBottom: 4 }}>
                {rowLabel}
              </p>
              <TagList items={humanizeList(items)} paletteIndex={svcIndex * 2} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Service row builders — all strongly typed, return ServiceRow[] ───────────

const SERVICE_ROW_BUILDERS: Record<string, (v: unknown) => ServiceRow[]> = {
  tutorPrivateEducator: (v: unknown): ServiceRow[] => {
    const t = v as TutorValue;
    return [
      ["Subjects",     toStrArr(t.qualSubject?.option)],
      ["Levels",       toStrArr(t.eduLevel?.option)],
      ["Style",        toStrArr(t.teachStyle?.option)],
      ["Availability", toStrArr(t.ava?.option)],
      ["Mode",         toStrArr(t.remOrPerson?.option)],
    ];
  },
  specializedCaregiver: (v: unknown): ServiceRow[] => {
    const t = v as SpecializedCaregiverValue;
    return [
      ["Care Types",    toStrArr(t.specializedCare?.option)],
      ["Certified",     toStrArr(t.cert?.option)],
      ["Special Needs", toStrArr(t.expManagNeed?.option)],
    ];
  },
  sportCoach: (v: unknown): ServiceRow[] => {
    const t = v as SportCoachValue;
    return [
      ["Sports",         toStrArr(t.sportType?.option)],
      ["Certified",      toStrArr(t.cert?.option)],
      ["Coaching Style", toStrArr(t.preCoachingTeam?.option)],
    ];
  },
  musicInstructor: (v: unknown): ServiceRow[] => {
    const t = v as MusicInstructorValue;
    return [
      ["Instruments",      toStrArr(t.musicalInstruments?.option)],
      ["Levels",           toStrArr(t.level?.option)],
      ["Performance Prep", toStrArr(t.perPreparation?.option)],
    ];
  },
  swimInstructor: (v: unknown): ServiceRow[] => {
    const t = v as SwimInstructorValue;
    return [
      ["Certified",  toStrArr(t.cert?.option)],
      ["Age Groups", toStrArr(t.ageGroup?.option)],
      ["Levels",     toStrArr(t.level?.option)],
    ];
  },
  houseManager: (v: unknown): ServiceRow[] => {
    const t = v as HouseManagerValue;
    return [
      ["Skills",       toStrArr(t.experience?.option)],
      ["Housekeeping", toStrArr(t.performHouseKeeping?.option)],
      ["Budget Mgmt",  toStrArr(t.expMangeHouseholdBudget?.option)],
    ];
  },
};

const SERVICE_KEYS = Object.keys(SERVICE_ROW_BUILDERS);

// ─── Main export ──────────────────────────────────────────────────────────────

type AdditionalInfoEntry = { key: string; value: unknown };

export function DialogScrollableContent({ nanny }: { nanny: Users }) {
  const additionalInfo = (nanny.additionalInfo ?? []) as AdditionalInfoEntry[];
  const getInfo = (key: string): unknown =>
    additionalInfo.find((i) => i.key === key)?.value;

  // ── narrow all values at the top — nothing unknown reaches JSX ──────────
  const interestedPosiRaw  = asOption(getInfo("interestedPosi"));
  const availRaw           = getInfo("specificDaysAndTime") as AvailabilityValue | undefined;
  const childcareType      = asOption(getInfo("interestedChildcare"));
  const ageGroupsRaw       = asOption(getInfo("ageGroupsExp"));
  const availToStart       = asOption(getInfo("avaiForWorking"));
  const experience         = asOption(getInfo("experience"));
  const salaryExpRaw       = getInfo("salaryExp") as SalaryExpValue | undefined;
  const salaryRangeRaw     = getInfo("salaryRange") as SalaryRangeValue | undefined;
  const bgCheck            = asOption(getInfo("backgroundCheck"));
  const familyExpArr       = asFamilyExpArr(getInfo("FamilyExp"));
  const cookFor            = asOption(getInfo("cookFor"));
  const housekeeping       = asOption(getInfo("helpWithHousekeeping"));
  const certification      = asOption(getInfo("certification"));
  const transport          = asOption(getInfo("usePerTransport"));
  const sickChild          = asOption(getInfo("watchChildWhenTheyAreSick"));
  const references         = asOption(getInfo("references"));
  const language           = asOption(getInfo("language"));
  const workEnv            = asOption(getInfo("resOrPreAboutWorkEnv"));
  const prefTransport      = asOption(getInfo("preferredMetOfTran"));
  const jobDescRaw         = getInfo("jobDescription");
  const jobDesc: string | undefined =
    typeof jobDescRaw === "string" ? humanize(jobDescRaw) : undefined;

  // ── derived string arrays — all string[] before JSX ─────────────────────
  const availDays: string[] = availRaw
    ? Object.entries(availRaw)
        .filter(([, v]) => v?.checked)
        .map(([day, v]) => {
          const s = new Date(v.start).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
          const e = new Date(v.end).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
          return `${day}  ${s} – ${e}`;
        })
    : [];

  const salaryRows: [string, string][] = (salaryExpRaw
    ? ([
        ["1 Child",     salaryExpRaw.firstChild],
        ["2 Children",  salaryExpRaw.secChild],
        ["3 Children",  salaryExpRaw.thirdChild],
        ["4 Children",  salaryExpRaw.fourthChild],
        ["5+ Children", salaryExpRaw.fiveOrMoreChild],
      ] as [string, string | undefined][])
    : []
  ).filter((row): row is [string, string] => row[1] !== undefined);

  const interestedPosiTags: string[] = [
    ...humanizeList(toStrArr(interestedPosiRaw?.option)),
    ...(interestedPosiRaw?.typeHere ? [interestedPosiRaw.typeHere] : []),
  ];
  const ageGroupTags  = humanizeList(toStrArr(ageGroupsRaw?.option));
  const languageTags  = humanizeList(toStrArr(language?.option));
  const workEnvTags   = toStrArr(workEnv?.option).map((v) => v.replace(/\b\w/g, (c) => c.toUpperCase()));
  const certTags      = toStrArr(certification?.option).map((v) => v.replace(/\b\w/g, (c) => c.toUpperCase()));

  const bgCheckYes    = bgCheck?.option === "Yes";
  const referencesYes = references?.option === "Yes";

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
        <div style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 60%, #0c4a6e 100%)", padding: "22px 24px 18px", flexShrink: 0, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -30, right: -30, width: 130, height: 130, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
          <div style={{ position: "absolute", bottom: -20, left: 60, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />

          <DialogHeader>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, flexShrink: 0, background: "linear-gradient(135deg,#38bdf8,#0ea5e9)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 800, color: "white", border: "2px solid rgba(255,255,255,0.2)" }}>
                {(nanny.firstName?.[0] ?? "").toUpperCase()}
                {(nanny.lastName?.[0] ?? "").toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                  <DialogTitle style={{ color: "white", fontSize: 19, margin: 0 }}>
                    {nanny.firstName} {nanny.lastName}
                  </DialogTitle>
                  <span style={{ background: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.85)", fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 999 }}>
                    Nanny
                  </span>
                  {nanny.premium && (
                    <span style={{ background: "#f59e0b", color: "white", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 999 }}>
                      ⭐ Premium
                    </span>
                  )}
                </div>
                <p style={{ color: "rgba(255,255,255,0.38)", fontSize: 11, margin: 0 }}>
                  Joined {parseDate(nanny.createdAt)} · Last active {parseDate(nanny.ActiveAt)} ·{" "}
                  {nanny.online ? "🟢 Online" : "⚫ Offline"}
                </p>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* ── Scrollable body ── */}
        <div style={{ flex: 1, overflowY: "auto", padding: "4px 24px 28px", minHeight: 0, background: "#f8fafc" }}>

          {/* BASIC INFO */}
          <SectionHeading title="Basic Info" color={SECTION_COLORS.basic} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(190px,1fr))", gap: 10 }}>
            <InfoCard label="Email" value={nanny.email} accent={SECTION_COLORS.basic} />
            <InfoCard label="Last Active" value={parseDate(nanny.ActiveAt)} accent={SECTION_COLORS.basic} />
          </div>

          {/* PROFILE DETAILS */}
          <SectionHeading title="Profile Details" color={SECTION_COLORS.profile} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(190px,1fr))", gap: 10, marginBottom: 10 }}>
            <InfoCard label="Years of Experience" value={optStr(experience?.option)}  accent={SECTION_COLORS.profile} />
            <InfoCard label="Childcare Type"       value={optStr(childcareType?.option)} accent={SECTION_COLORS.profile} />
            <InfoCard label="Available To Start"   value={optStr(availToStart?.option)} accent={SECTION_COLORS.profile} />
            <InfoCard label="Cooking For"          value={optStr(cookFor?.option)}      accent={SECTION_COLORS.profile} />
            <InfoCard label="Housekeeping"         value={optStr(housekeeping?.option)} accent={SECTION_COLORS.profile} />
            <InfoCard label="Sick Child Care"      value={optStr(sickChild?.option)}    accent={SECTION_COLORS.profile} />
            <InfoCard label="Personal Transport"   value={optStr(transport?.option)}    accent={SECTION_COLORS.profile} />
            <InfoCard label="Preferred Transport"  value={optStr(prefTransport?.option)} accent={SECTION_COLORS.profile} />
            <InfoCard label="Background Check" accent={SECTION_COLORS.profile}>
              <span style={{ color: bgCheckYes ? "#16a34a" : "#dc2626", fontWeight: 700 }}>
                {bgCheckYes ? "✅ Yes" : "❌ No"}
              </span>
            </InfoCard>
            <InfoCard label="References Available" accent={SECTION_COLORS.profile}>
              <span style={{ color: referencesYes ? "#16a34a" : "#dc2626", fontWeight: 700 }}>
                {referencesYes ? "✅ Yes" : "❌ No"}
              </span>
            </InfoCard>
          </div>

          {/* About — full width */}
          <InfoCard label="About" value={jobDesc} accent={SECTION_COLORS.profile} />

          {/* Positions */}
          {interestedPosiTags.length > 0 && (
            <div style={{ marginTop: 10 }}>
              <InfoCard label="Interested Positions" accent="#7c3aed">
                <TagList items={interestedPosiTags} paletteIndex={0} />
              </InfoCard>
            </div>
          )}

          {/* Availability */}
          {availDays.length > 0 && (
            <div style={{ marginTop: 10 }}>
              <InfoCard label="Availability" accent="#0891b2">
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {availDays.map((d) => (
                    <span key={d} style={{ background: "#ecfeff", border: "1px solid #a5f3fc", color: "#0e7490", fontSize: 12, fontWeight: 600, padding: "5px 12px", borderRadius: 10 }}>
                      📅 {d}
                    </span>
                  ))}
                </div>
              </InfoCard>
            </div>
          )}

          {/* Age Groups */}
          {ageGroupTags.length > 0 && (
            <div style={{ marginTop: 10 }}>
              <InfoCard label="Experienced Age Groups" accent="#d97706">
                <TagList items={ageGroupTags} paletteIndex={3} />
              </InfoCard>
            </div>
          )}

          {/* Languages */}
          {languageTags.length > 0 && (
            <div style={{ marginTop: 10 }}>
              <InfoCard label="Languages Spoken" accent="#0369a1">
                <TagList items={languageTags} paletteIndex={7} />
              </InfoCard>
            </div>
          )}

          {/* Work Environment */}
          {workEnvTags.length > 0 && (
            <div style={{ marginTop: 10 }}>
              <InfoCard label="Work Environment Preferences" accent="#9333ea">
                <TagList items={workEnvTags} paletteIndex={1} />
              </InfoCard>
            </div>
          )}

          {/* Certifications */}
          {certTags.length > 0 && (
            <div style={{ marginTop: 10 }}>
              <InfoCard label="Certifications" accent="#0d9488">
                <TagList items={certTags} paletteIndex={4} />
              </InfoCard>
            </div>
          )}

          {/* Salary */}
          {salaryRows.length > 0 && (
            <div style={{ marginTop: 10 }}>
              <InfoCard label="Salary Expectations" accent="#16a34a">
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 2 }}>
                  {salaryRows.map(([lbl, val]) => (
                    <div key={lbl} style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: "8px 14px", textAlign: "center" }}>
                      <p style={{ fontSize: 18, fontWeight: 800, color: "#15803d", margin: 0 }}>${val}</p>
                      <p style={{ fontSize: 10, color: "#4ade80", fontWeight: 600, margin: "1px 0 0", textTransform: "uppercase", letterSpacing: "0.05em" }}>{lbl}</p>
                    </div>
                  ))}
                  {salaryRangeRaw && (
                    <div style={{ background: "#dcfce7", border: "1px solid #4ade80", borderRadius: 10, padding: "8px 14px", textAlign: "center", alignSelf: "center" }}>
                      <p style={{ fontSize: 14, fontWeight: 800, color: "#15803d", margin: 0 }}>${salaryRangeRaw.min} – ${salaryRangeRaw.max}</p>
                      <p style={{ fontSize: 10, color: "#4ade80", fontWeight: 600, margin: "1px 0 0", textTransform: "uppercase", letterSpacing: "0.05em" }}>Range</p>
                    </div>
                  )}
                </div>
              </InfoCard>
            </div>
          )}

          {/* Family Experience */}
          {familyExpArr.length > 0 && (
            <>
              <SectionHeading title="Family Experience" color="#0369a1" />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(270px,1fr))", gap: 10 }}>
                {familyExpArr.map((f, i) => <FamilyExpCard key={i} exp={f} />)}
              </div>
            </>
          )}

          {/* Services */}
          {SERVICE_KEYS.some((k) => Boolean(getInfo(k))) && (
            <>
              <SectionHeading title="Services & Specializations" color={SECTION_COLORS.services} />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(270px,1fr))", gap: 10 }}>
                {SERVICE_KEYS.map((key) => {
                  const val = getInfo(key);
                  if (!val) return null;
                  return (
                    <ServiceCard
                      key={key}
                      svcKey={key}
                      label={LABELS[key]}
                      rows={SERVICE_ROW_BUILDERS[key](val)}
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