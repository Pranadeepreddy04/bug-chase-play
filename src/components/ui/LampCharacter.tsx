import { motion } from "framer-motion";

interface LampCharacterProps {
  state: "off" | "on" | "happy" | "sad";
}

export const LampCharacter = ({ state }: LampCharacterProps) => {
  const isOn = state === "on" || state === "happy";
  const lampColor = state === "happy" ? "#FCD34D" : state === "sad" ? "#9CA3AF" : isOn ? "#FDE047" : "#6B7280";
  const glowIntensity = state === "happy" ? 40 : isOn ? 25 : 0;

  return (
    <div className="flex flex-col items-center mb-8">
      <motion.div
        animate={{
          scale: state === "happy" ? [1, 1.1, 1] : 1,
        }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        <svg
          width="120"
          height="140"
          viewBox="0 0 120 140"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Glow effect */}
          {isOn && (
            <motion.circle
              cx="60"
              cy="35"
              r="30"
              fill={lampColor}
              opacity="0.3"
              animate={{
                r: [25, glowIntensity, 25],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          )}

          {/* Lamp shade */}
          <motion.path
            d="M 30 30 L 25 50 L 95 50 L 90 30 Z"
            fill={lampColor}
            animate={{
              fill: lampColor,
            }}
            transition={{ duration: 0.3 }}
          />

          {/* Lamp bulb */}
          <motion.circle
            cx="60"
            cy="35"
            r="8"
            fill={isOn ? "#FFF59D" : "#E5E7EB"}
            animate={{
              fill: isOn ? "#FFF59D" : "#E5E7EB",
            }}
            transition={{ duration: 0.3 }}
          />

          {/* Lamp neck */}
          <rect x="56" y="50" width="8" height="20" fill="#9CA3AF" rx="2" />

          {/* Lamp base */}
          <ellipse cx="60" cy="75" rx="20" ry="8" fill="#6B7280" />

          {/* Face - Eyes */}
          <motion.circle
            cx="50"
            cy="60"
            r="2"
            fill="#374151"
            animate={{
              scaleY: state === "sad" ? 0.5 : 1,
            }}
          />
          <motion.circle
            cx="70"
            cy="60"
            r="2"
            fill="#374151"
            animate={{
              scaleY: state === "sad" ? 0.5 : 1,
            }}
          />

          {/* Face - Mouth */}
          {state === "happy" && (
            <motion.path
              d="M 50 65 Q 60 70 70 65"
              stroke="#374151"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.3 }}
            />
          )}
          {state === "sad" && (
            <motion.path
              d="M 50 68 Q 60 63 70 68"
              stroke="#374151"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.3 }}
            />
          )}

          {/* Cord */}
          <motion.path
            d="M 60 75 Q 65 85 60 95 L 60 110"
            stroke="#6B7280"
            strokeWidth="2"
            fill="none"
            animate={{
              d: state === "happy"
                ? "M 60 75 Q 70 85 65 95 L 65 110"
                : "M 60 75 Q 65 85 60 95 L 60 110",
            }}
            transition={{ duration: 0.3 }}
          />

          {/* Plug */}
          <rect x="55" y="110" width="10" height="8" fill="#6B7280" rx="2" />
          <line x1="58" y1="118" x2="58" y2="125" stroke="#6B7280" strokeWidth="2" />
          <line x1="62" y1="118" x2="62" y2="125" stroke="#6B7280" strokeWidth="2" />
        </svg>
      </motion.div>

      <motion.p
        className="text-sm text-muted-foreground mt-2 font-medium"
        animate={{
          opacity: [0.6, 1, 0.6],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {state === "off" && "💡 Focus to light up"}
        {state === "on" && "✨ Glowing bright!"}
        {state === "happy" && "🎉 Welcome back!"}
        {state === "sad" && "😢 Oops, something went wrong"}
      </motion.p>
    </div>
  );
};
