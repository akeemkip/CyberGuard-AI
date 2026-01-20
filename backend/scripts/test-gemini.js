const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function testGemini() {
  console.log('Testing Gemini 1.5 Flash...\n');
  
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    console.log('Sending test message...\n');
    
    const result = await model.generateContent('What is phishing? Answer in one sentence.');
    const response = result.response.text();
    
    console.log('✅ Success! AI Response:');
    console.log(response);
    console.log('\n✅ Gemini 1.5 Flash is working!');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testGemini();
