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
  // ── W1 ──
  "Mon-W1": { label: "Pull", color: "#3b82f6", exercises: ["Barbell Bench Press (4x8)", "Dumbbell Shoulder Press (4x8)", "Single-Arm Dumbbell Rows (3x10)", "Standing Military Press (3x8)", "Weighted Raises (3x10)", "Bench Tricep Dips (3x8)", "Skull Crushers (3x10)"] },
  "Tue-W1": { label: "Pull", color: "#3b82f6", exercises: ["New machine Hack squats (4x10)", "Single leg press (4x12)", "Cable pull through (4x12)", "Step-Ups (3x12)", "New machine Calf Raises (5x15)", "Glute Bridges (4x12)"] },
  "Wed-W1": { label: "Legs", color: "#22c55e", exercises: ["Single-Leg Romanian Deadlift (4x8)", "Cable bent over rows (4x8)", "Dumbbell pullover (4x10)", "Face Pulls (4x10)", "Concentration Curls (3x10)", "Cable Curls (3x10)"] },
  "Thu-W1": { label: "Push", color: "#ef4444", exercises: ["Bench Press (4x12)", "Dumbbell Flyes (4x12)", "Cable Crossovers (3x15)", "Arnold Press (3x15)", "Upright Rows (3x12)", "Overhead Tricep Extension (3x15)", "Tricep Kickbacks (3x12)"] },
  "Fri-W1": { label: "Pull", color: "#3b82f6", exercises: ["Bent-Over Barbell Rows (4x12)", "Single-Arm Dumbbell Rows (4x12)", "Chin-Ups (4x15)", "Seated Cable Rows (4x12)", "Zottman Curls (3x15)", "Spider Curls (3x12)"] },
  "Sat-W1": { label: "Legs", color: "#22c55e", exercises: ["New machine Hack squats (4x12)", "Single leg press (4x15)", "Cable pull through (4x15)", "Step-Ups (3x12)", "New machine Calf Raises (5x12)", "Glute Bridges (4x15)"] },
  // ── W2 ──
  "Mon-W2": { label: "Pull", color: "#3b82f6", exercises: ["Barbell Bench Press (4x8)", "Dumbbell Shoulder Press (4x8)", "Single-Arm Dumbbell Rows (3x10)", "Standing Military Press (3x8)", "Weighted Raises (3x10)", "Bench Tricep Dips (3x8)", "Skull Crushers (3x10)"] },
  "Tue-W2": { label: "Pull", color: "#3b82f6", exercises: ["New machine Hack squats (4x10)", "Single leg press (4x12)", "Cable pull through (4x12)", "Step-Ups (3x12)", "New machine Calf Raises (5x15)", "Glute Bridges (4x12)"] },
  "Wed-W2": { label: "Legs", color: "#22c55e", exercises: ["Single-Leg Romanian Deadlift (4x8)", "Cable bent over rows (4x8)", "Dumbbell pullover (4x10)", "Face Pulls (4x10)", "Concentration Curls (3x10)", "Cable Curls (3x10)"] },
  "Thu-W2": { label: "Push", color: "#ef4444", exercises: ["Bench Press (4x12)", "Dumbbell Flyes (4x12)", "Cable Crossovers (3x15)", "Arnold Press (3x15)", "Upright Rows (3x12)", "Overhead Tricep Extension (3x15)", "Tricep Kickbacks (3x12)"] },
  "Fri-W2": { label: "Pull", color: "#3b82f6", exercises: ["Bent-Over Barbell Rows (4x12)", "Single-Arm Dumbbell Rows (4x12)", "Chin-Ups (4x15)", "Seated Cable Rows (4x12)", "Zottman Curls (3x15)", "Spider Curls (3x12)"] },
  "Sat-W2": { label: "Legs", color: "#22c55e", exercises: ["New machine Hack squats (4x12)", "Single leg press (4x15)", "Cable pull through (4x15)", "Step-Ups (3x12)", "New machine Calf Raises (5x12)", "Glute Bridges (4x15)"] },
  // ── W3 ──
  "Mon-W3": { label: "Pull", color: "#3b82f6", exercises: ["Barbell Bench Press (4x8)", "Dumbbell Shoulder Press (4x8)", "Single-Arm Dumbbell Rows (3x10)", "Standing Military Press (3x8)", "Weighted Raises (3x10)", "Bench Tricep Dips (3x8)", "Skull Crushers (3x10)"] },
  "Tue-W3": { label: "Pull", color: "#3b82f6", exercises: ["New machine Hack squats (4x10)", "Single leg press (4x12)", "Cable pull through (4x12)", "Step-Ups (3x12)", "New machine Calf Raises (5x15)", "Glute Bridges (4x12)"] },
  "Wed-W3": { label: "Legs", color: "#22c55e", exercises: ["Single-Leg Romanian Deadlift (4x8)", "Cable bent over rows (4x8)", "Dumbbell pullover (4x10)", "Face Pulls (4x10)", "Concentration Curls (3x10)", "Cable Curls (3x10)"] },
  "Thu-W3": { label: "Push", color: "#ef4444", exercises: ["Bench Press (4x12)", "Dumbbell Flyes (4x12)", "Cable Crossovers (3x15)", "Arnold Press (3x15)", "Upright Rows (3x12)", "Overhead Tricep Extension (3x15)", "Tricep Kickbacks (3x12)"] },
  "Fri-W3": { label: "Pull", color: "#3b82f6", exercises: ["Bent-Over Barbell Rows (4x12)", "Single-Arm Dumbbell Rows (4x12)", "Chin-Ups (4x15)", "Seated Cable Rows (4x12)", "Zottman Curls (3x15)", "Spider Curls (3x12)"] },
  "Sat-W3": { label: "Legs", color: "#22c55e", exercises: ["New machine Hack squats (4x12)", "Single leg press (4x15)", "Cable pull through (4x15)", "Step-Ups (3x12)", "New machine Calf Raises (5x12)", "Glute Bridges (4x15)"] },
  // ── W4 ──
  "Mon-W4": { label: "Pull", color: "#3b82f6", exercises: ["Barbell Bench Press (4x8)", "Dumbbell Shoulder Press (4x8)", "Single-Arm Dumbbell Rows (3x10)", "Standing Military Press (3x8)", "Weighted Raises (3x10)", "Bench Tricep Dips (3x8)", "Skull Crushers (3x10)"] },
  "Tue-W4": { label: "Pull", color: "#3b82f6", exercises: ["New machine Hack squats (4x10)", "Single leg press (4x12)", "Cable pull through (4x12)", "Step-Ups (3x12)", "New machine Calf Raises (5x15)", "Glute Bridges (4x12)"] },
  "Wed-W4": { label: "Legs", color: "#22c55e", exercises: ["Single-Leg Romanian Deadlift (4x8)", "Cable bent over rows (4x8)", "Dumbbell pullover (4x10)", "Face Pulls (4x10)", "Concentration Curls (3x10)", "Cable Curls (3x10)"] },
  "Thu-W4": { label: "Push", color: "#ef4444", exercises: ["Bench Press (4x12)", "Dumbbell Flyes (4x12)", "Cable Crossovers (3x15)", "Arnold Press (3x15)", "Upright Rows (3x12)", "Overhead Tricep Extension (3x15)", "Tricep Kickbacks (3x12)"] },
  "Fri-W4": { label: "Pull", color: "#3b82f6", exercises: ["Bent-Over Barbell Rows (4x12)", "Single-Arm Dumbbell Rows (4x12)", "Chin-Ups (4x15)", "Seated Cable Rows (4x12)", "Zottman Curls (3x15)", "Spider Curls (3x12)"] },
  "Sat-W4": { label: "Legs", color: "#22c55e", exercises: ["New machine Hack squats (4x12)", "Single leg press (4x15)", "Cable pull through (4x15)", "Step-Ups (3x12)", "New machine Calf Raises (5x12)", "Glute Bridges (4x15)"] },
  // ── W5 ──
  "Mon-W5": { label: "Push", color: "#ef4444", exercises: ["Barbell Bench Press (4x8)", "Dumbbell Shoulder Press (4x8)", "Chest Dips (3x10)", "Standing Military Press (3x8)", "Front Raises (3x10)", "Tricep Dips (3x8)", "Skull Crushers (3x10)"] },
  "Tue-W5": { label: "Pull", color: "#3b82f6", exercises: ["Deadlifts (4x8)", "T-Bar Rows (4x8)", "Pull-Ups (4x10)", "Face Pulls (4x12)", "Concentration Curls (3x10)", "Cable Curls (3x10)"] },
  "Wed-W5": { label: "Push", color: "#ef4444", exercises: ["Decline Bench Press (4x12)", "Dumbbell Flyes (4x12)", "Cable Crossovers (3x15)", "Arnold Press (3x15)", "Upright Rows (3x12)", "Overhead Tricep Extension (3x15)", "Tricep Kickbacks (3x12)"] },
  "Thu-W5": { label: "Legs", color: "#22c55e", exercises: ["Back Squats (4x10)", "Bulgarian Split Squats (4x12)", "Romanian Deadlifts (4x12)", "Step-Ups (3x12)", "Standing Calf Raises (5x15)", "Glute Bridges (4x12)"] },
  "Fri-W5": { label: "Pull", color: "#3b82f6", exercises: ["Bent-Over Barbell Rows (4x12)", "Single-Arm Dumbbell Rows (4x12)", "Chin-Ups (4x15)", "Seated Cable Rows (4x12)", "Zottman Curls (3x15)", "Incline Dumbbell Curls (3x12)"] },
  "Sat-W5": { label: "Legs", color: "#22c55e", exercises: ["Hack Squats (4x12)", "Lying Leg Curls (4x15)", "Goblet Squats (4x15)", "Good Mornings (4x12)", "Donkey Calf Raises (3x12)", "Seated Calf Raises (5x15)"] },
  // ── W6 ──
  "Mon-W6": { label: "Push", color: "#ef4444", exercises: ["Barbell Bench Press (4x8)", "Dumbbell Shoulder Press (4x8)", "Chest Dips (3x10)", "Standing Military Press (3x8)", "Front Raises (3x10)", "Tricep Dips (3x8)", "Skull Crushers (3x10)"] },
  "Tue-W6": { label: "Pull", color: "#3b82f6", exercises: ["Deadlifts (4x8)", "T-Bar Rows (4x8)", "Pull-Ups (4x10)", "Face Pulls (4x12)", "Concentration Curls (3x10)", "Cable Curls (3x10)"] },
  "Wed-W6": { label: "Push", color: "#ef4444", exercises: ["Decline Bench Press (4x12)", "Dumbbell Flyes (4x12)", "Cable Crossovers (3x15)", "Arnold Press (3x15)", "Upright Rows (3x12)", "Overhead Tricep Extension (3x15)", "Tricep Kickbacks (3x12)"] },
  "Thu-W6": { label: "Legs", color: "#22c55e", exercises: ["Back Squats (4x10)", "Bulgarian Split Squats (4x12)", "Romanian Deadlifts (4x12)", "Step-Ups (3x12)", "Standing Calf Raises (5x15)", "Glute Bridges (4x12)"] },
  "Fri-W6": { label: "Pull", color: "#3b82f6", exercises: ["Bent-Over Barbell Rows (4x12)", "Single-Arm Dumbbell Rows (4x12)", "Chin-Ups (4x15)", "Seated Cable Rows (4x12)", "Zottman Curls (3x15)", "Incline Dumbbell Curls (3x12)"] },
  "Sat-W6": { label: "Legs", color: "#22c55e", exercises: ["Hack Squats (4x12)", "Lying Leg Curls (4x15)", "Goblet Squats (4x15)", "Good Mornings (4x12)", "Donkey Calf Raises (3x12)", "Seated Calf Raises (5x15)"] },
  // ── W7 ──
  "Mon-W7": { label: "Push", color: "#ef4444", exercises: ["Barbell Bench Press (4x8)", "Dumbbell Shoulder Press (4x8)", "Chest Dips (3x10)", "Standing Military Press (3x8)", "Front Raises (3x10)", "Tricep Dips (3x8)", "Skull Crushers (3x10)"] },
  "Tue-W7": { label: "Pull", color: "#3b82f6", exercises: ["Deadlifts (4x8)", "T-Bar Rows (4x8)", "Pull-Ups (4x10)", "Face Pulls (4x12)", "Concentration Curls (3x10)", "Cable Curls (3x10)"] },
  "Wed-W7": { label: "Push", color: "#ef4444", exercises: ["Decline Bench Press (4x12)", "Dumbbell Flyes (4x12)", "Cable Crossovers (3x15)", "Arnold Press (3x15)", "Upright Rows (3x12)", "Overhead Tricep Extension (3x15)", "Tricep Kickbacks (3x12)"] },
  "Thu-W7": { label: "Legs", color: "#22c55e", exercises: ["Back Squats (4x10)", "Bulgarian Split Squats (4x12)", "Romanian Deadlifts (4x12)", "Step-Ups (3x12)", "Standing Calf Raises (5x15)", "Glute Bridges (4x12)"] },
  "Fri-W7": { label: "Pull", color: "#3b82f6", exercises: ["Bent-Over Barbell Rows (4x12)", "Single-Arm Dumbbell Rows (4x12)", "Chin-Ups (4x15)", "Seated Cable Rows (4x12)", "Zottman Curls (3x15)", "Incline Dumbbell Curls (3x12)"] },
  "Sat-W7": { label: "Legs", color: "#22c55e", exercises: ["Hack Squats (4x12)", "Lying Leg Curls (4x15)", "Goblet Squats (4x15)", "Good Mornings (4x12)", "Donkey Calf Raises (3x12)", "Seated Calf Raises (5x15)"] },
  // ── W8 ──
  "Mon-W8": { label: "Push", color: "#ef4444", exercises: ["Barbell Bench Press (4x8)", "Dumbbell Shoulder Press (4x8)", "Chest Dips (3x10)", "Standing Military Press (3x8)", "Front Raises (3x10)", "Tricep Dips (3x8)", "Skull Crushers (3x10)"] },
  "Tue-W8": { label: "Pull", color: "#3b82f6", exercises: ["Deadlifts (4x8)", "T-Bar Rows (4x8)", "Pull-Ups (4x10)", "Face Pulls (4x12)", "Concentration Curls (3x10)", "Cable Curls (3x10)"] },
  "Wed-W8": { label: "Push", color: "#ef4444", exercises: ["Decline Bench Press (4x12)", "Dumbbell Flyes (4x12)", "Cable Crossovers (3x15)", "Arnold Press (3x15)", "Upright Rows (3x12)", "Overhead Tricep Extension (3x15)", "Tricep Kickbacks (3x12)"] },
  "Thu-W8": { label: "Legs", color: "#22c55e", exercises: ["Back Squats (4x10)", "Bulgarian Split Squats (4x12)", "Romanian Deadlifts (4x12)", "Step-Ups (3x12)", "Standing Calf Raises (5x15)", "Glute Bridges (4x12)"] },
  "Fri-W8": { label: "Pull", color: "#3b82f6", exercises: ["Bent-Over Barbell Rows (4x12)", "Single-Arm Dumbbell Rows (4x12)", "Chin-Ups (4x15)", "Seated Cable Rows (4x12)", "Zottman Curls (3x15)", "Incline Dumbbell Curls (3x12)"] },
  "Sat-W8": { label: "Legs", color: "#22c55e", exercises: ["Hack Squats (4x12)", "Lying Leg Curls (4x15)", "Goblet Squats (4x15)", "Good Mornings (4x12)", "Donkey Calf Raises (3x12)", "Seated Calf Raises (5x15)"] },
  // ── W9 ──
  "Mon-W9": { label: "Push", color: "#ef4444", exercises: ["Incline Bench Press (4x8)", "Dumbbell Press (4x8)", "Cable Flyes (3x10)", "Seated Arnold Press (3x8)", "Lateral Raises (3x10)", "Seated Overhead Dumbbell Extensions (3x8)", "Cable Pressdowns (3x10)"] },
  "Tue-W9": { label: "Pull", color: "#3b82f6", exercises: ["Barbell Rows (4x8)", "Dumbbell Rows (4x8)", "Lat Pulldowns (4x10)", "Seated Rows (4x10)", "Dumbbell Hammer Curls (3x10)", "Preacher Curls (3x10)"] },
  "Wed-W9": { label: "Legs", color: "#22c55e", exercises: ["Sumo Squats (4x10)", "Leg Press (4x12)", "Lying Leg Curls (4x12)", "Dumbbell Lunges (3x12)", "Calf Raises (5x15)", "Hip thrust (4x12)"] },
  "Thu-W9": { label: "Push", color: "#ef4444", exercises: ["Incline Dumbbell Press (4x12)", "Machine Chest Press (4x12)", "Pec Dec Flyes (3x15)", "Machine Shoulder Press (3x15)", "Bent-Over Raises (3x12)", "Reverse Overhead Rope Extension (3x15)", "Rope Pressdown (3x12)"] },
  "Fri-W9": { label: "Pull", color: "#3b82f6", exercises: ["Reverse Grip Barbell Rows (4x12)", "Wide Grip Seated Rows (4x12)", "Reverse Grip Pulldowns (4x15)", "Hammer Curls (4x12)", "EZ Bar Curls (3x15)", "Incline Curls (3x12)"] },
  "Sat-W9": { label: "Legs", color: "#22c55e", exercises: ["Leg Extension (4x12)", "Seated Leg Curls (4x15)", "Leg Press Close Stance (4x15)", "Stiff-Leg Deadlifts (4x12)", "Leg Press Close Stance (3x12)", "Seated Calf Raises (3x13)", "Standing Calf Raises (5x15)"] },
  // ── W10 ──
  "Mon-W10": { label: "Push", color: "#ef4444", exercises: ["Incline Bench Press (4x8)", "Dumbbell Press (4x8)", "Cable Flyes (3x10)", "Seated Arnold Press (3x8)", "Lateral Raises (3x10)", "Seated Overhead Dumbbell Extensions (3x8)", "Cable Pressdowns (3x10)"] },
  "Tue-W10": { label: "Pull", color: "#3b82f6", exercises: ["Barbell Rows (4x8)", "Dumbbell Rows (4x8)", "Lat Pulldowns (4x10)", "Seated Rows (4x10)", "Dumbbell Hammer Curls (3x10)", "Preacher Curls (3x10)"] },
  "Wed-W10": { label: "Legs", color: "#22c55e", exercises: ["Sumo Squats (4x10)", "Leg Press (4x12)", "Lying Leg Curls (4x12)", "Dumbbell Lunges (3x12)", "Calf Raises (5x15)", "Hip thrust (4x12)"] },
  "Thu-W10": { label: "Push", color: "#ef4444", exercises: ["Incline Dumbbell Press (4x12)", "Machine Chest Press (4x12)", "Pec Dec Flyes (3x15)", "Machine Shoulder Press (3x15)", "Bent-Over Raises (3x12)", "Reverse Overhead Rope Extension (3x15)", "Rope Pressdown (3x12)"] },
  "Fri-W10": { label: "Pull", color: "#3b82f6", exercises: ["Reverse Grip Barbell Rows (4x12)", "Wide Grip Seated Rows (4x12)", "Reverse Grip Pulldowns (4x15)", "Hammer Curls (4x12)", "EZ Bar Curls (3x15)", "Incline Curls (3x12)"] },
  "Sat-W10": { label: "Legs", color: "#22c55e", exercises: ["Leg Extension (4x12)", "Seated Leg Curls (4x15)", "Leg Press Close Stance (4x15)", "Stiff-Leg Deadlifts (4x12)", "Leg Press Close Stance (3x12)", "Seated Calf Raises (3x13)", "Standing Calf Raises (5x15)"] },
  // ── W11 ──
  "Mon-W11": { label: "Push", color: "#ef4444", exercises: ["Incline Bench Press (4x8)", "Dumbbell Press (4x8)", "Cable Flyes (3x10)", "Seated Arnold Press (3x8)", "Lateral Raises (3x10)", "Seated Overhead Dumbbell Extensions (3x8)", "Cable Pressdowns (3x10)"] },
  "Tue-W11": { label: "Pull", color: "#3b82f6", exercises: ["Barbell Rows (4x8)", "Dumbbell Rows (4x8)", "Lat Pulldowns (4x10)", "Seated Rows (4x10)", "Dumbbell Hammer Curls (3x10)", "Preacher Curls (3x10)"] },
  "Wed-W11": { label: "Legs", color: "#22c55e", exercises: ["Sumo Squats (4x10)", "Leg Press (4x12)", "Lying Leg Curls (4x12)", "Dumbbell Lunges (3x12)", "Calf Raises (5x15)", "Hip thrust (4x12)"] },
  "Thu-W11": { label: "Push", color: "#ef4444", exercises: ["Incline Dumbbell Press (4x12)", "Machine Chest Press (4x12)", "Pec Dec Flyes (3x15)", "Machine Shoulder Press (3x15)", "Bent-Over Raises (3x12)", "Reverse Overhead Rope Extension (3x15)", "Rope Pressdown (3x12)"] },
  "Fri-W11": { label: "Pull", color: "#3b82f6", exercises: ["Reverse Grip Barbell Rows (4x12)", "Wide Grip Seated Rows (4x12)", "Reverse Grip Pulldowns (4x15)", "Hammer Curls (4x12)", "EZ Bar Curls (3x15)", "Incline Curls (3x12)"] },
  "Sat-W11": { label: "Legs", color: "#22c55e", exercises: ["Leg Extension (4x12)", "Seated Leg Curls (4x15)", "Leg Press Close Stance (4x15)", "Stiff-Leg Deadlifts (4x12)", "Leg Press Close Stance (3x12)", "Seated Calf Raises (3x13)", "Standing Calf Raises (5x15)"] },
  // ── W12 ──
  "Mon-W12": { label: "Push", color: "#ef4444", exercises: ["Incline Bench Press (4x8)", "Dumbbell Press (4x8)", "Cable Flyes (3x10)", "Seated Arnold Press (3x8)", "Lateral Raises (3x10)", "Seated Overhead Dumbbell Extensions (3x8)", "Cable Pressdowns (3x10)"] },
  "Tue-W12": { label: "Pull", color: "#3b82f6", exercises: ["Barbell Rows (4x8)", "Dumbbell Rows (4x8)", "Lat Pulldowns (4x10)", "Seated Rows (4x10)", "Dumbbell Hammer Curls (3x10)", "Preacher Curls (3x10)"] },
  "Wed-W12": { label: "Legs", color: "#22c55e", exercises: ["Sumo Squats (4x10)", "Leg Press (4x12)", "Lying Leg Curls (4x12)", "Dumbbell Lunges (3x12)", "Calf Raises (5x15)", "Hip thrust (4x12)"] },
  "Thu-W12": { label: "Push", color: "#ef4444", exercises: ["Incline Dumbbell Press (4x12)", "Machine Chest Press (4x12)", "Pec Dec Flyes (3x15)", "Machine Shoulder Press (3x15)", "Bent-Over Raises (3x12)", "Reverse Overhead Rope Extension (3x15)", "Rope Pressdown (3x12)"] },
  "Fri-W12": { label: "Pull", color: "#3b82f6", exercises: ["Reverse Grip Barbell Rows (4x12)", "Wide Grip Seated Rows (4x12)", "Reverse Grip Pulldowns (4x15)", "Hammer Curls (4x12)", "EZ Bar Curls (3x15)", "Incline Curls (3x12)"] },
  "Sat-W12": { label: "Legs", color: "#22c55e", exercises: ["Leg Extension (4x12)", "Seated Leg Curls (4x15)", "Leg Press Close Stance (4x15)", "Stiff-Leg Deadlifts (4x12)", "Leg Press Close Stance (3x12)", "Seated Calf Raises (3x13)", "Standing Calf Raises (5x15)"] },
  // ── W13 ──
  "Mon-W13": { label: "Upper Body", color: "#3b82f6", exercises: ["Cable Biceps Curl (3x12)", "Cable Flyes (3x12)", "High Cable Curl (3x12)", "Dual Cable Biceps Curl (3x12)", "Incline Bench Press (3x12)", "Bench Press (3x12)"] },
  "Tue-W13": { label: "Lower Body", color: "#22c55e", exercises: ["Cable Glute Kickback (3x12)", "Standing Cable Calf Raise (3x12)", "Machine Leg Press (3x12)", "Leg Curls (3x12)", "Seated Dumbbell Squat (3x12)", "Barbell Hip Thrust (3x12)"] },
  "Wed-W13": { label: "Back and Biceps", color: "#3b82f6", exercises: ["Straight Arm Lat Pulldown (3x12)", "Seated Cable Row (3x12)", "Incline Dumbbell Row (3x12)", "21s Barbell Curls (3x12)", "Hammer Curls (3x12)", "Preacher Dumbbell Curls (3x12)"] },
  "Thu-W13": { label: "Chest and Triceps", color: "#ef4444", exercises: ["Cable Crossover (3x12)", "Cable Chest Press (3x12)", "Cable Overhead Triceps Extension (3x12)", "Close Grip Bench Press (3x12)", "Dips (3x12)", "Cable Triceps Extension (3x12)"] },
  "Fri-W13": { label: "Legs and Shoulders", color: "#22c55e", exercises: ["Cable Front Raise (3x12)", "Cable Rear Delt Fly (3x12)", "Cable Lateral Raise (3x12)", "Barbell Squat (5x12)", "Machine Leg Press (5x12)", "Barbell Lunge (3x12)"] },
  // ── W14 ──
  "Mon-W14": { label: "Upper Body", color: "#3b82f6", exercises: ["Cable Biceps Curl (3x12)", "Cable Flyes (3x12)", "High Cable Curl (3x12)", "Dual Cable Biceps Curl (3x12)", "Incline Bench Press (3x12)", "Bench Press (3x12)"] },
  "Tue-W14": { label: "Lower Body", color: "#22c55e", exercises: ["Cable Glute Kickback (3x12)", "Standing Cable Calf Raise (3x12)", "Machine Leg Press (3x12)", "Leg Curls (3x12)", "Seated Dumbbell Squat (3x12)", "Barbell Hip Thrust (3x12)"] },
  "Wed-W14": { label: "Back and Biceps", color: "#3b82f6", exercises: ["Straight Arm Lat Pulldown (3x12)", "Seated Cable Row (3x12)", "Incline Dumbbell Row (3x12)", "21s Barbell Curls (3x12)", "Hammer Curls (3x12)", "Preacher Dumbbell Curls (3x12)"] },
  "Thu-W14": { label: "Chest and Triceps", color: "#ef4444", exercises: ["Cable Crossover (3x12)", "Cable Chest Press (3x12)", "Cable Overhead Triceps Extension (3x12)", "Close Grip Bench Press (3x12)", "Dips (3x12)", "Cable Triceps Extension (3x12)"] },
  "Fri-W14": { label: "Legs and Shoulders", color: "#22c55e", exercises: ["Cable Front Raise (3x12)", "Cable Rear Delt Fly (3x12)", "Cable Lateral Raise (3x12)", "Barbell Squat (5x12)", "Machine Leg Press (5x12)", "Barbell Lunge (3x12)"] },
  // ── W15 ──
  "Mon-W15": { label: "Upper Body", color: "#3b82f6", exercises: ["Cable Biceps Curl (3x12)", "Cable Flyes (3x12)", "High Cable Curl (3x12)", "Dual Cable Biceps Curl (3x12)", "Incline Bench Press (3x12)", "Bench Press (3x12)"] },
  "Tue-W15": { label: "Lower Body", color: "#22c55e", exercises: ["Cable Glute Kickback (3x12)", "Standing Cable Calf Raise (3x12)", "Machine Leg Press (3x12)", "Leg Curls (3x12)", "Seated Dumbbell Squat (3x12)", "Barbell Hip Thrust (3x12)"] },
  "Wed-W15": { label: "Back and Biceps", color: "#3b82f6", exercises: ["Straight Arm Lat Pulldown (3x12)", "Seated Cable Row (3x12)", "Incline Dumbbell Row (3x12)", "21s Barbell Curls (3x12)", "Hammer Curls (3x12)", "Preacher Dumbbell Curls (3x12)"] },
  "Thu-W15": { label: "Chest and Triceps", color: "#ef4444", exercises: ["Cable Crossover (3x12)", "Cable Chest Press (3x12)", "Cable Overhead Triceps Extension (3x12)", "Close Grip Bench Press (3x12)", "Dips (3x12)", "Cable Triceps Extension (3x12)"] },
  "Fri-W15": { label: "Legs and Shoulders", color: "#22c55e", exercises: ["Cable Front Raise (3x12)", "Cable Rear Delt Fly (3x12)", "Cable Lateral Raise (3x12)", "Barbell Squat (5x12)", "Machine Leg Press (5x12)", "Barbell Lunge (3x12)"] },
  // ── W16 ──
  "Mon-W16": { label: "Upper Body", color: "#3b82f6", exercises: ["Cable Biceps Curl (3x12)", "Cable Flyes (3x12)", "High Cable Curl (3x12)", "Dual Cable Biceps Curl (3x12)", "Incline Bench Press (3x12)", "Bench Press (3x12)"] },
  "Tue-W16": { label: "Lower Body", color: "#22c55e", exercises: ["Cable Glute Kickback (3x12)", "Standing Cable Calf Raise (3x12)", "Machine Leg Press (3x12)", "Leg Curls (3x12)", "Seated Dumbbell Squat (3x12)", "Barbell Hip Thrust (3x12)"] },
  "Wed-W16": { label: "Back and Biceps", color: "#3b82f6", exercises: ["Straight Arm Lat Pulldown (3x12)", "Seated Cable Row (3x12)", "Incline Dumbbell Row (3x12)", "21s Barbell Curls (3x12)", "Hammer Curls (3x12)", "Preacher Dumbbell Curls (3x12)"] },
  "Thu-W16": { label: "Chest and Triceps", color: "#ef4444", exercises: ["Cable Crossover (3x12)", "Cable Chest Press (3x12)", "Cable Overhead Triceps Extension (3x12)", "Close Grip Bench Press (3x12)", "Dips (3x12)", "Cable Triceps Extension (3x12)"] },
  "Fri-W16": { label: "Legs and Shoulders", color: "#22c55e", exercises: ["Cable Front Raise (3x12)", "Cable Rear Delt Fly (3x12)", "Cable Lateral Raise (3x12)", "Barbell Squat (5x12)", "Machine Leg Press (5x12)", "Barbell Lunge (3x12)"] },
  // ── W17 ──
  "Mon-W17": { label: "Push", color: "#ef4444", exercises: ["Bench Press (4x8)", "Dumbbell Shoulder Press (4x8)", "Chest Flyes (3x10)", "Lateral Raises (3x8)", "Tricep Dips (3x10)", "Overhead Tricep Extensions (3x10)"] },
  "Tue-W17": { label: "Pull", color: "#3b82f6", exercises: ["Pull-Ups or Assisted Pull-Ups (4x8)", "Single-Arm Dumbbell Row (4x8)", "Lat Pulldowns (4x10)", "Face Pulls (4x10)", "Hammer Curls (3x8)", "Preacher Curls (3x10)"] },
  "Wed-W17": { label: "Legs", color: "#22c55e", exercises: ["Back Squats (4x8)", "Leg Press (4x12)", "Barbell Hip Thrust (4x12)", "Goblet Squats (3x12)", "Calf Raises (5x15)"] },
  "Thu-W17": { label: "Push", color: "#ef4444", exercises: ["Incline Dumbbell Press (4x12)", "Machine Shoulder Press (4x12)", "Pec Dec Flyes (3x15)", "Lateral Raises (3x15)", "Parallel Bar Dips (3x12)", "Rope Pushdowns (3x15)"] },
  "Fri-W17": { label: "Pull", color: "#3b82f6", exercises: ["T-Bar Rows (4x12)", "Seated Cable Rows (4x12)", "Wide Grip Pulldowns (4x15)", "Face Pulls (4x12)", "Barbell Curls (3x15)", "Hammer Curls (3x12)"] },
  "Sat-W17": { label: "Legs", color: "#22c55e", exercises: ["Leg Extensions (4x12)", "Lying Leg Curls (4x15)", "Hack Squats (4x15)", "Stiff-Leg Deadlifts (4x12)", "Seated Calf Raises (5x15)", "Standing Calf Raises (5x15)"] },
  // ── W18 ──
  "Mon-W18": { label: "Push", color: "#ef4444", exercises: ["Bench Press (4x8)", "Dumbbell Shoulder Press (4x8)", "Chest Flyes (3x10)", "Lateral Raises (3x8)", "Tricep Dips (3x10)", "Overhead Tricep Extensions (3x10)"] },
  "Tue-W18": { label: "Pull", color: "#3b82f6", exercises: ["Pull-Ups or Assisted Pull-Ups (4x8)", "Single-Arm Dumbbell Row (4x8)", "Lat Pulldowns (4x10)", "Face Pulls (4x10)", "Hammer Curls (3x8)", "Preacher Curls (3x10)"] },
  "Wed-W18": { label: "Legs", color: "#22c55e", exercises: ["Back Squats (4x8)", "Leg Press (4x12)", "Barbell Hip Thrust (4x12)", "Goblet Squats (3x12)", "Calf Raises (5x15)"] },
  "Thu-W18": { label: "Push", color: "#ef4444", exercises: ["Incline Dumbbell Press (4x12)", "Machine Shoulder Press (4x12)", "Pec Dec Flyes (3x15)", "Lateral Raises (3x15)", "Parallel Bar Dips (3x12)", "Rope Pushdowns (3x15)"] },
  "Fri-W18": { label: "Pull", color: "#3b82f6", exercises: ["T-Bar Rows (4x12)", "Seated Cable Rows (4x12)", "Wide Grip Pulldowns (4x15)", "Face Pulls (4x12)", "Barbell Curls (3x15)", "Hammer Curls (3x12)"] },
  "Sat-W18": { label: "Legs", color: "#22c55e", exercises: ["Leg Extensions (4x12)", "Lying Leg Curls (4x15)", "Hack Squats (4x15)", "Stiff-Leg Deadlifts (4x12)", "Seated Calf Raises (5x15)", "Standing Calf Raises (5x15)"] },
  // ── W19 ──
  "Mon-W19": { label: "Push", color: "#ef4444", exercises: ["Bench Press (4x8)", "Dumbbell Shoulder Press (4x8)", "Chest Flyes (3x10)", "Lateral Raises (3x8)", "Tricep Dips (3x10)", "Overhead Tricep Extensions (3x10)"] },
  "Tue-W19": { label: "Pull", color: "#3b82f6", exercises: ["Pull-Ups or Assisted Pull-Ups (4x8)", "Single-Arm Dumbbell Row (4x8)", "Lat Pulldowns (4x10)", "Face Pulls (4x10)", "Hammer Curls (3x8)", "Preacher Curls (3x10)"] },
  "Wed-W19": { label: "Legs", color: "#22c55e", exercises: ["Back Squats (4x8)", "Leg Press (4x12)", "Barbell Hip Thrust (4x12)", "Goblet Squats (3x12)", "Calf Raises (5x15)"] },
  "Thu-W19": { label: "Push", color: "#ef4444", exercises: ["Incline Dumbbell Press (4x12)", "Machine Shoulder Press (4x12)", "Pec Dec Flyes (3x15)", "Lateral Raises (3x15)", "Parallel Bar Dips (3x12)", "Rope Pushdowns (3x15)"] },
  "Fri-W19": { label: "Pull", color: "#3b82f6", exercises: ["T-Bar Rows (4x12)", "Seated Cable Rows (4x12)", "Wide Grip Pulldowns (4x15)", "Face Pulls (4x12)", "Barbell Curls (3x15)", "Hammer Curls (3x12)"] },
  "Sat-W19": { label: "Legs", color: "#22c55e", exercises: ["Leg Extensions (4x12)", "Lying Leg Curls (4x15)", "Hack Squats (4x15)", "Stiff-Leg Deadlifts (4x12)", "Seated Calf Raises (5x15)", "Standing Calf Raises (5x15)"] },
  // ── W20 ──
  "Mon-W20": { label: "Push", color: "#ef4444", exercises: ["Bench Press (4x8)", "Dumbbell Shoulder Press (4x8)", "Chest Flyes (3x10)", "Lateral Raises (3x8)", "Tricep Dips (3x10)", "Overhead Tricep Extensions (3x10)"] },
  "Tue-W20": { label: "Pull", color: "#3b82f6", exercises: ["Pull-Ups or Assisted Pull-Ups (4x8)", "Single-Arm Dumbbell Row (4x8)", "Lat Pulldowns (4x10)", "Face Pulls (4x10)", "Hammer Curls (3x8)", "Preacher Curls (3x10)"] },
  "Wed-W20": { label: "Legs", color: "#22c55e", exercises: ["Back Squats (4x8)", "Leg Press (4x12)", "Barbell Hip Thrust (4x12)", "Goblet Squats (3x12)", "Calf Raises (5x15)"] },
  "Thu-W20": { label: "Push", color: "#ef4444", exercises: ["Incline Dumbbell Press (4x12)", "Machine Shoulder Press (4x12)", "Pec Dec Flyes (3x15)", "Lateral Raises (3x15)", "Parallel Bar Dips (3x12)", "Rope Pushdowns (3x15)"] },
  "Fri-W20": { label: "Pull", color: "#3b82f6", exercises: ["T-Bar Rows (4x12)", "Seated Cable Rows (4x12)", "Wide Grip Pulldowns (4x15)", "Face Pulls (4x12)", "Barbell Curls (3x15)", "Hammer Curls (3x12)"] },
  "Sat-W20": { label: "Legs", color: "#22c55e", exercises: ["Leg Extensions (4x12)", "Lying Leg Curls (4x15)", "Hack Squats (4x15)", "Stiff-Leg Deadlifts (4x12)", "Seated Calf Raises (5x15)", "Standing Calf Raises (5x15)"] },
  // ── W21 ──
  "Mon-W21": { label: "Upper Body", color: "#3b82f6", exercises: ["Cable Biceps Curl (3x12)", "Dual Cable Biceps Curl (3x12)", "High Cable Curl (3x12)", "Bench Press (3x12)", "Incline Bench Press (3x12)", "Cable Flyes (3x12)"] },
  "Tue-W21": { label: "Lower Body", color: "#22c55e", exercises: ["Cable Glute Kickback (3x12)", "Standing Cable Calf Raise (3x12)", "Machine Leg Press (3x12)", "Leg Curls (3x12)", "Seated Dumbbell Squat (3x12)", "Barbell Hip Thrust (3x12)"] },
  "Wed-W21": { label: "Back and Biceps", color: "#3b82f6", exercises: ["Straight Arm Lat Pulldown (3x12)", "Seated Cable Row (3x12)", "Incline Dumbbell Row (3x12)", "21s Barbell Curls (3x12)", "Hammer Curls (3x12)", "Preacher Dumbbell Curls (3x12)"] },
  "Thu-W21": { label: "Chest and Triceps", color: "#ef4444", exercises: ["Cable Crossover (3x12)", "Cable Chest Press (3x12)", "Cable Overhead Triceps Extension (3x12)", "Close Grip Bench Press (3x12)", "Dips (3x12)", "Cable Triceps Extension (3x12)"] },
  "Fri-W21": { label: "Legs and Shoulders", color: "#22c55e", exercises: ["Cable Front Raise (3x12)", "Cable Rear Delt Fly (3x12)", "Cable Lateral Raise (3x12)", "Kettlebell Squat (5x12)", "Kettlebell Swing (5x12)", "Kettlebell Lunge (5x12)"] },
  // ── W22 ──
  "Mon-W22": { label: "Upper Body", color: "#3b82f6", exercises: ["Cable Biceps Curl (3x12)", "Dual Cable Biceps Curl (3x12)", "High Cable Curl (3x12)", "Bench Press (3x12)", "Incline Bench Press (3x12)", "Cable Flyes (3x12)"] },
  "Tue-W22": { label: "Lower Body", color: "#22c55e", exercises: ["Cable Glute Kickback (3x12)", "Standing Cable Calf Raise (3x12)", "Machine Leg Press (3x12)", "Leg Curls (3x12)", "Seated Dumbbell Squat (3x12)", "Barbell Hip Thrust (3x12)"] },
  "Wed-W22": { label: "Back and Biceps", color: "#3b82f6", exercises: ["Straight Arm Lat Pulldown (3x12)", "Seated Cable Row (3x12)", "Incline Dumbbell Row (3x12)", "21s Barbell Curls (3x12)", "Hammer Curls (3x12)", "Preacher Dumbbell Curls (3x12)"] },
  "Thu-W22": { label: "Chest and Triceps", color: "#ef4444", exercises: ["Cable Crossover (3x12)", "Cable Chest Press (3x12)", "Cable Overhead Triceps Extension (3x12)", "Close Grip Bench Press (3x12)", "Dips (3x12)", "Cable Triceps Extension (3x12)"] },
  "Fri-W22": { label: "Legs and Shoulders", color: "#22c55e", exercises: ["Cable Front Raise (3x12)", "Cable Rear Delt Fly (3x12)", "Cable Lateral Raise (3x12)", "Kettlebell Squat (5x12)", "Kettlebell Swing (5x12)", "Kettlebell Lunge (5x12)"] },
  // ── W23 ──
  "Mon-W23": { label: "Upper Body", color: "#3b82f6", exercises: ["Cable Biceps Curl (3x12)", "Dual Cable Biceps Curl (3x12)", "High Cable Curl (3x12)", "Bench Press (3x12)", "Incline Bench Press (3x12)", "Cable Flyes (3x12)"] },
  "Tue-W23": { label: "Lower Body", color: "#22c55e", exercises: ["Cable Glute Kickback (3x12)", "Standing Cable Calf Raise (3x12)", "Machine Leg Press (3x12)", "Leg Curls (3x12)", "Seated Dumbbell Squat (3x12)", "Barbell Hip Thrust (3x12)"] },
  "Wed-W23": { label: "Back and Biceps", color: "#3b82f6", exercises: ["Straight Arm Lat Pulldown (3x12)", "Seated Cable Row (3x12)", "Incline Dumbbell Row (3x12)", "21s Barbell Curls (3x12)", "Hammer Curls (3x12)", "Preacher Dumbbell Curls (3x12)"] },
  "Thu-W23": { label: "Chest and Triceps", color: "#ef4444", exercises: ["Cable Crossover (3x12)", "Cable Chest Press (3x12)", "Cable Overhead Triceps Extension (3x12)", "Close Grip Bench Press (3x12)", "Dips (3x12)", "Cable Triceps Extension (3x12)"] },
  "Fri-W23": { label: "Legs and Shoulders", color: "#22c55e", exercises: ["Cable Front Raise (3x12)", "Cable Rear Delt Fly (3x12)", "Cable Lateral Raise (3x12)", "Kettlebell Squat (5x12)", "Kettlebell Swing (5x12)", "Kettlebell Lunge (5x12)"] },
  // ── W24 ──
  "Mon-W24": { label: "Upper Body", color: "#3b82f6", exercises: ["Cable Biceps Curl (3x12)", "Dual Cable Biceps Curl (3x12)", "High Cable Curl (3x12)", "Bench Press (3x12)", "Incline Bench Press (3x12)", "Cable Flyes (3x12)"] },
  "Tue-W24": { label: "Lower Body", color: "#22c55e", exercises: ["Cable Glute Kickback (3x12)", "Standing Cable Calf Raise (3x12)", "Machine Leg Press (3x12)", "Leg Curls (3x12)", "Seated Dumbbell Squat (3x12)", "Barbell Hip Thrust (3x12)"] },
  "Wed-W24": { label: "Back and Biceps", color: "#3b82f6", exercises: ["Straight Arm Lat Pulldown (3x12)", "Seated Cable Row (3x12)", "Incline Dumbbell Row (3x12)", "21s Barbell Curls (3x12)", "Hammer Curls (3x12)", "Preacher Dumbbell Curls (3x12)"] },
  "Thu-W24": { label: "Chest and Triceps", color: "#ef4444", exercises: ["Cable Crossover (3x12)", "Cable Chest Press (3x12)", "Cable Overhead Triceps Extension (3x12)", "Close Grip Bench Press (3x12)", "Dips (3x12)", "Cable Triceps Extension (3x12)"] },
  "Fri-W24": { label: "Legs and Shoulders", color: "#22c55e", exercises: ["Cable Front Raise (3x12)", "Cable Rear Delt Fly (3x12)", "Cable Lateral Raise (3x12)", "Kettlebell Squat (5x12)", "Kettlebell Swing (5x12)", "Kettlebell Lunge (5x12)"] },
  // ── W25 ──
  "Mon-W25": { label: "Push", color: "#ef4444", exercises: ["Barbell Bench Press (4x8)", "Barbell Shoulder Press (4x8)", "Barbell Raises (3x10)", "Barbell Skull Crusher (3x8)", "Seated Machine Military Press (3x10)", "Tricep Dips (3x8)", "Chest Dips (3x10)"] },
  "Tue-W25": { label: "Pull", color: "#3b82f6", exercises: ["Deadlifts (4x8)", "T-Bar Rows (4x8)", "Pull-Ups (4x10)", "Face Pulls (4x10)", "Concentration Curls (3x10)", "Cable Curls (3x10)"] },
  "Wed-W25": { label: "Legs", color: "#22c55e", exercises: ["Back Squats (4x10)", "Bulgarian Split Squats (4x12)", "Romanian Deadlifts (4x12)", "Step-Ups (3x12)", "Standing Calf Raises (5x15)", "Glute Bridges (4x12)"] },
  "Thu-W25": { label: "Push", color: "#ef4444", exercises: ["Decline Bench Press (4x12)", "Dumbbell Flyes (4x12)", "Cable Crossovers (3x15)", "Arnold Press (3x15)", "Upright Rows (3x12)", "Overhead Tricep Extension (3x15)", "Tricep Kickbacks (3x12)"] },
  "Fri-W25": { label: "Pull", color: "#3b82f6", exercises: ["Bent-Over Barbell Rows (4x12)", "Single-Arm Dumbbell Rows (4x12)", "Chin-Ups (4x15)", "Seated Cable Rows (4x12)", "Zottman Curls (3x15)", "Spider Curls (3x12)"] },
  "Sat-W25": { label: "Legs", color: "#22c55e", exercises: ["Hack Squats (4x12)", "Lying Leg Curls (4x15)", "Goblet Squats (4x15)", "Good Mornings (4x12)", "Donkey Calf Raises (3x12)", "Seated Calf Raises (5x15)"] },
  // ── W26 ──
  "Mon-W26": { label: "Push", color: "#ef4444", exercises: ["Barbell Bench Press (4x8)", "Barbell Shoulder Press (4x8)", "Barbell Raises (3x10)", "Barbell Skull Crusher (3x8)", "Seated Machine Military Press (3x10)", "Tricep Dips (3x8)", "Chest Dips (3x10)"] },
  "Tue-W26": { label: "Pull", color: "#3b82f6", exercises: ["Deadlifts (4x8)", "T-Bar Rows (4x8)", "Pull-Ups (4x10)", "Face Pulls (4x10)", "Concentration Curls (3x10)", "Cable Curls (3x10)"] },
  "Wed-W26": { label: "Legs", color: "#22c55e", exercises: ["Back Squats (4x10)", "Bulgarian Split Squats (4x12)", "Romanian Deadlifts (4x12)", "Step-Ups (3x12)", "Standing Calf Raises (5x15)", "Glute Bridges (4x12)"] },
  "Thu-W26": { label: "Push", color: "#ef4444", exercises: ["Decline Bench Press (4x12)", "Dumbbell Flyes (4x12)", "Cable Crossovers (3x15)", "Arnold Press (3x15)", "Upright Rows (3x12)", "Overhead Tricep Extension (3x15)", "Tricep Kickbacks (3x12)"] },
  "Fri-W26": { label: "Pull", color: "#3b82f6", exercises: ["Bent-Over Barbell Rows (4x12)", "Single-Arm Dumbbell Rows (4x12)", "Chin-Ups (4x15)", "Seated Cable Rows (4x12)", "Zottman Curls (3x15)", "Spider Curls (3x12)"] },
  "Sat-W26": { label: "Legs", color: "#22c55e", exercises: ["Hack Squats (4x12)", "Lying Leg Curls (4x15)", "Goblet Squats (4x15)", "Good Mornings (4x12)", "Donkey Calf Raises (3x12)", "Seated Calf Raises (5x15)"] },
  // ── W27 ──
  "Mon-W27": { label: "Push", color: "#ef4444", exercises: ["Barbell Bench Press (4x8)", "Barbell Shoulder Press (4x8)", "Barbell Raises (3x10)", "Barbell Skull Crusher (3x8)", "Seated Machine Military Press (3x10)", "Tricep Dips (3x8)", "Chest Dips (3x10)"] },
  "Tue-W27": { label: "Pull", color: "#3b82f6", exercises: ["Deadlifts (4x8)", "T-Bar Rows (4x8)", "Pull-Ups (4x10)", "Face Pulls (4x10)", "Concentration Curls (3x10)", "Cable Curls (3x10)"] },
  "Wed-W27": { label: "Legs", color: "#22c55e", exercises: ["Back Squats (4x10)", "Bulgarian Split Squats (4x12)", "Romanian Deadlifts (4x12)", "Step-Ups (3x12)", "Standing Calf Raises (5x15)", "Glute Bridges (4x12)"] },
  "Thu-W27": { label: "Push", color: "#ef4444", exercises: ["Decline Bench Press (4x12)", "Dumbbell Flyes (4x12)", "Cable Crossovers (3x15)", "Arnold Press (3x15)", "Upright Rows (3x12)", "Overhead Tricep Extension (3x15)", "Tricep Kickbacks (3x12)"] },
  "Fri-W27": { label: "Pull", color: "#3b82f6", exercises: ["Bent-Over Barbell Rows (4x12)", "Single-Arm Dumbbell Rows (4x12)", "Chin-Ups (4x15)", "Seated Cable Rows (4x12)", "Zottman Curls (3x15)", "Spider Curls (3x12)"] },
  "Sat-W27": { label: "Legs", color: "#22c55e", exercises: ["Hack Squats (4x12)", "Lying Leg Curls (4x15)", "Goblet Squats (4x15)", "Good Mornings (4x12)", "Donkey Calf Raises (3x12)", "Seated Calf Raises (5x15)"] },
  // ── W28 ──
  "Mon-W28": { label: "Push", color: "#ef4444", exercises: ["Barbell Bench Press (4x8)", "Barbell Shoulder Press (4x8)", "Barbell Raises (3x10)", "Barbell Skull Crusher (3x8)", "Seated Machine Military Press (3x10)", "Tricep Dips (3x8)", "Chest Dips (3x10)"] },
  "Tue-W28": { label: "Pull", color: "#3b82f6", exercises: ["Deadlifts (4x8)", "T-Bar Rows (4x8)", "Pull-Ups (4x10)", "Face Pulls (4x10)", "Concentration Curls (3x10)", "Cable Curls (3x10)"] },
  "Wed-W28": { label: "Legs", color: "#22c55e", exercises: ["Back Squats (4x10)", "Bulgarian Split Squats (4x12)", "Romanian Deadlifts (4x12)", "Step-Ups (3x12)", "Standing Calf Raises (5x15)", "Glute Bridges (4x12)"] },
  "Thu-W28": { label: "Push", color: "#ef4444", exercises: ["Decline Bench Press (4x12)", "Dumbbell Flyes (4x12)", "Cable Crossovers (3x15)", "Arnold Press (3x15)", "Upright Rows (3x12)", "Overhead Tricep Extension (3x15)", "Tricep Kickbacks (3x12)"] },
  "Fri-W28": { label: "Pull", color: "#3b82f6", exercises: ["Bent-Over Barbell Rows (4x12)", "Single-Arm Dumbbell Rows (4x12)", "Chin-Ups (4x15)", "Seated Cable Rows (4x12)", "Zottman Curls (3x15)", "Spider Curls (3x12)"] },
  "Sat-W28": { label: "Legs", color: "#22c55e", exercises: ["Hack Squats (4x12)", "Lying Leg Curls (4x15)", "Goblet Squats (4x15)", "Good Mornings (4x12)", "Donkey Calf Raises (3x12)", "Seated Calf Raises (5x15)"] },
  // ── W29 ──
  "Mon-W29": { label: "Push", color: "#ef4444", exercises: ["Incline Bench Press (4x8)", "Dumbbell Press (4x8)", "Cable Flyes (3x10)", "Seated Arnold Press (3x8)", "Lateral Raises (3x10)", "Seated Overhead Dumbbell Extensions (3x8)", "Cable Pressdowns (3x10)"] },
  "Tue-W29": { label: "Pull", color: "#3b82f6", exercises: ["Barbell Rows (4x8)", "Dumbbell Rows (4x8)", "Lat Pulldowns (4x10)", "Seated Rows (4x10)", "Dumbbell Hammer Curls (3x10)", "Preacher Curls (3x10)"] },
  "Wed-W29": { label: "Legs", color: "#22c55e", exercises: ["Sumo Squats (4x10)", "Leg Press (4x12)", "Lying Leg Curls (4x12)", "Dumbbell Lunges (3x12)", "Calf Raises (5x15)", "Hip thrust (4x12)"] },
  "Thu-W29": { label: "Push", color: "#ef4444", exercises: ["Incline Dumbbell Press (4x12)", "Machine Chest Press (4x12)", "Pec Dec Flyes (3x15)", "Machine Shoulder Press (3x15)", "Bent-Over Raises (3x12)", "Reverse Overhead Rope Extension (3x15)", "Rope Pressdown (3x12)"] },
  "Fri-W29": { label: "Pull", color: "#3b82f6", exercises: ["Reverse Grip Barbell Rows (4x12)", "Wide Grip Seated Rows (4x12)", "Reverse Grip Pulldowns (4x15)", "Hammer Curls (4x12)", "EZ Bar Curls (3x15)", "Incline Curls (3x12)"] },
  "Sat-W29": { label: "Legs", color: "#22c55e", exercises: ["Leg Extension (4x12)", "Seated Leg Curls (4x15)", "Leg Press Close Stance (4x15)", "Stiff-Leg Deadlifts (4x12)", "Leg Press Close Stance (3x12)", "Seated Calf Raises (3x13)", "Standing Calf Raises (5x15)"] },
  // ── W30 ──
  "Mon-W30": { label: "Push", color: "#ef4444", exercises: ["Incline Bench Press (4x8)", "Dumbbell Press (4x8)", "Cable Flyes (3x10)", "Seated Arnold Press (3x8)", "Lateral Raises (3x10)", "Seated Overhead Dumbbell Extensions (3x8)", "Cable Pressdowns (3x10)"] },
  "Tue-W30": { label: "Pull", color: "#3b82f6", exercises: ["Barbell Rows (4x8)", "Dumbbell Rows (4x8)", "Lat Pulldowns (4x10)", "Seated Rows (4x10)", "Dumbbell Hammer Curls (3x10)", "Preacher Curls (3x10)"] },
  "Wed-W30": { label: "Legs", color: "#22c55e", exercises: ["Sumo Squats (4x10)", "Leg Press (4x12)", "Lying Leg Curls (4x12)", "Dumbbell Lunges (3x12)", "Calf Raises (5x15)", "Hip thrust (4x12)"] },
  "Thu-W30": { label: "Push", color: "#ef4444", exercises: ["Incline Dumbbell Press (4x12)", "Machine Chest Press (4x12)", "Pec Dec Flyes (3x15)", "Machine Shoulder Press (3x15)", "Bent-Over Raises (3x12)", "Reverse Overhead Rope Extension (3x15)", "Rope Pressdown (3x12)"] },
  "Fri-W30": { label: "Pull", color: "#3b82f6", exercises: ["Reverse Grip Barbell Rows (4x12)", "Wide Grip Seated Rows (4x12)", "Reverse Grip Pulldowns (4x15)", "Hammer Curls (4x12)", "EZ Bar Curls (3x15)", "Incline Curls (3x12)"] },
  "Sat-W30": { label: "Legs", color: "#22c55e", exercises: ["Leg Extension (4x12)", "Seated Leg Curls (4x15)", "Leg Press Close Stance (4x15)", "Stiff-Leg Deadlifts (4x12)", "Leg Press Close Stance (3x12)", "Seated Calf Raises (3x13)", "Standing Calf Raises (5x15)"] },
  // ── W31 ──
  "Mon-W31": { label: "Push", color: "#ef4444", exercises: ["Incline Bench Press (4x8)", "Dumbbell Press (4x8)", "Cable Flyes (3x10)", "Seated Arnold Press (3x8)", "Lateral Raises (3x10)", "Seated Overhead Dumbbell Extensions (3x8)", "Cable Pressdowns (3x10)"] },
  "Tue-W31": { label: "Pull", color: "#3b82f6", exercises: ["Barbell Rows (4x8)", "Dumbbell Rows (4x8)", "Lat Pulldowns (4x10)", "Seated Rows (4x10)", "Dumbbell Hammer Curls (3x10)", "Preacher Curls (3x10)"] },
  "Wed-W31": { label: "Legs", color: "#22c55e", exercises: ["Sumo Squats (4x10)", "Leg Press (4x12)", "Lying Leg Curls (4x12)", "Dumbbell Lunges (3x12)", "Calf Raises (5x15)", "Hip thrust (4x12)"] },
  "Thu-W31": { label: "Push", color: "#ef4444", exercises: ["Incline Dumbbell Press (4x12)", "Machine Chest Press (4x12)", "Pec Dec Flyes (3x15)", "Machine Shoulder Press (3x15)", "Bent-Over Raises (3x12)", "Reverse Overhead Rope Extension (3x15)", "Rope Pressdown (3x12)"] },
  "Fri-W31": { label: "Pull", color: "#3b82f6", exercises: ["Reverse Grip Barbell Rows (4x12)", "Wide Grip Seated Rows (4x12)", "Reverse Grip Pulldowns (4x15)", "Hammer Curls (4x12)", "EZ Bar Curls (3x15)", "Incline Curls (3x12)"] },
  "Sat-W31": { label: "Legs", color: "#22c55e", exercises: ["Leg Extension (4x12)", "Seated Leg Curls (4x15)", "Leg Press Close Stance (4x15)", "Stiff-Leg Deadlifts (4x12)", "Leg Press Close Stance (3x12)", "Seated Calf Raises (3x13)", "Standing Calf Raises (5x15)"] },
  // ── W32 ──
  "Mon-W32": { label: "Push", color: "#ef4444", exercises: ["Incline Bench Press (4x8)", "Dumbbell Press (4x8)", "Cable Flyes (3x10)", "Seated Arnold Press (3x8)", "Lateral Raises (3x10)", "Seated Overhead Dumbbell Extensions (3x8)", "Cable Pressdowns (3x10)"] },
  "Tue-W32": { label: "Pull", color: "#3b82f6", exercises: ["Barbell Rows (4x8)", "Dumbbell Rows (4x8)", "Lat Pulldowns (4x10)", "Seated Rows (4x10)", "Dumbbell Hammer Curls (3x10)", "Preacher Curls (3x10)"] },
  "Wed-W32": { label: "Legs", color: "#22c55e", exercises: ["Sumo Squats (4x10)", "Leg Press (4x12)", "Lying Leg Curls (4x12)", "Dumbbell Lunges (3x12)", "Calf Raises (5x15)", "Hip thrust (4x12)"] },
  "Thu-W32": { label: "Push", color: "#ef4444", exercises: ["Incline Dumbbell Press (4x12)", "Machine Chest Press (4x12)", "Pec Dec Flyes (3x15)", "Machine Shoulder Press (3x15)", "Bent-Over Raises (3x12)", "Reverse Overhead Rope Extension (3x15)", "Rope Pressdown (3x12)"] },
  "Fri-W32": { label: "Pull", color: "#3b82f6", exercises: ["Reverse Grip Barbell Rows (4x12)", "Wide Grip Seated Rows (4x12)", "Reverse Grip Pulldowns (4x15)", "Hammer Curls (4x12)", "EZ Bar Curls (3x15)", "Incline Curls (3x12)"] },
  "Sat-W32": { label: "Legs", color: "#22c55e", exercises: ["Leg Extension (4x12)", "Seated Leg Curls (4x15)", "Leg Press Close Stance (4x15)", "Stiff-Leg Deadlifts (4x12)", "Leg Press Close Stance (3x12)", "Seated Calf Raises (3x13)", "Standing Calf Raises (5x15)"] },
  // ── W33 ──
  "Mon-W33": { label: "Upper Body", color: "#3b82f6", exercises: ["Cable Biceps Curl (3x12)", "Dual Cable Biceps Curl (3x12)", "High Cable Curl (3x12)", "Bench Press (3x12)", "Incline Bench Press (3x12)", "Cable Flyes (3x12)"] },
  "Tue-W33": { label: "Lower Body", color: "#22c55e", exercises: ["Cable Glute Kickback (3x12)", "Standing Cable Calf Raise (3x12)", "Machine Leg Press (3x12)", "Leg Curls (3x12)", "Seated Dumbbell Squat (3x12)", "Barbell Hip Thrust (3x12)"] },
  "Wed-W33": { label: "Back and Biceps", color: "#3b82f6", exercises: ["Straight Arm Lat Pulldown (3x12)", "Seated Cable Row (3x12)", "Incline Dumbbell Row (3x12)", "21s Barbell Curls (3x12)", "Hammer Curls (3x12)", "Preacher Dumbbell Curls (3x12)"] },
  "Thu-W33": { label: "Chest and Triceps", color: "#ef4444", exercises: ["Cable Crossover (3x12)", "Cable Chest Press (3x12)", "Cable Overhead Triceps Extension (3x12)", "Close Grip Bench Press (3x12)", "Dips (3x12)", "Cable Triceps Extension (3x12)"] },
  "Fri-W33": { label: "Legs and Shoulders", color: "#22c55e", exercises: ["Cable Front Raise (3x12)", "Cable Rear Delt Fly (3x12)", "Cable Lateral Raise (3x12)", "Barbell Squat (5x12)", "Machine Leg Press (5x12)", "Barbell Lunge (5x12)"] },
  // ── W34 ──
  "Mon-W34": { label: "Upper Body", color: "#3b82f6", exercises: ["Cable Biceps Curl (3x12)", "Dual Cable Biceps Curl (3x12)", "High Cable Curl (3x12)", "Bench Press (3x12)", "Incline Bench Press (3x12)", "Cable Flyes (3x12)"] },
  "Tue-W34": { label: "Lower Body", color: "#22c55e", exercises: ["Cable Glute Kickback (3x12)", "Standing Cable Calf Raise (3x12)", "Machine Leg Press (3x12)", "Leg Curls (3x12)", "Seated Dumbbell Squat (3x12)", "Barbell Hip Thrust (3x12)"] },
  "Wed-W34": { label: "Back and Biceps", color: "#3b82f6", exercises: ["Straight Arm Lat Pulldown (3x12)", "Seated Cable Row (3x12)", "Incline Dumbbell Row (3x12)", "21s Barbell Curls (3x12)", "Hammer Curls (3x12)", "Preacher Dumbbell Curls (3x12)"] },
  "Thu-W34": { label: "Chest and Triceps", color: "#ef4444", exercises: ["Cable Crossover (3x12)", "Cable Chest Press (3x12)", "Cable Overhead Triceps Extension (3x12)", "Close Grip Bench Press (3x12)", "Dips (3x12)", "Cable Triceps Extension (3x12)"] },
  "Fri-W34": { label: "Legs and Shoulders", color: "#22c55e", exercises: ["Cable Front Raise (3x12)", "Cable Rear Delt Fly (3x12)", "Cable Lateral Raise (3x12)", "Barbell Squat (5x12)", "Machine Leg Press (5x12)", "Barbell Lunge (5x12)"] },
  // ── W35 ──
  "Mon-W35": { label: "Upper Body", color: "#3b82f6", exercises: ["Cable Biceps Curl (3x12)", "Dual Cable Biceps Curl (3x12)", "High Cable Curl (3x12)", "Bench Press (3x12)", "Incline Bench Press (3x12)", "Cable Flyes (3x12)"] },
  "Tue-W35": { label: "Lower Body", color: "#22c55e", exercises: ["Cable Glute Kickback (3x12)", "Standing Cable Calf Raise (3x12)", "Machine Leg Press (3x12)", "Leg Curls (3x12)", "Seated Dumbbell Squat (3x12)", "Barbell Hip Thrust (3x12)"] },
  "Wed-W35": { label: "Back and Biceps", color: "#3b82f6", exercises: ["Straight Arm Lat Pulldown (3x12)", "Seated Cable Row (3x12)", "Incline Dumbbell Row (3x12)", "21s Barbell Curls (3x12)", "Hammer Curls (3x12)", "Preacher Dumbbell Curls (3x12)"] },
  "Thu-W35": { label: "Chest and Triceps", color: "#ef4444", exercises: ["Cable Crossover (3x12)", "Cable Chest Press (3x12)", "Cable Overhead Triceps Extension (3x12)", "Close Grip Bench Press (3x12)", "Dips (3x12)", "Cable Triceps Extension (3x12)"] },
  "Fri-W35": { label: "Legs and Shoulders", color: "#22c55e", exercises: ["Cable Front Raise (3x12)", "Cable Rear Delt Fly (3x12)", "Cable Lateral Raise (3x12)", "Barbell Squat (5x12)", "Machine Leg Press (5x12)", "Barbell Lunge (5x12)"] },
  // ── W36 ──
  "Mon-W36": { label: "Upper Body", color: "#3b82f6", exercises: ["Cable Biceps Curl (3x12)", "Dual Cable Biceps Curl (3x12)", "High Cable Curl (3x12)", "Bench Press (3x12)", "Incline Bench Press (3x12)", "Cable Flyes (3x12)"] },
  "Tue-W36": { label: "Lower Body", color: "#22c55e", exercises: ["Cable Glute Kickback (3x12)", "Standing Cable Calf Raise (3x12)", "Machine Leg Press (3x12)", "Leg Curls (3x12)", "Seated Dumbbell Squat (3x12)", "Barbell Hip Thrust (3x12)"] },
  "Wed-W36": { label: "Back and Biceps", color: "#3b82f6", exercises: ["Straight Arm Lat Pulldown (3x12)", "Seated Cable Row (3x12)", "Incline Dumbbell Row (3x12)", "21s Barbell Curls (3x12)", "Hammer Curls (3x12)", "Preacher Dumbbell Curls (3x12)"] },
  "Thu-W36": { label: "Chest and Triceps", color: "#ef4444", exercises: ["Cable Crossover (3x12)", "Cable Chest Press (3x12)", "Cable Overhead Triceps Extension (3x12)", "Close Grip Bench Press (3x12)", "Dips (3x12)", "Cable Triceps Extension (3x12)"] },
  "Fri-W36": { label: "Legs and Shoulders", color: "#22c55e", exercises: ["Cable Front Raise (3x12)", "Cable Rear Delt Fly (3x12)", "Cable Lateral Raise (3x12)", "Barbell Squat (5x12)", "Machine Leg Press (5x12)", "Barbell Lunge (5x12)"] },
  // ── W37 ──
  "Mon-W37": { label: "Push", color: "#ef4444", exercises: ["Bench Press (4x8)", "Dumbbell Shoulder Press (4x8)", "Chest Flyes (3x10)", "Lateral Raises (3x8)", "Tricep Dips (3x10)", "Overhead Tricep Extensions (3x10)"] },
  "Tue-W37": { label: "Pull", color: "#3b82f6", exercises: ["Pull-Ups or Assisted Pull-Ups (4x8)", "Single-Arm Dumbbell Row (4x8)", "Lat Pulldowns (4x10)", "Face Pulls (4x10)", "Hammer Curls (3x8)", "Preacher Curls (3x10)"] },
  "Wed-W37": { label: "Legs", color: "#22c55e", exercises: ["Back Squats (4x8)", "Leg Press (4x12)", "Barbell Hip Thrust (4x12)", "Goblet Squats (3x12)", "Calf Raises (5x15)"] },
  "Thu-W37": { label: "Push", color: "#ef4444", exercises: ["Incline Dumbbell Press (4x12)", "Machine Shoulder Press (4x12)", "Pec Dec Flyes (3x15)", "Lateral Raises (3x15)", "Parallel Bar Dips (3x12)", "Rope Pushdowns (3x15)"] },
  "Fri-W37": { label: "Pull", color: "#3b82f6", exercises: ["T-Bar Rows (4x12)", "Seated Cable Rows (4x12)", "Wide Grip Pulldowns (4x15)", "Face Pulls (4x12)", "Barbell Curls (3x15)", "Hammer Curls (3x12)"] },
  "Sat-W37": { label: "Legs", color: "#22c55e", exercises: ["Leg Extensions (4x12)", "Lying Leg Curls (4x15)", "Hack Squats (4x15)", "Stiff-Leg Deadlifts (4x12)", "Seated Calf Raises (5x15)", "Standing Calf Raises (5x15)"] },
  // ── W38 ──
  "Mon-W38": { label: "Push", color: "#ef4444", exercises: ["Bench Press (4x8)", "Dumbbell Shoulder Press (4x8)", "Chest Flyes (3x10)", "Lateral Raises (3x8)", "Tricep Dips (3x10)", "Overhead Tricep Extensions (3x10)"] },
  "Tue-W38": { label: "Pull", color: "#3b82f6", exercises: ["Pull-Ups or Assisted Pull-Ups (4x8)", "Single-Arm Dumbbell Row (4x8)", "Lat Pulldowns (4x10)", "Face Pulls (4x10)", "Hammer Curls (3x8)", "Preacher Curls (3x10)"] },
  "Wed-W38": { label: "Legs", color: "#22c55e", exercises: ["Back Squats (4x8)", "Leg Press (4x12)", "Barbell Hip Thrust (4x12)", "Goblet Squats (3x12)", "Calf Raises (5x15)"] },
  "Thu-W38": { label: "Push", color: "#ef4444", exercises: ["Incline Dumbbell Press (4x12)", "Machine Shoulder Press (4x12)", "Pec Dec Flyes (3x15)", "Lateral Raises (3x15)", "Parallel Bar Dips (3x12)", "Rope Pushdowns (3x15)"] },
  "Fri-W38": { label: "Pull", color: "#3b82f6", exercises: ["T-Bar Rows (4x12)", "Seated Cable Rows (4x12)", "Wide Grip Pulldowns (4x15)", "Face Pulls (4x12)", "Barbell Curls (3x15)", "Hammer Curls (3x12)"] },
  "Sat-W38": { label: "Legs", color: "#22c55e", exercises: ["Leg Extensions (4x12)", "Lying Leg Curls (4x15)", "Hack Squats (4x15)", "Stiff-Leg Deadlifts (4x12)", "Seated Calf Raises (5x15)", "Standing Calf Raises (5x15)"] },
  // ── W39 ──
  "Mon-W39": { label: "Push", color: "#ef4444", exercises: ["Bench Press (4x8)", "Dumbbell Shoulder Press (4x8)", "Chest Flyes (3x10)", "Lateral Raises (3x8)", "Tricep Dips (3x10)", "Overhead Tricep Extensions (3x10)"] },
  "Tue-W39": { label: "Pull", color: "#3b82f6", exercises: ["Pull-Ups or Assisted Pull-Ups (4x8)", "Single-Arm Dumbbell Row (4x8)", "Lat Pulldowns (4x10)", "Face Pulls (4x10)", "Hammer Curls (3x8)", "Preacher Curls (3x10)"] },
  "Wed-W39": { label: "Legs", color: "#22c55e", exercises: ["Back Squats (4x8)", "Leg Press (4x12)", "Barbell Hip Thrust (4x12)", "Goblet Squats (3x12)", "Calf Raises (5x15)"] },
  "Thu-W39": { label: "Push", color: "#ef4444", exercises: ["Incline Dumbbell Press (4x12)", "Machine Shoulder Press (4x12)", "Pec Dec Flyes (3x15)", "Lateral Raises (3x15)", "Parallel Bar Dips (3x12)", "Rope Pushdowns (3x15)"] },
  "Fri-W39": { label: "Pull", color: "#3b82f6", exercises: ["T-Bar Rows (4x12)", "Seated Cable Rows (4x12)", "Wide Grip Pulldowns (4x15)", "Face Pulls (4x12)", "Barbell Curls (3x15)", "Hammer Curls (3x12)"] },
  "Sat-W39": { label: "Legs", color: "#22c55e", exercises: ["Leg Extensions (4x12)", "Lying Leg Curls (4x15)", "Hack Squats (4x15)", "Stiff-Leg Deadlifts (4x12)", "Seated Calf Raises (5x15)", "Standing Calf Raises (5x15)"] },
  // ── W40 ──
  "Mon-W40": { label: "Push", color: "#ef4444", exercises: ["Bench Press (4x8)", "Dumbbell Shoulder Press (4x8)", "Chest Flyes (3x10)", "Lateral Raises (3x8)", "Tricep Dips (3x10)", "Overhead Tricep Extensions (3x10)"] },
  "Tue-W40": { label: "Pull", color: "#3b82f6", exercises: ["Pull-Ups or Assisted Pull-Ups (4x8)", "Single-Arm Dumbbell Row (4x8)", "Lat Pulldowns (4x10)", "Face Pulls (4x10)", "Hammer Curls (3x8)", "Preacher Curls (3x10)"] },
  "Wed-W40": { label: "Legs", color: "#22c55e", exercises: ["Back Squats (4x8)", "Leg Press (4x12)", "Barbell Hip Thrust (4x12)", "Goblet Squats (3x12)", "Calf Raises (5x15)"] },
  "Thu-W40": { label: "Push", color: "#ef4444", exercises: ["Incline Dumbbell Press (4x12)", "Machine Shoulder Press (4x12)", "Pec Dec Flyes (3x15)", "Lateral Raises (3x15)", "Parallel Bar Dips (3x12)", "Rope Pushdowns (3x15)"] },
  "Fri-W40": { label: "Pull", color: "#3b82f6", exercises: ["T-Bar Rows (4x12)", "Seated Cable Rows (4x12)", "Wide Grip Pulldowns (4x15)", "Face Pulls (4x12)", "Barbell Curls (3x15)", "Hammer Curls (3x12)"] },
  "Sat-W40": { label: "Legs", color: "#22c55e", exercises: ["Leg Extensions (4x12)", "Lying Leg Curls (4x15)", "Hack Squats (4x15)", "Stiff-Leg Deadlifts (4x12)", "Seated Calf Raises (5x15)", "Standing Calf Raises (5x15)"] },
  // ── W41 ──
  "Mon-W41": { label: "Upper Body", color: "#3b82f6", exercises: ["Cable Biceps Curl (3x12)", "Dual Cable Biceps Curl (3x12)", "High Cable Curl (3x12)", "Bench Press (3x12)", "Incline Bench Press (3x12)", "Cable Flyes (3x12)"] },
  "Tue-W41": { label: "Lower Body", color: "#22c55e", exercises: ["Cable Glute Kickback (3x12)", "Standing Cable Calf Raise (3x12)", "Machine Leg Press (3x12)", "Leg Curls (3x12)", "Seated Dumbbell Squat (3x12)", "Barbell Hip Thrust (3x12)"] },
  "Wed-W41": { label: "Back and Biceps", color: "#3b82f6", exercises: ["Straight Arm Lat Pulldown (3x12)", "Seated Cable Row (3x12)", "Incline Dumbbell Row (3x12)", "21s Barbell Curls (3x12)", "Hammer Curls (3x12)", "Preacher Dumbbell Curls (3x12)"] },
  "Thu-W41": { label: "Chest and Triceps", color: "#ef4444", exercises: ["Cable Crossover (3x12)", "Cable Chest Press (3x12)", "Cable Overhead Triceps Extension (3x12)", "Close Grip Bench Press (3x12)", "Dips (3x12)", "Cable Triceps Extension (3x12)"] },
  "Fri-W41": { label: "Legs and Shoulders", color: "#22c55e", exercises: ["Cable Front Raise (3x12)", "Cable Rear Delt Fly (3x12)", "Cable Lateral Raise (3x12)", "Kettlebell Squat (5x12)", "Kettlebell Swing (5x12)", "Kettlebell Lunge (5x12)"] },
  // ── W42 ──
  "Mon-W42": { label: "Upper Body", color: "#3b82f6", exercises: ["Cable Biceps Curl (3x12)", "Dual Cable Biceps Curl (3x12)", "High Cable Curl (3x12)", "Bench Press (3x12)", "Incline Bench Press (3x12)", "Cable Flyes (3x12)"] },
  "Tue-W42": { label: "Lower Body", color: "#22c55e", exercises: ["Cable Glute Kickback (3x12)", "Standing Cable Calf Raise (3x12)", "Machine Leg Press (3x12)", "Leg Curls (3x12)", "Seated Dumbbell Squat (3x12)", "Barbell Hip Thrust (3x12)"] },
  "Wed-W42": { label: "Back and Biceps", color: "#3b82f6", exercises: ["Straight Arm Lat Pulldown (3x12)", "Seated Cable Row (3x12)", "Incline Dumbbell Row (3x12)", "21s Barbell Curls (3x12)", "Hammer Curls (3x12)", "Preacher Dumbbell Curls (3x12)"] },
  "Thu-W42": { label: "Chest and Triceps", color: "#ef4444", exercises: ["Cable Crossover (3x12)", "Cable Chest Press (3x12)", "Cable Overhead Triceps Extension (3x12)", "Close Grip Bench Press (3x12)", "Dips (3x12)", "Cable Triceps Extension (3x12)"] },
  "Fri-W42": { label: "Legs and Shoulders", color: "#22c55e", exercises: ["Cable Front Raise (3x12)", "Cable Rear Delt Fly (3x12)", "Cable Lateral Raise (3x12)", "Kettlebell Squat (5x12)", "Kettlebell Swing (5x12)", "Kettlebell Lunge (5x12)"] },
  // ── W43 ──
  "Mon-W43": { label: "Upper Body", color: "#3b82f6", exercises: ["Cable Biceps Curl (3x12)", "Dual Cable Biceps Curl (3x12)", "High Cable Curl (3x12)", "Bench Press (3x12)", "Incline Bench Press (3x12)", "Cable Flyes (3x12)"] },
  "Tue-W43": { label: "Lower Body", color: "#22c55e", exercises: ["Cable Glute Kickback (3x12)", "Standing Cable Calf Raise (3x12)", "Machine Leg Press (3x12)", "Leg Curls (3x12)", "Seated Dumbbell Squat (3x12)", "Barbell Hip Thrust (3x12)"] },
  "Wed-W43": { label: "Back and Biceps", color: "#3b82f6", exercises: ["Straight Arm Lat Pulldown (3x12)", "Seated Cable Row (3x12)", "Incline Dumbbell Row (3x12)", "21s Barbell Curls (3x12)", "Hammer Curls (3x12)", "Preacher Dumbbell Curls (3x12)"] },
  "Thu-W43": { label: "Chest and Triceps", color: "#ef4444", exercises: ["Cable Crossover (3x12)", "Cable Chest Press (3x12)", "Cable Overhead Triceps Extension (3x12)", "Close Grip Bench Press (3x12)", "Dips (3x12)", "Cable Triceps Extension (3x12)"] },
  "Fri-W43": { label: "Legs and Shoulders", color: "#22c55e", exercises: ["Cable Front Raise (3x12)", "Cable Rear Delt Fly (3x12)", "Cable Lateral Raise (3x12)", "Kettlebell Squat (5x12)", "Kettlebell Swing (5x12)", "Kettlebell Lunge (5x12)"] },
  // ── W44 ──
  "Mon-W44": { label: "Upper Body", color: "#3b82f6", exercises: ["Cable Biceps Curl (3x12)", "Dual Cable Biceps Curl (3x12)", "High Cable Curl (3x12)", "Bench Press (3x12)", "Incline Bench Press (3x12)", "Cable Flyes (3x12)"] },
  "Tue-W44": { label: "Lower Body", color: "#22c55e", exercises: ["Cable Glute Kickback (3x12)", "Standing Cable Calf Raise (3x12)", "Machine Leg Press (3x12)", "Leg Curls (3x12)", "Seated Dumbbell Squat (3x12)", "Barbell Hip Thrust (3x12)"] },
  "Wed-W44": { label: "Back and Biceps", color: "#3b82f6", exercises: ["Straight Arm Lat Pulldown (3x12)", "Seated Cable Row (3x12)", "Incline Dumbbell Row (3x12)", "21s Barbell Curls (3x12)", "Hammer Curls (3x12)", "Preacher Dumbbell Curls (3x12)"] },
  "Thu-W44": { label: "Chest and Triceps", color: "#ef4444", exercises: ["Cable Crossover (3x12)", "Cable Chest Press (3x12)", "Cable Overhead Triceps Extension (3x12)", "Close Grip Bench Press (3x12)", "Dips (3x12)", "Cable Triceps Extension (3x12)"] },
  "Fri-W44": { label: "Legs and Shoulders", color: "#22c55e", exercises: ["Cable Front Raise (3x12)", "Cable Rear Delt Fly (3x12)", "Cable Lateral Raise (3x12)", "Kettlebell Squat (5x12)", "Kettlebell Swing (5x12)", "Kettlebell Lunge (5x12)"] },
  // ── W45 ──
  "Mon-W45": { label: "Push", color: "#ef4444", exercises: ["Barbell Bench Press (4x8)", "Dumbbell Shoulder Press (4x8)", "Chest Dips (3x10)", "Standing Military Press (3x8)", "Front Raises (3x10)", "Tricep Dips (3x8)", "Skull Crushers (3x10)"] },
  "Tue-W45": { label: "Pull", color: "#3b82f6", exercises: ["Deadlifts (4x8)", "T-Bar Rows (4x8)", "Pull-Ups (4x10)", "Face Pulls (4x10)", "Concentration Curls (3x10)", "Cable Curls (3x10)"] },
  "Wed-W45": { label: "Legs", color: "#22c55e", exercises: ["Back Squats (4x10)", "Bulgarian Split Squats (4x12)", "Romanian Deadlifts (4x12)", "Step-Ups (3x12)", "Standing Calf Raises (5x15)", "Glute Bridges (4x12)"] },
  "Thu-W45": { label: "Push", color: "#ef4444", exercises: ["Decline Bench Press (4x12)", "Dumbbell Flyes (4x12)", "Cable Crossovers (3x15)", "Arnold Press (3x15)", "Upright Rows (3x12)", "Overhead Tricep Extension (3x15)", "Tricep Kickbacks (3x12)"] },
  "Fri-W45": { label: "Pull", color: "#3b82f6", exercises: ["Bent-Over Barbell Rows (4x12)", "Single-Arm Dumbbell Rows (4x12)", "Chin-Ups (4x15)", "Seated Cable Rows (4x12)", "Zottman Curls (3x15)", "Spider Curls (3x12)"] },
  "Sat-W45": { label: "Legs", color: "#22c55e", exercises: ["Hack Squats (4x12)", "Lying Leg Curls (4x15)", "Goblet Squats (4x15)", "Good Mornings (4x12)", "Donkey Calf Raises (3x12)", "Seated Calf Raises (5x15)"] },
  // ── W46 ──
  "Mon-W46": { label: "Push", color: "#ef4444", exercises: ["Barbell Bench Press (4x8)", "Dumbbell Shoulder Press (4x8)", "Chest Dips (3x10)", "Standing Military Press (3x8)", "Front Raises (3x10)", "Tricep Dips (3x8)", "Skull Crushers (3x10)"] },
  "Tue-W46": { label: "Pull", color: "#3b82f6", exercises: ["Deadlifts (4x8)", "T-Bar Rows (4x8)", "Pull-Ups (4x10)", "Face Pulls (4x10)", "Concentration Curls (3x10)", "Cable Curls (3x10)"] },
  "Wed-W46": { label: "Legs", color: "#22c55e", exercises: ["Back Squats (4x10)", "Bulgarian Split Squats (4x12)", "Romanian Deadlifts (4x12)", "Step-Ups (3x12)", "Standing Calf Raises (5x15)", "Glute Bridges (4x12)"] },
  "Thu-W46": { label: "Push", color: "#ef4444", exercises: ["Decline Bench Press (4x12)", "Dumbbell Flyes (4x12)", "Cable Crossovers (3x15)", "Arnold Press (3x15)", "Upright Rows (3x12)", "Overhead Tricep Extension (3x15)", "Tricep Kickbacks (3x12)"] },
  "Fri-W46": { label: "Pull", color: "#3b82f6", exercises: ["Bent-Over Barbell Rows (4x12)", "Single-Arm Dumbbell Rows (4x12)", "Chin-Ups (4x15)", "Seated Cable Rows (4x12)", "Zottman Curls (3x15)", "Spider Curls (3x12)"] },
  "Sat-W46": { label: "Legs", color: "#22c55e", exercises: ["Hack Squats (4x12)", "Lying Leg Curls (4x15)", "Goblet Squats (4x15)", "Good Mornings (4x12)", "Donkey Calf Raises (3x12)", "Seated Calf Raises (5x15)"] },
  // ── W47 ──
  "Mon-W47": { label: "Push", color: "#ef4444", exercises: ["Barbell Bench Press (4x8)", "Dumbbell Shoulder Press (4x8)", "Chest Dips (3x10)", "Standing Military Press (3x8)", "Front Raises (3x10)", "Tricep Dips (3x8)", "Skull Crushers (3x10)"] },
  "Tue-W47": { label: "Pull", color: "#3b82f6", exercises: ["Deadlifts (4x8)", "T-Bar Rows (4x8)", "Pull-Ups (4x10)", "Face Pulls (4x10)", "Concentration Curls (3x10)", "Cable Curls (3x10)"] },
  "Wed-W47": { label: "Legs", color: "#22c55e", exercises: ["Back Squats (4x10)", "Bulgarian Split Squats (4x12)", "Romanian Deadlifts (4x12)", "Step-Ups (3x12)", "Standing Calf Raises (5x15)", "Glute Bridges (4x12)"] },
  "Thu-W47": { label: "Push", color: "#ef4444", exercises: ["Decline Bench Press (4x12)", "Dumbbell Flyes (4x12)", "Cable Crossovers (3x15)", "Arnold Press (3x15)", "Upright Rows (3x12)", "Overhead Tricep Extension (3x15)", "Tricep Kickbacks (3x12)"] },
  "Fri-W47": { label: "Pull", color: "#3b82f6", exercises: ["Bent-Over Barbell Rows (4x12)", "Single-Arm Dumbbell Rows (4x12)", "Chin-Ups (4x15)", "Seated Cable Rows (4x12)", "Zottman Curls (3x15)", "Spider Curls (3x12)"] },
  "Sat-W47": { label: "Legs", color: "#22c55e", exercises: ["Hack Squats (4x12)", "Lying Leg Curls (4x15)", "Goblet Squats (4x15)", "Good Mornings (4x12)", "Donkey Calf Raises (3x12)", "Seated Calf Raises (5x15)"] },
  // ── W48 ──
  "Mon-W48": { label: "Push", color: "#ef4444", exercises: ["Barbell Bench Press (4x8)", "Dumbbell Shoulder Press (4x8)", "Chest Dips (3x10)", "Standing Military Press (3x8)", "Front Raises (3x10)", "Tricep Dips (3x8)", "Skull Crushers (3x10)"] },
  "Tue-W48": { label: "Pull", color: "#3b82f6", exercises: ["Deadlifts (4x8)", "T-Bar Rows (4x8)", "Pull-Ups (4x10)", "Face Pulls (4x10)", "Concentration Curls (3x10)", "Cable Curls (3x10)"] },
  "Wed-W48": { label: "Legs", color: "#22c55e", exercises: ["Back Squats (4x10)", "Bulgarian Split Squats (4x12)", "Romanian Deadlifts (4x12)", "Step-Ups (3x12)", "Standing Calf Raises (5x15)", "Glute Bridges (4x12)"] },
  "Thu-W48": { label: "Push", color: "#ef4444", exercises: ["Decline Bench Press (4x12)", "Dumbbell Flyes (4x12)", "Cable Crossovers (3x15)", "Arnold Press (3x15)", "Upright Rows (3x12)", "Overhead Tricep Extension (3x15)", "Tricep Kickbacks (3x12)"] },
  "Fri-W48": { label: "Pull", color: "#3b82f6", exercises: ["Bent-Over Barbell Rows (4x12)", "Single-Arm Dumbbell Rows (4x12)", "Chin-Ups (4x15)", "Seated Cable Rows (4x12)", "Zottman Curls (3x15)", "Spider Curls (3x12)"] },
  "Sat-W48": { label: "Legs", color: "#22c55e", exercises: ["Hack Squats (4x12)", "Lying Leg Curls (4x15)", "Goblet Squats (4x15)", "Good Mornings (4x12)", "Donkey Calf Raises (3x12)", "Seated Calf Raises (5x15)"] },
  // ── W49 ──
  "Mon-W49": { label: "Push", color: "#ef4444", exercises: ["Barbell Bench Press (4x8)", "Dumbbell Shoulder Press (4x8)", "Chest Dips (3x10)", "Standing Military Press (3x8)", "Front Raises (3x10)", "Tricep Dips (3x8)", "Skull Crushers (3x10)"] },
  "Tue-W49": { label: "Pull", color: "#3b82f6", exercises: ["Deadlifts (4x8)", "T-Bar Rows (4x8)", "Pull-Ups (4x10)", "Face Pulls (4x10)", "Concentration Curls (3x10)", "Cable Curls (3x10)"] },
  "Wed-W49": { label: "Legs", color: "#22c55e", exercises: ["Back Squats (4x10)", "Bulgarian Split Squats (4x12)", "Romanian Deadlifts (4x12)", "Step-Ups (3x12)", "Standing Calf Raises (5x15)", "Glute Bridges (4x12)"] },
  "Thu-W49": { label: "Push", color: "#ef4444", exercises: ["Decline Bench Press (4x12)", "Dumbbell Flyes (4x12)", "Cable Crossovers (3x15)", "Arnold Press (3x15)", "Upright Rows (3x12)", "Overhead Tricep Extension (3x15)", "Tricep Kickbacks (3x12)"] },
  "Fri-W49": { label: "Pull", color: "#3b82f6", exercises: ["Bent-Over Barbell Rows (4x12)", "Single-Arm Dumbbell Rows (4x12)", "Chin-Ups (4x15)", "Seated Cable Rows (4x12)", "Zottman Curls (3x15)", "Spider Curls (3x12)"] },
  "Sat-W49": { label: "Legs", color: "#22c55e", exercises: ["Hack Squats (4x12)", "Lying Leg Curls (4x15)", "Goblet Squats (4x15)", "Good Mornings (4x12)", "Donkey Calf Raises (3x12)", "Seated Calf Raises (5x15)"] },
  // ── W50 ──
  "Mon-W50": { label: "Push", color: "#ef4444", exercises: ["Barbell Bench Press (4x8)", "Dumbbell Shoulder Press (4x8)", "Chest Dips (3x10)", "Standing Military Press (3x8)", "Front Raises (3x10)", "Tricep Dips (3x8)", "Skull Crushers (3x10)"] },
  "Tue-W50": { label: "Pull", color: "#3b82f6", exercises: ["Deadlifts (4x8)", "T-Bar Rows (4x8)", "Pull-Ups (4x10)", "Face Pulls (4x10)", "Concentration Curls (3x10)", "Cable Curls (3x10)"] },
  "Wed-W50": { label: "Legs", color: "#22c55e", exercises: ["Back Squats (4x10)", "Bulgarian Split Squats (4x12)", "Romanian Deadlifts (4x12)", "Step-Ups (3x12)", "Standing Calf Raises (5x15)", "Glute Bridges (4x12)"] },
  "Thu-W50": { label: "Push", color: "#ef4444", exercises: ["Decline Bench Press (4x12)", "Dumbbell Flyes (4x12)", "Cable Crossovers (3x15)", "Arnold Press (3x15)", "Upright Rows (3x12)", "Overhead Tricep Extension (3x15)", "Tricep Kickbacks (3x12)"] },
  "Fri-W50": { label: "Pull", color: "#3b82f6", exercises: ["Bent-Over Barbell Rows (4x12)", "Single-Arm Dumbbell Rows (4x12)", "Chin-Ups (4x15)", "Seated Cable Rows (4x12)", "Zottman Curls (3x15)", "Spider Curls (3x12)"] },
  "Sat-W50": { label: "Legs", color: "#22c55e", exercises: ["Hack Squats (4x12)", "Lying Leg Curls (4x15)", "Goblet Squats (4x15)", "Good Mornings (4x12)", "Donkey Calf Raises (3x12)", "Seated Calf Raises (5x15)"] },
  // ── W51 ──
  "Mon-W51": { label: "Push", color: "#ef4444", exercises: ["Barbell Bench Press (4x8)", "Dumbbell Shoulder Press (4x8)", "Chest Dips (3x10)", "Standing Military Press (3x8)", "Front Raises (3x10)", "Tricep Dips (3x8)", "Skull Crushers (3x10)"] },
  "Tue-W51": { label: "Pull", color: "#3b82f6", exercises: ["Deadlifts (4x8)", "T-Bar Rows (4x8)", "Pull-Ups (4x10)", "Face Pulls (4x10)", "Concentration Curls (3x10)", "Cable Curls (3x10)"] },
  "Wed-W51": { label: "Legs", color: "#22c55e", exercises: ["Back Squats (4x10)", "Bulgarian Split Squats (4x12)", "Romanian Deadlifts (4x12)", "Step-Ups (3x12)", "Standing Calf Raises (5x15)", "Glute Bridges (4x12)"] },
  "Thu-W51": { label: "Push", color: "#ef4444", exercises: ["Decline Bench Press (4x12)", "Dumbbell Flyes (4x12)", "Cable Crossovers (3x15)", "Arnold Press (3x15)", "Upright Rows (3x12)", "Overhead Tricep Extension (3x15)", "Tricep Kickbacks (3x12)"] },
  "Fri-W51": { label: "Pull", color: "#3b82f6", exercises: ["Bent-Over Barbell Rows (4x12)", "Single-Arm Dumbbell Rows (4x12)", "Chin-Ups (4x15)", "Seated Cable Rows (4x12)", "Zottman Curls (3x15)", "Spider Curls (3x12)"] },
  "Sat-W51": { label: "Legs", color: "#22c55e", exercises: ["Hack Squats (4x12)", "Lying Leg Curls (4x15)", "Goblet Squats (4x15)", "Good Mornings (4x12)", "Donkey Calf Raises (3x12)", "Seated Calf Raises (5x15)"] },
  // ── W52 ──
  "Mon-W52": { label: "Push", color: "#ef4444", exercises: ["Barbell Bench Press (4x8)", "Dumbbell Shoulder Press (4x8)", "Chest Dips (3x10)", "Standing Military Press (3x8)", "Front Raises (3x10)", "Tricep Dips (3x8)", "Skull Crushers (3x10)"] },
  "Tue-W52": { label: "Pull", color: "#3b82f6", exercises: ["Deadlifts (4x8)", "T-Bar Rows (4x8)", "Pull-Ups (4x10)", "Face Pulls (4x10)", "Concentration Curls (3x10)", "Cable Curls (3x10)"] },
  "Wed-W52": { label: "Legs", color: "#22c55e", exercises: ["Back Squats (4x10)", "Bulgarian Split Squats (4x12)", "Romanian Deadlifts (4x12)", "Step-Ups (3x12)", "Standing Calf Raises (5x15)", "Glute Bridges (4x12)"] },
  "Thu-W52": { label: "Push", color: "#ef4444", exercises: ["Decline Bench Press (4x12)", "Dumbbell Flyes (4x12)", "Cable Crossovers (3x15)", "Arnold Press (3x15)", "Upright Rows (3x12)", "Overhead Tricep Extension (3x15)", "Tricep Kickbacks (3x12)"] },
  "Fri-W52": { label: "Pull", color: "#3b82f6", exercises: ["Bent-Over Barbell Rows (4x12)", "Single-Arm Dumbbell Rows (4x12)", "Chin-Ups (4x15)", "Seated Cable Rows (4x12)", "Zottman Curls (3x15)", "Spider Curls (3x12)"] },
  "Sat-W52": { label: "Legs", color: "#22c55e", exercises: ["Hack Squats (4x12)", "Lying Leg Curls (4x15)", "Goblet Squats (4x15)", "Good Mornings (4x12)", "Donkey Calf Raises (3x12)", "Seated Calf Raises (5x15)"] },
};


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