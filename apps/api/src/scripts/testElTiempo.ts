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
      ['media:content', 'mediaContent'],
      ['media:thumbnail', 'mediaThumbnail'],
      ['enclosure', 'enclosure'],
    ],
  },
});

async function testElTiempo() {
  const RSS_URL = 'https://www.eltiempo.com/rss/deportes.xml';
  
  console.log('Probando feed de El Tiempo...\n');
  
  try {
    const feed = await parser.parseURL(RSS_URL);
    console.log(`Total items: ${feed.items.length}\n`);
    
    const firstItem = feed.items[0];
    console.log('Primer item:');
    console.log('='.repeat(60));
    console.log('Título:', firstItem.title);
    console.log('Link:', firstItem.link);
    console.log('\nCampos disponibles:', Object.keys(firstItem));
    
    console.log('\n--- DESCRIPTION ---');
    console.log(firstItem.description?.substring(0, 500));
    
    console.log('\n--- CONTENT ENCODED ---');
    console.log(firstItem.contentEncoded?.substring(0, 500));
    
    console.log('\n--- ENCLOSURE ---');
    console.log(JSON.stringify(firstItem.enclosure, null, 2));
    
    console.log('\n--- MEDIA CONTENT ---');
    console.log(JSON.stringify(firstItem.mediaContent, null, 2));
    
    console.log('\n--- MEDIA THUMBNAIL ---');
    console.log(JSON.stringify(firstItem.mediaThumbnail, null, 2));
    
    // Buscar img en description
    const imgMatch = firstItem.description?.match(/<img[^>]+src=["']([^"']+)["']/);
    if (imgMatch) {
      console.log('\n✅ Imagen encontrada en description:');
      console.log(imgMatch[1]);
    } else {
      console.log('\n❌ No se encontró img tag en description');
    }
    
    // Buscar img en contentEncoded
    const imgMatch2 = firstItem.contentEncoded?.match(/<img[^>]+src=["']([^"']+)["']/);
    if (imgMatch2) {
      console.log('\n✅ Imagen encontrada en contentEncoded:');
      console.log(imgMatch2[1]);
    } else {
      console.log('\n❌ No se encontró img tag en contentEncoded');
    }
    
  } catch (error: any) {
    console.error('Error:', error.message);
  }
}

testElTiempo();
