/**
 * Service pages (/services/<slug>). Copy is limited to what Tow Guys actually
 * offers — no prices or response-time promises.
 */

import type { FAQItem, GalleryImage, SEOContentBlock } from './serviceAreas';

export interface ServiceData {
  slug: string;
  /** Short name used in nav, cards and breadcrumbs */
  name: string;
  /** schema.org serviceType */
  serviceType: string;
  metaTitle: string;
  metaDescription: string;
  /** Hero headline; rendered as the page H1 */
  headline: string;
  intro: string;
  /** Short line for cards that link to this page */
  summary: string;
  /** Bullet list of what's included */
  includes: string[];
  /** Optional "who it's for" list */
  audience?: { heading: string; items: string[] };
  /** Optional numbered process */
  steps?: { heading: string; items: string[] };
  content: SEOContentBlock[];
  faqs: FAQItem[];
  images: GalleryImage[];
}

const SERVICES: ServiceData[] = [
  {
    slug: 'emergency-towing',
    name: 'Emergency Towing',
    serviceType: 'Emergency Towing',
    metaTitle: '24/7 Emergency Towing in Gresham, OR | Tow Guys',
    metaDescription:
      'Broken down or stuck in Gresham, Troutdale or East Portland? Tow Guys runs 24/7 emergency towing for cars, trucks, SUVs and box trucks. Call 971-222-7994.',
    headline: '24/7 Emergency Towing in Gresham, OR',
    intro:
      'Breakdowns don\'t keep business hours. Tow Guys dispatches tow trucks around the clock, including nights, weekends and holidays, from our yard on SE Dodge Park Blvd in Gresham.',
    summary: 'Day or night, holidays included — breakdowns, no-starts and disabled vehicles.',
    includes: [
      'Cars, SUVs, pickups and vans',
      'Box trucks and rental trucks',
      'Classic and collector cars',
      'Tows to your mechanic, dealer, home or our secure yard',
      'Night, weekend and holiday calls',
    ],
    content: [
      {
        headline: 'Local trucks, not a call center',
        body:
          'When you call Tow Guys you reach our own dispatch in Gresham, and the truck that comes is ours. We know East County roads — Powell, Division, Burnside, Stark, I-84 and US-26 — so we can find you quickly and give you an honest idea of when we\'ll get there.',
      },
      {
        headline: 'Wherever your vehicle needs to go',
        body:
          'We\'ll take your vehicle to the repair shop you trust, your dealership, your driveway, or our secure lot in Gresham if you need time to decide. Let us know where it\'s going when you call and we\'ll handle the rest.',
      },
      {
        headline: 'Tap to send your exact location',
        body:
          'On your phone, the "Text My Location" button on this site opens a text to us with a map pin of exactly where you are — just press Send — useful on the freeway, on back roads, or anywhere you\'re not sure of the address.',
      },
    ],
    faqs: [
      {
        question: 'Do you really tow 24 hours a day?',
        answer:
          'Yes. Tow Guys dispatches 24 hours a day, 7 days a week, including holidays. Call (971) 222-7994 any time.',
      },
      {
        question: 'Where will you take my car?',
        answer:
          'Anywhere you need it to go — your mechanic, a dealership, your home, or our secure storage lot at 28901 SE Dodge Park Blvd in Gresham.',
      },
      {
        question: 'Can you tow larger vehicles like box trucks?',
        answer:
          'Yes. Along with cars, SUVs and pickups, we tow box trucks and rental trucks. Tell dispatch what you have when you call so we send the right truck.',
      },
    ],
    images: [
      { src: '/gallery/gallery6.jpg', alt: 'Tow Guys wrecker towing a U-Haul box truck in Gresham, Oregon' },
      { src: '/images/hero-bg.jpg', alt: 'Tow Guys tow truck towing an SUV at night in the rain' },
      { src: '/gallery/gallery5.jpg', alt: 'Tow Guys Ram wrecker tow truck ready for 24/7 dispatch' },
    ],
  },
  {
    slug: 'flatbed-towing',
    name: 'Flatbed Towing',
    serviceType: 'Flatbed Towing',
    metaTitle: 'Flatbed Towing in Gresham, OR | AWD, Classic & Motorcycle | Tow Guys',
    metaDescription:
      'Flatbed towing in Gresham and East Portland for AWD vehicles, classics, lowered cars, motorcycles and small equipment. All four wheels off the ground. Call 971-222-7994.',
    headline: 'Flatbed Towing in Gresham, OR',
    intro:
      'A flatbed carries your whole vehicle with all four wheels off the road — the safest way to move all-wheel-drive vehicles, classics, lowered cars, motorcycles and anything that can\'t roll.',
    summary: 'All four wheels off the ground for AWD, classics, motorcycles and equipment.',
    includes: [
      'All-wheel-drive and 4x4 vehicles',
      'Classic, collector and luxury cars',
      'Lowered and modified vehicles',
      'Motorcycles, strapped and secured',
      'Small equipment such as mini excavators',
      'Vehicles that won\'t roll or steer',
    ],
    content: [
      {
        headline: 'Why AWD vehicles need a flatbed',
        body:
          'Towing an all-wheel-drive vehicle with two wheels on the ground can damage the drivetrain. A flatbed lifts the entire vehicle, so nothing turns on the way to the shop. If you\'re not sure what your car needs, tell dispatch the year, make and model and we\'ll send the right truck.',
      },
      {
        headline: 'Careful with the cars you care about',
        body:
          'Classic and collector owners trust us with their cars — customers have used us for BMW classics and Jaguars. We load slowly, strap at proper points and deliver to your mechanic, body shop or garage.',
      },
      {
        headline: 'Motorcycles and equipment too',
        body:
          'Our flatbeds haul motorcycles to dealers and repair shops, and can move small equipment like mini excavators between job sites in the Gresham area.',
      },
    ],
    faqs: [
      {
        question: 'Does my all-wheel-drive car need a flatbed?',
        answer:
          'In most cases, yes. A flatbed keeps all four wheels off the ground, which avoids drivetrain damage. Give dispatch your year, make and model and we\'ll confirm.',
      },
      {
        question: 'Can you tow a motorcycle?',
        answer:
          'Yes. We transport motorcycles on our flatbeds, strapped down and secured, to dealers, repair shops or your home.',
      },
      {
        question: 'Do you haul equipment?',
        answer:
          'We can move small equipment such as mini excavators on our flatbeds. Call with the machine and its weight so we can confirm the right truck.',
      },
    ],
    images: [
      { src: '/gallery/gallery3.jpg', alt: 'Ram dually pickup loaded on a Tow Guys flatbed tow truck' },
      { src: '/images/tow2.jpg', alt: 'Motorcycle strapped to a Tow Guys flatbed at a Honda dealer' },
      { src: '/images/tow6.jpg', alt: 'Mini excavator hauled on a Tow Guys flatbed in a Gresham neighborhood' },
    ],
  },
  {
    slug: 'roadside-assistance',
    name: 'Roadside Assistance',
    serviceType: 'Roadside Assistance',
    metaTitle: 'Roadside Assistance in Gresham, OR | Jump Starts, Lockouts & Fuel | Tow Guys',
    metaDescription:
      'Dead battery, locked out, flat tire or out of gas in Gresham or East Portland? Tow Guys roadside assistance is available 24/7. Call 971-222-7994.',
    headline: 'Roadside Assistance in Gresham, OR',
    intro:
      'Not every problem needs a tow. For dead batteries, lockouts, flat tires and empty tanks, Tow Guys comes to you and gets you moving again — and if it turns out you do need a tow, the truck is already there.',
    summary: 'Jump starts, lockouts, tire changes and fuel delivery, 24/7.',
    includes: [
      'Jump starts for dead batteries',
      'Car lockouts — keys locked inside',
      'Flat tire changes with your spare',
      'Fuel delivery when you run out of gas',
      'Winch-outs from ditches, mud and snow',
    ],
    content: [
      {
        headline: 'Locked out? Dead battery?',
        body:
          'Lockouts and dead batteries are some of the most common calls we get, and some of the fastest to fix. Customers regularly tell us we had them back in their car or on the road quickly.',
      },
      {
        headline: 'Stuck off the road',
        body:
          'Slid into a ditch, stuck in mud or snow, or off the edge of a driveway? Our trucks can winch your vehicle back onto solid ground, and tow it if anything is damaged.',
      },
      {
        headline: 'Stay safe while you wait',
        body:
          'If you can, pull fully onto the shoulder or into a parking lot, turn on your hazards, and stay buckled in your vehicle on busy roads like I-84 or US-26. Tap "Text My Location" (then press Send) so our driver can find you without guesswork.',
      },
    ],
    faqs: [
      {
        question: 'Can you unlock my car?',
        answer:
          'Yes. Lockout service is part of our roadside assistance. Call (971) 222-7994 and tell us where you are.',
      },
      {
        question: 'Do you deliver gas?',
        answer:
          'Yes. If you run out of fuel we can bring enough to get you to the nearest gas station.',
      },
      {
        question: 'What if a jump start doesn\'t work?',
        answer:
          'If your vehicle still won\'t start, we can tow it to your mechanic or our yard on the same call.',
      },
    ],
    images: [
      { src: '/gallery/gallery5.jpg', alt: 'Tow Guys roadside assistance truck in Gresham, Oregon' },
      { src: '/images/tow5.jpg', alt: 'Tow Guys wrecker ready for roadside assistance and winch-outs' },
      { src: '/gallery/gallery4.jpg', alt: 'Tow Guys winching an SUV out of landscaping at night' },
    ],
  },
  {
    slug: 'accident-recovery',
    name: 'Accident Recovery',
    serviceType: 'Accident Recovery and Towing',
    metaTitle: 'Accident Towing & Recovery in Gresham, OR | Secure Storage | Tow Guys',
    metaDescription:
      'Accident towing and vehicle recovery in Gresham, Troutdale and East Portland. We work with police and insurance and store vehicles in our secure yard. Call 971-222-7994.',
    headline: 'Accident Towing & Recovery in Gresham, OR',
    intro:
      'After a crash, you need the scene cleared safely and your vehicle somewhere secure. Tow Guys recovers damaged vehicles from roads, ditches and embankments and works alongside local police at the scene.',
    summary: 'Crash scene recovery, secure storage, and coordination with police and insurance.',
    includes: [
      'Towing damaged and non-drivable vehicles',
      'Recovery from ditches, embankments and off-road',
      'Scene cleanup coordination with law enforcement',
      'Secure storage at our Gresham yard',
      'Release to you, your insurer or your body shop',
    ],
    content: [
      {
        headline: 'Trusted by local police',
        body:
          'Tow Guys is a Gresham-based company trusted by the Gresham Police Department. We work accident scenes alongside officers, recover vehicles carefully, and keep traffic moving.',
      },
      {
        headline: 'Your vehicle, stored securely',
        body:
          'Damaged vehicles go to our fenced yard at 28901 SE Dodge Park Blvd until you, your insurance company or your body shop are ready. You can also send it straight to the shop of your choice.',
      },
      {
        headline: 'Picking up your vehicle or belongings',
        body:
          'Bring a valid photo ID, proof of ownership (title or registration), proof of insurance, and cash — vehicle pickups are cash only. Call ahead so we can have everything ready when you arrive.',
      },
    ],
    faqs: [
      {
        question: 'Where does my car go after an accident?',
        answer:
          'Wherever you choose — a body shop, dealership, your home, or our secure yard in Gresham while you sort things out with insurance.',
      },
      {
        question: 'What do I need to pick up my vehicle?',
        answer:
          'A valid photo ID, proof of ownership (title or registration), proof of insurance, and cash — vehicle pickups are cash only. Call (971) 222-7994 before you come so we can have it ready.',
      },
      {
        question: 'Do you work with insurance companies?',
        answer:
          'Yes. We can release your vehicle to your insurer or the body shop they assign, and we coordinate with law enforcement at the scene.',
      },
    ],
    images: [
      { src: '/gallery/gallery7.jpg', alt: 'Tow Guys recovering a crashed SUV from an embankment near I-84' },
      { src: '/gallery/gallery11.jpg', alt: 'Tow Guys clearing an accident scene on a wet Gresham road' },
      { src: '/gallery/gallery1.jpg', alt: 'City of Gresham police vehicle on a Tow Guys flatbed' },
    ],
  },
  {
    slug: 'junk-car-removal',
    name: 'Cash for Junk Cars',
    serviceType: 'Junk Car Removal',
    metaTitle: 'Cash for Junk Cars in Gresham, OR | Free Removal | Tow Guys',
    metaDescription:
      'Sell your junk, broken or unwanted car for cash in Gresham and East Portland. Text 3 photos for a quote and we\'ll tow it away. Call or text 971-222-7994.',
    headline: 'Cash for Junk Cars in Gresham, OR',
    intro:
      'Got a car that doesn\'t run, failed inspection or is just taking up space? Tow Guys buys junk and unwanted vehicles and tows them away — no need to get it running first.',
    summary: 'Text 3 photos, get a quote, and we tow it away.',
    includes: [
      'Running or non-running vehicles',
      'Wrecked, damaged and high-mileage cars',
      'Quotes by text from your photos',
      'Pickup from your driveway, street or shop',
    ],
    steps: {
      heading: 'How it works',
      items: [
        'Text 3 photos — front, side and interior — with the year, make and model to (971) 222-7994.',
        'We reply with a cash offer.',
        'If you accept, we schedule a pickup and tow it away.',
      ],
    },
    content: [
      {
        headline: 'Quotes from your phone',
        body:
          'You don\'t need to bring the car anywhere or wait for an appraiser. Text us three photos and the basic details, and we\'ll come back with an offer.',
      },
      {
        headline: 'Have your paperwork ready',
        body:
          'To sell a vehicle you\'ll generally need to show you own it — have your title and a photo ID ready when we pick it up. If something\'s missing, ask us when you text and we\'ll tell you what\'s needed.',
      },
    ],
    faqs: [
      {
        question: 'Does the car need to run?',
        answer: 'No. We buy running and non-running vehicles and tow them away.',
      },
      {
        question: 'How do I get a quote?',
        answer:
          'Text three photos (front, side and interior) plus the year, make and model to (971) 222-7994, or use "Sell Junk Car for Cash" on our homepage.',
      },
      {
        question: 'What paperwork do I need?',
        answer:
          'Have your title and a valid photo ID ready. If your title is missing, mention it when you text and we\'ll let you know your options.',
      },
    ],
    images: [
      { src: '/images/tow3.jpg', alt: 'Tow Guys trucks ready for junk car pickup in the Gresham area' },
      { src: '/gallery/gallery9.jpg', alt: 'Tow Guys flatbed for junk car removal' },
      { src: '/gallery/gallery8.jpg', alt: 'Tow Guys flatbed tow truck inside a warehouse' },
    ],
  },
  {
    slug: 'private-property-impound',
    name: 'Private Property Impound',
    serviceType: 'Private Property Impound Towing',
    metaTitle: 'Private Property Towing & Parking Enforcement in Gresham, OR | Tow Guys',
    metaDescription:
      'Private property impound towing for apartments, HOAs, shopping centers and businesses in Gresham and East Portland. No cost to the property owner. Call 971-222-7994.',
    headline: 'Private Property Impound Towing in Gresham, OR',
    intro:
      'Take back control of your parking. Tow Guys removes abandoned, unauthorized and illegally parked vehicles from private property — and it costs the property nothing. The vehicle owner pays for the tow and storage.',
    summary: 'Parking enforcement for apartments, HOAs and businesses — no cost to you.',
    includes: [
      'Abandoned and inoperable vehicles',
      'Unauthorized parking in reserved or customer-only spaces',
      'Fire lanes, blocked access and illegal parking',
      'Parking signage for your property',
      '24/7 response',
    ],
    audience: {
      heading: 'Perfect for',
      items: [
        'Apartment complexes',
        'Shopping centers',
        'HOAs and private communities',
        'Businesses and contractors',
      ],
    },
    steps: {
      heading: 'How it works',
      items: [
        'You call us when there\'s a problem vehicle.',
        'We arrive quickly and remove it.',
        'You get your parking back — stress-free.',
      ],
    },
    content: [
      {
        headline: 'No cost to the property',
        body:
          'Property owners and managers don\'t pay for impound tows. The vehicle owner is responsible for the tow and storage when they retrieve the vehicle from our yard.',
      },
      {
        headline: 'Professional and compliant',
        body:
          'Our drivers are uniformed, our trucks are clean, and we follow Oregon\'s private property towing laws, including signage requirements. We can help you get compliant signs posted so enforcement is clear to residents and visitors.',
      },
      {
        headline: 'Local and trusted',
        body:
          'Tow Guys is based in Gresham, serves the local community, and is trusted by the Gresham Police Department. Impounded vehicles are held at our secure yard on SE Dodge Park Blvd.',
      },
    ],
    faqs: [
      {
        question: 'How much does private property towing cost the property owner?',
        answer:
          'Nothing. The owner of the towed vehicle pays the tow and storage fees, not the property.',
      },
      {
        question: 'Do I need signs before vehicles can be towed?',
        answer:
          'Oregon has signage requirements for private property towing. Call us and we\'ll walk you through what your property needs and help you get signs posted.',
      },
      {
        question: 'My car was towed from private property — where is it?',
        answer:
          'If Tow Guys towed it, it\'s at our secure yard at 28901 SE Dodge Park Blvd, Gresham, OR 97080. Call (971) 222-7994 and bring a valid photo ID, proof of ownership, proof of insurance, and cash — vehicle pickups are cash only.',
      },
    ],
    images: [
      { src: '/gallery/gallery2.jpg', alt: 'Tow Guys secure impound yard and sign on SE Dodge Park Blvd in Gresham' },
      { src: '/gallery/gallery10.jpg', alt: 'Tow Guys office and impound lot in Gresham, Oregon' },
      { src: '/gallery/gallery13.jpg', alt: 'Tow Guys flatbed removing a vehicle in Gresham' },
    ],
  },
];

export default SERVICES;
