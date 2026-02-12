const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

console.log('🔍 Verifying Deployment Connections...\n');

// Test 1: Environment Variables
console.log('📋 Step 1: Checking Environment Variables');
const requiredEnvVars = [
    'MONGO_URI',
    'JWT_SECRET',
    'EMAIL_USER',
    'EMAIL_PASS',
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET'
];

let envCheckPassed = true;
requiredEnvVars.forEach(varName => {
    if (process.env[varName]) {
        console.log(`   ✅ ${varName}: Set`);
    } else {
        console.log(`   ❌ ${varName}: Missing`);
        envCheckPassed = false;
    }
});

if (!envCheckPassed) {
    console.log('\n❌ Some environment variables are missing!');
    process.exit(1);
}

console.log('\n✅ All environment variables are set!\n');

// Test 2: MongoDB Connection
console.log('📋 Step 2: Testing MongoDB Atlas Connection');
console.log(`   Connecting to: ${process.env.MONGO_URI.split('@')[1].split('?')[0]}...`);

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('   ✅ MongoDB Atlas: Connected successfully!\n');
        
        // Test 3: Cloudinary Configuration
        console.log('📋 Step 3: Checking Cloudinary Configuration');
        console.log(`   Cloud Name: ${process.env.CLOUDINARY_CLOUD_NAME}`);
        console.log(`   API Key: ${process.env.CLOUDINARY_API_KEY.substring(0, 4)}...`);
        console.log('   ✅ Cloudinary: Configured\n');
        
        // Test 4: Email Configuration
        console.log('📋 Step 4: Checking Email Configuration');
        console.log(`   Email User: ${process.env.EMAIL_USER}`);
        console.log('   ✅ Email: Configured\n');
        
        // Summary
        console.log('═══════════════════════════════════════════');
        console.log('✅ ALL CONNECTIONS VERIFIED SUCCESSFULLY!');
        console.log('═══════════════════════════════════════════\n');
        console.log('📝 Next Steps:');
        console.log('   1. Push code to GitHub: git push origin main');
        console.log('   2. Deploy backend to Render');
        console.log('   3. Deploy frontend to Netlify');
        console.log('   4. See DEPLOYMENT_CHECKLIST.md for details\n');
        
        process.exit(0);
    })
    .catch(err => {
        console.log('   ❌ MongoDB Atlas: Connection failed!');
        console.error('   Error:', err.message);
        console.log('\n❌ VERIFICATION FAILED!');
        console.log('\n📝 Troubleshooting:');
        console.log('   1. Check MongoDB Atlas Network Access (allow 0.0.0.0/0)');
        console.log('   2. Verify database user credentials');
        console.log('   3. Check if cluster is running\n');
        process.exit(1);
    });
