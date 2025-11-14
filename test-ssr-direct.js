// Direct test of SSR functionality
import('file://' + process.cwd() + '/build/server.js').then(async module => {
  const app = module.default;

  console.log('=== TESTING SSR OUTPUT ===\n');

  // Create a mock request for the deal page
  const mockRequest = {
    method: 'GET',
    url: 'http://localhost:3000/deal/mumzworld-discount-code-up-to-45-egypt',
    headers: {}
  };

  try {
    // Call the SSR handler
    const response = await app.fetch(mockRequest);
    const html = await response.text();

    console.log('SSR Response Status:', response.status);
    console.log('Content-Type:', response.headers.get('content-type'));

    // Check for SEO elements
    const hasTitle = html.includes('<title>');
    const hasDescription = html.includes('name="description"');
    const hasOgTitle = html.includes('og:title');
    const hasStructuredData = html.includes('application/ld+json');

    console.log('\n=== SEO ELEMENTS CHECK ===');
    console.log('✅ Has title tag:', hasTitle);
    console.log('✅ Has meta description:', hasDescription);
    console.log('✅ Has Open Graph title:', hasOgTitle);
    console.log('✅ Has structured data:', hasStructuredData);

    // Extract title
    const titleMatch = html.match(/<title>(.*?)<\/title>/);
    if (titleMatch) {
      console.log('\n🎯 PAGE TITLE:', titleMatch[1]);
    }

    // Extract description
    const descMatch = html.match(/name="description" content="(.*?)"/);
    if (descMatch) {
      console.log('📝 META DESCRIPTION:', descMatch[1]);
    }

    if (hasTitle && hasDescription) {
      console.log('\n✅ SUCCESS: SSR is working with proper SEO!');
    } else {
      console.log('\n❌ ISSUE: SSR missing SEO elements');
      console.log('\nFirst 500 chars of HTML:');
      console.log(html.substring(0, 500));
    }

  } catch (error) {
    console.error('❌ Error testing SSR:', error);
  }
}).catch(err => {
  console.error('❌ Error loading SSR server:', err);
});