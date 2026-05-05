import type { MaterialQualityIndicator, TrackedMaterial } from "./types";

export const materialQualityIndicators: MaterialQualityIndicator[] = [
  {
    slug: "calibration-traceability-coverage",
    title: "Calibration traceability coverage",
    summary: "Share of critical measurements tied to traceable references and documented uncertainty budgets.",
    category: "metrology",
    value: "92",
    target: "98",
    unit: "%",
    direction: "higher-better",
    status: "watch",
    trend: "rising",
    updatedAt: "2026-05-05T00:00:00-05:00",
    cadence: "Weekly until every critical measurement path has a named reference and uncertainty owner.",
    sourceSlug: "nist-srm",
    topicSlugs: ["material-quality", "metrology"],
    signalSlugs: ["measurement-graph-over-material-facts"],
    tags: ["calibration", "traceability", "uncertainty"],
    whyItMatters:
      "A material stat is only as useful as the measurement chain behind it. Traceability coverage is the early warning for weak certificates, stale instruments, or unowned uncertainty."
  },
  {
    slug: "lot-variance-drift",
    title: "Lot-to-lot variance drift",
    summary: "Coefficient-of-variation watch across incoming material lots, normalized by the most critical property per family.",
    category: "process",
    value: "1.8",
    target: "<= 1.0",
    unit: "% CV",
    direction: "lower-better",
    status: "watch",
    trend: "mixed",
    updatedAt: "2026-05-05T00:00:00-05:00",
    cadence: "Per lot, summarized weekly for the materials with active sourcing or process changes.",
    sourceSlug: "nist-materials",
    topicSlugs: ["material-quality", "metrology"],
    signalSlugs: ["measurement-graph-over-material-facts"],
    tags: ["variance", "lots", "incoming-quality"],
    whyItMatters:
      "Variance drift moves before full failures show up. It is a better leading signal than waiting for scrap, returns, or field reliability problems."
  },
  {
    slug: "process-capability-cpk",
    title: "Process capability index",
    summary: "Cpk-style readiness score for the narrowest manufacturing tolerance currently being watched.",
    category: "process",
    value: "1.42",
    target: ">= 1.67",
    direction: "higher-better",
    status: "watch",
    trend: "steady",
    updatedAt: "2026-05-05T00:00:00-05:00",
    cadence: "Daily for active production experiments; weekly for research-only materials.",
    sourceSlug: "nist-manufacturing",
    topicSlugs: ["material-quality", "metrology"],
    signalSlugs: ["measurement-graph-over-material-facts"],
    tags: ["cpk", "capability", "manufacturing"],
    whyItMatters:
      "A strong material can still be unusable if the process cannot repeatedly hit the required window. Capability is the bridge between lab promise and production reality."
  },
  {
    slug: "non-destructive-inspection-coverage",
    title: "Non-destructive inspection coverage",
    summary: "Critical feature coverage by non-destructive inspection, inline sensing, or documented post-process checks.",
    category: "durability",
    value: "78",
    target: "95",
    unit: "%",
    direction: "higher-better",
    status: "watch",
    trend: "rising",
    updatedAt: "2026-05-05T00:00:00-05:00",
    cadence: "Reviewed whenever a material, geometry, or supplier changes.",
    sourceSlug: "nasa-technology",
    topicSlugs: ["material-quality", "critical-materials"],
    signalSlugs: ["aerospace-material-signals-need-early-inspection"],
    tags: ["inspection", "ndt", "durability"],
    whyItMatters:
      "Inspection coverage is a leading indicator for hidden porosity, cracks, delamination, contamination, or heat-treatment misses before those defects become system failures."
  },
  {
    slug: "critical-material-exposure",
    title: "Critical material exposure",
    summary: "Supply and substitution risk score for materials tied to energy, aerospace, electronics, or high-spec manufacturing.",
    category: "supply-chain",
    value: "68",
    target: "< 45",
    unit: "risk index",
    direction: "lower-better",
    status: "risk",
    trend: "rising",
    updatedAt: "2026-05-05T00:00:00-05:00",
    cadence: "Monthly, with immediate review after DOE, NIST, NASA, or supplier signals.",
    sourceSlug: "doe-ammto",
    topicSlugs: ["critical-materials", "material-quality"],
    signalSlugs: ["critical-material-exposure-is-a-quality-signal"],
    tags: ["critical-minerals", "supply-chain", "substitution"],
    whyItMatters:
      "A material can look excellent in the lab and still be fragile in the product if its feedstock is scarce, concentrated, geopolitically exposed, or hard to substitute."
  },
  {
    slug: "digital-thread-completeness",
    title: "Digital thread completeness",
    summary: "Percent of material records with property values, provenance, source URL, timestamp, and downstream decision note.",
    category: "data-quality",
    value: "64",
    target: "90",
    unit: "%",
    direction: "higher-better",
    status: "watch",
    trend: "rising",
    updatedAt: "2026-05-05T00:00:00-05:00",
    cadence: "Updated whenever a source trail, test result, or computed-property connector is added.",
    sourceSlug: "materials-project",
    topicSlugs: ["material-quality", "data-quality", "source-trails"],
    signalSlugs: ["materials-project-as-data-connector"],
    tags: ["provenance", "api", "digital-thread"],
    whyItMatters:
      "Useful material quality tracking needs provenance. Missing source, timestamp, or decision context turns a stat into a loose bookmark."
  },
  {
    slug: "scrap-rework-rate",
    title: "Scrap and rework rate",
    summary: "Combined scrap and rework signal for the material/process pair with the highest current learning value.",
    category: "process",
    value: "4.6",
    target: "< 2.0",
    unit: "%",
    direction: "lower-better",
    status: "risk",
    trend: "falling",
    updatedAt: "2026-05-05T00:00:00-05:00",
    cadence: "Per experiment batch, with a weekly rollup.",
    sourceSlug: "nist-manufacturing",
    topicSlugs: ["material-quality"],
    signalSlugs: ["measurement-graph-over-material-facts"],
    tags: ["scrap", "rework", "yield"],
    whyItMatters:
      "Scrap and rework are late enough to hurt, but early enough to diagnose before warranty, reliability, or field failures become the signal."
  },
  {
    slug: "accelerated-aging-evidence",
    title: "Accelerated-aging evidence",
    summary: "Evidence score for whether the material has stress, temperature, corrosion, fatigue, or radiation aging data attached.",
    category: "durability",
    value: "6",
    target: "8",
    unit: "/10",
    direction: "higher-better",
    status: "watch",
    trend: "steady",
    updatedAt: "2026-05-05T00:00:00-05:00",
    cadence: "Reviewed when adding new material families or moving a material toward field use.",
    sourceSlug: "nasa-technology",
    topicSlugs: ["material-quality", "critical-materials"],
    signalSlugs: ["aerospace-material-signals-need-early-inspection"],
    tags: ["aging", "fatigue", "reliability"],
    whyItMatters:
      "Leading-edge materials fail in edge conditions. Aging evidence shows whether the current confidence is based on realistic stress or only room-temperature optimism."
  }
];

