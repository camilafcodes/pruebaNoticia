-- public.news definition

-- Drop table

-- DROP TABLE public.news;

CREATE TABLE public.news (
	"newId" text NOT NULL,
	"portalName" varchar(100) NOT NULL,
	"newTitle" text NOT NULL,
	"newDate" timestamptz NOT NULL,
	image text NULL,
	description text NULL,
	"content" text NOT NULL,
	category varchar(100) NOT NULL,
	flag bool DEFAULT false NOT NULL,
	"sourceUrl" text NULL,
	CONSTRAINT pk_news PRIMARY KEY ("newId")
);
CREATE INDEX idx_news_category ON public.news USING btree (category);
CREATE INDEX idx_news_category_date ON public.news USING btree (category, "newDate" DESC);
CREATE INDEX idx_news_flag ON public.news USING btree (flag);

INSERT INTO public.news
("newId", "portalName", "newTitle", "newDate", image, description, "content", category, flag, "sourceUrl")
VALUES('caperucita-intoxicada-galletas-abuela-2026', 'La Crónica Nacional', 'Caperucita intoxicada por las galletas de la abuela', '2026-03-07 10:34:22.761 -0500', '/caperucita.jpg', 'Una joven conocida como Caperucita fue atendida por personal médico tras presentar síntomas de intoxicación luego de comer unas galletas preparadas por su abuela. El incidente ocurrió durante una visita al bosque que terminó generando preocupación entre los habitantes de la zona.', '<p>Lo que parecía una tranquila visita familiar terminó en una inesperada emergencia cuando Caperucita comenzó a sentirse mal poco después de probar unas galletas caseras preparadas por su abuela.</p>
<p>Según vecinos del lugar, la joven había llevado una canasta con alimentos para compartir durante la tarde. Minutos después de comer las galletas, empezó a presentar mareo y malestar estomacal, por lo que fue trasladada rápidamente a un centro de atención cercano.</p>
<p>Las autoridades locales investigan si los ingredientes utilizados en la preparación de las galletas pudieron haberse contaminado accidentalmente. Mientras tanto, Caperucita se encuentra fuera de peligro y recuperándose favorablemente.</p>', 'actualidad', true, '');