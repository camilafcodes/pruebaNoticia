**Contexto Proyecto Portal Noticias**

Estoy trabajando en un Proyecto de portal de noticias. El proyecto consta de 3 etapas, levantamiento de requerimientos, modelo relacional en Postgres SQL, desarrollo Frontend en Next.js, desarrollo Backend en node.js, y despliegue en Vercel. Adicional se contempla generar los artefactos necesarios para realizar el despliegue de manera manual en un hosting hostgator dedicado.

**Alcance**

El portal de noticias mostrará a los usuarios las noticias más relevantes en materia de política, deportes, economía, finanzas y actualidad(relevante). Y otros datos como clima, tasa de cambio y resultados deportivos.

**Base de datos**

Se utilizará una base de datos relacional en Postgres SQL para la persistencia de la información, la cual se configura de la siguiente manera:

CREATE TABLE IF NOT EXISTS news (

    \"newId\" TEXT NOT NULL,

    \"portalName\" VARCHAR(100) NOT NULL,

    \"newTitle\" TEXT NOT NULL,

    \"newDate\" TIMESTAMPTZ NOT NULL,

    \"image\" TEXT,

    \"description\" TEXT,

    \"content\" TEXT NOT NULL,

    \"category\" VARCHAR(100) NOT NULL,

    \"flag\" BOOLEAN NOT NULL DEFAULT FALSE,

    CONSTRAINT pk_news PRIMARY KEY (\"newId\")

);

El modelo de base de datos **news-portal-database-model.sql** se encuentra anexo al contexto.

**Frontend**

El FrontEnd de la aplicación será desarrollado en Next.js y tendrás las siguientes características:

1.  Encabezado: este componente tendrá un Logo, un Slogan, día y fecha actualizada. *(para diseño responsive los elementos del encabezado en caso de celulares y ipads, serán mostrados de manera descendente en el siguiente orden logo, slogan. Campo fecha iría en la esquina derecha del encabezado sin entorpecer el aspecto visual del encabezado)*

2.  Menú: menú horizontal con 5 categorías, son las siguientes:

- Actualidad

- Política

- Economía

- Deportes

- Finanzas

> *Para el diseño responsive el del menú para celulares y tablets configurar un menú hamburguesa.*

3.  Cuerpo: este estará dividido en dos secciones, la primera sección izquierda de la pagina contendrá aprox el 70% de ancho del cuerpo, esta sección que llamaremos "padre" contendrán las noticias por cada categoría, cada noticia se mostrará en una grilla, mostrando fuente de la noticia, imagen, nombre de la noticia y una pequeña descripción. Esta grilla debe tener una configuración de paginación 10 noticias por pagina. Adicional a esto, cuando el usuario de Click a una noticia en particular, se debe mostrar este contenido renderizado sobre la misma sección llamada "padre". Debajo de esta información mostrar una grilla indicando las 4 noticias mas actuales (fecha descendente) de la categoría Actualidad. Ahora bien la sección "hija" contendrá aprox el 30% de ancho del cuerpo. Esta sección mostrará información relacionada al clima de las principales ciudades del país Colombia como lo son Bogotá, Cali, Medellin, Bucaramanga y Cartagena. Tendrá información relacionada al cambio de divisas, bolsa, costo petróleo y resultados del futbol europeo y colombiano. *(esto depende del diseño responsive, esta característica solamente se vera reflejada en computadores de escritorio. Para celulares y Ipads el ancho ocupará el 100% del ancho de la pantalla y el componente "hijo" que corresponde a la vista de noticias sobre el clima, resultados deportes y cambio trm ocupara el 100% del ancho de la pantalla. Para este ultimo caso, el componente padre, hijo se mostrarán de manera descendente*)

4.  Pie de pagina: Esta sección contendrá logo y redirección a redes sociales como lo son Facebook, Linkedin, Twitter, Copyright 2026 y nombre página web.

*Aplicar diseño responsive celulares y tablet para el pie de página.*

El Frontend, debe estar construido haciendo uso de las mejores prácticas de desarrollo. Adicional cada componente mencionado anteriormente (encabezado, menú, cuerpo y pie de página) debe ser responsive y se debe adecuar a pantallas portátiles, móviles y Ipads. Importante usar Tailwind CSS para los estilos.

**Backend**

El Backend será el responsable de usar RSS para conectarse diariamente mediante un CronJob y consultar las noticias actualizadas sobre actualidad, política, economía, deportes y finanzas de los siguientes portales:

- <https://www.infobae.com/arc/outboundfeeds/rss/category/colombia/>

- [qhubocali.com/feed/](https://www.qhubocali.com/feed/)

- <https://www.valoraanalitik.com/feed/>

- <https://www.futbolred.com/rss>

- <https://feeds.elpais.com/mrss-s/list/ep/site/elpais.com/tag/finanzas_a>

Anexo se encuenta la estructura de los feed por cada uno de los portales mencionados anteriormente, y adicional la estructura json esperada por cada portal. Ademas dichos campos encontrados en el json serán los implementados en la base de datos relacional como columnas.

El proceso de consulta de noticias será el siguiente:

1.  El cronJob se ejecuta todos los días a las 6 am, 12 pm y 6 pm, hora colombiana.

2.  Para cada una de las categorías se consultará los siguientes feed:

| Politica   | <https://www.infobae.com/arc/outboundfeeds/rss/category/colombia/>       |
|------------|--------------------------------------------------------------------------|
| Actualidad | [qhubocali.com/feed/](https://www.qhubocali.com/feed/)                   |
| Economia   | <https://www.valoraanalitik.com/feed/>                                   |
| Deportes   | <https://www.futbolred.com/rss>                                          |
| Finanzas   | <https://feeds.elpais.com/mrss-s/list/ep/site/elpais.com/tag/finanzas_a> |

3.  Cuando se extrae el feed correspondiente por cada categoría, extraer los ítems del xml resultante, y consultar la etiqueta \<link\> por cada item, por ejemplo si al consultar el link, el valor es <https://elpais.com/economia/2026-02-06/el-banco-sabadell-cierra-las-cuentas-de-2025-con-1775-millones-de-beneficio-la-opa-salvada-y-buscando-ganar-mas-clientes-en-espana.html> construir un regexPattern, para tomar solamente lo siguiente "el-banco-sabadell-cierra-las-cuentas-de-2025-con-1775-millones-de-beneficio-la-opa-salvada-y-buscando-ganar-mas-clientes-en-espana", este valor resultante será nuestra llavePrincipal newId en el guardado de base de datos. Antes de construir el objeto new que será almacenado en base de datos, siguiendo el modelo relacional anexo ***news-portal-database-model.sql***. Consultar si ese newId existe o no en la base de datos, si el item no es existente, se procede a construir el objeto con las propiedades newId, portalName, newTitle, newDate, image, description, content, category y flag. Las propiedades adicionales a newId se deben extraer por cada item consultado al feed que corresponde a cada categoría, excepto category y flag, category será seteado de acuerdo el feed ejecutado y el flag será seteado por la base de datos con un valor false por defecto. A continuación, se relaciona una tabla con los archivos json generados apartir del xml del feed consultado por cada categoría:

| Categoria  | Url feed                                                                 | Contenido xml feed          | Transformación json esperada |
|------------|--------------------------------------------------------------------------|-----------------------------|------------------------------|
| Politica   | <https://www.infobae.com/arc/outboundfeeds/rss/category/colombia/>       | Infobae-feed-rs-structure   | Infobae-json-structure       |
| Actualidad | [qhubocali.com/feed/](https://www.qhubocali.com/feed/)                   | qhubocali-feed-rs-structure | qhubocali-json-structure     |
| Economia   | <https://www.valoraanalitik.com/feed/>                                   | qhubocali-feed-rs-structure | qhubocali-json-structure     |
| Deportes   | <https://www.futbolred.com/rss>                                          | futbolred-feed-rs-structure | futbolred-json-structure     |
| Finanzas   | <https://feeds.elpais.com/mrss-s/list/ep/site/elpais.com/tag/finanzas_a> | elpais-feed-rs-structure    | elpais-json-structure        |

4.  Despues de construir el objeto **new** por cada categoría se realiza el almacenamiento en la base de datos **news_portal** tabla **news.**

Después de la ejecución del Job que se hará a las 6:00 am, 12:00 pm y 06:00 pm, se ejecuta un proceso donde tomará todas las noticias almacenadas en base de datos donde la columna flag sea igual a true y la columna category sea igual a Actualidad, para estas noticias se actualizará el campo newDate con la fecha actual.

Para este punto, se debe realizar un manejo de errores puesto que al consumir el feed, el proceso de tranformación, consulta, guardado o actualización puede llegar a fallar. Si por ejemplo el proceso de consulta del feed RSS para un portal de noticias llegase a fallar, no interrumpir la ejecución del flujo sino tomar otro feed RSS de otro portal de noticias. Se debe construir una variable de entorno con la lista de los feeds para cada portal de noticias.

Luego de que se ejecute el proceso de persistencia de la información y actualización. Se procede a implementar la API Rest que permitan consultar las noticias en orden descendente por fecha método getAll de acuerdo a cada categoría (actualidad, politica, economía, deportes y finanzas) donde se configura paginación 10 noticias por página. Las URLs a exponer son las siguientes:

- api/v1/actualidad

- api/v1/politica

- api/v1/economía

- api/v1/deportes

- api/v1/finanzas

Adiciona a esto se expondrá una API, que devolverá las 4 noticias más actuales de la categoría Actualidad cumpliendo los siguiente criterios:

- noticias con newDate más actual y flag en true y category Actualidad (Prioridad 1)

- noticias con newDate más actual y category Actualidad (prioridad 2)

Api expuesta:

- api/v1/actualidad/4

El componente Backend, debe estar construido implementando las mejores prácticas y aplicando principios de diseño y SOLID.

**Flujo completo**

Cuando el usuario navegue hacia el dominio expuesto de la aplicación, la categoría que se carga por defecto será "Actualidad". Ahora bien, una vez seleccione alguna de las 5 categorias (actualidad, politica, economía, deportes y finanzas), el Front debe ejecutar una petición HTTP hacia el Backend indicándole la categoría de noticias a cargar, por ejemplo si el usuario navega y da click en la pestaña politica, se le enviará al Backend la siguiente petición: http://localhost:8080 api/v1/politica, el servicio Backend recibe la petición y deberá consultar y traer de la base de datos tabla "news" todas las noticias asociadas por fecha de manera descendente a esa categoría usando paginación (10 registros por pagina). Cada noticia entregada al front por parte del Backend tendrán los siguientes campos newId, portalName, newTitle, newDate, image, description, content, category y flag. Ahora bien el front renderizará una grilla de 10 componentes en una pagina, donde cada componente mostrará solamente los siguientes campos portalName, newTitle, newDate, image, description. Una vez el usuario de click a una noticia, se renderizará el componente llamado "padre" que ocupa el 70% del ancho de la pantalla *(esto depende del diseño responsive, esta característica solamente se vera reflejada en computadores de escritorio. Para celulares y Ipads el ancho ocupará el 100% del ancho de la pantalla y el componente "hijo" que corresponde a la vista de noticias sobre el clima, resultados deportes y cambio trm ocupara el 100% del ancho de la pantalla. Para este ultimo caso, el componente padre e hijo se mostrarán de manera descendente*) y tomará los valores dados en el campo content, dentro de este campo vendrá una estructura HTML de tipo String a renderizar dentro del componente llamado "padre".

**Detalle del flujo de visualización**

1.  Llamada Inicial (Grid View):

    - El frontend pide al backend: \"Dame la página 1 de noticias de la categoría \'Finanzas\'\".

    - El backend responde con un array de 10, 20 o N objetos de noticias. **Crucialmente, cada uno de estos objetos ya contiene el campo content con todo el HTML del artículo**.

    - El frontend renderiza una grilla. Para cada noticia en la grilla, usa campos como image, newTitle, y description (que son más cortos). El campo content está en memoria, pero no se renderiza visualmente en la grilla.

2.  Click del Usuario (Detail View):

    - El usuario hace clic en una noticia específica de la grilla.

    - En lugar de hacer una nueva llamada a la API como GET /api/news/{newId}, el frontend simplemente busca en el array de noticias que ya tiene en su estado la noticia que corresponde al newId del elemento clickeado.

    - Una vez que encuentra el objeto de la noticia, navega a la página de detalle y utiliza el campo content (que ya tenía desde el principio) para renderizar la vista completa del artículo usando dangerouslySetInnerHTML.

    - En este punto debajo del objeto de la noticia, se cargará una grilla indicando las 4 noticias más actuales (fecha descendente) de la categoría Actualidad, para este último paso se consumirá el api expuesta api/v1/actualidad/4.

**Configuración manual para anexo de noticias personalizadas.**

Para el servicio Backend, es necesario en la carpeta raíz del proyecto crear una carpeta llamada **customNews**, en esta carpeta se creará una carpeta **news** y otra **imágenes**, en la carpeta **news** se almacenará de manera manual una lista de noticias en formato Json. se anexa json de ejemplo custom-json-structure.json. En la carpeta imágenes, se añadirá las imágenes correspondientes a cada noticia personalizada. **Nota**: se debe actualizar la ruta de las imágenes a cargar por cada noticia personalizada en el archivo custom-json-structure.json.

Una vez se realice la carga de noticias personalizadas e imágenes en el directorio raíz del proyecto, se debe crear en el Backend una interfaz similar a la de Command Line Runner de SpringBoot, para que inmedietamente se realice la ejecución de la aplicación, lea el archivo custom-json-structure.json, mapee la información con los datos parametrizados en la tabla news (newId, portalName, newTitle, newDate, image, description, content, category y flag), actualice el campo newDate con la fecha actual y se almacene en la base de datos.

**Otros recursos:**

**Nombre Portal de noticias:** La Crónica Nacional.

**Nombre Slogan:** "Hechos que el poder no puede ocultar".

**Nombre dominio:** lacronicanacional.com

CN Noticias

![](media/image3.jpeg){width="6.5in" height="2.553472222222222in"}![](media/image4.jpeg){width="6.5in" height="3.658333333333333in"}
