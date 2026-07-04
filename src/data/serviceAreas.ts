/**
 * Service area city data for programmatic local SEO pages.
 *
 * Each entry maps a URL slug to structured city metadata used by the
 * ServiceArea page component for dynamic copy, JSON-LD schema, and
 * meta tags.
 */

export interface CityData {
  /** URL slug — must be lowercase, hyphenated (e.g. "wood-village") */
  slug: string;
  /** Display name — properly capitalized (e.g. "Wood Village") */
  name: string;
  /** Approximate city-center latitude */
  lat: number;
  /** Approximate city-center longitude */
  lng: number;
  /** One-liner shown as the hero subtext — should include a local flavor cue */
  tagline: string;
  /** Wikipedia entity URL for sameAs / knowledge-graph linkage */
  wiki: string;
  /** GeoCircle radius in miles used in areaServed schema */
  radiusMi: number;
}

const SERVICE_AREAS: CityData[] = [
  {
    slug: 'gresham',
    name: 'Gresham',
    lat: 45.4983,
    lng: -122.4310,
    tagline: 'Our home base — the fastest response time in the fleet.',
    wiki: 'https://en.wikipedia.org/wiki/Gresham,_Oregon',
    radiusMi: 8,
  },
  {
    slug: 'troutdale',
    name: 'Troutdale',
    lat: 45.5393,
    lng: -122.3872,
    tagline: 'Gateway to the Gorge — we cover I-84 and the Outlets.',
    wiki: 'https://en.wikipedia.org/wiki/Troutdale,_Oregon',
    radiusMi: 5,
  },
  {
    slug: 'wood-village',
    name: 'Wood Village',
    lat: 45.5334,
    lng: -122.4176,
    tagline: 'Minutes from our lot — fast flatbed towing when you need it.',
    wiki: 'https://en.wikipedia.org/wiki/Wood_Village,_Oregon',
    radiusMi: 3,
  },
  {
    slug: 'fairview',
    name: 'Fairview',
    lat: 45.5390,
    lng: -122.4340,
    tagline: 'Covering Fairview from Blue Lake to Halsey Street.',
    wiki: 'https://en.wikipedia.org/wiki/Fairview,_Oregon',
    radiusMi: 4,
  },
  {
    slug: 'boring',
    name: 'Boring',
    lat: 45.4326,
    lng: -122.3682,
    tagline: 'Hwy 212 breakdowns and beyond — we\'re already close.',
    wiki: 'https://en.wikipedia.org/wiki/Boring,_Oregon',
    radiusMi: 6,
  },
  {
    slug: 'sandy',
    name: 'Sandy',
    lat: 45.3973,
    lng: -122.2612,
    tagline: 'Mt. Hood corridor coverage — chains or no chains.',
    wiki: 'https://en.wikipedia.org/wiki/Sandy,_Oregon',
    radiusMi: 7,
  },
  {
    slug: 'corbett',
    name: 'Corbett',
    lat: 45.5219,
    lng: -122.2285,
    tagline: 'Scenic Highway breakdowns handled with care.',
    wiki: 'https://en.wikipedia.org/wiki/Corbett,_Oregon',
    radiusMi: 6,
  },
  {
    slug: 'portland',
    name: 'Portland',
    lat: 45.5152,
    lng: -122.6784,
    tagline: 'East-side Portland — from I-205 to the city center.',
    wiki: 'https://en.wikipedia.org/wiki/Portland,_Oregon',
    radiusMi: 15,
  },
  {
    slug: 'clackamas',
    name: 'Clackamas',
    lat: 45.4076,
    lng: -122.5712,
    tagline: 'I-205, Clackamas Town Center, and the surrounding corridors.',
    wiki: 'https://en.wikipedia.org/wiki/Clackamas,_Oregon',
    radiusMi: 8,
  },
];

export default SERVICE_AREAS;
