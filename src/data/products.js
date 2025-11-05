// Centralized product database
export const productsData = [
  { 
    id: 1, 
    name: "Sassy Sunnipindi", 
    category: "skin-care",
    priority: 0, // 0 = normal priority, higher numbers appear first
    description: "Traditional bath powder for glowing skin. Experience the timeless beauty secrets of India with our authentic Sunnipindi formulation.",
    fullDescription: "Sassy Sunnipindi is a traditional herbal bath powder that has been used for centuries in Indian households. This unique blend combines the finest natural ingredients to provide you with radiant, glowing skin. The powder works gently to exfoliate dead skin cells, brighten your complexion, and leave your skin feeling soft and refreshed. Regular use helps maintain skin health and brings out your natural glow.",
    benefits: "Natural cleansing, skin brightening, gentle exfoliation, anti-aging properties",
    ingredients: "Rice Flour, Chickpea Flour, Green Gram Flour, Fenugreek Seeds Flour, Turmeric, Mudda Karappam (Camphor), Triphala, Manjishta, Jivvadhu",
    skinType: "Normal to oily skin, dull or tired complexion",
    effects: "Cleanses, exfoliates, and brightens skin; helps control oil and pigmentation with anti-inflammatory and antibacterial properties.",
    keyBenefits: "Brightening, gentle exfoliation, oil control", 
    sizes: [ 
      { size: "200g", weight: "0.25 kg", price: 350, stock: 50 }, 
      { size: "400g", weight: "0.50 kg", price: 700, stock: 30 },
      { size: "800g", weight: "0.80 kg", price: 1400, stock: 30 }
    ], 
    rating: 4.8, 
    reviews: 156,
    images: [
      "/images/Sassy Sunnupindi/Sassy Sunnipindi 1.jpg",
      "/images/Sassy Sunnupindi/Sassy Sunnipindi 2.jpg",
      "/images/Sassy Sunnupindi/Sassy Sunnipindi 3.jpg",
      "/images/Sassy Sunnupindi/Sassy Sunnipindi 4.jpg",
      "/images/Sassy Sunnupindi/Sassy Sunnipindi 5.jpg",
      "/images/Sassy Sunnupindi/Sassy Sunnipindi 6.jpg"
    ]
  },
  { 
    id: 2, 
    name: "Authentic Avarampoo", 
    category: "skin-care",
    priority: 0,
    description: "Natural skin care powder with Avarampoo. Embrace the authentic tradition of natural skincare with pure Avarampoo.",
    fullDescription: "Authentic Avarampoo powder is crafted from the finest Avarampoo flowers, known for their exceptional skin benefits. This traditional formulation has been trusted for generations to provide natural nourishment and a healthy glow. The unique properties of Avarampoo help in maintaining skin elasticity, reducing signs of aging, and promoting an even skin tone.",
    benefits: "Anti-aging, skin nourishment, natural glow, even skin tone",
    ingredients: "Rice Flour, Chickpea Flour, Green Gram Flour, Fenugreek Seeds Flour, Turmeric, Mudda Karappam (Camphor), Triphala, Manjishta, Avarampoo (Tanner's Cassia), Jivvadhu",
    skinType: "Oily, pigmented, acne-prone skin",
    effects: "Cools and refreshes, aids in controlling oiliness, supports healthy skin, and prevents breakouts.",
    keyBenefits: "Controlling oil, reducing pigmentation, cooling", 
    sizes: [ 
      { size: "200g", weight: "0.25 kg", price: 400, stock: 45 }, 
      { size: "400g", weight: "0.50 kg", price: 800, stock: 25 },
      { size: "800g", weight: "0.80 kg", price: 1600, stock: 30 }
    ], 
    rating: 4.7, 
    reviews: 89,
    images: [
      "/images/Authentic Avarampoo/Authentic Avarampoo 1.jpg",
      "/images/Authentic Avarampoo/Authentic Avarampoo 2.jpg",
      "/images/Authentic Avarampoo/Authentic Avarampoo 3.jpg",
      "/images/Authentic Avarampoo/Authentic Avarampoo 4.jpg",
      "/images/Authentic Avarampoo/Authentic Avarampoo 5.jpg",
      "/images/Authentic Avarampoo/Authentic Avarampoo 6.jpg"
    ]
  },
  { 
    id: 3, 
    name: "Multani Marvel", 
    category: "skin-care",
    priority: 0,
    description: "Premium Multani Mitti powder for skin care. Detoxify and renew your complexion with this potent clay-based powder.",
    fullDescription: "Multani Marvel is a potent clay-based powder designed specifically for oily and combination skin. Featuring Multani Mitti (Fuller's Earth), this natural formula absorbs impurities and excess sebum while soothing acne-related irritations. It brightens the skin and refines texture, resulting in a smoother, clearer complexion. Ideal for those seeking an effective deep-cleanse and oil control with Ayurvedic care.",
    benefits: "Deep cleansing, oil control, skin detoxification, pore refinement",
    ingredients: "Rice Flour, Chickpea Flour, Green Gram Flour, Fenugreek Seeds Flour, Turmeric, Mudda Karappam (Camphor), Triphala, Manjishta, Multani Mitti, Jivvadhu",
    skinType: "Oily, combination, acne-prone skin",
    effects: "Detoxifies and purifies skin, draws out impurities, controls excess oil, and brightens complexion.",
    keyBenefits: "Detoxifying, removing excess oil, and brightening complexion", 
    sizes: [ 
      { size: "200g", weight: "0.40 kg", price: 400, stock: 60 }, 
      { size: "400g", weight: "0.65 kg", price: 800, stock: 35 },
      { size: "800g", weight: "0.80 kg", price: 1600, stock: 30 }
    ], 
    rating: 4.6, 
    reviews: 124,
    images: [
      "/images/Multani Marvel/Multani Marvel 1.jpg",
      "/images/Multani Marvel/Multani Marvel 2.jpg",
      "/images/Multani Marvel/Multani Marvel 3.jpg",
      "/images/Multani Marvel/Multani Marvel 4.jpg",
      "/images/Multani Marvel/Multani Marvel 5.jpg",
      "/images/Multani Marvel/Multani Marvel 6.jpg"
    ]
  },
  { 
    id: 4, 
    name: "Serene Sandalwood", 
    category: "skin-care",
    priority: 0,
    description: "Pure sandalwood powder for radiant skin. Experience the luxury of pure sandalwood for a naturally radiant complexion.",
    fullDescription: "Serene Sandalwood brings you the finest quality sandalwood powder, revered for centuries for its skin-enhancing properties. This premium formulation provides a cooling effect, soothes irritated skin, and imparts a natural, healthy glow. The aromatic sandalwood not only benefits your skin but also provides a calming, meditative experience during your skincare routine.",
    benefits: "Cooling effect, skin soothing, natural fragrance, anti-inflammatory",
    ingredients: "Rice Flour, Chickpea Flour, Green Gram Flour, Fenugreek Seeds Flour, Turmeric, Mudda Karappam (Camphor), Triphala, Manjishta, Sandalwood, Jivvadhu",
    skinType: "Dry, sensitive, mature skin",
    effects: "Soothes irritation, tones skin, and reduces blemishes; imparts a pleasant natural aroma and improves skin clarity.",
    keyBenefits: "Soothing irritation, hydrating, reducing blemishes and redness", 
    sizes: [ 
      { size: "200g", weight: "0.30 kg", price: 400, stock: 40 }, 
      { size: "400g", weight: "0.55 kg", price: 800, stock: 20 },
      { size: "800g", weight: "0.80 kg", price: 1600, stock: 30 }
    ], 
    rating: 4.9, 
    reviews: 203,
    images: [
      "/images/Serene Sandalwood/Serene Sandalwood 1.jpg",
      "/images/Serene Sandalwood/Serene Sandalwood 2.jpg",
      "/images/Serene Sandalwood/Serene Sandalwood 3.jpg",
      "/images/Serene Sandalwood/Serene Sandalwood 4.jpg",
      "/images/Serene Sandalwood/Serene Sandalwood 5.jpg",
      "/images/Serene Sandalwood/Serene Sandalwood 6.jpg"
    ]
  },
  { 
    id: 5, 
    name: "Neem Nourish", 
    category: "skin-care",
    priority: 0,
    description: "Neem-based skin care powder. Harness the antibacterial power of neem for clear, healthy skin.",
    fullDescription: "Neem Nourish is formulated with pure neem powder, known for its powerful antibacterial and antifungal properties. This natural remedy is perfect for acne-prone skin, helping to purify, heal, and prevent breakouts. The blend of traditional herbs works synergistically to detoxify the skin, reduce inflammation, and promote a clear, blemish-free complexion.",
    benefits: "Antibacterial, acne treatment, skin purification, reduces inflammation",
    ingredients: "Rice Flour, Chickpea Flour, Green Gram Flour, Fenugreek Seeds Flour, Turmeric, Mudda Karappam (Camphor), Triphala, Manjishta, Neem, Jivvadhu",
    skinType: "Oily, acne-prone, or blemished skin",
    effects: "Effectively fights acne and skin infections; soothes inflammation and reduces blemishes for clearer skin.",
    keyBenefits: "Acne control, reducing inflammation, purifying pores", 
    sizes: [ 
      { size: "200g", weight: "0.28 kg", price: 400, stock: 55 }, 
      { size: "400g", weight: "0.52 kg", price: 800, stock: 30 },
      { size: "800g", weight: "0.80 kg", price: 1600, stock: 30 }
    ], 
    rating: 4.5, 
    reviews: 98,
    images: [
      "/images/Neem Nourish/Neem Nourish 1.jpg",
      "/images/Neem Nourish/Neem Nourish 2.jpg",
      "/images/Neem Nourish/Neem Nourish 3.jpg",
      "/images/Neem Nourish/Neem Nourish 4.jpg",
      "/images/Neem Nourish/Neem Nourish 5.jpg",
      "/images/Neem Nourish/Neem Nourish 6.jpg"
    ]
  },
  { 
    id: 6, 
    name: "Vibrant Vetiver", 
    category: "skin-care",
    priority: 0,
    description: "Vetiver root powder for skin wellness. Cool and refresh your skin with the natural goodness of vetiver.",
    fullDescription: "Vibrant Vetiver is a unique formulation featuring the cooling and aromatic properties of vetiver root. Known for its ability to calm and refresh the skin, this powder is ideal for hot climates and stressed skin. The natural fragrance provides aromatherapy benefits while the powder works to improve skin texture and tone.",
    benefits: "Skin cooling, natural fragrance, stress relief, improves skin texture",
    ingredients: "Rice Flour, Chickpea Flour, Green Gram Flour, Fenugreek Seeds Flour, Turmeric, Mudda Karappam (Camphor), Triphala, Manjishta, Vetiver, Jivvadhu",
    skinType: "Combination to oily skin, overheated or inflamed skin",
    effects: "Deeply cleanses, cools, and calms skin; improves skin texture and supports natural radiance.",
    keyBenefits: "Cooling, deep cleansing, balancing pH", 
    sizes: [ 
      { size: "200g", weight: "0.20 kg", price: 400, stock: 35 }, 
      { size: "400g", weight: "0.40 kg", price: 800, stock: 25 },
      { size: "800g", weight: "0.80 kg", price: 1600, stock: 30 }
    ], 
    rating: 4.7, 
    reviews: 67,
    images: [
      "/images/Vibrant Vetiver/Vibrant Vetiver 1.jpg",
      "/images/Vibrant Vetiver/Vibrant Vetiver 2.jpg",
      "/images/Vibrant Vetiver/Vibrant Vetiver 3.jpg",
      "/images/Vibrant Vetiver/Vibrant Vetiver 4.jpg",
      "/images/Vibrant Vetiver/Vibrant Vetiver 5.jpg",
      "/images/Vibrant Vetiver/Vibrant Vetiver 6.jpg"
    ]
  },
  { 
    id: 7, 
    name: "Anti Hairfall", 
    category: "hair-care",
    priority: 0,
    description: "Natural hair fall control powder. Strengthen your hair from the roots and reduce hair fall naturally.",
    fullDescription: "Anti Hairfall powder is a powerful blend of Ayurvedic herbs specifically formulated to combat hair fall and promote hair growth. Rich in proteins and vitamins, this natural treatment strengthens hair roots, improves scalp health, and stimulates new hair growth. Regular use results in thicker, stronger, and healthier hair.",
    benefits: "Strengthens roots, reduces hair fall, promotes growth, adds volume",
    ingredients: "Curry Leaves, Henna, Vetiver, Kalanj Seeds, Greengram, Hibiscus Flowers, Reta, Shikakai, Brahmi, Bhringraj, and Triphala",
    hairType: "Thinning hair, weak roots, hair prone to breakage",
    effects: "Nourishes scalp, reduces hair fall, and promotes thicker, healthier growth.",
    keyBenefits: "Strengthening roots, promoting thicker hair growth", 
    sizes: [ 
      { size: "200g", weight: "0.20 kg", price: 400, stock: 70 }, 
      { size: "400g", weight: "0.40 kg", price: 800, stock: 60 }, 
      { size: "800g", weight: "0.80 kg", price: 1600, stock: 40 }
    ], 
    rating: 4.9, 
    reviews: 203,
    images: [
      "/images/Mane Magic/Anti-Hairfall.png",
      "/images/Mane Magic/Anti-Hairfall.png",
      "/productimgs/Mane Magic/Anti-Hairfall.png"
    ]
  },
  { 
    id: 8, 
    name: "Anti Oily", 
    category: "hair-care",
    priority: 0,
    description: "Natural solution for oily hair. Control excess oil and enjoy fresh, voluminous hair.",
    fullDescription: "Anti Oily hair powder is specially formulated to tackle excessive oil production in the scalp. This natural blend absorbs excess sebum, adds volume to flat hair, and maintains scalp health. The gentle yet effective formula cleanses without stripping natural oils, leaving your hair feeling fresh and bouncy all day long.",
    benefits: "Controls oil production, adds volume, scalp health, maintains freshness",
    ingredients: "Multani Mitti, Henna, Greengram, Curry Leaves, Hibiscus Flowers, Rita, Shikakai, Brahmi, Bhringraj, and Triphala",
    hairType: "Oily scalp, limp hair, buildup of excess oil",
    effects: "Cleanses scalp, removes excess oil, and maintains smooth, balanced hair with natural herbal ingredients.",
    keyBenefits: "Oil removal, refreshing scalp, maintaining smoothness", 
    sizes: [ 
      { size: "200g", weight: "0.26 kg", price: 400, stock: 65 }, 
      { size: "400g", weight: "0.50 kg", price: 800, stock: 35 },
      { size: "800g", weight: "0.80 kg", price: 1600, stock: 30 }
    ], 
    rating: 4.6, 
    reviews: 145,
    images: [
      "/images/Mane Magic/Anti-Hairfall.png",
      "/images/Mane Magic/Anti-Hairfall.png",
      "/productimgs/Mane Magic/Anti-Hairfall.png"
    ]
  },
  { 
    id: 9, 
    name: "Anti Dandruff", 
    category: "hair-care",
    priority: 0,
    description: "Natural dandruff treatment powder. Say goodbye to flakes and itching with this powerful herbal blend.",
    fullDescription: "Anti Dandruff powder is a therapeutic blend of herbs known for their antifungal and soothing properties. This natural treatment effectively fights dandruff, soothes scalp irritation, and prevents flakes from recurring. Regular use promotes a healthy, clean scalp and beautiful, dandruff-free hair.",
    benefits: "Fights dandruff, soothes scalp, prevents flakes, antimicrobial action",
    ingredients: "Fenugreek Seeds, Henna, Curry Leaves, Flax Seeds, Greengram, Hibiscus Flowers, Rita, Shikakai, Brahmi, Bhringraj, and Triphala",
    hairType: "Scalp with dandruff, irritation, flakiness",
    effects: "Strengthens hair follicles, reduces dandruff, and soothes scalp; prevents hair fall and itching.",
    keyBenefits: "Cleansing, soothing, reducing itchiness and dandruff", 
    sizes: [ 
      { size: "200g", weight: "0.20 kg", price: 400, stock: 60 }, 
      { size: "400g", weight: "0.40 kg", price: 800, stock: 30 },
      { size: "800g", weight: "0.80 kg", price: 1600, stock: 30 }
    ], 
    rating: 4.8, 
    reviews: 178,
    images: [
      "/images/Mane Magic/Anti-Hairfall.png",
      "/images/Mane Magic/Anti-Hairfall.png",
      "/productimgs/Mane Magic/Anti-Hairfall.png"
    ]
  },
  { 
    id: 10, 
    name: "Smitha Manjan", 
    category: "oral-care",
    priority: 0,
    description: "Traditional tooth powder for oral hygiene. Achieve naturally white teeth and healthy gums with this time-tested formula.",
    fullDescription: "Smitha Manjan is a traditional tooth powder that combines ancient wisdom with natural ingredients for complete oral care. This unique formulation helps whiten teeth naturally, strengthens gums, prevents cavities, and ensures long-lasting fresh breath. Free from harsh chemicals, it's a gentle yet effective alternative to modern toothpaste.",
    benefits: "Natural whitening, gum health, fresh breath, cavity prevention",
    ingredients: "Cinnamon Powder, Clove Powder, Mango Leaves Powder, Guava Leaves Powder, Neem Leaves Powder, Citrus Peels Powder, and Rock Salt",
    effects: "Smitha Manjan is a revitalizing Ayurvedic tooth powder that naturally strengthens teeth and gums while preventing common oral health issues such as cavities and inflammation. Enriched with target anti-tartar ingredients, it offers long-lasting fresh breath and antibacterial protection. The inclusion of neem, guava, and mango leaf powders work synergistically to combat bad breath while also soothing gum irritation. This rock salt and herbal powder combination helps in balancing oral pH, effectively polishes teeth and maintains overall dental hygiene. This chemical-free, herbal formulation is safe for daily use.",
    keyBenefits: "Natural teeth whitening, gum health, fresh breath, cavity prevention", 
    sizes: [ 
      { size: "50g", weight: "0.05 kg", price: 400, stock: 80 }, 
      { size: "100g", weight: "0.10 kg", price: 800, stock: 50 },
      { size: "200g", weight: "0.20 kg", price: 1600, stock: 30 }
    ], 
    rating: 4.6, 
    reviews: 124,
    images: [
      "/images/Smitha Manjan/Smitha Manjan.png",
      "/images/Smitha Manjan/2644661624.jpg",
      "/images/Smitha Manjan/2350167f-5e25-4a13-8aa4-d25fae44e723.png"
    ]
  },
  { 
    id: 11, 
    name: "Radiant Rose", 
    category: "skin-care",
    priority: 0,
    description: "Rose petal powder for radiant skin. Indulge in the luxury of roses for naturally radiant and youthful skin.",
    fullDescription: "Radiant Rose is a luxurious blend featuring pure rose petals combined with traditional herbs for ultimate skin radiance. Roses have been celebrated for centuries for their skin-beautifying properties. This powder helps tone the skin, reduce pigmentation, and impart a natural rosy glow while providing deep hydration and nourishment.",
    benefits: "Skin radiance, anti-aging, hydration, natural glow",
    ingredients: "Rice Flour, Chickpea Flour, Green Gram Flour, Fenugreek Seeds Flour, Turmeric, Mudda Karappam (Camphor), Triphala, Manjishta, Rose Powder, Jivvadhu",
    skinType: "Normal to dry, sensitive, or mature skin",
    effects: "Tones and tightens skin, soothes inflammation, and provides antioxidant protection for youthful radiance.",
    keyBenefits: "Toning, calming, antioxidant protection, boosting radiance", 
    sizes: [ 
      { size: "200g", weight: "0.20 kg", price: 400, stock: 45 }, 
      { size: "400g", weight: "0.40 kg", price: 800, stock: 25 },
      { size: "800g", weight: "0.80 kg", price: 1600, stock: 30 }
    ], 
    rating: 4.8, 
    reviews: 142,
    images: [
      "/images/Radiant Rose/Radiant Rose.png",
      "/images/Radiant Rose/Radiant Rose.png",
      "/images/Radiant Rose/Radiant Rose.png"
    ]
  },
  {
    id: 12,
    name: "Diwali Delight Hamper",
    category: "gift-hamper",
    type: "bundle", // Special type for bundle products
    priority: 100, // HIGH PRIORITY - Will appear first in listings
    description: "Celebrate Diwali with our customizable gift hamper! Choose your favorite products and get 2 beautiful colorful diyas included.",
    fullDescription: "Make this Diwali extra special with our Diwali Delight Hamper. Customize your perfect gift by selecting your favorite herbal powders from our premium collection. Each hamper comes with 2 handcrafted colorful diyas to light up your celebrations. Perfect for gifting to loved ones or treating yourself to a complete wellness package.",
    benefits: "Customizable selection, festive gift packaging, includes decorative diyas, perfect for gifting",
    ingredients: "Varies based on selected products",
    keyBenefits: "Customizable, festive packaging, gift-ready, includes diyas",
    
    // Bundle-specific configuration
    bundleConfig: {
      minSelections: 5, // Minimum products to select
      maxSelections: 10, // Maximum products to select (admin can change this)
      includedItems: [
        {
          name: "Colorful Diyas Set",
          description: "2 handcrafted decorative diyas",
          quantity: 1,
          image: "/images/diya-set.jpg" // You'll need to add this image
        }
      ],
      // Products available for selection (IDs from productsData)
      selectableProducts: [1, 2, 3, 4, 5, 6, 11], // Skin care products
      // Each selected product will be 50g in the hamper context
      defaultSize: "50g"
    },
    
    // Base price for the hamper (before adding products)
    basePrice: 500, // Includes packaging and diyas
    
    sizes: [
      { 
        size: "Standard Hamper", 
        weight: "Variable", 
        price: 500, // Will be calculated based on selections
        stock: 50 
      }
    ],
    
    rating: 4.9,
    reviews: 45,
    images: [
      "/images/diwali-hamper.jpg", // You'll need to add hamper images
      "/images/diwali-hamper-2.jpg",
      "/images/diwali-hamper-3.jpg"
    ]
  }
]

