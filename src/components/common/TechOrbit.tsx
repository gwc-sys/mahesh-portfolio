import { motion } from 'framer-motion';
import type { IconType } from 'react-icons';
import {
  TbBolt,
  TbBrain,
  TbChartBar,
  TbCircleCheck,
  TbCurrencyDollar,
  TbDatabase,
  TbFileText,
  TbMail,
  TbSearch,
  TbSettings,
  TbTrendingUp,
  TbUsers,
  TbUserStar,
} from 'react-icons/tb';

interface DiagramNode {
  label: string;
  icon: IconType;
  y: number;
}

const businessInputs: DiagramNode[] = [
  { label: 'Customers and teams', icon: TbUsers, y: 55 },
  { label: 'Business data', icon: TbDatabase, y: 107 },
  { label: 'Documents', icon: TbFileText, y: 159 },
  { label: 'Messages', icon: TbMail, y: 211 },
  { label: 'Analytics', icon: TbChartBar, y: 263 },
  { label: 'Operations', icon: TbSettings, y: 315 },
];

const businessOutcomes: DiagramNode[] = [
  { label: 'Business growth', icon: TbTrendingUp, y: 70 },
  { label: 'Customer value', icon: TbUserStar, y: 138 },
  { label: 'Automated operations', icon: TbSettings, y: 206 },
  { label: 'Financial value', icon: TbCurrencyDollar, y: 274 },
];

const operatingStages = [
  { label: 'UNDERSTAND', icon: TbSearch, x: 286 },
  { label: 'REASON', icon: TbBrain, x: 362 },
  { label: 'DECIDE', icon: TbCircleCheck, x: 438 },
  { label: 'ACT', icon: TbBolt, x: 514 },
];

function AnimatedIcon({
  icon: Icon,
  colorClass,
  delay = 0,
}: {
  icon: IconType;
  colorClass: string;
  delay?: number;
}) {
  return (
    <motion.div
      animate={{ scale: [0.94, 1.08, 0.94], opacity: [0.7, 1, 0.7] }}
      transition={{ duration: 1.45, repeat: Infinity, delay, ease: 'easeInOut' }}
      className="flex h-full w-full items-center justify-center"
    >
      <Icon
        className={colorClass}
        style={{ width: '78%', height: '78%' }}
        strokeWidth={1.7}
        aria-hidden="true"
      />
    </motion.div>
  );
}

