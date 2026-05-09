import { useRef, useState, useCallback } from "react";
import { calculateAngle, LANDMARKS } from "./usePoseDetection";

const EXERCISE_CONFIGS = {
  // ─── MOBILITY EXERCISES ──────────────────────────────────────────

  "Neck Rotations & Tilts": {
    joints: [
      LANDMARKS.LEFT_SHOULDER,
      LANDMARKS.LEFT_EAR ?? 7,
      LANDMARKS.RIGHT_SHOULDER,
    ],
    downAngle: 160,
    upAngle: 120,
    feedback: {
      up: "Hold the tilt! 🧘",
      down: "Return to center",
      good: "Good neck movement! ✅",
    },
  },

  "Shoulder Pendulums": {
    joints: [LANDMARKS.LEFT_HIP, LANDMARKS.LEFT_SHOULDER, LANDMARKS.LEFT_ELBOW],
    downAngle: 30,
    upAngle: 80,
    feedback: {
      up: "Full circle! 🔄",
      down: "Let it hang naturally",
      good: "Great pendulum! ✅",
    },
  },

  "Cat-Cow Stretch": {
    joints: [LANDMARKS.LEFT_SHOULDER, LANDMARKS.LEFT_HIP, LANDMARKS.LEFT_KNEE],
    downAngle: 160,
    upAngle: 120,
    feedback: {
      up: "Hold the arch! 🐱",
      down: "Now round your back 🐄",
      good: "Full stretch! ✅",
    },
  },

  "Ankle Circles": {
    joints: [LANDMARKS.LEFT_KNEE, LANDMARKS.LEFT_ANKLE, LANDMARKS.LEFT_HIP],
    downAngle: 150,
    upAngle: 110,
    feedback: {
      up: "Full rotation! 🔄",
      down: "Keep circling",
      good: "Good ankle mobility! ✅",
    },
  },

  "Seated Hamstring Stretch": {
    joints: [LANDMARKS.LEFT_HIP, LANDMARKS.LEFT_KNEE, LANDMARKS.LEFT_ANKLE],
    downAngle: 90,
    upAngle: 160,
    feedback: {
      up: "Leg fully extended! ✅",
      down: "Bend the knee",
      good: "Great stretch! ✅",
    },
  },

  // ─── STRENGTH EXERCISES ──────────────────────────────────────────

  "Glute Bridges": {
    joints: [LANDMARKS.LEFT_SHOULDER, LANDMARKS.LEFT_HIP, LANDMARKS.LEFT_KNEE],
    downAngle: 160,
    upAngle: 110,
    feedback: {
      up: "Hold at the top! 💪",
      down: "Lower your hips",
      good: "Perfect bridge! ✅",
    },
  },

  "Straight Leg Raises (SLR)": {
    joints: [LANDMARKS.LEFT_HIP, LANDMARKS.LEFT_KNEE, LANDMARKS.LEFT_ANKLE],
    downAngle: 170,
    upAngle: 120,
    feedback: {
      up: "Hold it up! 💪",
      down: "Lower slowly",
      good: "Great raise! ✅",
    },
  },

  Clamshells: {
    joints: [LANDMARKS.LEFT_SHOULDER, LANDMARKS.LEFT_HIP, LANDMARKS.LEFT_KNEE],
    downAngle: 160,
    upAngle: 120,
    feedback: {
      up: "Open wide! 🦪",
      down: "Close slowly",
      good: "Perfect clamshell! ✅",
    },
  },

  "Bird-Dog": {
    joints: [LANDMARKS.LEFT_SHOULDER, LANDMARKS.LEFT_HIP, LANDMARKS.LEFT_KNEE],
    downAngle: 160,
    upAngle: 120,
    feedback: {
      up: "Hold and balance! 🐦",
      down: "Return to start",
      good: "Great stability! ✅",
    },
  },

  "Wall Sits": {
    joints: [LANDMARKS.LEFT_HIP, LANDMARKS.LEFT_KNEE, LANDMARKS.LEFT_ANKLE],
    downAngle: 95,
    upAngle: 160,
    feedback: {
      up: "Stand tall! 🧱",
      down: "Sit down to 90°",
      good: "Perfect wall sit! ✅",
    },
  },

  // ─── FUNCTIONAL & BALANCE ────────────────────────────────────────

  "Sit-to-Stand": {
    joints: [LANDMARKS.LEFT_HIP, LANDMARKS.LEFT_KNEE, LANDMARKS.LEFT_ANKLE],
    downAngle: 95,
    upAngle: 165,
    feedback: {
      up: "Fully standing! 🧍",
      down: "Sit back down slowly",
      good: "Great sit-to-stand! ✅",
    },
  },

  "Single-Leg Stands": {
    joints: [LANDMARKS.LEFT_HIP, LANDMARKS.LEFT_KNEE, LANDMARKS.LEFT_ANKLE],
    downAngle: 160,
    upAngle: 120,
    feedback: {
      up: "Balance! 🦩",
      down: "Lower the leg",
      good: "Great balance! ✅",
    },
  },

  "Step Ups/Downs": {
    joints: [LANDMARKS.LEFT_HIP, LANDMARKS.LEFT_KNEE, LANDMARKS.LEFT_ANKLE],
    downAngle: 160,
    upAngle: 100,
    feedback: {
      up: "Step up! 🪜",
      down: "Step down slowly",
      good: "Great step! ✅",
    },
  },

  // ─── CLASSIC EXERCISES ───────────────────────────────────────────

  "Bicep Curl": {
    joints: [
      LANDMARKS.LEFT_SHOULDER,
      LANDMARKS.LEFT_ELBOW,
      LANDMARKS.LEFT_WRIST,
    ],
    downAngle: 160,
    upAngle: 40,
    feedback: {
      up: "Hold it! 💪",
      down: "Extend fully!",
      good: "Great curl! ✅",
    },
  },

  Squat: {
    joints: [LANDMARKS.LEFT_HIP, LANDMARKS.LEFT_KNEE, LANDMARKS.LEFT_ANKLE],
    downAngle: 90,
    upAngle: 170,
    feedback: {
      up: "Stand tall!",
      down: "Go lower! 🏋️",
      good: "Perfect squat! ✅",
    },
  },

  "Shoulder Raise": {
    joints: [LANDMARKS.LEFT_HIP, LANDMARKS.LEFT_SHOULDER, LANDMARKS.LEFT_ELBOW],
    downAngle: 20,
    upAngle: 160,
    feedback: {
      up: "Hold up! 🙌",
      down: "Lower slowly!",
      good: "Nice raise! ✅",
    },
  },

  "Knee Extension": {
    joints: [LANDMARKS.LEFT_HIP, LANDMARKS.LEFT_KNEE, LANDMARKS.LEFT_ANKLE],
    downAngle: 90,
    upAngle: 170,
    feedback: {
      up: "Fully extended! ✅",
      down: "Bend knee!",
      good: "Great extension! ✅",
    },
  },

  // Added/Additional Exercise
  "Shoulder Rotation": {
    joints: [LANDMARKS.LEFT_HIP, LANDMARKS.LEFT_SHOULDER, LANDMARKS.LEFT_ELBOW],
    downAngle: 30,
    upAngle: 130,
    feedback: {
      up: "Full circle! 🔄",
      down: "Keep rotating!",
      good: "Good rotation! ✅",
    },
  },
};

