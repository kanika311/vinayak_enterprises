"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = require("../config/database");
const Admin_1 = __importDefault(require("../models/Admin"));
const Category_1 = __importDefault(require("../models/Category"));
const Setting_1 = __importDefault(require("../models/Setting"));
const constants_1 = require("../constants");
dotenv_1.default.config({ path: '.env.local' });
dotenv_1.default.config();
const seed = async () => {
    await (0, database_1.connectDatabase)();
    const existingAdmin = await Admin_1.default.findOne({ email: 'admin@scientificinstruments.com' });
    if (!existingAdmin) {
        await Admin_1.default.create({
            name: 'Super Admin',
            email: 'admin@scientificinstruments.com',
            password: 'Admin@123',
            role: constants_1.ROLES.SUPER_ADMIN,
            permissions: constants_1.ROLE_PERMISSIONS[constants_1.ROLES.SUPER_ADMIN],
        });
        console.log('Super admin created: admin@scientificinstruments.com / Admin@123');
    }
    const categoryCount = await Category_1.default.countDocuments();
    if (categoryCount === 0) {
        const categories = [
            { name: 'Microscopes', slug: 'microscopes', description: 'Optical and digital microscopes' },
            { name: 'Digital Microscopes', slug: 'digital-microscopes', description: 'USB and HDMI digital microscopes' },
            { name: 'Human Anatomy Models', slug: 'human-anatomy-models', description: 'Detailed anatomical models' },
            { name: 'Human Skeleton Models', slug: 'human-skeleton-models', description: 'Life-size and desktop skeleton models' },
            { name: 'Human Dummies', slug: 'human-dummies', description: 'Training dummies and manikins' },
            { name: 'CPR Training Manikins', slug: 'cpr-training-manikins', description: 'CPR and first aid training manikins' },
            { name: 'Laboratory Equipment', slug: 'laboratory-equipment', description: 'Lab instruments and apparatus' },
            { name: 'Educational Scientific Instruments', slug: 'educational-scientific-instruments', description: 'Educational science kits and instruments' },
        ];
        await Category_1.default.insertMany(categories);
        console.log('Categories seeded');
    }
    const settingsCount = await Setting_1.default.countDocuments();
    if (settingsCount === 0) {
        await Setting_1.default.insertMany([
            { key: 'companyName', value: 'Scientific Instruments Co.', group: 'company' },
            { key: 'companyEmail', value: 'info@scientificinstruments.com', group: 'company' },
            { key: 'companyPhone', value: '+1-800-555-0199', group: 'company' },
            { key: 'companyAddress', value: '123 Science Park, Innovation City', group: 'company' },
            { key: 'whatsappNumber', value: '+1234567890', group: 'social' },
            { key: 'facebook', value: 'https://facebook.com/scientificinstruments', group: 'social' },
            { key: 'linkedin', value: 'https://linkedin.com/company/scientificinstruments', group: 'social' },
            { key: 'googleAnalyticsId', value: '', group: 'analytics' },
            { key: 'googleSearchConsole', value: '', group: 'analytics' },
        ]);
        console.log('Settings seeded');
    }
    console.log('Seed completed');
    process.exit(0);
};
seed().catch((err) => {
    console.error(err);
    process.exit(1);
});
