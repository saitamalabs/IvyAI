// Quick AIML API Test Script
const apiKey = '5ce0e6ce951a4b89bdc2fb9a39ad3532';

async function testAIMLAPI() {
  console.log('🧪 Testing AIML API...\n');

  // Test 1: Claude 3.5 Sonnet
  console.log('1️⃣ Testing Claude 3.5 Sonnet...');
  try {
    const response1 = await fetch('https://api.aimlapi.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-latest',
        messages: [{ role: 'user', content: 'Say "Claude works!" in one sentence.' }],
        max_tokens: 50,
      }),
    });

    if (!response1.ok) {
      const errorText = await response1.text();
      console.log(`❌ Claude Failed: ${response1.status} - ${errorText}\n`);
    } else {
      const data1 = await response1.json();
      console.log(`✅ Claude Response: ${data1.choices[0].message.content}\n`);
    }
  } catch (error) {
    console.log(`❌ Claude Error: ${error.message}\n`);
  }

  // Test 2: Gemini 2.0 Flash
  console.log('2️⃣ Testing Gemini 2.0 Flash...');
  try {
    const response2 = await fetch('https://api.aimlapi.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gemini-2.0-flash-exp',
        messages: [{ role: 'user', content: 'Say "Gemini works!" in one sentence.' }],
        max_tokens: 50,
      }),
    });

    if (!response2.ok) {
      const errorText = await response2.text();
      console.log(`❌ Gemini Failed: ${response2.status} - ${errorText}\n`);
    } else {
      const data2 = await response2.json();
      console.log(`✅ Gemini Response: ${data2.choices[0].message.content}\n`);
    }
  } catch (error) {
    console.log(`❌ Gemini Error: ${error.message}\n`);
  }

  // Test 3: GPT-4o
  console.log('3️⃣ Testing GPT-4o...');
  try {
    const response3 = await fetch('https://api.aimlapi.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: 'Say "GPT-4o works!" in one sentence.' }],
        max_tokens: 50,
      }),
    });

    if (!response3.ok) {
      const errorText = await response3.text();
      console.log(`❌ GPT-4o Failed: ${response3.status} - ${errorText}\n`);
    } else {
      const data3 = await response3.json();
      console.log(`✅ GPT-4o Response: ${data3.choices[0].message.content}\n`);
    }
  } catch (error) {
    console.log(`❌ GPT-4o Error: ${error.message}\n`);
  }

  console.log('✅ API Test Complete!');
}

testAIMLAPI();
