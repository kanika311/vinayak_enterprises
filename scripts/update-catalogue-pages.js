const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const https = require('https');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/vinayak_enterprises';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dd29usied',
  api_key: process.env.CLOUDINARY_API_KEY || '225492446738982',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'w-YFp_T3PZ2L8T-oQ4-Q3rU4Yq8',
});

async function main() {
  await mongoose.connect(uri);
  const catCol = mongoose.connection.collection('catalogues');

  // Update both catalogues to pageCount 11
  await catCol.updateMany(
    { 'file.publicId': { $in: ['catalogues/iq25cm3chflbzlxhjgkt', 'catalogues/qejnih4gflgxn39p5n5s'] } },
    { $set: { pageCount: 11 } }
  );

  // Set latest one as active
  await catCol.updateMany({}, { $set: { isActive: false } });
  await catCol.updateOne(
    { 'file.publicId': 'catalogues/iq25cm3chflbzlxhjgkt' },
    { $set: { isActive: true, pageCount: 11 } }
  );

  const active = await catCol.findOne({ isActive: true });
  console.log('Active catalogue now:', {
    _id: active._id,
    title: active.title,
    publicId: active.file?.publicId,
    pageCount: active.pageCount,
    isActive: active.isActive
  });

  for (const pg of [1, 2, 6, 11]) {
    const testUrl = `https://res.cloudinary.com/dd29usied/image/upload/pg_${pg},f_auto,q_auto,w_1200/${active.file.publicId}.jpg`;
    await new Promise((resolve) => {
      https.get(testUrl, (res) => {
        console.log(`Page ${pg} (${testUrl}) status:`, res.statusCode);
        resolve();
      });
    });
  }

  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