export function TechOrbit() {
  return (
    <div
      className="relative mx-auto aspect-[8/5] w-full max-w-[40rem] overflow-hidden rounded-2xl border border-blue-300/20 bg-slate-950 shadow-[0_30px_90px_rgba(37,99,235,0.3)] sm:rounded-[2rem] lg:aspect-[3/2] xl:aspect-[10/7]"
      aria-label="Animated AI operating system connecting business inputs to business outcomes"
    >
      <svg
        viewBox="0 0 800 500"
        preserveAspectRatio="none"
        className="block h-full w-full"
        role="img"
        aria-labelledby="ai-os-title ai-os-description"
      >
        <title id="ai-os-title">Intelligent AI operating system</title>
        <desc id="ai-os-description">
          Business inputs flow through an AI operating system that understands, reasons, decides, acts, and continuously learns to create business outcomes.
        </desc>

        <defs>
          <radialGradient id="diagram-background" cx="50%" cy="38%" r="65%">
            <stop offset="0%" stopColor="#102B61" />
            <stop offset="42%" stopColor="#07152F" />
            <stop offset="100%" stopColor="#020617" />
          </radialGradient>
          <linearGradient id="input-line" x1="142" y1="190" x2="295" y2="190">
            <stop stopColor="#8B5CF6" stopOpacity="0.45" />
            <stop offset="1" stopColor="#38BDF8" />
          </linearGradient>
          <linearGradient id="output-line" x1="505" y1="190" x2="658" y2="190">
            <stop stopColor="#38BDF8" />
            <stop offset="1" stopColor="#6366F1" stopOpacity="0.5" />
          </linearGradient>
          <linearGradient id="feedback-line" x1="708" y1="445" x2="90" y2="445">
            <stop stopColor="#8B5CF6" />
            <stop offset="0.5" stopColor="#3B82F6" />
            <stop offset="1" stopColor="#38BDF8" />
          </linearGradient>
          <linearGradient id="ai-ring" x1="300" y1="90" x2="500" y2="290">
            <stop stopColor="#38BDF8" />
            <stop offset="0.5" stopColor="#3B82F6" />
            <stop offset="1" stopColor="#8B5CF6" />
          </linearGradient>
          <filter id="diagram-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="strong-glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="7" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <marker id="diagram-arrow" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
            <path d="M1 1 L8 5 L1 9" fill="none" stroke="#60A5FA" strokeWidth="1.8" />
          </marker>
          <pattern id="diagram-grid" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M32 0H0V32" fill="none" stroke="#3B82F6" strokeOpacity="0.055" strokeWidth="1" />
          </pattern>
        </defs>

        <rect width="800" height="500" fill="url(#diagram-background)" />
        <rect width="800" height="500" fill="url(#diagram-grid)" />

        <text x="92" y="25" textAnchor="middle" fill="#BFDBFE" fillOpacity="0.8" fontSize="13" fontWeight="800" letterSpacing="1.5">
          BUSINESS
        </text>
        <text x="92" y="42" textAnchor="middle" fill="#BFDBFE" fillOpacity="0.8" fontSize="13" fontWeight="800" letterSpacing="1.5">
          INPUTS
        </text>
        <text x="400" y="31" textAnchor="middle" fill="#DBEAFE" fillOpacity="0.9" fontSize="15" fontWeight="800" letterSpacing="2">
          AI OPERATING SYSTEM
        </text>
        <text x="708" y="25" textAnchor="middle" fill="#BFDBFE" fillOpacity="0.8" fontSize="13" fontWeight="800" letterSpacing="1.5">
          BUSINESS
        </text>
        <text x="708" y="42" textAnchor="middle" fill="#BFDBFE" fillOpacity="0.8" fontSize="13" fontWeight="800" letterSpacing="1.5">
          OUTCOMES
        </text>

        {businessInputs.map((input, index) => {
          const centerY = input.y + 21;

          return (
            <g key={input.label}>
              <motion.path
                d={`M142 ${centerY} C205 ${centerY}, 188 190, 245 190 L294 190`}
                stroke="url(#input-line)"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                markerEnd={index === 2 ? 'url(#diagram-arrow)' : undefined}
                filter="url(#diagram-glow)"
                strokeDasharray="8 6"
                animate={{ strokeDashoffset: [0, -28], opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.55 + index * 0.1, repeat: Infinity, ease: 'linear' }}
              />
              <motion.rect
                x="42"
                y={input.y}
                width="100"
                height="42"
                rx="8"
                fill="#0B1E42"
                fillOpacity="0.9"
                stroke="#60A5FA"
                strokeOpacity="0.28"
                animate={{ strokeOpacity: [0.2, 0.65, 0.2] }}
                transition={{ duration: 1.6, repeat: Infinity, delay: index * 0.12 }}
              />
              <foreignObject x="72" y={input.y + 5} width="40" height="32">
                <AnimatedIcon icon={input.icon} colorClass="text-blue-400" delay={index * 0.18} />
              </foreignObject>
            </g>
          );
        })}

        {businessOutcomes.map((outcome, index) => {
          const centerY = outcome.y + 27;

          return (
            <g key={outcome.label}>
              <motion.path
                d={`M506 190 L555 190 C612 190, 595 ${centerY}, 658 ${centerY}`}
                stroke="url(#output-line)"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                markerEnd="url(#diagram-arrow)"
                filter="url(#diagram-glow)"
                strokeDasharray="8 6"
                animate={{ strokeDashoffset: [0, -28], opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.65 + index * 0.12, repeat: Infinity, ease: 'linear' }}
              />
              <motion.rect
                x="658"
                y={outcome.y}
                width="100"
                height="54"
                rx="8"
                fill="#0B1E42"
                fillOpacity="0.9"
                stroke="#8B5CF6"
                strokeOpacity="0.3"
                animate={{ strokeOpacity: [0.2, 0.65, 0.2] }}
                transition={{ duration: 1.6, repeat: Infinity, delay: index * 0.14 }}
              />
              <foreignObject x="687" y={outcome.y + 8} width="42" height="38">
                <AnimatedIcon icon={outcome.icon} colorClass="text-violet-400" delay={index * 0.2} />
              </foreignObject>
            </g>
          );
        })}

        <motion.circle
          cx="400"
          cy="190"
          r="112"
          fill="#07142E"
          fillOpacity="0.94"
          stroke="url(#ai-ring)"
          strokeWidth="2.5"
          filter="url(#strong-glow)"
          animate={{ r: [108, 112, 108], opacity: [0.75, 1, 0.75] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.circle
          cx="400"
          cy="190"
          r="94"
          fill="none"
          stroke="#818CF8"
          strokeOpacity="0.42"
          strokeWidth="1.2"
          strokeDasharray="4 5"
          animate={{ rotate: 360 }}
          transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '400px 190px' }}
        />
        <motion.circle
          cx="400"
          cy="190"
          r="77"
          fill="#172554"
          fillOpacity="0.28"
          animate={{ r: [72, 80, 72], opacity: [0.2, 0.48, 0.2] }}
          transition={{ duration: 1.7, repeat: Infinity, ease: 'easeInOut' }}
        />

        <foreignObject x="352" y="108" width="96" height="90">
          <AnimatedIcon icon={TbBrain} colorClass="text-violet-300 drop-shadow-[0_0_10px_rgba(167,139,250,0.95)]" />
        </foreignObject>
        <text
          x="400"
          y="245"
          textAnchor="middle"
          fill="#DBEAFE"
          fontSize="35"
          fontWeight="800"
          filter="url(#diagram-glow)"
        >
          AI OS
        </text>

        <rect x="244" y="316" width="312" height="78" rx="12" fill="#0B1E42" fillOpacity="0.95" stroke="#60A5FA" strokeOpacity="0.28" />
        {operatingStages.slice(0, -1).map((stage) => (
          <line key={`divider-${stage.label}`} x1={stage.x + 38} y1="328" x2={stage.x + 38} y2="382" stroke="#60A5FA" strokeOpacity="0.2" />
        ))}
        {operatingStages.map((stage, index) => (
          <g key={stage.label}>
            <foreignObject x={stage.x - 15} y="326" width="30" height="28">
              <AnimatedIcon icon={stage.icon} colorClass="text-sky-400" delay={index * 0.35} />
            </foreignObject>
            <text x={stage.x} y="374" textAnchor="middle" fill="#DBEAFE" fillOpacity="0.9" fontSize="10" fontWeight="800">
              {stage.label}
            </text>
            <motion.line
              x1={stage.x - 15}
              y1="383"
              x2={stage.x + 15}
              y2="383"
              stroke="#67E8F9"
              strokeWidth="2"
              animate={{ opacity: [0.15, 1, 0.15], scaleX: [0.3, 1, 0.3] }}
              transition={{ duration: 1.25, repeat: Infinity, delay: index * 0.24 }}
              style={{ transformOrigin: `${stage.x}px 383px` }}
            />
          </g>
        ))}

        <motion.path
          d="M708 328 L708 414 C708 438 690 448 666 448 L134 448 C110 448 92 438 92 414 L92 389"
          stroke="url(#feedback-line)"
          strokeWidth="2.2"
          fill="none"
          strokeLinecap="round"
          markerEnd="url(#diagram-arrow)"
          filter="url(#diagram-glow)"
          strokeDasharray="10 7"
          animate={{ strokeDashoffset: [0, 34], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'linear' }}
        />

        <motion.rect
          x="374"
          y="414"
          width="52"
          height="48"
          rx="7"
          fill="#0B1E42"
          stroke="#60A5FA"
          strokeOpacity="0.45"
          animate={{ y: [414, 409, 414] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <foreignObject x="385" y="420" width="30" height="28">
          <AnimatedIcon icon={TbDatabase} colorClass="text-blue-400" />
        </foreignObject>
        <text x="400" y="486" textAnchor="middle" fill="#BFDBFE" fillOpacity="0.8" fontSize="12" fontWeight="800" letterSpacing="1.6">
          LEARN &amp; IMPROVE
        </text>
      </svg>
    </div>
  );
}
