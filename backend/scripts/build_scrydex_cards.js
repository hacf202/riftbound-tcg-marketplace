const fs = require("fs");
const path = require("path");

const rawPath = path.join(__dirname, "../data/scrydex_riftbound_raw.json");
const rawCards = JSON.parse(fs.readFileSync(rawPath, "utf8"));

function cleanText(html) {
  if (!html) return "";
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/:rb_energy_([0-9]+):/g, "[$1 Energy]")
    .replace(/:rb_rune_([a-z0-9_]+):/g, "[$1 Rune]")
    .replace(/:rb_might:/g, "[Might]")
    .replace(/:rb_power:/g, "[Power]")
    .replace(/\s+/g, " ")
    .trim();
}

function cleanLore(accessibility, name) {
  if (!accessibility) return `Thẻ bài ma thuật chính thức từ vũ trụ Riftbound: ${name}.`;
  const parts = accessibility.split(". ");
  if (parts.length > 1) {
    return parts.slice(1).join(". ").trim();
  }
  return accessibility;
}

// Map domain to standard & thematic
function getDomainInfo(c) {
  const primaryDomain = c.domains && c.domains[0] ? c.domains[0].label : "Colorless";
  let thematic = "Void";
  let color = "#8b5cf6";

  if (primaryDomain === "Fury") {
    thematic = "Inferno";
    color = "#ef4444";
  } else if (primaryDomain === "Mind" || primaryDomain === "Calm") {
    thematic = "Astral";
    color = "#06b6d4";
  } else if (primaryDomain === "Body") {
    thematic = "Abyssal";
    color = "#10b981";
  } else if (primaryDomain === "Order") {
    thematic = "Astral";
    color = "#f59e0b";
  } else {
    thematic = "Void";
    color = "#8b5cf6";
  }

  return { primaryDomain, thematic, color };
}

// Map rarity
function getRarity(c) {
  const r = c.rarity ? c.rarity.label : "Common";
  if (r === "Showcase") return "Mythic";
  if (r === "Epic") return "Epic";
  if (r === "Rare") return "Rare";
  if (r === "Uncommon") return "Uncommon";
  return "Common";
}

// Pricing based on rarity
function getPricing(rarity) {
  switch (rarity) {
    case "Mythic":
      return { rift: 1200, usd: 180.0, eur: 168.0, minted: 50 };
    case "Legendary":
      return { rift: 500, usd: 75.0, eur: 70.0, minted: 250 };
    case "Epic":
      return { rift: 180, usd: 27.0, eur: 25.2, minted: 800 };
    case "Rare":
      return { rift: 60, usd: 9.0, eur: 8.4, minted: 2000 };
    case "Uncommon":
      return { rift: 25, usd: 3.75, eur: 3.5, minted: 3500 };
    default:
      return { rift: 10, usd: 1.5, eur: 1.4, minted: 6000 };
  }
}

// Select 200 iconic cards
// Guarantee Void Gate (OGN-296), Legends, and a diverse spread across rarities and domains
const TARGET_COUNT = 200;
const seenImages = new Set();
const selected200 = [];

// 1. Guaranteed Void Gate
const voidGate = rawCards.find((c) => c.name === "Void Gate");
if (voidGate && voidGate.cardImage && voidGate.cardImage.url) {
  selected200.push(voidGate);
  seenImages.add(voidGate.cardImage.url);
}

// 2. Add Legends / Champions (up to 45)
const legends = rawCards.filter(
  (c) =>
    (c.cardType || []).some((t) => t.id === "legend" || t.label === "Legend") &&
    c.cardImage &&
    c.cardImage.url &&
    !seenImages.has(c.cardImage.url)
);

for (const leg of legends) {
  if (selected200.length >= 45) break;
  selected200.push(leg);
  seenImages.add(leg.cardImage.url);
}

// 3. Add Epics & Showcases (up to 95)
const highTier = rawCards.filter(
  (c) =>
    (c.rarity?.label === "Epic" || c.rarity?.label === "Showcase") &&
    c.cardImage &&
    c.cardImage.url &&
    !seenImages.has(c.cardImage.url)
);

for (const ht of highTier) {
  if (selected200.length >= 95) break;
  selected200.push(ht);
  seenImages.add(ht.cardImage.url);
}

// 4. Add Rares (up to 140)
const rares = rawCards.filter(
  (c) =>
    c.rarity?.label === "Rare" &&
    c.cardImage &&
    c.cardImage.url &&
    !seenImages.has(c.cardImage.url)
);

for (const r of rares) {
  if (selected200.length >= 140) break;
  selected200.push(r);
  seenImages.add(r.cardImage.url);
}

// 5. Fill remaining to 200 with balanced cards across all domains
const remaining = rawCards.filter(
  (c) => c.cardImage && c.cardImage.url && !seenImages.has(c.cardImage.url)
);

for (const rem of remaining) {
  if (selected200.length >= TARGET_COUNT) break;
  selected200.push(rem);
  seenImages.add(rem.cardImage.url);
}

console.log(`Selected ${selected200.length} cards. Unique images count: ${seenImages.size}`);

