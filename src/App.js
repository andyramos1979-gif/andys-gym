import { useState, useEffect, useCallback } from "react";
import { MEALS } from "./mealsData";

// ─── DATA ────────────────────────────────────────────────────────────────────

const MACROS = { kcal: 1712, protein: 159, carbs: 170, fat: 49 };

// Water goal: 100oz = 5 × 20oz
const WATER_MAX = 5;
const OZ_PER_TAP = 20;
const WATER_GOAL_OZ = WATER_MAX * OZ_PER_TAP;

const QUOTES = {
  Mon: "Show up. Do the work. Let the results make the noise.",
  Tue: "Strong back, strong life. Earn it rep by rep.",
  Wed: "Leg day builds the engine. Don't skip horsepower.",
  Thu: "Volume is the craft. Keep form clean and intent loud.",
  Fri: "Stack small wins. Strength compounds.",
  Sat: "Discipline is the cheat code. Press start anyway.",
  Sun: "Recovery is training. Recharge like it matters—because it does.",
};

const WORKOUTS = {
  "Mon-W1": {
    label: "Push HEAVY",
    color: "#ef4444",
    exercises: [
      "Incline Bench Press — 4×8",
      "Dumbbell Press — 4×8",
      "Cable Flyes — 3×10",
      "Seated Arnold Press — 3×8",
      "Lateral Raises — 3×10",
      "Seated Overhead DB Extensions — 3×8",
      "Cable Pressdowns — 3×10",
    ],
  },
  "Tue-W1": {
    label: "Pull HEAVY",
    color: "#3b82f6",
    exercises: [
      "Barbell Rows — 4×8",
      "Dumbbell Rows — 4×8",
      "Lat Pulldowns — 4×10",
      "Seated Rows — 4×10",
      "DB Hammer Curls — 3×10",
      "Preacher Curls — 3×10",
    ],
  },
  "Wed-W1": {
    label: "Legs HEAVY",
    color: "#22c55e",
    exercises: [
      "Sumo Squats — 4×10",
      "Leg Press — 4×12",
      "Lying Leg Curls — 4×12",
      "Dumbbell Lunges — 3×12",
      "Calf Raises — 5×15",
      "Hip Thrusts — 4×12",
    ],
  },
  "Thu-W1": {
    label: "Push VOLUME",
    color: "#f97316",
    exercises: [
      "Incline Dumbbell Press — 4×12",
      "Machine Chest Press — 4×12",
      "Pec Dec Flyes — 3×15",
      "Machine Shoulder Press — 3×15",
      "Bent-Over Raises — 3×12",
      "Reverse Overhead Rope Extension — 3×15",
      "Rope Pressdown — 3×12",
    ],
  },
  "Fri-W1": {
    label: "Pull VOLUME",
    color: "#eab308",
    exercises: [
      "Reverse Grip Barbell Rows — 4×12",
      "Wide Grip Seated Rows — 4×12",
      "Reverse Grip Pulldowns — 4×15",
      "Hammer Curls — 4×12",
      "EZ Bar Curls — 3×15",
      "Incline Curls — 3×12",
    ],
  },
  "Sat-W1": {
    label: "Legs VOLUME",
    color: "#a16207",
    exercises: [
      "Leg Extensions — 4×12",
      "Seated Leg Curls — 4×15",
      "Leg Press (Close Stance) — 4×15",
      "Stiff-Leg Deadlifts — 4×12",
      "Leg Press (Close Stance) — 3×12",
      "Seated Calf Raises — 3×13",
      "Standing Calf Raises — 5×15",
    ],
  },
  "Sun-W1": {
    label: "REST",
    color: "#a855f7",
    exercises: ["Walk / mobility / light movement (10–30 min)"],
  },
};

// Weeks 2-4 repeat same workouts
["W2", "W3", "W4"].forEach((w) => {
  Object.keys(WORKOUTS)
    .filter((k) => k.endsWith("W1"))
    .forEach((k) => {
      WORKOUTS[k.replace("W1", w)] = WORKOUTS[k];
    });
});


const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
// Generate an array from 1 to 52
const WEEKS = Array.from({ length: 52 }, (_, i) => i + 1);

