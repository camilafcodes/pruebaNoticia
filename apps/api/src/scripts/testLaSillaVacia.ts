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

async function testLaSillaVacia() {
  const RSS_URL = 'https://www.lasillavacia.com/feed/';
  
  console.log(`\nTesting: ${RSS_URL}\n`);
  
  try {
    const feed = await parser.parseURL(RSS_URL);
    console.log(`✓ Feed fetched successfully`);
    console.log(`  Title: ${feed.title}`);
    console.log(`  Items found: ${feed.items.length}\n`);
    
    let itemsWithImages = 0;
    
    feed.items.slice(0, 3).forEach((item, index) => {
      console.log(`Item ${index + 1}:`);
      console.log(`  Title: ${item.title}`);
      console.log(`  Link: ${item.link}`);
      console.log(`  Date: ${item.pubDate}`);
      
      const hasEnclosure = item.enclosure && item.enclosure.url;
      if (hasEnclosure) {
        console.log(`  Image (enclosure): ${item.enclosure.url}`);
        itemsWithImages++;
      } else {
        const content = item.contentEncoded || item.content || item.description || '';
        const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/);
        if (imgMatch) {
          console.log(`  Image (content): ${imgMatch[1]}`);
          itemsWithImages++;
        } else {
          console.log(`  Image: NONE`);
        }
      }
      console.log('');
    });
    
    console.log(`Images found: ${itemsWithImages}/${Math.min(3, feed.items.length)}`);
    
  } catch (error: any) {
    console.error(`✗ Error: ${error.message}`);
  }
}

testLaSillaVacia();
