const express = require("express");
const db = require("./db");
const crypto = require("bcrypt");
const cookieParser = require("cookie-parser");
const ImageKit = require("imagekit");
const app = express();
const port = process.env.PORT || 9091;

const imagekit = new ImageKit({
  publicKey: "public_BA4Pcimv5MNjuSgVgorpdDADpyc=",
  privateKey: "private_IXir/oq8QXdwsn1dyq90mHqWiwM=",
  urlEndpoint: "https://ik.imagekit.io/2bb11e1dc25c4278b3c4/",
});

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/build"));

//-----HOME PAGE---------
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/build/index.html");
});
//-----------------------

//-------------------------------AUTH--------------------------------------
app.post("/user/register", async (req, res) => {
  const { name, username, password } = req.body;

  const hashedPasswd = await crypto.hash(password, 10);

  let result = await db.query("SELECT count(1) FROM users WHERE uname=$1", [
    username,
  ]);
  if (result.rows[0].count === "1") res.end("user_exist");
  else {
    await db.query("INSERT INTO users(fname,uname,passwd) values($1,$2,$3);", [
      name,
      username,
      hashedPasswd,
    ]);
    res.end("success");
  }
});

app.post("/user/login", async (req, res) => {
  const { username, password } = req.body;

  let query = "SELECT id, uname, passwd, dp FROM users WHERE uname=$1";

  let result = await db.query(query, [username]);
  if (result.rows.length > 0) {
    let hashedPassword = result.rows[0].passwd;
    let output = await crypto.compare(password, hashedPassword);
    if (output) {
      res.cookie("userId", result.rows[0].id);
      res.cookie("userName", result.rows[0].uname);
      res.cookie("userDp", result.rows[0].dp);
      res.end("success");
    } else {
      res.end("auth_error");
    }
  } else {
    res.end("auth_error");
  }
});

app.get("/user/logout", (req, res) => {
  if (req.cookies["userId"]) {
    res.clearCookie("userId");
    res.clearCookie("userName");
    res.clearCookie("userDp");
    res.end("success");
  } else {
    res.end("no_auth");
  }
});

app.put("/password_rest", async (req, res) => {
  let { new_passwd } = req.body;
  let hashedPasswd = await crypto.hash(new_passwd, 10);

  await db.query("UPDATE users SET passwd=$1", [hashedPasswd]);
  res.end("success");
});
//----------------------------------------------------------------

app.get("/feed/:offset", async (req, res) => {
  if (req.cookies["userId"]) {
    let userId = parseInt(req.cookies["userId"]);
    let offset = parseInt(req.params.offset);

    let query = `   SELECT p.id, p.pid, p.content, p.media_url, p.likecount, p.commentcount, p.created, u.uname, u.dp, 
                        COALESCE((SELECT id FROM likes WHERE pid=p.pid AND id=$1),0) as likeflag
                        FROM posts p 
                        INNER JOIN users u ON u.id=p.id
                        WHERE p.id IN (SELECT followee FROM follow WHERE follower=$1) OR p.id IN ($1) 
                        ORDER BY created DESC OFFSET $2 LIMIT 20;
                    `;

    let result = await db.query(query, [userId, offset]);
    res.json(result.rowCount > 0 ? result.rows : []);
  } else res.end("auth_error");
});

app.get("/post/:pid", async (req, res) => {
  if (req.cookies["userId"]) {
    let pid = parseInt(req.params.pid);
    let query = `   SELECT p.id, p.pid, p.content, p.media_url, p.likecount, p.commentcount, p.created, u.uname, u.dp, 
                        COALESCE((SELECT id FROM likes WHERE pid=p.pid AND id=$1),0) as likeflag
                        FROM posts p INNER JOIN users u ON u.id=p.id
                        WHERE p.pid=$2
                    `;
    let result = await db.query(query, [parseInt(req.cookies["userId"]), pid]);
    if (result.rowCount > 0) res.json(result.rows[0]);
    else res.end("not_found");
  } else {
    res.end("auth_error");
  }
});

app.post("/post/new", async (req, res) => {
  if (req.cookies["userId"]) {
    let { postImageUrl, postImageMediaId, postText } = req.body;

    if (postImageUrl) {
      await db.query(
        "INSERT INTO posts(id, content, media_url, media_id) values($1,$2,$3,$4);",
        [
          parseInt(req.cookies["userId"]),
          postText,
          postImageUrl,
          postImageMediaId,
        ]
      );
      res.end("success");
    } else {
      await db.query("INSERT INTO posts(id, content) values($1, $2);", [
        parseInt(req.cookies["userId"]),
        postText,
      ]);
      res.end("success");
    }
  } else {
    res.end("auth_error");
  }
});

