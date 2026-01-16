const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function testQuotaReset() {
  console.log('Testing Gemini 2.5 Flash - Quota Reset Check\n');

  if (!process.env.GEMINI_API_KEY) {
    console.error('❌ GEMINI_API_KEY not found');
    return;
  }

  console.log('✓ API key found');

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    console.log('✓ Sending test request to gemini-2.5-flash...\n');

    const result = await model.generateContent('What is phishing in one sentence?');
    const response = result.response.text();

    console.log('✅ SUCCESS! Quota has reset!\n');
    console.log('AI Response:', response);
    console.log('\n🎉 Ready to implement full AI integration!');
    
  } catch (error) {
    console.error('❌ FAILED:', error.message);
    
    if (error.message.includes('429') || error.message.includes('quota')) {
      console.error('\n⚠️  Quota still exceeded.');
    } else if (error.message.includes('404')) {
      console.error('\n⚠️  Model not found. Trying gemini-2.0-flash as backup...');
    }
  }
}

testQuotaReset();
