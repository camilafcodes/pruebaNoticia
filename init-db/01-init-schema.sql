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
	CONSTRAINT pk_news PRIMARY KEY ("newId")
);
CREATE INDEX idx_news_category ON public.news USING btree (category);
CREATE INDEX idx_news_category_date ON public.news USING btree (category, "newDate" DESC);
CREATE INDEX idx_news_flag ON public.news USING btree (flag);