const MONTH_GROUPS = [
  { name: "JANUARY", weeks: [1, 2, 3, 4] },
  { name: "FEBRUARY", weeks: [5, 6, 7, 8] },
  { name: "MARCH", weeks: [9, 10, 11, 12, 13] },
  { name: "APRIL", weeks: [14, 15, 16, 17] },
  { name: "MAY", weeks: [18, 19, 20, 21] },
  { name: "JUNE", weeks: [22, 23, 24, 25, 26] },
  { name: "JULY", weeks: [27, 28, 29, 30] },
  { name: "AUGUST", weeks: [31, 32, 33, 34] },
  { name: "SEPTEMBER", weeks: [35, 36, 37, 38, 39] },
  { name: "OCTOBER", weeks: [40, 41, 42, 43] },
  { name: "NOVEMBER", weeks: [44, 45, 46, 47] },
  { name: "DECEMBER", weeks: [48, 49, 50, 51, 52] },
];
const DAY_LABELS = {
  Mon: "Monday",
  Tue: "Tuesday",
  Wed: "Wednesday",
  Thu: "Thursday",
  Fri: "Friday",
  Sat: "Saturday",
  Sun: "Sunday",
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────

const initState = () => {
  const s = {};
  WEEKS.forEach((w) => {
    DAYS.forEach((d) => {
      const key = `${d}-W${w}`;
      const wk = WORKOUTS[key];
      s[key] = {
        steps: false,
        water: 0, // taps (0..WATER_MAX)
        sleep: 0,
        exercises: wk ? wk.exercises.map(() => false) : [],
        meals: { breakfast: [], lunch: [], snack: [], dinner: [] },
        weight: "",
        bodyFat: "",
        note: "",
      };
      const weekMeals = MEALS[w] || MEALS[1];
      const meal = weekMeals?.[d];
      if (meal) {
        ["breakfast", "lunch", "snack", "dinner"].forEach((m) => {
          s[key].meals[m] = meal[m] ? meal[m].items.map(() => false) : [];
        });
      }
    });
  });
  return s;
};

const calcDayScore = (day) => {
  let pts = 0,
    max = 0;

  max += 1;
  if (day.steps) pts += 1;

  max += WATER_MAX;
  pts += Math.min(day.water, WATER_MAX);

  max += 8;
  pts += Math.min(day.sleep, 8);

  const ex = day.exercises.filter(Boolean).length;
  max += day.exercises.length;
  pts += ex;

  const meals = Object.values(day.meals).flat();
  max += meals.length;
  pts += meals.filter(Boolean).length;

  return { pts, max, pct: max ? Math.round((pts / max) * 100) : 0 };
};

// ─── SUB-COMPONENTS ──────────────────────────────────────────────────────────

const Ring = ({
  pct,
  size = 56,
  stroke = 5,
  color = "#22d3ee",
  textColor = "#fff",
  trackColor = "rgba(255,255,255,.08)",
}) => {
  const r = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={trackColor}
        strokeWidth={stroke}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        style={{ transition: "stroke-dasharray .5s ease" }}
      />
      <text
        x={size / 2}
        y={size / 2}
        dominantBaseline="middle"
        textAnchor="middle"
        style={{
          fill: textColor,
          fontSize: size * 0.22,
          fontFamily: "'Space Mono',monospace",
          transform: "rotate(90deg)",
          transformOrigin: `${size / 2}px ${size / 2}px`,
        }}
      >
        {pct}%
      </text>
    </svg>
  );
};

const Bar = ({ value, max, color, label, unit, trackColor }) => (
  <div style={{ marginBottom: 10 }}>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: 4,
        fontSize: 12,
        color: "var(--muted)",
      }}
    >
      <span>{label}</span>
      <span style={{ color }}>
        {value}/{max} {unit}
      </span>
    </div>
    <div
      style={{
        background: trackColor,
        borderRadius: 99,
        height: 7,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: `${Math.min(100, (value / max) * 100)}%`,
          height: "100%",
          background: color,
          borderRadius: 99,
          transition: "width .4s ease",
        }}
      />
    </div>
  </div>
);

