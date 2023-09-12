CREATE SCHEMA eat_score;

CREATE TABLE eat_score.account
(
    account_id         SERIAL PRIMARY KEY,
    account_email      VARCHAR UNIQUE NOT NULL,
    account_name       VARCHAR        NOT NULL,
    account_created_at TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    account_deleted_at TIMESTAMPTZ
);

CREATE TABLE eat_score.magic_login_link
(
    magic_login_link_id         SERIAL PRIMARY KEY,
    magic_login_link_account_id INT REFERENCES eat_score.account (account_id) NOT NULL,
    magic_login_link_hash       VARCHAR                                       NOT NULL,
    magic_login_link_created_at TIMESTAMPTZ                                   NOT NULL DEFAULT NOW(),
    magic_login_link_used_at    TIMESTAMPTZ
);

CREATE TABLE eat_score.session
(
    session_id          VARCHAR PRIMARY KEY,
    session_account_id  INT REFERENCES eat_score.account (account_id)                   NOT NULL,
    magic_login_link_id INT REFERENCES eat_score.magic_login_link (magic_login_link_id) NOT NULL,
    UNIQUE (session_account_id, magic_login_link_id)
);

CREATE TABLE eat_score.venue
(
    venue_id                    SERIAL PRIMARY KEY,
    venue_name                  VARCHAR                                       NOT NULL,
    venue_created_at            TIMESTAMPTZ                                   NOT NULL DEFAULT NOW(),
    venue_created_by_account_id INT REFERENCES eat_score.account (account_id) NOT NULL
);

CREATE TABLE eat_score.item
(
    item_id                    SERIAL PRIMARY KEY,
    item_venue_id              INT REFERENCES eat_score.venue (venue_id)     NOT NULL,
    item_name                  VARCHAR                                       NOT NULL,
    item_price_dkk             INT                                           NOT NULL,
    item_created_at            TIMESTAMPTZ                                   NOT NULL DEFAULT NOW(),
    item_created_by_account_id INT REFERENCES eat_score.account (account_id) NOT NULL
);

CREATE TABLE eat_score.item_rating
(
    item_rating_id         SERIAL PRIMARY KEY,
    item_rating_item_id    INT REFERENCES eat_score.item (item_id)       NOT NULL,
    item_rating_account_id INT REFERENCES eat_score.account (account_id) NOT NULL,
    item_rating_value      INT                                           NOT NULL,
    item_rating_created_at TIMESTAMPTZ                                   NOT NULL DEFAULT NOW(),
    UNIQUE (item_rating_item_id, item_rating_account_id)
);

CREATE VIEW eat_score.view_item_rating AS
SELECT ir.item_rating_id,
       i.item_id,
       i.item_name,
       v.venue_id,
       v.venue_name,
       ir.item_rating_value,
       ir.item_rating_account_id,
       a.account_name as item_rating_account_name
FROM eat_score.item_rating ir
         JOIN eat_score.account a on ir.item_rating_account_id = a.account_id
         JOIN eat_score.item i on i.item_id = ir.item_rating_item_id
         JOIN eat_score.venue v on i.item_venue_id = v.venue_id;

CREATE VIEW eat_score.view_item_with_rating AS
SELECT item_id,
       v.venue_id,
       v.venue_name,
       item_name,
       item_price_dkk,
       item_created_by_account_id,
       a.account_name                      as item_created_by_account_name,
       ROUND(AVG(ir.item_rating_value), 1) as avg_item_rating_value
FROM eat_score.item
         JOIN eat_score.venue v on item.item_venue_id = v.venue_id
         LEFT JOIN eat_score.item_rating ir on item.item_id = ir.item_rating_item_id
         JOIN eat_score.account a on item.item_created_by_account_id = a.account_id
GROUP BY 1, 2, 3, 4, 5, 6, 7;

CREATE VIEW eat_score.view_venue_with_rating AS
SELECT v.venue_id,
       v.venue_name,
       v.venue_created_at,
       v.venue_created_by_account_id,
       a.account_name                          as venue_created_by_account_name,
       ROUND(AVG(vr.avg_item_rating_value), 1) as avg_venue_rating_value
FROM eat_score.venue v
         LEFT JOIN eat_score.view_item_with_rating vr ON v.venue_id = vr.venue_id
         JOIN eat_score.account a ON a.account_id = v.venue_created_by_account_id
GROUP BY 1, 2, 3, 4, 5;

INSERT INTO eat_score.account (account_email, account_name)
VALUES ('frederik@hoergreen.dk', 'Frederik'),
       ('jol@hiper.dk', 'Jonas'),
       ('phd@hiper.dk', 'Peter');

INSERT INTO eat_score.venue (venue_name, venue_created_by_account_id)
VALUES ('Killer Kebab', 1),
       ('Burger Shack', 1),
       ('Kebabery', 1),
       ('The Bagel Co', 1),
       ('Gasolin Grill', 1);

INSERT INTO eat_score.item (item_venue_id, item_name, item_price_dkk, item_created_by_account_id)
VALUES (1, 'Killer Kombo Kebab', 139, 1),
       (1, 'Killer Kombo Falafel', 139, 1),
       (2, 'Shack Burger Menu', 79, 1),
       (3, 'Hjemmelavet Durum', 65, 1),
       (4, 'Bagel', 75, 1);

INSERT INTO eat_score.item_rating (item_rating_item_id, item_rating_account_id, item_rating_value)
VALUES (1, 1, 5),
       (2, 1, 8),
       (3, 1, 8),
       (4, 1, 9),
       (1, 2, 2),
       (2, 2, 7),
       (3, 2, 4),
       (4, 2, 10),
       (1, 3, 1),
       (2, 3, 5),
       (3, 3, 9),
       (4, 3, 4);
