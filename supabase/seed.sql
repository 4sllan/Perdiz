-- Seeds do ambiente local da Perdiz.
-- REGRA: somente dados fictícios de demonstração. Nunca inserir dados
-- reais, credenciais ou qualquer informação pessoal verdadeira.
-- Populado pelas tasks de catálogo (PDZ-013) em diante.

-- PDZ-013 seeds fictícios: categorias e mercados de demonstração.
insert into categories (slug, icon, sort_order) values
  ('politica', 'landmark', 1),
  ('economia', 'trending-up', 2),
  ('esportes', 'trophy', 3),
  ('tecnologia', 'cpu', 4)
on conflict (slug) do nothing;

insert into category_translations (category_id, locale, name, description)
select c.id, t.locale, t.name, t.descr from categories c
cross join (values
  ('politica','br','Política','Eleições e decisões públicas'),
  ('politica','us','Politics','Elections and public decisions'),
  ('politica','pt','Política','Eleições e decisões públicas'),
  ('politica','es','Política','Elecciones y decisiones públicas'),
  ('economia','br','Economia','Indicadores e política monetária'),
  ('economia','us','Economy','Indicators and monetary policy'),
  ('economia','pt','Economia','Indicadores e política monetária'),
  ('economia','es','Economía','Indicadores y política monetaria'),
  ('esportes','br','Esportes','Campeonatos e resultados'),
  ('esportes','us','Sports','Championships and results'),
  ('esportes','pt','Desporto','Campeonatos e resultados'),
  ('esportes','es','Deportes','Campeonatos y resultados'),
  ('tecnologia','br','Tecnologia','Lançamentos e tendências'),
  ('tecnologia','us','Technology','Launches and trends'),
  ('tecnologia','pt','Tecnologia','Lançamentos e tendências'),
  ('tecnologia','es','Tecnología','Lanzamientos y tendencias')
) as t(slug, locale, name, descr)
where c.slug = t.slug
on conflict do nothing;

insert into markets (slug, category_id, status, opens_at, closes_at)
select 'copa-2026-brasil-campeao', c.id, 'open', now() - interval '7 days', now() + interval '240 days' from categories c where c.slug = 'esportes'
union all select 'selic-ate-15-2026', c.id, 'open', now() - interval '3 days', now() + interval '90 days' from categories c where c.slug = 'economia'
union all select 'ia-regulamentada-ue-2026', c.id, 'review', now(), now() + interval '180 days' from categories c where c.slug = 'tecnologia'
on conflict (slug) do nothing;

insert into market_translations (market_id, locale, title, description, resolution_rules, resolution_source_url, publish_state)
select m.id, t.locale, t.title, t.descr, t.rules, t.src, 'published' from markets m
cross join (values
  ('copa-2026-brasil-campeao','br','Brasil vence a Copa do Mundo 2026?','Resolve SIM se a seleção brasileira masculina vencer a Copa 2026.','Fonte oficial: FIFA. Resultado após a final.','https://www.fifa.com'),
  ('copa-2026-brasil-campeao','us','Will Brazil win the 2026 World Cup?','Resolves YES if the Brazilian men''s team wins the 2026 World Cup.','Official source: FIFA. Result after the final.','https://www.fifa.com'),
  ('copa-2026-brasil-campeao','pt','O Brasil vence o Mundial 2026?','Resolve SIM se a seleção brasileira vencer o Mundial 2026.','Fonte oficial: FIFA. Resultado após a final.','https://www.fifa.com'),
  ('copa-2026-brasil-campeao','es','¿Brasil gana el Mundial 2026?','Resuelve SÍ si la selección brasileña gana el Mundial 2026.','Fuente oficial: FIFA. Resultado tras la final.','https://www.fifa.com'),
  ('selic-ate-15-2026','br','Selic acima de 15% ao fim de 2026?','Resolve SIM se a taxa Selic meta estiver acima de 15% a.a. na última decisão de 2026.','Fonte: comunicado do Copom/Banco Central.','https://www.bcb.gov.br'),
  ('selic-ate-15-2026','us','Selic above 15% at end of 2026?','Resolves YES if the Selic target rate is above 15% p.a. at the last 2026 decision.','Source: Copom/Central Bank statement.','https://www.bcb.gov.br'),
  ('ia-regulamentada-ue-2026','br','UE aprova nova regulação de IA em 2026?','Resolve SIM se a União Europeia aprovar nova lei setorial de IA até 31/12/2026.','Fonte: Diário Oficial da UE.','https://eur-lex.europa.eu')
) as t(slug, locale, title, descr, rules, src)
where m.slug = t.slug
on conflict do nothing;

insert into market_outcomes (market_id, outcome_key, sort_order)
select m.id, 'YES', 1 from markets m
union all select m.id, 'NO', 2 from markets m
on conflict do nothing;
