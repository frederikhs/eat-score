CREATE SCHEMA eat_score;

CREATE TABLE eat_score.account
(
    account_id    SERIAL PRIMARY KEY,
    account_email VARCHAR UNIQUE NOT NULL,
    account_name  VARCHAR        NOT NULL
);

CREATE TABLE eat_score.magic_login_link
(
    magic_login_link_id         SERIAL PRIMARY KEY,
    magic_login_link_account_id INT REFERENCES eat_score.account (account_id),
    magic_login_link_hash       VARCHAR     NOT NULL,
    magic_login_link_issued_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
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
    venue_id   SERIAL PRIMARY KEY,
    venue_name VARCHAR NOT NULL
);

CREATE TABLE eat_score.item
(
    item_id        SERIAL PRIMARY KEY,
    item_venue_id  INT REFERENCES eat_score.venue (venue_id) NOT NULL,
    item_name      VARCHAR                                   NOT NULL,
    item_price_dkk INT                                       NOT NULL
);

CREATE TABLE eat_score.item_rating
(
    item_rating_id         SERIAL PRIMARY KEY,
    item_rating_item_id    INT REFERENCES eat_score.item (item_id) NOT NULL,
    item_rating_account_id INT REFERENCES eat_score.account (account_id),
    item_rating_value      INT                                     NOT NULL,
    UNIQUE (item_rating_item_id, item_rating_account_id)
);

CREATE VIEW eat_score.view_item_rating AS
SELECT ir.item_rating_id,
       i.item_id,
       i.item_name,
       v.venue_id,
       v.venue_name,
       ir.item_rating_value,
       a.account_id,
       a.account_name
FROM eat_score.item_rating ir
         JOIN eat_score.account a on ir.item_rating_account_id = a.account_id
         JOIN eat_score.item i on i.item_id = ir.item_rating_item_id
         JOIN eat_score.venue v on i.item_venue_id = v.venue_id;

CREATE VIEW eat_score.view_item_with_rating AS
SELECT item_id, v.venue_id, v.venue_name, item_name, item_price_dkk, ROUND(AVG(item_rating_value), 1) as avg_item_rating_value
FROM eat_score.item
         JOIN eat_score.venue v on item.item_venue_id = v.venue_id
         LEFT JOIN eat_score.item_rating ir on item.item_id = ir.item_rating_item_id
GROUP BY 1, 2, 3, 4, 5;

CREATE VIEW eat_score.view_venue_with_rating AS
SELECT venue_id, venue_name, ROUND(AVG(avg_item_rating_value), 1) as avg_venue_rating_value
FROM eat_score.view_item_with_rating
GROUP BY 1, 2;

INSERT INTO eat_score.account (account_email, account_name)
VALUES ('frederik@hoergreen.dk', 'Frederik'),
       ('jol@hiper.dk', 'Jonas'),
       ('phd@hiper.dk', 'Peter');

INSERT INTO eat_score.venue (venue_name)
VALUES ('Killer Kebab'),
       ('Burger Shack'),
       ('Kebabery'),
       ('The Bagel Co');

INSERT INTO eat_score.item (item_venue_id, item_name, item_price_dkk)
VALUES (1, 'Killer Kombo Kebab', 139),
       (1, 'Killer Kombo Falafel', 139),
       (2, 'Shack Burger Menu', 79),
       (3, 'Hjemmelavet Durum', 65),
       (4, 'Bagel', 75);

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
