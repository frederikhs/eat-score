DROP VIEW eat_score.view_item_rating;
DROP VIEW eat_score.view_venue_with_rating;

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

CREATE VIEW eat_score.view_venue_with_rating AS
SELECT v.venue_id,
       v.venue_name,
       v.venue_created_at,
       v.venue_created_by_account_id,
       a.account_name                          as venue_created_by_account_name,
       v.venue_deleted_at,
       COALESCE(ROUND(AVG(vr.avg_item_rating_value), 1), 0) as avg_venue_rating_value
FROM eat_score.venue v
         LEFT JOIN eat_score.view_item_with_rating vr ON v.venue_id = vr.venue_id
         JOIN eat_score.account a ON a.account_id = v.venue_created_by_account_id
GROUP BY 1, 2, 3, 4, 5, 6;
