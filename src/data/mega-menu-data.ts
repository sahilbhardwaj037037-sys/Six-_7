export interface MenuSubItem {
  name: string;
  href: string;
  badge?: string;
}

export interface MenuSection {
  title: string;
  items: MenuSubItem[];
}

export interface MenuFeaturedCard {
  title: string;
  subtitle: string;
  imageUrl: string;
  href: string;
  ctaText: string;
}

export interface MegaMenuContent {
  id: string;
  label: string;
  href: string;
  sections: MenuSection[];
  featured?: MenuFeaturedCard;
}

export const MEGA_MENU_DATA: Record<string, MegaMenuContent> = {
  Shop: {
    id: "shop",
    label: "Shop",
    href: "/shop",
    sections: [
      {
        title: "DISCOVER",
        items: [
          { name: "All Footwear", href: "/shop" },
          { name: "New Arrivals", href: "/new-arrivals", badge: "New" },
          { name: "Best Sellers", href: "/best-sellers" },
          { name: "Limited Drops", href: "/shop?filter=limited", badge: "250 Pairs" },
          { name: "Archive & Offers", href: "/offers" },
        ],
      },
      {
        title: "BY CATEGORY",
        items: [
          { name: "Sculpted Sneakers", href: "/shop?category=sneakers" },
          { name: "Running & Kinetic", href: "/shop?category=running" },
          { name: "Atelier Leather Derby", href: "/shop?category=leather" },
          { name: "Minimalist Court", href: "/shop?category=court" },
          { name: "Off-Grid Slides & Mules", href: "/shop?category=mules" },
        ],
      },
      {
        title: "COLLECTIONS",
        items: [
          { name: "Atelier Monochrome", href: "/collections/atelier-monochrome" },
          { name: "Vanguard Trail", href: "/collections/vanguard-trail" },
          { name: "Studio Runners", href: "/collections/studio-runners" },
          { name: "Bio-Foam Essentials", href: "/collections/bio-foam" },
        ],
      },
    ],
    featured: {
      title: "Six&7 V1 Phantom Low",
      subtitle: "Full-grain Italian calfskin with bio-composite sole dampening.",
      imageUrl: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80",
      href: "/shop?featured=phantom-low",
      ctaText: "Explore Silhouette",
    },
  },

  Men: {
    id: "men",
    label: "Men",
    href: "/men",
    sections: [
      {
        title: "FEATURED",
        items: [
          { name: "Men's New Arrivals", href: "/men?filter=new", badge: "Drop 03" },
          { name: "Men's Best Sellers", href: "/men?filter=bestsellers" },
          { name: "Architectural Court", href: "/men?category=court" },
          { name: "Trail Performance", href: "/men?category=trail" },
        ],
      },
      {
        title: "FOOTWEAR",
        items: [
          { name: "Sculpted Lows", href: "/men?category=lows" },
          { name: "Kinetic Runners", href: "/men?category=runners" },
          { name: "Handcrafted Derbies", href: "/men?category=derby" },
          { name: "Slip-On Monoliths", href: "/men?category=slip-on" },
          { name: "All Men's Shoes", href: "/men" },
        ],
      },
      {
        title: "DISCIPLINE",
        items: [
          { name: "Urban Cadence", href: "/men?discipline=urban" },
          { name: "Road Running", href: "/men?discipline=running" },
          { name: "Studio & Gym", href: "/men?discipline=training" },
          { name: "Rest & Recovery", href: "/men?discipline=recovery" },
        ],
      },
    ],
    featured: {
      title: "Aeroform Kinetic High",
      subtitle: "High-top architectural silhouette engineered with locked heel stability.",
      imageUrl: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80",
      href: "/men?item=aeroform-kinetic",
      ctaText: "Shop Men's Edition",
    },
  },

  Women: {
    id: "women",
    label: "Women",
    href: "/women",
    sections: [
      {
        title: "FEATURED",
        items: [
          { name: "Women's New Arrivals", href: "/women?filter=new", badge: "Editorial" },
          { name: "Women's Best Sellers", href: "/women?filter=bestsellers" },
          { name: "The Minimalist Edit", href: "/women?collection=minimalist" },
          { name: "Studio Exclusives", href: "/women?filter=exclusive" },
        ],
      },
      {
        title: "FOOTWEAR",
        items: [
          { name: "Strata Minimalist Runner", href: "/women?category=strata" },
          { name: "Forma Off-Grid Mule", href: "/women?category=mule" },
          { name: "Sculpted Sneaker Lows", href: "/women?category=lows" },
          { name: "Bio-Foam Trainers", href: "/women?category=trainers" },
          { name: "All Women's Shoes", href: "/women" },
        ],
      },
      {
        title: "DISCIPLINE",
        items: [
          { name: "Lightweight Propulsion", href: "/women?discipline=propulsion" },
          { name: "Everyday Commute", href: "/women?discipline=commute" },
          { name: "Trail & Field", href: "/women?discipline=trail" },
        ],
      },
    ],
    featured: {
      title: "Strata Minimalist Runner",
      subtitle: "Featherweight bio-foam cushioning with contoured arch support.",
      imageUrl: "https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?auto=format&fit=crop&w=800&q=80",
      href: "/women?item=strata-minimalist",
      ctaText: "Shop Women's Edition",
    },
  },

  Kids: {
    id: "kids",
    label: "Kids",
    href: "/kids",
    sections: [
      {
        title: "EXPLORE",
        items: [
          { name: "Junior New Arrivals", href: "/kids?filter=new", badge: "New" },
          { name: "Boys' Performance", href: "/kids?category=boys" },
          { name: "Girls' Performance", href: "/kids?category=girls" },
          { name: "Mini-Six Classics", href: "/kids?category=classics" },
        ],
      },
      {
        title: "BY AGE GROUP",
        items: [
          { name: "Teens (Sizes 3.5 - 7)", href: "/kids?size=teens" },
          { name: "Little Kids (Sizes 10.5 - 3)", href: "/kids?size=little" },
          { name: "Easy Slip-On Silhouettes", href: "/kids?type=slip-on" },
        ],
      },
      {
        title: "FEATURES",
        items: [
          { name: "Reinforced Toe Caps", href: "/kids?tech=reinforced" },
          { name: "Washable Bio-Mesh", href: "/kids?tech=washable" },
          { name: "Ergonomic Flex Grooves", href: "/kids?tech=flex" },
        ],
      },
    ],
    featured: {
      title: "Junior Kinetic Trainer",
      subtitle: "Durable reinforced toe caps and lightweight impact dampening for all-day activity.",
      imageUrl: "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?auto=format&fit=crop&w=800&q=80",
      href: "/kids",
      ctaText: "View Junior Line",
    },
  },

  Sports: {
    id: "sports",
    label: "Sports",
    href: "/sports",
    sections: [
      {
        title: "DISCIPLINE",
        items: [
          { name: "Road Running", href: "/sports?type=running" },
          { name: "Trail & Technical Outdoor", href: "/sports?type=trail" },
          { name: "Court & Basketball", href: "/sports?type=basketball" },
          { name: "High-Intensity Training", href: "/sports?type=training" },
        ],
      },
      {
        title: "INNOVATION",
        items: [
          { name: "Bio-Cellular Spring Sole", href: "/sports?tech=bio-cellular" },
          { name: "Carbon-Plate Propulsion", href: "/sports?tech=carbon" },
          { name: "Hydrophobic Weave", href: "/sports?tech=hydrophobic" },
          { name: "Grip-Lug Outsoles", href: "/sports?tech=outsoles" },
        ],
      },
      {
        title: "ESSENTIALS",
        items: [
          { name: "Performance Socks", href: "/sports?item=socks" },
          { name: "Replacement Bio-Insoles", href: "/sports?item=insoles" },
          { name: "Sole Care Kits", href: "/sports?item=care" },
        ],
      },
    ],
    featured: {
      title: "Echo Matrix Runner 02",
      subtitle: "Proprietary twin-density foam dampening built for long-distance tempo runs.",
      imageUrl: "https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?auto=format&fit=crop&w=800&q=80",
      href: "/sports?item=echo-matrix",
      ctaText: "Explore Performance",
    },
  },

  "New Arrivals": {
    id: "new-arrivals",
    label: "New Arrivals",
    href: "/new-arrivals",
    sections: [
      {
        title: "LATEST DROPS",
        items: [
          { name: "Drop 03 // Autumn 2026", href: "/new-arrivals", badge: "Latest" },
          { name: "V1 Phantom Low All-Black", href: "/new-arrivals" },
          { name: "Atelier Derby Cognac Edition", href: "/new-arrivals" },
          { name: "Echo Matrix Neon Accent", href: "/new-arrivals" },
        ],
      },
      {
        title: "BY AUDIENCE",
        items: [
          { name: "Men's New Releases", href: "/men?filter=new" },
          { name: "Women's New Releases", href: "/women?filter=new" },
          { name: "Junior New Releases", href: "/kids?filter=new" },
        ],
      },
      {
        title: "CURATED STORIES",
        items: [
          { name: "The Carbon-Plate Experiment", href: "#story" },
          { name: "Behind Tuscan Tannery 07", href: "#story" },
          { name: "All New Releases", href: "/new-arrivals" },
        ],
      },
    ],
    featured: {
      title: "Drop 03 Capsule",
      subtitle: "Only 250 pairs produced per colorway. Certified numbered run.",
      imageUrl: "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=800&q=80",
      href: "/new-arrivals",
      ctaText: "Shop Drop 03",
    },
  },

  "Best Sellers": {
    id: "best-sellers",
    label: "Best Sellers",
    href: "/best-sellers",
    sections: [
      {
        title: "ICONIC SILHOUETTES",
        items: [
          { name: "Apex Monolith Slip-On", href: "/best-sellers", badge: "#1 Seller" },
          { name: "Echo Matrix Runner 02", href: "/best-sellers" },
          { name: "Kinesis Track Low", href: "/best-sellers" },
          { name: "Six&7 V1 Phantom Low", href: "/best-sellers" },
        ],
      },
      {
        title: "CATEGORY LEADERS",
        items: [
          { name: "Best Selling Running", href: "/shop?filter=best-running" },
          { name: "Best Selling Lifestyle", href: "/shop?filter=best-lifestyle" },
          { name: "Best Selling Minimalist", href: "/shop?filter=best-minimalist" },
        ],
      },
      {
        title: "REVIEWS & AWARDS",
        items: [
          { name: "Editorial Reviews", href: "#story" },
          { name: "Design Award 2026 Nominee", href: "#story" },
        ],
      },
    ],
    featured: {
      title: "Apex Monolith Slip-On",
      subtitle: "Ergonomic seamless one-piece upper. The defining icon of the Six&7 house.",
      imageUrl: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80",
      href: "/best-sellers",
      ctaText: "Shop The Icon",
    },
  },

  Offers: {
    id: "offers",
    label: "Offers",
    href: "/offers",
    sections: [
      {
        title: "ARCHIVE & INCENTIVES",
        items: [
          { name: "Seasonal Archive Sale", href: "/offers", badge: "Up to 30%" },
          { name: "Last Chance Silhouettes", href: "/offers" },
          { name: "Complimentary Global Shipping", href: "/offers" },
          { name: "Private Allocation Members", href: "/offers", badge: "VIP" },
        ],
      },
      {
        title: "SPECIAL EDITIONS",
        items: [
          { name: "Archive Men's Footwear", href: "/offers" },
          { name: "Archive Women's Footwear", href: "/offers" },
          { name: "Studio Overstock Lots", href: "/offers" },
        ],
      },
      {
        title: "MEMBERSHIP",
        items: [
          { name: "Atelier Club Sign Up", href: "/offers" },
          { name: "Early Access Calendar", href: "/offers" },
        ],
      },
    ],
    featured: {
      title: "2026 Atelier Archive",
      subtitle: "Final remaining pairs of previous season silhouettes at curated archive pricing.",
      imageUrl: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?auto=format&fit=crop&w=800&q=80",
      href: "/offers",
      ctaText: "Access Archive",
    },
  },
};