app.post("/comment/:pid", async (req, res) => {
  if (req.cookies["userId"]) {
    let { comment } = req.body;
    let { pid } = req.params;
    let query = `
                    INSERT INTO comments(id,pid,comment) values($1,$2,$3) returning 
                    cid,pid,id,comment,created,(SELECT uname FROM users WHERE id=$1),(SELECT dp FROM users WHERE id=$1)
                    `;
    let result = await db.query(query, [
      parseInt(req.cookies["userId"]),
      parseInt(pid),
      comment,
    ]);
    res.json(result.rows[0]);
  } else res.end("auth_error");
});

app.get("/comment/:pid", async (req, res) => {
  if (req.cookies["userId"]) {
    let { pid } = req.params;
    let query = `
                    SELECT c.cid, c.pid, c.comment, c.created, u.id, u.uname, u.dp 
                    FROM comments c INNER JOIN users u ON c.id=u.id WHERE c.pid=$1;
                    `;
    let result = await db.query(query, [parseInt(pid)]);
    res.json(result.rows);
  } else res.end("auth_error");
});

app.put("/post/:pid/edit", async (req, res) => {
  if (req.cookies["userId"]) {
    let pid = parseInt(req.params.pid);

    let { newImageUrl, newImageId, newPost, deleteImage } = req.body;

    if (newImageUrl || deleteImage) {
      let result = await db.query("SELECT media_id FROM posts WHERE pid=$1", [
        pid,
      ]);
      let media_id = result.rows.length > 0 ? result.rows[0].media_id : null;

      if (media_id) {
        imagekit.deleteFile(media_id);
      }

      if (newImageUrl) {
        await db.query(
          "UPDATE posts SET media_url=$1, media_id=$2, content=$3 WHERE pid=$4",
          [newImageUrl, newImageId, newPost, pid]
        );
        res.end("success");
      } else {
        await db.query(
          "UPDATE posts SET media_url='', media_id='', content=$1 WHERE pid=$2",
          [newPost, pid]
        );
        res.end("success");
      }
    } else {
      await db.query("UPDATE posts SET content=$1 WHERE pid=$2", [
        newPost,
        pid,
      ]);
      res.end("success");
    }
  } else {
    res.end("auth_error");
  }
});

app.put("/user/edit", async (req, res) => {
  if (req.cookies["userId"]) {
    let id = parseInt(req.cookies["userId"]);
    let { newName, newDpUrl, newDpId, newBio, deleteDp } = req.body;

    if (newDpUrl || deleteDp) {
      let result = await db.query("SELECT dp_file_id FROM users WHERE id=$1", [
        id,
      ]);
      let media_id = result.rows[0].dp_file_id;

      if (media_id) {
        imagekit.deleteFile(media_id);
      }

      if (newDpUrl) {
        await db.query(
          "UPDATE users SET dp=$1, dp_file_id=$2, bio=$3 ,fname=$4 WHERE id=$5",
          [newDpUrl, newDpId, newBio, newName, id]
        );
        res.end("success");
      } else {
        let defaultDp =
          "https://ik.imagekit.io/2bb11e1dc25c4278b3c4/dp.jpeg?updatedAt=1627287903195";
        await db.query(
          "UPDATE users SET dp=$1, dp_file_id='', bio=$2, fname=$3 WHERE id=$4",
          [defaultDp, newBio, newName, id]
        );
        res.end("success");
      }
    } else {
      await db.query("UPDATE users SET bio=$1, fname=$2 WHERE id=$3", [
        newBio,
        newName,
        id,
      ]);
      res.end("success");
    }
  } else res.end("auth_error");
});

app.post("/like/:pid", async (req, res) => {
  if (req.cookies["userId"]) {
    let pid = parseInt(req.params.pid);

    let result = await db.query(
      "SELECT count(1) FROM likes WHERE pid=$1 AND id=$2",
      [pid, parseInt(req.cookies["userId"])]
    );

    // dislike
    if (result.rows[0].count === "1") {
      await db.query("delete FROM likes WHERE pid=$1 AND id=$2", [
        pid,
        parseInt(req.cookies["userId"]),
      ]);
      res.end("success");
    }

    // like
    else {
      await db.query("INSERT INTO likes(pid, id) values($1,$2)", [
        pid,
        parseInt(req.cookies["userId"]),
      ]);
      res.end("success");
    }
  } else res.end("auth_error");
});

app.get("/like/:pid", async (req, res) => {
  if (req.cookies["userId"]) {
    let { pid } = req.params;
    let query = `
                        SELECT dp, uname, id FROM users 
                        WHERE id IN (SELECT id FROM likes WHERE pid=$1);
                    `;

    let result = await db.query(query, [parseInt(pid)]);
    res.json(result.rows);
  } else res.end("auth_error");
});

