create or replace view "public"."trader_assigned_originals" as  SELECT image.id
   FROM ((((image_configuration
     JOIN image ON ((image_configuration.image_id = image.id)))
     JOIN category ON ((image.category_id = category.id)))
     JOIN portfolio ON ((image_configuration.portfolio_id = portfolio.id)))
     JOIN auth.users ON ((portfolio.owner_id = users.id)))
  WHERE (((users.role)::text = 'authenticated'::text) AND (category.name = 'Original'::text) AND (image_configuration.by_trader = true));
