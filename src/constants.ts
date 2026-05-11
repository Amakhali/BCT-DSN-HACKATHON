import { UserProfile } from "./types";

export const DEMO_PROFILES: UserProfile[] = [
  {
    name: "Alex 'The Cynic' Thompson",
    bio: "Tech enthusiast who hates over-engineered solutions. Always looking for the 'catch'. Values reliability over features.",
    traits: ["Cynical", "Succinct", "Technical", "Critical"],
    history: [
      {
        id: "1",
        itemName: "Smart Coffee Maker X1",
        rating: 2,
        content: "Why do I need an app to brew coffee? The wifi chip broke after two days. Now it's just an expensive paperweight.",
        category: "Electronics"
      },
      {
        id: "2",
        itemName: "Mechanical Keyboard Pro",
        rating: 4,
        content: "Build quality is decent. Switches are reliable. Software is a mess, but at least it works offline."
      }
    ]
  },
  {
    name: "Maya 'Solaris' Chen",
    bio: "Optimistic lifestyle blogger. Loves aesthetics, sustainability, and small details. Very generous with praise if something 'sparks joy'.",
    traits: ["Enthusiastic", "Detail-oriented", "Style-focused", "Generous"],
    history: [
      {
        id: "3",
        itemName: "Bamboo Desk Organizer",
        rating: 5,
        content: "Absolutely stunning! The texture of the bamboo is so soothing. It completely transformed my workspace vibe. ✨",
        category: "Home Office"
      },
      {
        id: "4",
        itemName: "Vegan Leather Daypack",
        rating: 4,
        content: "Love the mission behind this brand. The color is a perfect sage green. The zippers are a bit stiff, but I hope they break in!"
      }
    ]
  },
  {
    name: "Gordon 'Grumpy' Ramsey-Lite",
    bio: "Home cook with very high standards. Focuses on preparation time, cleanliness, and value for money. Extremely harsh if quality is inconsistent.",
    traits: ["Perfectionist", "Direct", "Value-driven", "Harsh"],
    history: [
      {
        id: "5",
        itemName: "Non-Stick Pan 12-inch",
        rating: 1,
        content: "Coating started peeling after three uses at medium heat. Unacceptable. My cast iron is better than this junk.",
        category: "Kitchen"
      },
      {
        id: "6",
        itemName: "Local Bistro Dinner",
        rating: 3,
        content: "Steak was overcooked. Service was polite but slow. Overpriced for what it is."
      }
    ]
  }
];

export const DEMO_ITEMS = [
  {
    name: "AI-Powered Smart Toaster",
    category: "Kitchen Electronics",
    description: "A toaster that uses computer vision to detect the perfect shade of brown for your bread.",
    features: ["4K Camera inside", "Mobile App Control", "Voice Assistant Integration", "Custom Toast Profiles"],
  },
  {
    name: "ErgoFlow Office Chair",
    category: "Furniture",
    description: "A premium ergonomic chair designed for 12+ hours of continuous use with adaptive lumbar support.",
    features: ["Recycled Ocean Plastic", "4D Armrests", "Breathable Mesh", "Hidden storage compartment"],
  },
  {
    name: "Urban Explorer Wireless Buds",
    category: "Audio",
    description: "Compact wireless earbuds for city life with aggressive noise canceling and long battery.",
    features: ["40h Battery", "IPX7 Waterproof", "Transparency Mode", "Recycled Packaging"],
  }
];