app.post("/follow/:id", async (req, res) => {
  if (req.cookies["userId"]) {
    let { id: followeeId } = req.params;

    let result = await db.query(
      "SELECT count(1) FROM follow WHERE follower=$1 AND followee=$2",
      [parseInt(req.cookies["userId"]), parseInt(followeeId)]
    );

    if (result.rows[0].count === "1") {
      //unfollow
      await db.query("delete FROM follow WHERE follower=$1 AND followee=$2", [
        parseInt(req.cookies["userId"]),
        parseInt(followeeId),
      ]);
      res.end("success");
    } else {
      //follow
      await db.query("INSERT INTO follow(follower, followee) values($1, $2)", [
        parseInt(req.cookies["userId"]),
        parseInt(followeeId),
      ]);
      res.end("success");
    }
  } else {
    res.end("auth_error");
  }
});

app.get("/user/details", async (req, res) => {
  if (req.cookies["userId"]) {
    let result = await db.query("SELECT fname, bio FROM users WHERE id=$1", [
      parseInt(req.cookies["userId"]),
    ]);
    res.json(result.rows[0]);
  } else res.end("auth_error");
});

app.get("/user/:uname", async (req, res) => {
  if (req.cookies["userId"]) {
    let { uname } = req.params;

    let result = await db.query("SELECT * FROM users WHERE uname=$1", [uname]);

    if (result.rowCount > 0) {
      let user = result.rows[0];
      let query = `   SELECT p.id, p.pid, p.content, p.media_url, p.likecount, p.commentcount, p.created, u.uname, u.dp, 
                        COALESCE((SELECT id FROM likes WHERE pid=p.pid AND id=$1),0) as likeflag
                        FROM posts p 
                        INNER JOIN users u ON u.id=p.id
                        WHERE p.id=$2 
                        ORDER BY created;
                    `;
      result = await db.query(query, [
        parseInt(req.cookies["userId"]),
        user.id
      ]);
      user.posts = result.rowCount > 0 ? result.rows : [];
      if (parseInt(req.cookies["userId"]) !== user.id) {
        result = await db.query(
          "SELECT count(1) FROM follow WHERE follower=$1 AND followee=$2",
          [parseInt(req.cookies["userId"]), user.id]
        );
        user.followed = parseInt(result.rows[0].count);
      }

      res.json(user);
    } else res.end("not found");
  } else res.end("auth_error");
});

app.get("/user/search/:uname", async (req, res) => {
  if (req.cookies["userId"]) {
    let { uname } = req.params;

    let result = await db.query("SELECT id FROM users WHERE uname=$1", [uname]);
    if (result.rowCount > 0) {
      res.end("success");
    } else res.end("not_found");
  } else res.end("auth_error");
});

app.get("/user/:id/followings", async (req, res) => {
  if (req.cookies["userId"]) {
    let { id } = req.params;

    let result = await db.query(
      "SELECT followee, u.dp, u.uname FROM follow f INNER JOIN users u ON f.followee=u.id WHERE follower=$1 ",
      [parseInt(id)]
    );

    res.json(result.rows);
  } else res.end("auth_error");
});

app.get("/user/:id/followers", async (req, res) => {
  if (req.cookies["userId"]) {
    let { id } = req.params;

    let result = await db.query(
      "SELECT followee FROM follow f INNER JOIN users u ON f.followee=u.id WHERE followee=$1",
      [parseInt(id)]
    );
    res.json(result.rows);
  } else res.end("auth_error");
});

app.delete("/post/delete/:pid", async (req, res) => {
  if (req.cookies["userId"]) {
    let pid = parseInt(req.params.pid);
    let { rows } = await db.query("SELECT media_id FROM posts WHERE pid=$1", [
      pid,
    ]);
    imagekit.deleteFile(rows[0].media_id);
    await db.query("delete FROM likes WHERE pid=$1", [pid]);
    await db.query("delete FROM comments WHERE pid=$1", [pid]);
    await db.query("delete FROM posts WHERE pid=$1", [pid]);

    res.end("success");
  } else res.end("auth_error");
});

app.get("/post/content/:pid", async (req, res) => {
  if (req.cookies["userId"]) {
    let { rows } = await db.query("SELECT content FROM posts WHERE pid=$1", [
      parseInt(req.params.pid),
    ]);
    res.end(rows[0].content);
  } else res.end("auth_error");
});

app.get("/imagekit_auth", (req, res) => {
  if (req.cookies["userId"]) res.json(imagekit.getAuthenticationParameters());
  else res.end("auth_error");
});

app.get("/user/raw_search/:input", async (req, res) => {
  if (req.cookies["userId"]) {
    let { input } = req.params;
    let result = await db.query(
      "SELECT id, uname, dp FROM users WHERE uname LIKE $1 or fname LIKE $1;",
      ["%" + input + "%"]
    );
    res.json(result.rows);
  } else res.end("auth_error");
});

app.use("*", (req, res) => {
  res.sendFile(__dirname + "/build/index.html");
});

app.listen(port, () => {
  console.log("App started on port " + port);
});
