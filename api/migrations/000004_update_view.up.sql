DROP VIEW eat_score.view_item_rating;

CREATE VIEW eat_score.view_item_rating AS
SELECT ir.item_rating_id,
       i.item_id,
       i.item_name,
       v.venue_id,
       v.venue_name,
       v.venue_deleted_at,
       ir.item_rating_value,
       ir.item_rating_account_id,
       ir.item_rating_created_at,
       a.account_name as item_rating_account_name
FROM eat_score.item_rating ir
         JOIN eat_score.account a on ir.item_rating_account_id = a.account_id
         JOIN eat_score.item i on i.item_id = ir.item_rating_item_id
         JOIN eat_score.venue v on i.item_venue_id = v.venue_id;
