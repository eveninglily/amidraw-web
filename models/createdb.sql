/*DROP TABLE IF EXISTS gallery;*/
CREATE TABLE IF NOT EXISTS gallery(
    id serial PRIMARY KEY,
    title varchar(32),
    description varchar(128),
    imgpath text,
    userid integer
);

DROP TABLE IF EXISTS users;
CREATE TABLE IF NOT EXISTS users(
    id serial PRIMARY KEY,
    name varchar(32) UNIQUE,
    password text
);

INSERT INTO users(name, password) VALUES ('Anon', '');
INSERT INTO gallery(title, description, imgpath, userid) VALUES ('Upload', '<No description availible>', 'https://amidraw.com/gallery/img/test.png', 1);