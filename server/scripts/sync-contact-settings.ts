import dotenv from 'dotenv';
import { connectDatabase } from '../config/database';
import Setting from '../models/Setting';

dotenv.config({ path: '.env.local' });
dotenv.config();

const updates = [
  { key: 'companyName', value: 'Vinayak Enterprises', group: 'company' },
  { key: 'companyEmail', value: 'vinayakenterprises52@gmail.com', group: 'company' },
  { key: 'companyPhone', value: '94160-29492', group: 'company' },
  { key: 'companyPhoneSecondary', value: '62801-28618', group: 'company' },
  { key: 'companyAddress', value: 'Ambala Cantt, Ambala, Haryana 133001, India', group: 'company' },
  { key: 'gstin', value: '06AHLPA7723L1Z7', group: 'company' },
  { key: 'whatsappNumber', value: '9416029492', group: 'social' },
  { key: 'facebook', value: 'https://www.facebook.com/profile.php?id=61596718377937&sk=about', group: 'social' },
  { key: 'workingHours', value: 'Mon – Sat | 9:00 AM – 10:00 PM', group: 'company' },
];

async function main() {
  await connectDatabase();
  for (const item of updates) {
    await Setting.findOneAndUpdate({ key: item.key }, item, { upsert: true, new: true });
    console.log('Updated', item.key, '=', item.value);
  }
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