const DEFAULT_CONFIG = {
  joints: [LANDMARKS.LEFT_HIP, LANDMARKS.LEFT_KNEE, LANDMARKS.LEFT_ANKLE],
  downAngle: 160,
  upAngle: 100,
  feedback: { up: "Hold! 💪", down: "Return to start", good: "Good rep! ✅" },
};

export function useRepCounter(exerciseTitle = "") {
  const [reps, setReps] = useState(0);
  const [feedback, setFeedback] = useState("Get ready...");
  const [angle, setAngle] = useState(0);
  const stageRef = useRef("down");

  // Case-insensitive matching so "sit-to-stand" matches "Sit-to-Stand"
  const config = Object.keys(EXERCISE_CONFIGS).find(
    (key) => key.toLowerCase() === exerciseTitle.toLowerCase(),
  )
    ? EXERCISE_CONFIGS[
        Object.keys(EXERCISE_CONFIGS).find(
          (key) => key.toLowerCase() === exerciseTitle.toLowerCase(),
        )
      ]
    : DEFAULT_CONFIG;

  const processLandmarks = useCallback(
    (lm) => {
      if (!lm || lm.length === 0) return;

      const [aIdx, bIdx, cIdx] = config.joints;
      const a = lm[aIdx];
      const b = lm[bIdx];
      const c = lm[cIdx];

      if (!a || !b || !c) return;

      const currentAngle = calculateAngle(a, b, c);

      setTimeout(() => {
        setAngle(Math.round(currentAngle));

        if (currentAngle > config.downAngle) {
          stageRef.current = "down";
          setFeedback(config.feedback.down);
        }

        if (currentAngle < config.upAngle && stageRef.current === "down") {
          stageRef.current = "up";
          setReps((prev) => prev + 1);
          setFeedback(config.feedback.good);
        }
      }, 0);
    },
    [config],
  );

  const reset = useCallback(() => {
    setReps(0);
    setFeedback("Get ready...");
    setAngle(0);
    stageRef.current = "down";
  }, []);

  return { reps, feedback, angle, processLandmarks, reset };
}
