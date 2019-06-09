CREATE DATABASE farcry ENCODING 'UTF-8';
\c farcry
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


CREATE TABLE IF NOT EXISTS users
(
    user_name      text  NOT NULL UNIQUE,
    password       bytea NOT NULL,
    email          text  NOT NULL UNIQUE,
    email_verified bool DEFAULT false
);


CREATE TABLE IF NOT EXISTS matches
(
    match_id   uuid           NOT NULL DEFAULT uuid_generate_v1(),
    start_time timestamptz(3) NOT NULL,
    end_time   timestamptz(3) NOT NULL,
    game_mode  text           NOT NULL,
    map_name   text           NOT NULL
);


CREATE TABLE IF NOT EXISTS match_frags
(
    match_id    uuid        NOT NULL,
    frag_time   timestamptz NOT NULL,
    killer_name text        NOT NULL,
    victim_name text,
    weapon_code text
);


CREATE TABLE IF NOT EXISTS configs
(
    user_name text NOT NULL UNIQUE,
    config    text NOT NULL
);


CREATE VIEW match_stat AS
SELECT u.user_name                                                                                AS user_name,
       CASE WHEN SUM(p.kill_count)  IS NULL THEN 0 ELSE SUM(p.kill_count)  END  AS kills,
       CASE WHEN SUM(p.suicide_count)  IS NULL THEN 0 ELSE SUM(p.suicide_count)  END  AS suicides,
       CASE WHEN SUM(p.death_count)  IS NULL THEN 0 ELSE SUM(p.death_count)  END  AS  deaths
FROM users u
LEFT JOIN
    (SELECT match_id,
             killer_name                   AS player_name,
             COUNT(victim_name)            AS kill_count,
             COUNT(*) - COUNT(victim_name) AS suicide_count,
             0                             AS death_count
      FROM match_frags
      GROUP BY match_id, player_name
      UNION ALL
      SELECT match_id,
             victim_name        AS player_name,
             0                  AS kill_count,
             0                  AS suicide_count,
             count(victim_name) AS death_count
      FROM match_frags
      WHERE victim_name IS NOT NULL
      GROUP BY match_id, player_name
      ORDER BY match_id, player_name) AS p
ON u.user_name = p.player_name
GROUP BY u.user_name;


ALTER TABLE matches
    ADD CONSTRAINT pk_match_match_id
        PRIMARY KEY (match_id);


ALTER TABLE match_frags
    ADD CONSTRAINT fk_match_frag_match_id
        FOREIGN KEY (match_id) REFERENCES matches (match_id)
            ON UPDATE CASCADE ON DELETE RESTRICT;


ALTER TABLE configs
    ADD CONSTRAINT fk_configs_user_name
        FOREIGN KEY (user_name) REFERENCES users (user_name)
            ON UPDATE CASCADE ON DELETE RESTRICT;