export const trackedMaterials: TrackedMaterial[] = [
  {
    slug: "magnesium-alloys",
    name: "Magnesium alloys",
    family: "Lightweight structural metals",
    summary: "Useful where low density matters, but corrosion control, lot chemistry, and surface treatment quality need a tight measurement trail.",
    updatedAt: "2026-05-05T00:00:00-05:00",
    topicSlugs: ["material-quality", "critical-materials"],
    sourceSlugs: ["nist-materials", "nist-srm"],
    indicatorSlugs: ["calibration-traceability-coverage", "lot-variance-drift", "scrap-rework-rate"],
    qualityStats: [
      { label: "Density class", value: "low", status: "stable" },
      { label: "Corrosion sensitivity", value: "high", status: "watch" },
      { label: "Traceability need", value: "chemistry + treatment", status: "watch" }
    ],
    leadingIndicators: [
      "incoming chemistry variance",
      "coating adhesion drift",
      "salt/corrosion exposure deltas",
      "heat-treatment record completeness"
    ]
  },
  {
    slug: "silicon-carbide-ceramics",
    name: "Silicon carbide ceramics",
    family: "High-temperature ceramics",
    summary: "Strong fit for heat, wear, and electronics-adjacent environments when porosity, grain structure, and thermal shock evidence are controlled.",
    updatedAt: "2026-05-05T00:00:00-05:00",
    topicSlugs: ["material-quality", "metrology"],
    sourceSlugs: ["nist-materials", "nasa-technology"],
    indicatorSlugs: ["non-destructive-inspection-coverage", "accelerated-aging-evidence", "digital-thread-completeness"],
    qualityStats: [
      { label: "Thermal stability", value: "high", status: "stable" },
      { label: "Porosity watch", value: "active", status: "watch" },
      { label: "Inspection priority", value: "critical", status: "risk" }
    ],
    leadingIndicators: [
      "porosity distribution",
      "thermal shock deltas",
      "surface flaw detection coverage",
      "batch sintering window drift"
    ]
  },
  {
    slug: "high-purity-nickel-feedstock",
    name: "High-purity nickel feedstock",
    family: "Battery and alloy inputs",
    summary: "A quality and supply-chain watch item because impurity profile, source concentration, and refining path can change downstream performance.",
    updatedAt: "2026-05-05T00:00:00-05:00",
    topicSlugs: ["critical-materials", "material-quality"],
    sourceSlugs: ["doe-ammto", "nist-materials"],
    indicatorSlugs: ["critical-material-exposure", "digital-thread-completeness", "lot-variance-drift"],
    qualityStats: [
      { label: "Purity sensitivity", value: "high", status: "risk" },
      { label: "Supply exposure", value: "elevated", status: "risk" },
      { label: "Substitution pressure", value: "medium", status: "watch" }
    ],
    leadingIndicators: [
      "impurity ppm drift",
      "supplier concentration",
      "refining capacity signals",
      "battery and alloy demand changes"
    ]
  },
  {
    slug: "rare-earth-magnet-feedstock",
    name: "Rare-earth magnet feedstock",
    family: "Motor and actuator materials",
    summary: "Track coercivity, dysprosium/neodymium exposure, recovery signals, and substitution research before shortages become product constraints.",
    updatedAt: "2026-05-05T00:00:00-05:00",
    topicSlugs: ["critical-materials", "material-quality"],
    sourceSlugs: ["doe-ammto", "nist-materials"],
    indicatorSlugs: ["critical-material-exposure", "accelerated-aging-evidence", "digital-thread-completeness"],
    qualityStats: [
      { label: "Supply exposure", value: "high", status: "risk" },
      { label: "Recovery value", value: "high", status: "stable" },
      { label: "Substitution readiness", value: "early", status: "watch" }
    ],
    leadingIndicators: [
      "critical mineral policy signals",
      "recycling and recovery funding",
      "high-temperature magnetic property drift",
      "substitution research velocity"
    ]
  },
  {
    slug: "thermal-protection-ceramics",
    name: "Thermal protection ceramics",
    family: "Aerospace and high-heat protection",
    summary: "Aerospace-style quality depends on density, thermal conductivity, microcracking, coating integrity, and aging under realistic heat cycles.",
    updatedAt: "2026-05-05T00:00:00-05:00",
    topicSlugs: ["material-quality", "metrology"],
    sourceSlugs: ["nasa-technology", "nist-materials"],
    indicatorSlugs: ["non-destructive-inspection-coverage", "accelerated-aging-evidence", "calibration-traceability-coverage"],
    qualityStats: [
      { label: "Thermal exposure", value: "extreme", status: "risk" },
      { label: "Aging evidence", value: "needed", status: "watch" },
      { label: "Inspection need", value: "high", status: "risk" }
    ],
    leadingIndicators: [
      "thermal conductivity drift",
      "cycle-test delamination",
      "surface recession rate",
      "microcrack inspection coverage"
    ]
  }
];
