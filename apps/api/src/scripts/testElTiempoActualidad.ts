import Parser from 'rss-parser';

const parser = new Parser({
  timeout: 10000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'application/rss+xml, application/xml, text/xml, */*'
  },
  customFields: {
    item: [
      ['content:encoded', 'contentEncoded'],
      ['description', 'description'],
      ['enclosure', 'enclosure'],
    ],
  },
});

async function testElTiempoActualidad() {
  const urls = [
    'https://www.eltiempo.com/rss/ultimas-noticias.xml',
    'https://www.eltiempo.com/rss/actualidad.xml',
    'https://www.eltiempo.com/rss/colombia.xml',
    'https://www.eltiempo.com/rss/nacion.xml',
    'https://www.eltiempo.com/rss/'
  ];
  
  for (const RSS_URL of urls) {
    console.log(`\nTesting: ${RSS_URL}`);
    
    try {
      const feed = await parser.parseURL(RSS_URL);
      console.log(`✓ Feed fetched successfully`);
      console.log(`  Title: ${feed.title}`);
      console.log(`  Items found: ${feed.items.length}`);
      
      if (feed.items.length > 0) {
        const item = feed.items[0];
        console.log(`\n  First item:`);
        console.log(`    Title: ${item.title}`);
        console.log(`    Link: ${item.link}`);
        
        const hasEnclosure = item.enclosure && item.enclosure.url;
        if (hasEnclosure) {
          console.log(`    Image: ${item.enclosure.url}`);
        }
      }
      console.log('');
      
    } catch (error: any) {
      console.error(`✗ Error: ${error.message}`);
    }
  }
}

testElTiempoActualidad();
