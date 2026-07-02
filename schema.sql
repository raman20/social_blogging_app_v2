-- =========================================================================
-- 1. TABLES DEFINITION
-- =========================================================================

-- USER TABLE ->
CREATE TABLE users (
    id serial,                      -- user id
    fname text not null,            -- full name
    uname text not null unique,     -- username
    passwd text not null,           -- password
    dp text default 'dp.jpeg',      -- profile display picture
    bio text,                       -- profile bio
    followerCount int default 0,    -- follower count
    followingCount int default 0,   -- following count
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


-- =========================================================================
-- 2. TRIGGER FUNCTIONS (Using Standard String Literal Format)
-- =========================================================================

------------------ LIKE FUNCTIONS ------------------

CREATE OR REPLACE FUNCTION increment_like() RETURNS TRIGGER AS '
BEGIN
    UPDATE posts SET likeCount = likeCount + 1 WHERE pid = NEW.pid;
    RETURN NEW;
END;
' LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION decrement_like() RETURNS TRIGGER AS '
BEGIN
    UPDATE posts SET likeCount = likeCount - 1 WHERE pid = OLD.pid;
    RETURN OLD;
END;
' LANGUAGE plpgsql;


------------------ COMMENT FUNCTIONS ------------------

CREATE OR REPLACE FUNCTION increment_comment() RETURNS TRIGGER AS '
BEGIN
    UPDATE posts SET commentCount = commentCount + 1 WHERE pid = NEW.pid;
    RETURN NEW;
END;
' LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION decrement_comment() RETURNS TRIGGER AS '
BEGIN
    UPDATE posts SET commentCount = commentCount - 1 WHERE pid = OLD.pid;
    RETURN OLD;
END;
' LANGUAGE plpgsql;


------------------ FOLLOWER FUNCTIONS ------------------

CREATE OR REPLACE FUNCTION increment_follower_count() RETURNS TRIGGER AS '
BEGIN
    UPDATE users SET followerCount = followerCount + 1 WHERE id = NEW.followee;
    RETURN NEW;
END;
' LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION decrement_follower_count() RETURNS TRIGGER AS '
BEGIN
    UPDATE users SET followerCount = followerCount - 1 WHERE id = OLD.followee;
    RETURN OLD;
END;
' LANGUAGE plpgsql;


------------------ FOLLOWING FUNCTIONS ------------------

CREATE OR REPLACE FUNCTION increment_following_count() RETURNS TRIGGER AS '
BEGIN
    UPDATE users SET followingCount = followingCount + 1 WHERE id = NEW.follower;
    RETURN NEW;
END;
' LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION decrement_following_count() RETURNS TRIGGER AS '
BEGIN
    UPDATE users SET followingCount = followingCount - 1 WHERE id = OLD.follower;
    RETURN OLD;
END;
' LANGUAGE plpgsql;


-- =========================================================================
-- 3. TRIGGERS BINDING
-- =========================================================================

-- Likes Triggers
CREATE TRIGGER like_inc_trigger 
AFTER INSERT ON likes 
FOR EACH ROW EXECUTE FUNCTION increment_like();

CREATE TRIGGER like_dec_trigger 
AFTER DELETE ON likes 
FOR EACH ROW EXECUTE FUNCTION decrement_like();


-- Comments Triggers
CREATE TRIGGER comment_inc_trigger 
AFTER INSERT ON comments 
FOR EACH ROW EXECUTE FUNCTION increment_comment();

CREATE TRIGGER comment_dec_trigger 
AFTER DELETE ON comments 
FOR EACH ROW EXECUTE FUNCTION decrement_comment();


-- Followers Triggers
CREATE TRIGGER follower_inc_trigger 
AFTER INSERT ON follow 
FOR EACH ROW EXECUTE FUNCTION increment_follower_count();

CREATE TRIGGER follower_dec_trigger 
AFTER DELETE ON follow 
FOR EACH ROW EXECUTE FUNCTION decrement_follower_count();


-- Followings Triggers
CREATE TRIGGER following_inc_trigger 
AFTER INSERT ON follow 
FOR EACH ROW EXECUTE FUNCTION increment_following_count();

CREATE TRIGGER following_dec_trigger 
AFTER DELETE ON follow 
FOR EACH ROW EXECUTE FUNCTION decrement_following_count();
