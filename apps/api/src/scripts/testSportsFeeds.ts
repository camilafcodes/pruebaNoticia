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
      ['enclosure', 'enclosure'],
    ],
  },
});

const sportsFeeds = [
  {
    name: 'El Tiempo - Deportes',
    url: 'https://www.eltiempo.com/rss/deportes.xml'
  },
  {
    name: 'El Espectador - Deportes',
    url: 'https://www.elespectador.com/rss/deportes/rss.xml'
  },
  {
    name: 'RCN Deportes',
    url: 'https://www.rcnradio.com/rss/deportes'
  },
  {
    name: 'Caracol Radio - Deportes',
    url: 'https://caracol.com.co/rss/deportes/'
  },
  {
    name: 'Publimetro Colombia - Deportes',
    url: 'https://www.publimetro.co/co/feeds/deportes.rss'
  },
  {
    name: 'Semana - Deportes',
    url: 'https://www.semana.com/rss/deportes.xml'
  },
  {
    name: 'Portafolio - Deportes',
    url: 'https://www.portafolio.co/rss/deportes'
  },
  {
    name: 'AS Colombia',
    url: 'https://colombia.as.com/rss/colombia2.xml'
  },
  {
    name: 'GOL Caracol',
    url: 'https://gol.caracoltv.com/feed'
  },
  {
    name: 'El Heraldo Deportes',
    url: 'https://www.elheraldo.co/rss/deportes'
  }
];

const extractImageFromItem = (item: any): string | null => {
  // Intentar diferentes fuentes de imagen
  if (item.enclosure?.url) return item.enclosure.url;
  if (item.mediaContent?.$ && item.mediaContent.$.url) return item.mediaContent.$.url;
  
  const content = item.contentEncoded || item.content || item.description || '';
  
  // Buscar img tag
  const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/);
  if (imgMatch) return imgMatch[1];
  
  return null;
};

async function testFeed(feed: { name: string; url: string }) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Probando: ${feed.name}`);
  console.log(`URL: ${feed.url}`);
  console.log('='.repeat(60));
  
  try {
    const result = await parser.parseURL(feed.url);
    console.log(`✅ Feed funciona - ${result.items.length} items encontrados`);
    
    if (result.items.length > 0) {
      const firstItem = result.items[0];
      console.log(`\nPrimer artículo:`);
      console.log(`  Título: ${firstItem.title?.substring(0, 60)}...`);
      console.log(`  Fecha: ${firstItem.pubDate || firstItem.isoDate || 'N/A'}`);
      
      const image = extractImageFromItem(firstItem);
      if (image) {
        console.log(`  ✅ Imagen encontrada: ${image.substring(0, 80)}...`);
      } else {
        console.log(`  ❌ No se encontró imagen`);
      }
      
      // Verificar 3 primeros items para imagen
      let itemsWithImages = 0;
      for (let i = 0; i < Math.min(5, result.items.length); i++) {
        if (extractImageFromItem(result.items[i])) {
          itemsWithImages++;
        }
      }
      console.log(`  Imágenes en primeros 5: ${itemsWithImages}/5`);
    }
    
  } catch (error: any) {
    console.log(`❌ Error: ${error.message}`);
  }
}

async function testAllFeeds() {
  console.log('Iniciando prueba de feeds RSS de deportes...\n');
  
  for (const feed of sportsFeeds) {
    await testFeed(feed);
    // Pequeña pausa entre requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('Prueba completada');
  console.log('='.repeat(60));
}

testAllFeeds().catch(console.error);
