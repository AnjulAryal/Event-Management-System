async function testEndpoints() {
  const urls = [
    'http://localhost:5000/',
    'http://localhost:5000/api/events',
    'http://localhost:5000/api/speakers',
    'http://localhost:5000/api/feedback',
    'http://localhost:5000/api/support'
  ];

  for (const url of urls) {
    try {
      const res = await fetch(url);
      console.log(`[SUCCESS] ${url} - Status: ${res.status}`);
    } catch (error) {
      console.log(`[ERROR] ${url} - ${error.message}`);
    }
  }
}
testEndpoints();