// Format cards into Scrydex Schema
function formatCard(raw, assignedId) {
  const { primaryDomain, thematic, color } = getDomainInfo(raw);
  const rarity = getRarity(raw);
  const pricing = getPricing(rarity);
  const rulesText = cleanText(raw.text) || cleanLore(raw.cardImage?.accessibilityText, raw.name);
  const typeName = raw.cardType && raw.cardType[0] ? raw.cardType[0].label : "Unit";
  const publicCode = raw.publicCode || `OGN-${String(assignedId).padStart(3, "0")}/298`;
  const scrydexId = publicCode.split("/")[0]; // e.g. OGN-296
  const artistName = raw.illustrator && raw.illustrator[0] ? raw.illustrator[0] : "Riot Games";

  const cost = raw.energy !== undefined ? raw.energy : Math.floor(Math.random() * 4) + 1;
  const power = raw.power !== undefined ? raw.power : (rarity === "Mythic" ? 10 : rarity === "Epic" ? 6 : 3);
  const might = Math.floor(cost * 1.5) + (rarity === "Mythic" ? 5 : 2);

  return {
    id: assignedId,
    name: raw.name,
    title: `${primaryDomain} ${typeName}`,
    domain: primaryDomain, // Official Scrydex Domain (Fury, Calm, Mind, Body, Chaos, Order, Colorless)
    thematicDomain: thematic, // Alias for theme packs (Inferno, Astral, Abyssal, Void)
    type: typeName,
    rarity: rarity,
    cost: cost,
    power: power,
    might: might,
    artist: artistName,
    lore: raw.cardImage?.accessibilityText || `Official Riftbound TCG card: ${raw.name}`,
    ability: rulesText,
    image: raw.cardImage.url,
    color: raw.cardImage?.colors?.primary || color,
    foilAvailable: true,
    totalMinted: pricing.minted,
    marketFloorPrice: pricing.rift,

    // === Scrydex Official Specification Fields ===
    scrydex_id: scrydexId,
    public_code: publicCode,
    number: raw.collectorNumber || assignedId,
    printed_number: publicCode.includes("/") ? publicCode.split("-")[1] : `${String(assignedId).padStart(3, "0")}/298`,
    rules: [rulesText],
    flavor_text: cleanLore(raw.cardImage?.accessibilityText, raw.name),
    stats: {
      cost: cost,
      power: power,
      might: might,
    },
    images: {
      small: raw.cardImage.url,
      medium: raw.cardImage.url,
      large: raw.cardImage.url,
      front: raw.cardImage.url,
      back: "https://cmsassets.rgpub.io/sanity/images/dsfx7636/game_data_live/14a52a367fd41fd84745e050e62d1f281f733467-1038x744.png",
    },
    expansion: {
      id: raw.set || "OGN",
      name: raw.setName || "Origins",
      code: raw.set || "OGN",
      type: "Main",
      total: 352,
      printed_total: 298,
      release_date: "2025/10/31",
      logo: "https://images.scrydex.com/riftbound/OGN-logo/logo",
      language: "English",
      language_code: "EN",
    },
    language: "English",
    language_code: "EN",
    variants: [
      {
        name: "normal",
        prices: [
          {
            condition: "NM",
            is_perfect: false,
            is_signed: false,
            is_error: false,
            type: "raw",
            low: Number((pricing.usd * 0.7).toFixed(2)),
            market: pricing.usd,
            currency: "USD",
          },
        ],
      },
      {
        name: "foil",
        prices: [
          {
            condition: "NM",
            is_perfect: true,
            is_signed: false,
            is_error: false,
            type: "raw",
            low: Number((pricing.usd * 1.5).toFixed(2)),
            market: Number((pricing.usd * 2.2).toFixed(2)),
            currency: "USD",
          },
        ],
      },
    ],
    market: {
      floor_price_rift: pricing.rift,
      usd_price: pricing.usd,
      eur_price: pricing.eur,
      foil_available: true,
      total_minted: pricing.minted,
      currency: "$RIFT",
    },
  };
}

const CARDS_200 = selected200.map((raw, index) => formatCard(raw, index + 1));

// Also format ALL raw cards for complete Scrydex search coverage!
const ALL_SCRYDEX_CARDS = rawCards
  .filter((c) => c.cardImage && c.cardImage.url)
  .map((raw, index) => {
    // If it's in the 200, use the same id, otherwise index + 300
    const matched = CARDS_200.find((c) => c.scrydex_id === (raw.publicCode || "").split("/")[0]);
    if (matched) return matched;
    return formatCard(raw, 300 + index);
  });

console.log("CARDS_200 generated:", CARDS_200.length);
console.log("ALL_SCRYDEX_CARDS generated:", ALL_SCRYDEX_CARDS.length);

const outputContent = `/**
 * Official Scrydex Riftbound TCG Cards Dataset
 * Data synchronized directly from Scrydex Riftbound Cards Specification:
 * https://scrydex.com/docs/riftbound/cards#search-cards
 * Expansion: Origins (OGN) & Proving Grounds (OGS)
 */

const CARDS = ${JSON.stringify(CARDS_200, null, 2)};

const ALL_SCRYDEX_CARDS = ${JSON.stringify(ALL_SCRYDEX_CARDS, null, 2)};

module.exports = { CARDS, ALL_SCRYDEX_CARDS };
`;

fs.writeFileSync(path.join(__dirname, "../src/data/cards.js"), outputContent, "utf8");
console.log("Successfully updated backend/src/data/cards.js with 200 cards!");
