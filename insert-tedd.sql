INSERT INTO news ("newId", "portalName", "newTitle", "newDate", image, description, content, category, flag, "sourceUrl")
VALUES (
  'tedd-corte-2026',
  'La Crónica Nacional',
  'Tedd irá a la corte',
  NOW(),
  '/imagenTedd.jpg',
  'El caso de Tedd llega a los tribunales en un proceso que ha captado la atención nacional. Los detalles del caso siguen siendo objeto de análisis por parte de expertos legales.',
  '<p>El caso de Tedd llega a los tribunales en un proceso que ha captado la atención nacional. Los detalles del caso siguen siendo objeto de análisis por parte de expertos legales.</p><p>Esta noticia se mantendrá destacada en la sección de actualidad para seguimiento del proceso judicial.</p>',
  'actualidad',
  true,
  NULL
);

-- Verificar que se insertó correctamente
SELECT "newId", "newTitle", "portalName", category, flag, image
FROM news
WHERE "newId" = 'tedd-corte-2026';
