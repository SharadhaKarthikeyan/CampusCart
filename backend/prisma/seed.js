"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Starting seed process...');
    // Clean the database
    await prisma.listing.deleteMany({});
    await prisma.user.deleteMany({});
    // Create demo users
    const salt = await bcryptjs_1.default.genSalt(10);
    const passwordHash = await bcryptjs_1.default.hash('password123', salt);
    const alice = await prisma.user.create({
        data: {
            name: 'Alice Vance',
            email: 'alice@campus.edu',
            passwordHash,
        },
    });
    const bob = await prisma.user.create({
        data: {
            name: 'Bob Smith',
            email: 'bob@campus.edu',
            passwordHash,
        },
    });
    console.log('Demo users created:', { alice: alice.email, bob: bob.email });
    // Sample listings data
    const listings = [
        {
            sellerId: alice.id,
            title: 'iPhone 12 - 128GB Blue',
            description: 'Selling my old iPhone 12 since I recently upgraded. The phone is in like new condition with no scratches. Always kept in a case with a screen protector. Battery health is at 88%. Unlocked for all carriers.',
            price: 350.0,
            category: 'Electronics',
            condition: 'Like New',
            location: 'Main Library / Student Union',
            imageUrl: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=500&auto=format&fit=crop&q=60',
            status: 'Available',
        },
        {
            sellerId: alice.id,
            title: 'Wooden Study Desk',
            description: 'Solid wooden desk, perfect for dorms and student rooms. It has 3 drawers that slide smoothly. Small scratch on the left side, but otherwise in good shape. Dimensions: 48in W x 24in D x 30in H.',
            price: 45.0,
            category: 'Furniture',
            condition: 'Good',
            location: 'Dorm Quad Area',
            imageUrl: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=500&auto=format&fit=crop&q=60',
            status: 'Available',
        },
        {
            sellerId: alice.id,
            title: 'Introduction to Algorithms (CLRS)',
            description: 'Required textbook for CS 311 (Algorithms). 3rd Edition. Very light highlighting in chapters 2 and 4, but no written notes or ripped pages. Binding is solid. Pick up on campus.',
            price: 50.0,
            category: 'Books',
            condition: 'Good',
            location: 'Computer Science Building',
            imageUrl: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500&auto=format&fit=crop&q=60',
            status: 'Available',
        },
        {
            sellerId: alice.id,
            title: 'University Red Varsity Hoodie',
            description: 'Official university red varsity hoodie, size Medium. Extremely soft interior, worn only once or twice. Selling because it is a bit tight on me. Fits true to size.',
            price: 20.0,
            category: 'Clothing',
            condition: 'Like New',
            location: 'Student Activity Center',
            imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&auto=format&fit=crop&q=60',
            status: 'Available',
        },
        {
            sellerId: alice.id,
            title: 'Aroma Rice Cooker',
            description: 'Simple 6-cup rice cooker. Comes with the steaming basket and measuring cup. Works perfectly and makes great rice. Selling because I am graduating and moving out of state.',
            price: 15.0,
            category: 'Kitchen',
            condition: 'Fair',
            location: 'North Campus Dorms',
            imageUrl: 'https://images.unsplash.com/photo-1544233726-9f1d2b27be8b?w=500&auto=format&fit=crop&q=60',
            status: 'Sold',
        },
        {
            sellerId: bob.id,
            title: 'Noise Cancelling Headphones',
            description: 'Sony WH-1000XM4 active noise cancelling headphones in black. Outstanding sound quality and battery life. Has minor cosmetic wear on the headband but earcups are clean. Includes carrying case and charging cord.',
            price: 80.0,
            category: 'Electronics',
            condition: 'Like New',
            location: 'Student Union Lounge',
            imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60',
            status: 'Available',
        },
        {
            sellerId: bob.id,
            title: 'Ergonomic Office Chair',
            description: 'Black mesh back office chair with adjustable height and armrests. Very comfortable for long study sessions. Selling because I am moving back home. Note: must pick up from my apartment.',
            price: 30.0,
            category: 'Furniture',
            condition: 'Fair',
            location: 'University Apartments (Off-Campus)',
            imageUrl: 'https://images.unsplash.com/photo-1505797149-43b0069ec26b?w=500&auto=format&fit=crop&q=60',
            status: 'Sold',
        },
        {
            sellerId: bob.id,
            title: 'Organic Chemistry Study Guide',
            description: 'Organic Chemistry: Structure and Function. 8th Edition study guide and solutions manual. Brand new, shrink-wrapped. Never opened because I dropped the class.',
            price: 65.0,
            category: 'Books',
            condition: 'New',
            location: 'Chemistry Lab Lobby',
            imageUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=500&auto=format&fit=crop&q=60',
            status: 'Available',
        },
        {
            sellerId: bob.id,
            title: 'Instant Pot Air Fryer 4-Quart',
            description: 'Vortex 4-in-1 air fryer. Used only about 5 times to make fries. Very clean, works great, heats up super fast. Selling because my new apartment has a built-in air fryer.',
            price: 40.0,
            category: 'Kitchen',
            condition: 'Like New',
            location: 'South Campus Quad',
            imageUrl: 'https://images.unsplash.com/photo-1621972750749-0fbb1abb7736?w=500&auto=format&fit=crop&q=60',
            status: 'Available',
        },
        {
            sellerId: bob.id,
            title: 'Schwinn Mountain Bike',
            description: '18-speed Schwinn mountain bike. Frame size Medium. Brakes are responsive and gears shift cleanly. Tires have plenty of tread left. Perfect commute companion for getting across campus quickly. Lock included.',
            price: 120.0,
            category: 'Other',
            condition: 'Good',
            location: 'Recreation Center Bike Racks',
            imageUrl: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=500&auto=format&fit=crop&q=60',
            status: 'Available',
        },
    ];
    for (const item of listings) {
        await prisma.listing.create({
            data: item,
        });
    }
    console.log('Seeded database with 10 sample listings.');
    console.log('Seed completed successfully!');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
