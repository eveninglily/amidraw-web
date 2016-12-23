DROP TABLE IF EXISTS gallery;
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
    name varchar(32)
);

/* For testing */
INSERT INTO users(name) VALUES ('Evan');

INSERT INTO gallery(title, description, imgpath, userid) values ('B Trees!', 'A true work of art', 'https://amidraw.com/gallery/img/niUT0oN.png', 1);
INSERT INTO gallery(title, description, imgpath, userid) values ('WOW ITS B TREES', 'A true work of art', 'https://amidraw.com/gallery/img/niUT0oN.png', 1);
INSERT INTO gallery(title, description, imgpath, userid) values ('WOW I LOVE B TREES', 'A true work of art', 'https://amidraw.com/gallery/img/niUT0oN.png', 1);