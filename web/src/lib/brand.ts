/**
 * Product identity. A third-party provider must not present itself as the government register,
 * so the product has its own name and states its independence wherever results are shown.
 */
export const APP_NAME = "AssetCheck";
export const APP_TAGLINE = "PPSR & vehicle history searches";
/**
 * Pricing shown on the landing page. Placeholder figures for the PoC — set real prices once
 * AFSA's B2G fees and your margins are confirmed. Pay-as-you-go matches SEARCH_FEE_CENTS in the API.
 */
export const PRICING = [
  {
    name: "Pay as you go",
    price: "$4.00",
    unit: "per search",
    description: "For private buyers and occasional checks.",
    features: [
      "Security interests on the PPSR",
      "Vehicle details with every VIN search",
      "Written-off and stolen checks",
      "Search history and reprints",
    ],
    cta: "Create free account",
    featured: false,
  },
  {
    name: "Business",
    price: "$3.50",
    unit: "per search",
    description: "For dealers, brokers and lenders running regular checks.",
    features: [
      "Everything in Pay as you go",
      "Your own reference on every search",
      "Monthly invoice",
      "Multiple users on one account",
    ],
    cta: "Start with Business",
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    unit: "volume pricing",
    description: "For high volumes and system integration.",
    features: ["Everything in Business", "API access", "Bulk and batch searching", "Dedicated support"],
    cta: "Get started",
    featured: false,
  },
] as const;

export const INDEPENDENCE_NOTICE =
  "AssetCheck is an independent service and is not affiliated with the Australian Financial Security Authority (AFSA). Search results are obtained from the Personal Property Securities Register (PPSR).";

/** In-page sections of the landing page, used by its header, mobile menu and footer. */
export const LANDING_SECTIONS = [
  { href: "#home", label: "Home" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#about", label: "About" },
  { href: "#pricing", label: "Pricing" },
];