const CheckItem = ({
  label,
  checked,
  onToggle,
  accent = "#22d3ee",
  textOn = "var(--text)",
  textOff = "var(--muted)",
}) => (
  <button
    onClick={onToggle}
    style={{
      display: "flex",
      alignItems: "center",
      gap: 10,
      width: "100%",
      background: "none",
      border: "none",
      cursor: "pointer",
      padding: "6px 0",
      textAlign: "left",
    }}
  >
    <span
      style={{
        width: 20,
        height: 20,
        borderRadius: 6,
        border: `2px solid ${checked ? accent : "var(--border)"}`,
        background: checked ? accent : "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        transition: "all .2s",
      }}
    >
      {checked && (
        <span style={{ color: "#000", fontSize: 12, fontWeight: 900 }}>✓</span>
      )}
    </span>
    <span
      style={{
        fontSize: 13,
        color: checked ? textOn : textOff,
        textDecoration: checked ? "line-through" : "none",
        transition: "all .2s",
      }}
    >
      {label}
    </span>
  </button>
);

const Section = ({ icon, title, children, accent = "#22d3ee" }) => (
  <div
    style={{
      background: "var(--panel)",
      border: "1px solid var(--border)",
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
      <span style={{ fontSize: 18 }}>{icon}</span>
      <span
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: accent,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        {title}
      </span>
    </div>
    {children}
  </div>
);

// ─── MAIN ─────────────────────────────────────────────────────────────────────

export default function GymDashboard() {
  const [activeWeek, setActiveWeek] = useState(1);
  const [activeDay, setActiveDay] = useState("Mon");
  const [data, setData] = useState(initState);
  const [expandedMeal, setExpandedMeal] = useState(null);
  const [toast, setToast] = useState(null);

  // iPhone-safe localStorage keys (dashboard data)
  const STORAGE_KEY = "gymdata_neon";
  const LEGACY_KEY = "gymdata";

  // Theme toggle stored separately
  const THEME_KEY = "andys_gym_theme";
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "dark";
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === "light" || saved === "dark") return saved;
    try {
      return window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: light)").matches
        ? "light"
        : "dark";
    } catch {
      return "dark";
    }
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {}
  }, [theme]);

  const isDark = theme === "dark";

  // Theme variables
  const cssVars = {
    "--text": isDark ? "rgba(255,255,255,.92)" : "rgba(10,10,15,.92)",
    "--muted": isDark ? "rgba(255,255,255,.55)" : "rgba(10,10,15,.60)",
    "--muted2": isDark ? "rgba(255,255,255,.35)" : "rgba(10,10,15,.45)",
    "--panel": isDark ? "rgba(255,255,255,.04)" : "rgba(0,0,0,.04)",
    "--panel2": isDark ? "rgba(255,255,255,.06)" : "rgba(0,0,0,.06)",
    "--border": isDark ? "rgba(255,255,255,.10)" : "rgba(0,0,0,.12)",
    "--border2": isDark ? "rgba(255,255,255,.14)" : "rgba(0,0,0,.16)",
    "--track": isDark ? "rgba(255,255,255,.07)" : "rgba(0,0,0,.08)",
    "--headerFade": isDark
      ? "linear-gradient(180deg, rgba(10,10,20,.95) 0%, transparent 100%)"
      : "linear-gradient(180deg, rgba(248,250,252,.98) 0%, rgba(248,250,252,0) 100%)",
    "--bg": isDark
      ? "linear-gradient(135deg, #0a0a0f 0%, #0f0f1a 50%, #0a0d0f 100%)"
      : "linear-gradient(135deg, #f8fafc 0%, #eef2ff 50%, #f8fafc 100%)",
    "--toastBg": isDark ? "rgba(34,211,238,.15)" : "rgba(14,165,233,.12)",
    "--toastBorder": isDark ? "rgba(34,211,238,.4)" : "rgba(14,165,233,.35)",
  };

  const key = `${activeDay}-W${activeWeek}`;
  const day = data[key];
  const wk = WORKOUTS[key];
  const meal = MEALS[activeWeek]?.[activeDay] || MEALS[1]?.[activeDay];
  const score = calcDayScore(day);

  // Hydration values
  const waterOz = (day.water || 0) * OZ_PER_TAP;
  const waterRemaining = Math.max(0, WATER_GOAL_OZ - waterOz);
  const hydrationPct = Math.min(100, Math.round((waterOz / WATER_GOAL_OZ) * 100));

  // ✅ iPhone-safe load with migration + corruption safety
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const legacy = localStorage.getItem(LEGACY_KEY);
      const current = localStorage.getItem(STORAGE_KEY);

      if (!current && legacy) {
        localStorage.setItem(STORAGE_KEY, legacy);
        localStorage.removeItem(LEGACY_KEY);
      }

      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return;

      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === "object") {
        // Merge saved data into a full 52-week skeleton so weeks with no
        // saved data still have valid default objects instead of undefined.
        setData((prev) => ({ ...prev, ...parsed }));
      }
    } catch {
      try { localStorage.removeItem(STORAGE_KEY); } catch {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ iPhone-safe save (quota-safe)
  const save = useCallback((newData) => {
    setData(newData);
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    } catch {
      setToast("⚠️ Storage full on this device. Try clearing old data.");
      setTimeout(() => setToast(null), 2500);
    }
  }, []); // intentionally minimal deps

  const update = (updater) => {
    const newData = { ...data };
    newData[key] = { ...day, ...updater(day) };
    save(newData);
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  const toggleExercise = (i) => {
    const exercises = [...day.exercises];
    exercises[i] = !exercises[i];
    update(() => ({ exercises }));
    if (!day.exercises[i]) showToast("💪 Rep logged!");
  };

  const toggleMealItem = (mealType, i) => {
    const mealsObj = { ...day.meals };
    const arr = [...mealsObj[mealType]];
    arr[i] = !arr[i];
    mealsObj[mealType] = arr;
    update(() => ({ meals: mealsObj }));
  };

  const toggleSteps = () => {
    update((d) => ({ steps: !d.steps }));
    if (!day.steps) showToast("👟 10k steps!");
  };

  const totalWeekScore = DAYS.reduce((acc, d) => {
    const k = `${d}-W${activeWeek}`;
    return acc + calcDayScore(data[k]).pct;
  }, 0);
  const weekAvg = Math.round(totalWeekScore / 7);

  const mealTypes = ["breakfast", "lunch", "snack", "dinner"];
  const mealIcons = { breakfast: "🍳", lunch: "🥗", snack: "🍎", dinner: "🍽️" };
  const accentColor = wk?.color || "#a855f7";

  return (
    <div
      style={{
        ...cssVars,
        minHeight: "100vh",
        background: "var(--bg)",
        fontFamily: "'Space Mono', 'Courier New', monospace",
        color: "var(--text)",
        padding: "0 0 calc(80px + env(safe-area-inset-bottom))",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Bebas+Neue&display=swap');
        * { box-sizing: border-box; }
        html, body { height: 100%; }
        body { margin: 0; overscroll-behavior-y: none; -webkit-tap-highlight-color: transparent; background: var(--bg); }
        button { touch-action: manipulation; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(0,0,0,.20); border-radius: 2px; }
        .day-btn:hover { transform: translateY(-2px); }
        .week-btn:hover { opacity: .9; }
        @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        @keyframes slideIn { from { transform: translateX(100px); opacity:0; } to { transform: translateX(0); opacity:1; } }
      `}</style>

      {/* TOAST */}
      {toast && (
        <div
          style={{
            position: "fixed",
            top: "calc(20px + env(safe-area-inset-top))",
            right: 20,
            zIndex: 999,
            background: "var(--toastBg)",
            backdropFilter: "blur(10px)",
            border: "1px solid var(--toastBorder)",
            borderRadius: 12,
            padding: "10px 18px",
            fontSize: 14,
            fontWeight: 700,
            color: isDark ? "#22d3ee" : "#0284c7",
            animation: "slideIn .3s ease",
          }}
        >
          {toast}
        </div>
      )}

      {/* HEADER */}
      <div
        style={{
          background: "var(--headerFade)",
          padding: "calc(24px + env(safe-area-inset-top)) 20px 16px",
          position: "sticky",
          top: "env(safe-area-inset-top)",
          zIndex: 10,
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div style={{ maxWidth: 480, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
            <div>
              <div
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: 28,
                  letterSpacing: "0.1em",
                  color: isDark ? "#22d3ee" : "#0ea5e9",
                  lineHeight: 1,
                }}
              >
                ⚡ ANDYS GYM
              </div>
              <div style={{ fontSize: 10, color: "var(--muted2)", letterSpacing: "0.15em", marginTop: 2 }}>
                4-WEEK DASHBOARD
              </div>
            </div>

            <div style={{ textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {/* Dark Mode Toggle */}
                <button
                  onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
                  style={{
                    borderRadius: 12,
                    padding: "8px 10px",
                    border: "1px solid var(--border)",
                    background: "var(--panel)",
                    color: "var(--text)",
                    cursor: "pointer",
                    fontSize: 12,
                    fontWeight: 800,
                    letterSpacing: "0.06em",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                  aria-label="Toggle dark mode"
                  title="Toggle theme"
                >
                  {isDark ? "🌙 Dark" : "☀️ Light"}
                </button>

                <div>
                  <div style={{ fontSize: 10, color: "var(--muted2)", letterSpacing: "0.1em" }}>WEEK AVG</div>
                  <div
                    style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: 28,
                      color: weekAvg > 70 ? "#22c55e" : weekAvg > 40 ? "#eab308" : "#ef4444",
                    }}
                  >
                    {weekAvg}%
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* WEEK SELECTOR */}
          <div style={{ marginTop: 14, position: "relative" }}>
            <select
              value={activeWeek}
              onChange={(e) => setActiveWeek(Number(e.target.value))}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: 10,
                background: "var(--panel)",
                border: "1px solid var(--border)",
                color: "var(--text)",
                fontFamily: "'Space Mono',monospace",
                fontWeight: 800,
                fontSize: 14,
                cursor: "pointer",
                outline: "none",
                appearance: "none",
              }}
            >
              {MONTH_GROUPS.map((month) => (
                <optgroup
                  key={month.name}
                  label={month.name}
                  style={{ background: isDark ? "#1a1a24" : "#f1f5f9", color: isDark ? "#22d3ee" : "#0ea5e9", fontStyle: "normal" }}
                >
                  {month.weeks.map((w) => (
                    <option
                      key={w}
                      value={w}
                      style={{ background: isDark ? "#0a0a0f" : "#fff", color: isDark ? "#fff" : "#000" }}
                    >
                      WEEK {w}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            {/* Custom Dropdown Arrow */}
            <div
              style={{
                position: "absolute",
                right: 14,
                top: "50%",
                transform: "translateY(-50%)",
                pointerEvents: "none",
                fontSize: 12,
                color: "var(--muted)"
              }}
            >
              ▼
            </div>
          </div>

          {/* DAY TABS */}
          <div style={{ display: "flex", gap: 4, marginTop: 8, overflowX: "auto", paddingBottom: 2 }}>
            {DAYS.map((d) => {
              const dk = `${d}-W${activeWeek}`;
              const ds = calcDayScore(data[dk]);
              const isActive = d === activeDay;
              const dayColor = WORKOUTS[dk]?.color || "#a855f7";
              return (
                <button
                  key={d}
                  className="day-btn"
                  onClick={() => setActiveDay(d)}
                  style={{
                    flex: "0 0 auto",
                    padding: "8px 10px",
                    borderRadius: 10,
                    background: isActive ? dayColor : "var(--panel)",
                    border: `1px solid ${isActive ? dayColor : "var(--border)"}`,
                    cursor: "pointer",
                    color: isActive ? "#000" : "var(--muted)",
                    fontFamily: "'Space Mono',monospace",
                    fontWeight: 800,
                    fontSize: 11,
                    transition: "all .2s",
                    minWidth: 46,
                    textAlign: "center",
                  }}
                >
                  <div>{d}</div>
                  <div style={{ fontSize: 9, marginTop: 1, opacity: 0.8 }}>{ds.pct}%</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "16px 16px 0", animation: "fadeIn .3s ease" }} key={key}>
        {/* DAY HERO */}
        <div
          style={{
            background: `linear-gradient(135deg, ${accentColor}18, ${accentColor}08)`,
            border: `1px solid ${accentColor}30`,
            borderRadius: 20,
            padding: 20,
            marginBottom: 12,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 32, color: accentColor, lineHeight: 1 }}>
              {DAY_LABELS[activeDay]}
            </div>
            <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>
              WEEK {activeWeek} · {wk?.label || "REST DAY"}
            </div>
            <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 10, fontStyle: "italic", maxWidth: 220, lineHeight: 1.5 }}>
              "{QUOTES[activeDay]}"
            </div>
          </div>
          <Ring
            pct={score.pct}
            color={accentColor}
            size={72}
            stroke={6}
            textColor={isDark ? "#fff" : "rgba(10,10,15,.9)"}
            trackColor={isDark ? "rgba(255,255,255,.10)" : "rgba(0,0,0,.10)"}
          />
        </div>

        {/* MACRO STRIP */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginBottom: 12 }}>
          {[
            { label: "KCAL", val: MACROS.kcal, color: "#f97316" },
            { label: "PROTEIN", val: `${MACROS.protein}g`, color: "#ef4444" },
            { label: "CARBS", val: `${MACROS.carbs}g`, color: "#22d3ee" },
            { label: "FAT", val: `${MACROS.fat}g`, color: "#eab308" },
          ].map((m) => (
            <div key={m.label} style={{ background: "var(--panel)", border: "1px solid var(--border)", borderRadius: 12, padding: "10px 8px", textAlign: "center" }}>
              <div style={{ fontSize: 16, fontWeight: 900, color: m.color, fontFamily: "'Bebas Neue',sans-serif" }}>{m.val}</div>
              <div style={{ fontSize: 9, color: "var(--muted2)", letterSpacing: "0.1em", marginTop: 2 }}>{m.label}</div>
            </div>
          ))}
        </div>

        {/* DAILY VITALS */}
        <Section icon="📊" title="Daily Vitals" accent={isDark ? "#22d3ee" : "#0ea5e9"}>
          <CheckItem label="10,000+ Steps Completed" checked={day.steps} onToggle={toggleSteps} accent={isDark ? "#22d3ee" : "#0ea5e9"} />

          {/* Hydration Tracker */}
          <div
            style={{
              marginTop: 14,
              padding: 12,
              borderRadius: 14,
              background: "var(--panel2)",
              border: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <div style={{ fontSize: 12, fontWeight: 900, color: isDark ? "#38bdf8" : "#0284c7" }}>
                💧 Hydration Tracker
              </div>
              <div style={{ fontSize: 12, color: "var(--text)", fontWeight: 800 }}>
                {waterOz} / {WATER_GOAL_OZ} oz{" "}
                <span style={{ marginLeft: 10, fontSize: 11, color: "var(--muted)" }}>
                  ({waterRemaining} oz remaining)
                </span>
              </div>
              <div style={{ fontSize: 11, color: "var(--muted)" }}>
                Tap +{OZ_PER_TAP} below to log water.
              </div>
            </div>

            <Ring
              pct={hydrationPct}
              color={isDark ? "#38bdf8" : "#0284c7"}
              size={60}
              stroke={6}
              textColor={isDark ? "#fff" : "rgba(10,10,15,.9)"}
              trackColor={isDark ? "rgba(255,255,255,.10)" : "rgba(0,0,0,.10)"}
            />
          </div>

          {/* Water buttons (100oz = 5 taps) */}
          <div style={{ marginTop: 12 }}>
            <Bar value={day.water} max={WATER_MAX} color={isDark ? "#38bdf8" : "#0284c7"} label="💧 Water" unit="×20oz" trackColor={"var(--track)"} />
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {[...Array(WATER_MAX)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => update((d) => ({ water: d.water === i + 1 ? i : i + 1 }))}
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    border: `2px solid ${day.water > i ? (isDark ? "#38bdf8" : "#0284c7") : "var(--border)"}`,
                    background: day.water > i ? (isDark ? "rgba(56,189,248,.2)" : "rgba(2,132,199,.18)") : "transparent",
                    color: day.water > i ? (isDark ? "#38bdf8" : "#0284c7") : "var(--muted2)",
                    cursor: "pointer",
                    fontSize: 11,
                    fontWeight: 900,
                    fontFamily: "'Space Mono',monospace",
                    transition: "all .2s",
                  }}
                >
                  +{OZ_PER_TAP}
                </button>
              ))}
            </div>
          </div>

          {/* Sleep */}
          <div style={{ marginTop: 12 }}>
            <Bar value={day.sleep} max={8} color="#a78bfa" label="😴 Sleep" unit="hrs" trackColor={"var(--track)"} />
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              {[...Array(8)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => update((d) => ({ sleep: d.sleep === i + 1 ? i : i + 1 }))}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    border: `2px solid ${day.sleep > i ? "#a78bfa" : "var(--border)"}`,
                    background: day.sleep > i ? "rgba(167,139,250,.2)" : "transparent",
                    color: day.sleep > i ? "#a78bfa" : "var(--muted2)",
                    cursor: "pointer",
                    fontSize: 10,
                    fontWeight: 900,
                    fontFamily: "'Space Mono',monospace",
                    transition: "all .2s",
                  }}
                >
                  +1h
                </button>
              ))}
            </div>
          </div>
        </Section>

        {/* WORKOUT */}
        <Section icon="🏋️" title={`Workout · ${wk?.label || "Active Recovery"}`} accent={accentColor}>
          {wk?.exercises.map((ex, i) => (
            <CheckItem key={i} label={ex} checked={day.exercises[i]} onToggle={() => toggleExercise(i)} accent={accentColor} />
          ))}
          {day.exercises.length > 0 && (
            <div
              style={{
                marginTop: 12,
                padding: "8px 12px",
                borderRadius: 10,
                background: `${accentColor}18`,
                border: `1px solid ${accentColor}25`,
                fontSize: 12,
                color: accentColor,
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span>Sets completed</span>
              <span style={{ fontWeight: 900 }}>
                {day.exercises.filter(Boolean).length}/{day.exercises.length}
              </span>
            </div>
          )}
        </Section>

        {/* NUTRITION */}
        <Section icon="🍽️" title="Nutrition" accent="#22c55e">
          {mealTypes.map((mt) => {
            const mealData = meal?.[mt];
            if (!mealData) return null;
            const checked = day.meals[mt] || [];
            const allDone = checked.every(Boolean) && checked.length > 0;
            const isExpanded = expandedMeal === mt;

            return (
              <div key={mt} style={{ marginBottom: 8 }}>
                <button
                  onClick={() => setExpandedMeal(isExpanded ? null : mt)}
                  style={{
                    width: "100%",
                    background: allDone ? "rgba(34,197,94,.12)" : "var(--panel)",
                    border: `1px solid ${allDone ? "rgba(34,197,94,.3)" : "var(--border)"}`,
                    borderRadius: 12,
                    padding: "12px 14px",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    transition: "all .2s",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 18 }}>{mealIcons[mt]}</span>
                    <div style={{ textAlign: "left" }}>
                      <div style={{ fontSize: 12, fontWeight: 900, color: allDone ? "#22c55e" : "var(--text)" }}>
                        {mealData.name}
                      </div>
                      <div style={{ fontSize: 10, color: "var(--muted2)", marginTop: 1 }}>
                        {checked.filter(Boolean).length}/{mealData.items.length} items
                      </div>
                    </div>
                  </div>
                  <span style={{ color: "var(--muted2)", fontSize: 12, transform: isExpanded ? "rotate(180deg)" : "none", transition: "transform .2s" }}>
                    ▼
                  </span>
                </button>

                {isExpanded && (
                  <div style={{ padding: "8px 14px 4px", animation: "fadeIn .2s ease" }}>
                    {mealData.items.map((item, i) => (
                      <CheckItem key={i} label={item} checked={checked[i]} onToggle={() => toggleMealItem(mt, i)} accent="#22c55e" />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </Section>

        {/* CHECK-IN */}
        <Section icon="📌" title="Weekly Check-In" accent="#f59e0b">
          {(() => {
            const isCheckInDay = activeDay === "Mon";
            const prevWeekKey = `Mon-W${activeWeek - 1}`;
            const prevWeekData = activeWeek > 1 ? data[prevWeekKey] : null;

            const renderDiff = (current, previous, unit) => {
              if (!current || !previous) return null;
              const diff = parseFloat(current) - parseFloat(previous);
              if (isNaN(diff) || diff === 0) return <span style={{ color: "var(--muted)", marginLeft: 6, fontSize: 10 }}>—</span>;
              const isDown = diff < 0;
              const color = isDown ? "#22c55e" : "#ef4444";
              return (
                <span style={{ color, fontSize: 11, marginLeft: 6, fontWeight: 900 }}>
                  {isDown ? "▼" : "▲"} {Math.abs(diff).toFixed(1)}{unit}
                </span>
              );
            };

            return (
              <>
                {!isCheckInDay && (
                  <div style={{
                    padding: "8px 12px",
                    background: "rgba(245, 158, 11, 0.1)",
                    border: "1px solid rgba(245, 158, 11, 0.2)",
                    borderRadius: 8,
                    marginBottom: 12,
                    fontSize: 11,
                    color: "#f59e0b",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    gap: 6
                  }}>
                    <span>🔒</span> Check-in locked until next Monday.
                  </div>
                )}

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {[
                    { label: "Weight (lb)", field: "weight", unit: "lb" },
                    { label: "Body Fat %", field: "bodyFat", unit: "%" },
                  ].map(({ label, field, unit }) => (
                    <div key={field}>
                      <div style={{ fontSize: 10, color: "var(--muted2)", marginBottom: 4, letterSpacing: "0.1em", display: "flex", alignItems: "center" }}>
                        {label}
                        {isCheckInDay && prevWeekData && renderDiff(day[field], prevWeekData[field], unit)}
                      </div>
                      <input
                        type="number"
                        value={day[field]}
                        onChange={(e) => update((d) => ({ [field]: e.target.value }))}
                        placeholder="—"
                        disabled={!isCheckInDay}
                        style={{
                          width: "100%",
                          background: isCheckInDay ? "var(--panel2)" : "var(--panel)",
                          border: "1px solid var(--border2)",
                          borderRadius: 10,
                          padding: "10px 12px",
                          color: isCheckInDay ? "var(--text)" : "var(--muted)",
                          fontSize: 16,
                          fontWeight: 900,
                          fontFamily: "'Space Mono',monospace",
                          outline: "none",
                          opacity: isCheckInDay ? 1 : 0.5,
                          cursor: isCheckInDay ? "text" : "not-allowed",
                          transition: "all .2s"
                        }}
                      />
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: 8 }}>
                  <div style={{ fontSize: 10, color: "var(--muted2)", marginBottom: 4, letterSpacing: "0.1em" }}>NOTES</div>
                  <textarea
                    value={day.note}
                    onChange={(e) => update((d) => ({ note: e.target.value }))}
                    placeholder={isCheckInDay ? "How did the week go? Energy, mood, PRs..." : "Notes locked."}
                    disabled={!isCheckInDay}
                    rows={3}
                    style={{
                      width: "100%",
                      background: isCheckInDay ? "var(--panel2)" : "var(--panel)",
                      border: "1px solid var(--border2)",
                      borderRadius: 10,
                      padding: "10px 12px",
                      color: isCheckInDay ? "var(--text)" : "var(--muted)",
                      fontSize: 13,
                      fontFamily: "'Space Mono',monospace",
                      outline: "none",
                      resize: "none",
                      lineHeight: 1.6,
                      opacity: isCheckInDay ? 1 : 0.5,
                      cursor: isCheckInDay ? "text" : "not-allowed",
                      transition: "all .2s"
                    }}
                  />
                </div>
              </>
            );
          })()}
        </Section>

        {/* WEEK OVERVIEW */}
        <Section icon="📅" title="Week Overview" accent="#818cf8">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4 }}>
            {DAYS.map((d) => {
              const dk = `${d}-W${activeWeek}`;
              const ds = calcDayScore(data[dk]);
              const dc = WORKOUTS[dk]?.color || "#a855f7";
              return (
                <button
                  key={d}
                  onClick={() => setActiveDay(d)}
                  style={{
                    background: d === activeDay ? dc : "var(--panel)",
                    border: `1px solid ${d === activeDay ? dc : "var(--border)"}`,
                    borderRadius: 10,
                    padding: "8px 4px",
                    cursor: "pointer",
                    textAlign: "center",
                    transition: "all .2s",
                  }}
                >
                  <div style={{ fontSize: 9, color: d === activeDay ? "#000" : "var(--muted)", fontWeight: 900 }}>
                    {d}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 900,
                      color:
                        d === activeDay
                          ? "#000"
                          : ds.pct > 70
                          ? "#22c55e"
                          : ds.pct > 30
                          ? "#eab308"
                          : "var(--muted2)",
                      marginTop: 2,
                      fontFamily: "'Bebas Neue',sans-serif",
                    }}
                  >
                    {ds.pct}%
                  </div>
                </button>
              );
            })}
          </div>
        </Section>
      </div>
    </div>
  );
}