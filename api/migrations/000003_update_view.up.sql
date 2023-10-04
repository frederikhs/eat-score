DROP VIEW eat_score.view_venue_with_rating;
DROP VIEW eat_score.view_item_with_rating;

CREATE VIEW eat_score.view_item_with_rating AS
SELECT item_id,
       v.venue_id,
       v.venue_name,
       v.venue_deleted_at,
       item_name,
       item_price_dkk,
       item_created_by_account_id,
       a.account_name                      as item_created_by_account_name,
       item_created_at,
       item_deleted_at,
       ROUND(AVG(ir.item_rating_value), 1) as avg_item_rating_value,
       COUNT(ir.item_rating_value) as item_rating_count,
       MIN(ir.item_rating_value) as min_item_rating_value,
       MAX(ir.item_rating_value) as max_item_rating_value,
       ROUND(STDDEV(ir.item_rating_value), 1) AS standard_deviation_item_rating_value
FROM eat_score.item
         JOIN eat_score.venue v on item.item_venue_id = v.venue_id
         LEFT JOIN eat_score.item_rating ir on item.item_id = ir.item_rating_item_id
         JOIN eat_score.account a on item.item_created_by_account_id = a.account_id
GROUP BY 1, 2, 3, 4, 5, 6, 7, 8, 9, 10;

CREATE VIEW eat_score.view_venue_with_rating AS
SELECT v.venue_id,
       v.venue_name,
       v.venue_created_at,
       v.venue_created_by_account_id,
       a.account_name                          as venue_created_by_account_name,
       v.venue_deleted_at,
       ROUND(AVG(vr.avg_item_rating_value), 1) as avg_venue_rating_value
FROM eat_score.venue v
         LEFT JOIN eat_score.view_item_with_rating vr ON v.venue_id = vr.venue_id
         JOIN eat_score.account a ON a.account_id = v.venue_created_by_account_id
GROUP BY 1, 2, 3, 4, 5, 6;