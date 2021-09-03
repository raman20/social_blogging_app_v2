-- USER TABLE ->

CREATE TABLE users (
    id serial,                      -- user id
    fname text not null,            -- full name
    uname text not null unique,     -- username
    passwd text not null,           -- password
    dp text default 'dp.jpeg',      -- profile display picture
    bio text,                       -- profile bio
    PRIMARY KEY(id)
);

-- USERs RELATION TABLE ->

CREATE TABLE follow (
    follower integer REFERENCES users(id),
    followee integer REFERENCES users(id),
    PRIMARY KEY(follower,followee),
    CHECK(follower <> followee)
);

-- POSTS TABLE -> 

CREATE TABLE posts (
    pid serial,                         -- post id
    id integer REFERENCES users(id),    -- user id
    content text,                       -- post content
    media_url text default null,        -- media cdn address
    created timestamp default now(),    -- time it is created
    likeCount integer default 0,        -- like count
    commentCount integer default 0,     -- comment count
    PRIMARY KEY(pid)
);

-- Likes Table -> 

CREATE TABLE likes (
    id integer REFERENCES users(id),    -- user id
    pid integer REFERENCES posts(pid),  -- post id
    PRIMARY KEY (id,pid)
);

-- COMMENTS TABLE ->

CREATE TABLE comments (
    cid serial,                         -- comment id
    pid integer REFERENCES posts(pid),  -- post id
    id integer REFERENCES users(id),    -- user id
    comment text,                       -- comment content
    created timestamp default now(),    -- time it is created
    PRIMARY KEY(cid)  
);


-- ----------------------TRIGGERS FOR UPDATING LIKE COUNTS ON POST TABLE---------------------------->

-- TRIGGER FOR LIKE INCREMENT -->

CREATE FUNCTION increment_like() RETURNS TRIGGER AS
$$
BEGIN
    UPDATE posts SET likeCount=likeCount+1 WHERE pid=new.pid;
    RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER like_inc_trigger AFTER INSERT ON likes FOR EACH ROW EXECUTE FUNCTION increment_like();

-----------------------------------

-- TRIGGER FOR LIKE COUNT DECREMENT -->

CREATE FUNCTION decrement_like() RETURNS TRIGGER AS
$$
BEGIN
    UPDATE posts SET likeCount=likeCount-1 WHERE pid=old.pid;
    RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER like_dec_trigger AFTER DELETE ON likes FOR EACH ROW EXECUTE FUNCTION decrement_like();

-----------------------------------------

CREATE FUNCTION increment_comment() RETURNS TRIGGER AS
$$
BEGIN
    UPDATE posts SET commentCount=commentCount+1 WHERE pid=new.pid;
    RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER comment_inc_trigger AFTER INSERT ON comments FOR EACH ROW EXECUTE FUNCTION increment_comment();


CREATE FUNCTION decrement_comment() RETURNS TRIGGER AS
$$
BEGIN
    UPDATE posts SET commentCount=commentCount-1 WHERE pid=old.pid;
    RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER comment_dec_trigger AFTER DELETE ON comments FOR EACH ROW EXECUTE FUNCTION decrement_comment();


-----------------------------------------------------------------------------------------------------