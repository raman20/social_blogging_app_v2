-- USER TABLE ->

CREATE TABLE users (
    id serial,                      -- user id
    fname text not null,            -- full name
    uname text not null unique,     -- username
    passwd text not null,           -- password
    dp text default 'dp.jpeg',      -- profile display picture
    bio text,                       -- profile bio
    followerCount int default 0     -- follower count
    followingCount int default 0    -- following count
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

----------------- TRIGGER FOR LIKE COUNT DECREMENT ------------->

CREATE FUNCTION decrement_like() RETURNS TRIGGER AS
$$
BEGIN
    UPDATE posts SET likeCount=likeCount-1 WHERE pid=old.pid;
    RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER like_dec_trigger AFTER DELETE ON likes FOR EACH ROW EXECUTE FUNCTION decrement_like();

------------------------------------------------------------------

------------------Trigger for comment count increment-------------

CREATE FUNCTION increment_comment() RETURNS TRIGGER AS
$$
BEGIN
    UPDATE posts SET commentCount=commentCount+1 WHERE pid=new.pid;
    RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER comment_inc_trigger AFTER INSERT ON comments FOR EACH ROW EXECUTE FUNCTION increment_comment();
--------------------------------------------------------------------

------------------Trigger for comment count decrement---------------
CREATE FUNCTION decrement_comment() RETURNS TRIGGER AS
$$
BEGIN
    UPDATE posts SET commentCount=commentCount-1 WHERE pid=old.pid;
    RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER comment_dec_trigger AFTER DELETE ON comments FOR EACH ROW EXECUTE FUNCTION decrement_comment();
---------------------------------------------------------------------

-----------------Trigger for followers count increment---------------
CREATE FUNCTION increment_follower_count() RETURNS TRIGGER AS
$$
BEGIN
    UPDATE users SET followerCount=followerCount+1 WHERE id=new.followee;
    RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER increment_follower_count AFTER INSERT ON follow FOR EACH ROW EXECUTE FUNCTION increment_follower_count();
---------------------------------------------------------------------

-----------------Trigger for followers count decrement---------------
CREATE FUNCTION decrement_follower_count() RETURNS TRIGGER AS
$$
BEGIN
    UPDATE users SET followerCount=followerCount-1 WHERE id=old.followee;
    RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER increment_follower_count AFTER DELETE ON follow FOR EACH ROW EXECUTE FUNCTION decrement_follower_count();
---------------------------------------------------------------------

----------------Trigger for followings count increment---------------
CREATE FUNCTION increment_following_count() RETURNS TRIGGER AS
$$
BEGIN
    UPDATE users SET followingCount=followingCount+1 WHERE id=new.follower;
    RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER increment_following_count AFTER INSERT ON follow FOR EACH ROW EXECUTE FUNCTION increment_following_count();
---------------------------------------------------------------------

----------------Trigger for followings count decrement---------------
CREATE FUNCTION decrement_following_count() RETURNS TRIGGER AS
$$
BEGIN
    UPDATE users SET followingCount=followingCount-1 WHERE id=old.follower;
    RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER increment_following_count AFTER DELETE ON follow FOR EACH ROW EXECUTE FUNCTION decrement_following_count();
---------------------------------------------------------------------


-----------------------------------------------------------------------------------------------------