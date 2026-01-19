const http = require('http');

function testLogin(email, password, label) {
  const postData = JSON.stringify({ email, password });

  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        console.log(`\n${'='.repeat(80)}`);
        console.log(`TEST: ${label}`);
        console.log('='.repeat(80));
        console.log(`Email: ${email}`);
        console.log(`Status Code: ${res.statusCode}`);

        try {
          const parsed = JSON.parse(data);
          if (res.statusCode === 200) {
            console.log('✅ LOGIN SUCCESSFUL');
            console.log(`User: ${parsed.user.firstName} ${parsed.user.lastName}`);
            console.log(`Role: ${parsed.user.role}`);
            console.log(`Token: ${parsed.token.substring(0, 20)}...`);
          } else {
            console.log('❌ LOGIN FAILED');
            console.log(`Error: ${parsed.error}`);
          }
        } catch (e) {
          console.log('Response:', data);
        }

        resolve();
      });
    });

    req.on('error', (e) => {
      console.error(`Problem with request: ${e.message}`);
      reject(e);
    });

    req.write(postData);
    req.end();
  });
}

async function runTests() {
  console.log('\n🔐 TESTING LOGIN API');
  console.log('='.repeat(80));

  // Test demo accounts
  await testLogin('rajesh.singh@gmail.com', 'student123', 'Demo Account - Rajesh Singh');
  await testLogin('priya.persaud@yahoo.com', 'student123', 'Demo Account - Priya Persaud');
  await testLogin('admin@cyberguard.com', 'admin123', 'Demo Account - Admin');

  // Test invalid credentials
  await testLogin('test@test.com', 'wrongpassword', 'Invalid Credentials Test');

  console.log('\n' + '='.repeat(80));
  console.log('TESTS COMPLETE');
  console.log('='.repeat(80));
  console.log('\nIf demo accounts work but manually typed ones don\'t:');
  console.log('1. Check if there are extra spaces in the email/password fields');
  console.log('2. Check browser console for JavaScript errors');
  console.log('3. Check Network tab in DevTools for the actual API request');
  console.log('4. Verify localStorage is not blocked in browser');
}

runTests();
