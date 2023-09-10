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

INSERT INTO eat_score.account (account_email, account_name)
VALUES ('frederik@hoergreen.dk', 'Frederik');

CREATE TABLE eat_score.item
(
    item_id        SERIAL PRIMARY KEY,
    item_name      VARCHAR NOT NULL,
    item_price_dkk INT     NOT NULL
);

CREATE TABLE eat_score.item_rating
(
    item_rating_id         SERIAL PRIMARY KEY,
    item_rating_item_id    INT REFERENCES eat_score.item (item_id) NOT NULL,
    item_rating_account_id INT REFERENCES eat_score.account (account_id),
    item_rating_value INT NOT NULL,
    UNIQUE (item_rating_item_id, item_rating_account_id)
);

CREATE VIEW eat_score.view_item_with_rating AS
SELECT item_id, item_name, item_price_dkk, ROUND(AVG(item_rating_value), 1) as avg_item_rating_value
FROM eat_score.item
         LEFT JOIN eat_score.item_rating ir on item.item_id = ir.item_rating_item_id
GROUP BY 1,2,3;

INSERT INTO eat_score.item (item_name, item_price_dkk)
VALUES ('Durum', 79),
       ('Killer Kebab', 139);
