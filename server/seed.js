const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');
const Coupon = require('./models/Coupon');

dotenv.config();

const seedData = async (skipConnect = false) => {
  try {
    if (!skipConnect) {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('Connected to MongoDB for seeding...');
    }

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    await Coupon.deleteMany({});
    console.log('Cleared existing data.');

    // Create users
    const salt = await bcrypt.genSalt(12);
    const adminPassword = await bcrypt.hash('Admin@12345', salt);
    const userPassword = await bcrypt.hash('User@12345', salt);

    const admin = await User.create({
      fullName: 'Store Admin',
      email: 'admin@thecuratedstore.com',
      password: adminPassword,
      phone: '9876543210',
      role: 'admin',
      address: { street: '42 MG Road', city: 'Bengaluru', state: 'Karnataka', pincode: '560001', country: 'India' }
    });

    await User.create({
      fullName: 'Priya Sharma',
      email: 'priya@example.com',
      password: userPassword,
      phone: '9876543211',
      role: 'user',
      creditPoints: 150,
      giftVoucherBalance: 500,
      address: { street: '15 Park Street', city: 'Kolkata', state: 'West Bengal', pincode: '700016', country: 'India' }
    });

    await User.create({
      fullName: 'Rahul Verma',
      email: 'rahul@example.com',
      password: userPassword,
      phone: '9876543212',
      role: 'user',
      creditPoints: 75,
      giftVoucherBalance: 200,
      address: { street: '8 Anna Salai', city: 'Chennai', state: 'Tamil Nadu', pincode: '600002', country: 'India' }
    });

    console.log('Users created successfully.');

    // Create products
    const products = [
      // ===== ELECTRONICS - Mobile Phones =====
      {
        name: 'Galaxy S24 Ultra Smartphone',
        description: 'Flagship smartphone with 6.8-inch Dynamic AMOLED 2X display, 200MP camera system, Snapdragon 8 Gen 3 processor, 12GB RAM, 256GB storage, and 5000mAh battery with 45W fast charging. Features built-in S Pen, IP68 water resistance, and advanced AI photo editing tools. Titanium frame with Gorilla Armor glass.',
        price: 79999,
        originalPrice: 134999,
        category: 'Electronics',
        brand: 'Samsung',
        images: [],
        stock: 35,
        ratings: 4.7,
        numReviews: 342,
        isFeatured: true,
        createdBy: admin._id
      },
      {
        name: 'iPhone 15 Pro Max 256GB',
        description: 'Apple A17 Pro chip with 6-core GPU. 6.7-inch Super Retina XDR display with ProMotion and Always-On. 48MP main camera with 5x optical zoom telephoto. Titanium design, USB-C with USB 3 speeds, and Action button. All-day battery life with up to 29 hours of video playback.',
        price: 149900,
        originalPrice: 159900,
        category: 'Electronics',
        brand: 'Apple',
        images: [],
        stock: 20,
        ratings: 4.8,
        numReviews: 567,
        isFeatured: true,
        createdBy: admin._id
      },
      {
        name: 'OnePlus 12 5G',
        description: 'Powered by Snapdragon 8 Gen 3. Features a 6.82-inch 2K 120Hz ProXDR display, Hasselblad camera system with 50MP main sensor, 100W SUPERVOOC charging, and 5400mAh battery. Runs OxygenOS 14 based on Android 14. Available in Flowy Emerald finish.',
        price: 64999,
        originalPrice: 69999,
        category: 'Electronics',
        brand: 'OnePlus',
        images: [],
        stock: 50,
        ratings: 4.5,
        numReviews: 289,
        isFeatured: true,
        createdBy: admin._id
      },
      {
        name: 'Redmi Note 13 Pro+ 5G',
        description: 'MediaTek Dimensity 7200 Ultra processor with 8GB RAM and 256GB storage. 6.67-inch curved AMOLED display with 120Hz refresh rate. 200MP OIS camera, 5000mAh battery with 120W HyperCharge. IP68 dust and water resistance. An exceptional value flagship.',
        price: 29999,
        originalPrice: 32999,
        category: 'Electronics',
        brand: 'Xiaomi',
        images: [],
        stock: 80,
        ratings: 4.3,
        numReviews: 456,
        isFeatured: false,
        createdBy: admin._id
      },

      // ===== ELECTRONICS - Laptops =====
      {
        name: 'MacBook Air M3 15-inch',
        description: 'Apple M3 chip with 8-core CPU and 10-core GPU. 15.3-inch Liquid Retina display with 500 nits brightness. 16GB unified memory, 512GB SSD storage. Up to 18 hours of battery life. MagSafe charging, two Thunderbolt ports. Weighs just 1.51 kg. Available in Midnight finish.',
        price: 149900,
        originalPrice: 159900,
        category: 'Electronics',
        brand: 'Apple',
        images: [],
        stock: 15,
        ratings: 4.9,
        numReviews: 198,
        isFeatured: true,
        createdBy: admin._id
      },
      {
        name: 'ASUS ROG Strix G16 Gaming Laptop',
        description: 'Intel Core i9-14900HX processor, NVIDIA RTX 4070 8GB GPU. 16-inch 240Hz QHD display with 100% DCI-P3. 16GB DDR5 RAM, 1TB PCIe SSD. Per-key RGB keyboard, Dolby Atmos sound. Advanced cooling with Tri-Fan technology. Built for serious gaming and creative work.',
        price: 164990,
        originalPrice: 179990,
        category: 'Electronics',
        brand: 'ASUS',
        images: [],
        stock: 10,
        ratings: 4.6,
        numReviews: 134,
        isFeatured: false,
        createdBy: admin._id
      },
      {
        name: 'Dell Inspiron 15 Laptop',
        description: '13th Gen Intel Core i5-1335U processor with 8GB DDR4 RAM and 512GB SSD. 15.6-inch FHD WVA anti-glare display. Intel UHD Graphics, Windows 11 Home. Backlit keyboard, fingerprint reader. Long-lasting battery with ExpressCharge. A reliable everyday laptop for students and professionals.',
        price: 54990,
        originalPrice: 67990,
        category: 'Electronics',
        brand: 'Dell',
        images: [],
        stock: 40,
        ratings: 4.2,
        numReviews: 267,
        isFeatured: false,
        createdBy: admin._id
      },

      // ===== ELECTRONICS - TVs =====
      {
        name: 'Sony Bravia 55-inch 4K OLED Smart TV',
        description: 'XR OLED Contrast Pro with Cognitive Processor XR delivers pure blacks and stunning colors. 55-inch 4K UHD (3840x2160) panel with 120Hz refresh rate. Google TV built-in with Chromecast, Apple AirPlay, and Alexa compatibility. Acoustic Surface Audio+ with Dolby Atmos. HDMI 2.1 ports for gaming.',
        price: 129990,
        originalPrice: 159990,
        category: 'Electronics',
        brand: 'Sony',
        images: [],
        stock: 8,
        ratings: 4.8,
        numReviews: 89,
        isFeatured: true,
        createdBy: admin._id
      },
      {
        name: 'Samsung 43-inch Crystal 4K UHD Smart TV',
        description: 'Crystal Processor 4K with 4K Upscaling. 43-inch UHD display with Dynamic Crystal Color. Tizen OS with built-in OTT apps, screen mirroring, and SmartThings hub. 20W speakers with Adaptive Sound. Slim AirSlim design blends into any room. HDR10+ support for vivid content.',
        price: 29990,
        originalPrice: 42990,
        category: 'Electronics',
        brand: 'Samsung',
        images: [],
        stock: 25,
        ratings: 4.4,
        numReviews: 312,
        isFeatured: false,
        createdBy: admin._id
      },

      // ===== ELECTRONICS - Chargers & Power Banks =====
      {
        name: '65W GaN USB-C Fast Charger',
        description: 'Ultra-compact GaN (Gallium Nitride) charger with 65W total output. Features 2 USB-C ports and 1 USB-A port for simultaneous charging of laptop, phone, and accessories. PD 3.0 and QC 4.0 compatible. Foldable plug design, weighs just 120g. Universal voltage support for international travel.',
        price: 1999,
        originalPrice: 3499,
        category: 'Electronics',
        brand: 'Anker',
        images: [],
        stock: 120,
        ratings: 4.6,
        numReviews: 534,
        isFeatured: false,
        createdBy: admin._id
      },
      {
        name: '20000mAh Power Bank with 22.5W Fast Charging',
        description: 'High-capacity 20000mAh lithium-polymer battery pack with 22.5W output. Charges most smartphones 4-5 times. Triple output (2x USB-A, 1x USB-C) with simultaneous charging. Digital LED display shows exact battery percentage. Airline-approved capacity. Includes USB-C cable.',
        price: 1499,
        originalPrice: 2499,
        category: 'Electronics',
        brand: 'Ambrane',
        images: [],
        stock: 100,
        ratings: 4.3,
        numReviews: 678,
        isFeatured: false,
        createdBy: admin._id
      },
      {
        name: '10000mAh Slim Power Bank - Magnetic',
        description: 'Ultra-slim magnetic wireless power bank compatible with MagSafe. 10000mAh capacity with 15W wireless charging and 20W wired USB-C output. Snaps magnetically to the back of your phone for cable-free charging on the go. Just 15mm thin, available in Midnight Black.',
        price: 2499,
        originalPrice: 3999,
        category: 'Electronics',
        brand: 'Belkin',
        images: [],
        stock: 60,
        ratings: 4.5,
        numReviews: 234,
        isFeatured: false,
        createdBy: admin._id
      },
      {
        name: 'Wireless Noise Cancelling Headphones',
        description: 'Premium over-ear headphones with active noise cancellation, 40-hour battery life, and studio-quality sound. Features memory foam ear cushions and a foldable design for easy portability. Compatible with all Bluetooth-enabled devices.',
        price: 4999,
        originalPrice: 7499,
        category: 'Electronics',
        brand: 'SoundCraft',
        images: [],
        stock: 45,
        ratings: 4.5,
        numReviews: 128,
        isFeatured: false,
        createdBy: admin._id
      },
      {
        name: 'Ultra-Slim Mechanical Keyboard',
        description: 'Low-profile mechanical keyboard with RGB backlighting and hot-swappable switches. Crafted with an aerospace-grade aluminum frame for durability. Features N-key rollover and programmable macro keys for professionals and gamers alike.',
        price: 3499,
        originalPrice: 4999,
        category: 'Electronics',
        brand: 'KeyForge',
        images: [],
        stock: 30,
        ratings: 4.3,
        numReviews: 89,
        isFeatured: false,
        createdBy: admin._id
      },

      // ===== FASHION =====
      {
        name: 'Organic Cotton Crew Neck T-Shirt',
        description: 'Made from 100% GOTS-certified organic cotton. Pre-washed for softness with reinforced stitching at stress points. Relaxed yet refined fit. Available in earthy tones that pair effortlessly with any wardrobe.',
        price: 899,
        originalPrice: 1299,
        category: 'Fashion',
        brand: 'ThreadBare',
        images: [],
        stock: 120,
        ratings: 4.6,
        numReviews: 234,
        isFeatured: true,
        createdBy: admin._id
      },
      {
        name: 'Italian Leather Crossbody Bag',
        description: 'Handcrafted from full-grain Italian leather with brass hardware. Features adjustable strap, interior zip pocket, and magnetic closure. Ages beautifully with use, developing a unique patina. Dimensions: 25cm x 18cm x 7cm.',
        price: 3299,
        originalPrice: 4500,
        category: 'Fashion',
        brand: 'Pelletteria',
        images: [],
        stock: 25,
        ratings: 4.8,
        numReviews: 67,
        isFeatured: false,
        createdBy: admin._id
      },
      {
        name: 'Classic Aviator Sunglasses - Polarized',
        description: 'Premium polarized aviator sunglasses with UV400 protection. Lightweight titanium frame with adjustable nose pads. Scratch-resistant CR-39 lenses reduce glare for comfortable all-day wear. Includes microfiber pouch and hardshell case.',
        price: 2499,
        originalPrice: 3999,
        category: 'Fashion',
        brand: 'OpticVault',
        images: [],
        stock: 70,
        ratings: 4.4,
        numReviews: 189,
        isFeatured: false,
        createdBy: admin._id
      },
      {
        name: 'Merino Wool Beanie Cap',
        description: '100% Australian Merino wool beanie. Naturally temperature-regulating, moisture-wicking, and odor-resistant. Double-layered knit for warmth without bulk. One-size-fits-most with gentle stretch. Hand-wash recommended.',
        price: 799,
        originalPrice: 1199,
        category: 'Fashion',
        brand: 'Alpine',
        images: [],
        stock: 90,
        ratings: 4.5,
        numReviews: 145,
        isFeatured: false,
        createdBy: admin._id
      },

      // ===== HOME & KITCHEN =====
      {
        name: 'Handcrafted Ceramic Coffee Mug Set',
        description: 'Set of 4 artisan ceramic mugs, each hand-thrown and glazed with a unique reactive finish. Microwave and dishwasher safe. Capacity: 350ml each. No two mugs are identical.',
        price: 1249,
        originalPrice: null,
        category: 'Home & Kitchen',
        brand: 'Clay & Kiln',
        images: [],
        stock: 60,
        ratings: 4.7,
        numReviews: 156,
        isFeatured: true,
        createdBy: admin._id
      },
      {
        name: 'Bamboo Kitchen Organizer Set',
        description: 'Sustainable bamboo storage set including a spice rack, utensil holder, and cutting board. Responsibly sourced Moso bamboo with food-safe mineral oil finish. Keeps your kitchen tidy while adding natural warmth.',
        price: 1899,
        originalPrice: 2499,
        category: 'Home & Kitchen',
        brand: 'GreenNest',
        images: [],
        stock: 40,
        ratings: 4.4,
        numReviews: 92,
        isFeatured: false,
        createdBy: admin._id
      },
      {
        name: 'Smart LED Desk Lamp with Wireless Charger',
        description: 'Minimalist desk lamp with 5 brightness levels and 3 color temperatures. Built-in 10W Qi wireless charging pad on the base. Touch-sensitive controls, auto-dimming mode, and USB-A charging port. 50,000-hour LED lifespan.',
        price: 2999,
        originalPrice: 4499,
        category: 'Home & Kitchen',
        brand: 'LumiDesk',
        images: [],
        stock: 35,
        ratings: 4.6,
        numReviews: 123,
        isFeatured: false,
        createdBy: admin._id
      },

      // ===== BOOKS =====
      {
        name: 'The Psychology of Money',
        description: 'By Morgan Housel. A masterful exploration of how people think about money and the behavioral patterns that shape financial decisions. Through 19 short stories, Housel reveals the strange ways people think about money.',
        price: 349,
        originalPrice: 399,
        category: 'Books',
        brand: 'Jaico Publishing',
        images: [],
        stock: 200,
        ratings: 4.9,
        numReviews: 412,
        isFeatured: true,
        createdBy: admin._id
      },
      {
        name: 'Atomic Habits',
        description: 'By James Clear. A proven framework for improving every day. Practical strategies to form good habits, break bad ones, and master the tiny behaviors that lead to remarkable results. Over 15 million copies sold worldwide.',
        price: 399,
        originalPrice: 599,
        category: 'Books',
        brand: 'Penguin Random House',
        images: [],
        stock: 180,
        ratings: 4.8,
        numReviews: 387,
        isFeatured: false,
        createdBy: admin._id
      },
      {
        name: 'Deep Work by Cal Newport',
        description: 'Rules for focused success in a distracted world. Newport makes the case that deep work is the most valuable skill in our increasingly competitive economy. Learn to cultivate an ability to focus without distraction on cognitively demanding tasks.',
        price: 299,
        originalPrice: 450,
        category: 'Books',
        brand: 'Hachette India',
        images: [],
        stock: 140,
        ratings: 4.6,
        numReviews: 201,
        isFeatured: false,
        createdBy: admin._id
      },

      // ===== SPORTS =====
      {
        name: 'Professional Yoga Mat - Extra Thick',
        description: 'Premium 8mm thick yoga mat with alignment guides and dual-texture surface. Eco-friendly TPE material, free from PVC, latex, and toxic chemicals. Includes carrying strap. Dimensions: 183cm x 68cm.',
        price: 1599,
        originalPrice: 2199,
        category: 'Sports',
        brand: 'FlowState',
        images: [],
        stock: 75,
        ratings: 4.5,
        numReviews: 143,
        isFeatured: false,
        createdBy: admin._id
      },
      {
        name: 'Adjustable Resistance Band Set',
        description: 'Complete set of 5 resistance bands with varying tension levels from 5kg to 30kg. Includes door anchor, ankle straps, and cushioned handles. Perfect for home workouts, physical therapy, and travel fitness.',
        price: 799,
        originalPrice: 1199,
        category: 'Sports',
        brand: 'IronFlex',
        images: [],
        stock: 90,
        ratings: 4.3,
        numReviews: 201,
        isFeatured: false,
        createdBy: admin._id
      },
      {
        name: 'Stainless Steel Water Bottle 1L - Insulated',
        description: 'Double-wall vacuum insulated stainless steel bottle. Keeps drinks cold for 24 hours and hot for 12 hours. BPA-free, leak-proof lid with one-hand operation. Powder-coated finish resists scratches. Capacity: 1 litre.',
        price: 699,
        originalPrice: 999,
        category: 'Sports',
        brand: 'HydroElite',
        images: [],
        stock: 110,
        ratings: 4.6,
        numReviews: 324,
        isFeatured: false,
        createdBy: admin._id
      },

      // ===== BEAUTY =====
      {
        name: 'Vitamin C Brightening Serum',
        description: 'Clinical-grade 20% Vitamin C serum with Hyaluronic Acid and Vitamin E. Targets dark spots, uneven skin tone, and fine lines. Dermatologist-tested, paraben-free formula. 30ml glass dropper bottle with UV-protective packaging.',
        price: 699,
        originalPrice: 999,
        category: 'Beauty',
        brand: 'Derma Luxe',
        images: [],
        stock: 150,
        ratings: 4.6,
        numReviews: 278,
        isFeatured: false,
        createdBy: admin._id
      },
      {
        name: 'Natural Rose Clay Face Mask',
        description: 'Gentle purifying mask with French rose clay, rosehip oil, and chamomile extract. Draws out impurities while maintaining moisture balance. Suitable for sensitive and dry skin. 100ml jar with bamboo spatula applicator.',
        price: 549,
        originalPrice: null,
        category: 'Beauty',
        brand: 'Botanica',
        images: [],
        stock: 85,
        ratings: 4.4,
        numReviews: 167,
        isFeatured: false,
        createdBy: admin._id
      },
      {
        name: 'Luxury Hair Oil - Cold Pressed Blend',
        description: 'Nourishing blend of cold-pressed Argan, Jojoba, and Bhringraj oils. Strengthens hair from root to tip, reduces frizz, and adds a natural shine. Free from mineral oil, silicones, and synthetic fragrances. 100ml amber glass bottle.',
        price: 449,
        originalPrice: 699,
        category: 'Beauty',
        brand: 'HerbRoots',
        images: [],
        stock: 95,
        ratings: 4.5,
        numReviews: 213,
        isFeatured: false,
        createdBy: admin._id
      }
    ];

    await Product.insertMany(products);
    console.log(`${products.length} products created successfully.`);

    // Create coupons
    const coupons = [
      {
        code: 'WELCOME20',
        description: 'Welcome offer - 20% off on your first order',
        discountType: 'percentage',
        discountValue: 20,
        minOrderAmount: 500,
        maxDiscount: 2000,
        usageLimit: 1000,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
        isActive: true
      },
      {
        code: 'FLAT500',
        description: 'Flat Rs. 500 off on orders above Rs. 3,000',
        discountType: 'fixed',
        discountValue: 500,
        minOrderAmount: 3000,
        maxDiscount: null,
        usageLimit: 500,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        isActive: true
      },
      {
        code: 'ELECTRONICS10',
        description: '10% off on all electronics products',
        discountType: 'percentage',
        discountValue: 10,
        minOrderAmount: 1000,
        maxDiscount: 5000,
        usageLimit: 300,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        isActive: true
      },
      {
        code: 'GIFT250',
        description: 'Gift voucher - Rs. 250 off on any order',
        discountType: 'fixed',
        discountValue: 250,
        minOrderAmount: 999,
        maxDiscount: null,
        usageLimit: 200,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000),
        isActive: true
      },
      {
        code: 'MEGA30',
        description: 'Mega Sale - 30% off up to Rs. 3,000',
        discountType: 'percentage',
        discountValue: 30,
        minOrderAmount: 2000,
        maxDiscount: 3000,
        usageLimit: 100,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        isActive: true
      }
    ];

    await Coupon.insertMany(coupons);
    console.log(`${coupons.length} coupons created successfully.`);

    console.log('\n--- Seed Complete ---');
    console.log('Admin Login:  admin@thecuratedstore.com / Admin@12345');
    console.log('User Login:   priya@example.com / User@12345');
    console.log('User Login:   rahul@example.com / User@12345');
    console.log('\nCoupon Codes: WELCOME20, FLAT500, ELECTRONICS10, GIFT250, MEGA30');

    if (!skipConnect) {
      process.exit(0);
    }
  } catch (error) {
    console.error('Seed error:', error);
    if (!skipConnect) {
      process.exit(1);
    }
    throw error;
  }
};

if (require.main === module) {
  seedData();
}

module.exports = seedData;
