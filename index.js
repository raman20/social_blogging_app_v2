const express = require('express');
const db = require('./db');
const crypto = require('bcrypt');
const cookieParser = require('cookie-parser');
const ImageKit = require("imagekit");
const app = express();
const cors = require('cors');
const port = 3001;

const imagekit = new ImageKit({
    publicKey: "public_BA4Pcimv5MNjuSgVgorpdDADpyc=",
    privateKey: "private_IXir/oq8QXdwsn1dyq90mHqWiwM=",
    urlEndpoint: "https://ik.imagekit.io/2bb11e1dc25c4278b3c4/"
});

app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/build'));
app.get('*', (req, res) => {
    res.sendFile(__dirname + '/build/index.html');
})

//-----HOME PAGE---------
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/build/index.html');
})
//-----------------------

//-------------------------------AUTH--------------------------------------
app.post('/user/register', async (req, res) => {
    const { name, username, password } = req.body;

    const hashedPasswd = await crypto.hash(password, 10);

    let result = await db.query('SELECT count(1) FROM users WHERE uname=$1', [username]);
    if (result.rows[0].count === '1') res.end('user_exist');
    else {
        await db.query('INSERT INTO users(fname,uname,passwd) values($1,$2,$3);', [name, username, hashedPasswd]);
        res.end('success');
    }
});

app.post('/user/login', async (req, res) => {
    const { username, password } = req.body;

    let query = 'select id, uname, passwd from users where uname=$1';

    let result = await db.query(query, [username]);

    let hashedPassword = result.rows[0].passwd;
    let output = await crypto.compare(password, hashedPassword);
    if (output) {
        res.cookie('userId', result.rows[0].id);
        res.cookie('userName', result.rows[0].uname);
        res.end("success");
    }

    else {
        res.end("auth_error");
    }
})

app.get('/user/logout', (req, res) => {
    if (req.cookies['userId']) {
        res.clearCookie('userId');
        res.end('success');
    }
    else {
        res.end('no_auth');
    }
});

app.put('/password_rest', async (req, res) => {
    let { new_passwd } = req.body;
    let hashedPasswd = await crypto.hash(new_passwd, 10);

    await db.query("update users set passwd=$1", [hashedPasswd]);
    res.end("success");
})
//----------------------------------------------------------------

app.get('/feed/:offset', async (req, res) => {
    if (req.cookies['userId']) {
        let userId = parseInt(req.cookies['userId']);
        let offset = parseInt(req.params.offset);

        let query = `   select p.id, p.pid, p.content, p.media_url, p.likecount, p.commentcount, p.created, u.uname, u.dp 
                        from posts p inner join users u
                        on u.id=p.id
                        where p.id in (select followee from follow where follower=$1) 
                        order by created desc offset $2 limit 20;
                    `;

        let result = await db.query(query, [userId, offset]);
        res.json(result.rows);
    }

    else res.end("auth_error");
})

app.get('/post/:pid', async (req, res) => {

    if (req.cookies['userId']) {
        let pid = parseInt(req.params.pid);

        let result = await db.query("select * from posts where pid=$1", [pid]);
        res.json(result.rows[0]);
    }

    else {
        res.end('auth_error');
    }

})

app.post('/post/new', (req, res) => {
    if (req.cookies['userId']) {
        let postImage = req.body.image;
        let postImageType = req.body.imageType;
        let postText = req.body.text;

        if (postImage) {
            imagekit.upload({
                file: postImage,
                fileName: `${req.cookies['userId']}_upload.${postImageType}`
            }, (err, result) => {
                if (err) {
                    console.log(err);
                    res.end('sys_error');
                }
                else {
                    db.query('insert into posts(id, content, media_url, media_id) values($1,$2,$3,$4)', [req.cookies['userId'], postText, result.url, result.fileId], (err, result) => {
                        if (err) {
                            console.log(err);
                            res.end('sys_error');
                        }
                        else {
                            res.end('success');
                        }
                    })
                }
            })
        }

        else {
            db.query('insert into posts(id, content) values($1, $2)', [req.cookies['userId'], postText], (err, res) => {
                if (err) {
                    res.end('sys_error');
                }
                else {
                    res.end('success');
                }
            })
        }

    }
    else {
        res.end('auth_error');
    }
})

app.post('/comment/:pid', async (req, res) => {
    if (req.cookies['userId']) {
        let { comment } = req.body;
        let { pid } = req.params;
        let query = `
                    insert into comments(id,pid,comment) values($1,$2,$3) returning 
                    cid,pid,id,comment,created,(select uname from users where id=$1),(select dp from users where id=$1)
                    `
        let result = await db.query(query, [req.cookies['userId'], pid, comment]);
        res.json(result.rows[0]);
    }
    else res.end('auth_error');
})

app.get('/comment/:pid', async (req, res) => {
    if (req.cookies['userId']) {
        let { pid } = req.params;
        let query = `
                    select c.cid, c.pid, c.comment, c.created, u.id, u.uname, u.dp 
                    from comments c inner join users u on c.id=u.id where c.pid=$1;
                    `
        let result = await db.query(query, [parseInt(pid)]);
        res.json(result.rows);
    }
    else res.end("auth_error");
})

app.put('/post/:pid/edit', async (req, res) => {
    if (req.cookies['userId']) {
        let pid = req.params.pid;

        let newImage = req.body.image;
        let newImageType = req.body.imageType;
        let newPostText = req.body.text;
        let deleteImage = req.body.deleteImage;

        if (newImage || deleteImage) {
            let result = await db.query('select media_id from posts where pid=$1', [pid]);
            let media_id = result.rows[0].media_id;

            if (media_id) {
                imagekit.deleteFile(media_id, (err, result) => { });
            }

            if (newImage) {
                imagekit.upload({
                    file: newImage,
                    fileName: `${req.cookies['userId']}_upload.${newImageType}`,
                }, (err, result) => {

                    db.query('update posts set media_url=$1, media_id=$2, content=$3 where pid=$4', [result.url, result.fileId, newPostText, pid], (err, res) => {
                        res.end('success');
                    })
                })
            }

            else {
                await db.query("update posts set media_url='', media_id='', content=$1 where pid=$2", [newPostText, pid]);
                res.end('success');
            }
        }

        else {
            await db.query('update posts set content=$1 where pid=$2', [newPostText, pid]);
            res.end('success');
        }
    }
    else {
        res.end('auth_error');
    }
})

app.put('/user/edit', async (req, res) => {
    if (req.cookies['userId']) {
        let id = req.cookies['userId'];

        let newDp = req.body.image;
        let newDpType = req.body.imageType;
        let newBio = req.body.bio;
        let deleteDp = req.body.deleteDp;

        if (newDp || deleteDp) {
            let result = await db.query('select dp_file_id from users where id=$1', [id]);
            let media_id = result.rows[0].dp_file_id;

            if (media_id) {
                imagekit.deleteFile(media_id, (err, result) => { });
            }

            if (newDp) {
                imagekit.upload({
                    file: newDp,
                    fileName: `${req.cookies['userId']}_upload.${newDpType}`,
                }, (err, result) => {
                    if (err) {
                        res.json({ result: 'sys_error' });
                    }

                    else {
                        db.query('update users set dp=$1, dp_file_id=$2, bio=$3 where id=$4', [result.url, result.fileId, newBio, id], (err, res) => {
                            res.end("success");
                        })
                    }
                })
            }

            else {
                await db.query("update users set dp='', dp_file_id='', content=$1 where id=$2", [newBio, id]);
                res.end("success");
            }
        }

        else {
            await db.query('update users set content=$1 where id=$2', [newBio, id]);
            res.end('success');
        }
    }

    else res.end('auth_error');
})

app.post('/like/:pid', async (req, res) => {
    if (req.cookies['userId']) {
        let pid = parseInt(req.params.pid);

        let result = await db.query("select count(1) from likes where pid=$1 and id=$2", [pid, parseInt(req.cookies['userId'])]);

        // dislike
        if (result.rows[0].count === '1') {
            await db.query("delete from likes where pid=$1 and id=$2", [pid, parseInt(req.cookies['userId'])]);
            res.end("success");
        }

        // like
        else {
            await db.query("insert into likes(pid, id) values($1,$2)", [pid, parseInt(req.cookies['userId'])]);
            res.end("success");
        }

    }
    else {
        res.end('auth_error');
    }
})

app.get('/like/:pid', async (req, res) => {
    if (req.cookies['userId']) {
        let { pid } = req.params;
        let query = `
                        select dp, uname, id from users 
                        where id in (select id from likes where pid=$1);
                    `;

        let result = await db.query(query, [parseInt(pid)]);
        res.json(result.rows);
    }
    else res.end("auth_error");
})

app.post('/follow/:id', async (req, res) => {
    if (req.cookies['userId']) {
        let { id: followeeId } = req.params;

        let result = await db.query('select count(1) from follow where follower=$1 and followee=$2', [req.cookies['userId'], followeeId]);

        if (result.rows[0].count === '1') {
            //unfollow
            await db.query('delete from follow where follower=$1 and followee=$2', [req.cookies['userId'], followeeId]);
            res.end('success');
        }

        else {
            //follow
            await db.query('insert into follow(follower, followee) values($1, $2)', [req.cookies['userId'], followeeId]);
            res.end('success');
        }
    }

    else {
        res.end('auth_error');
    }
})

app.get('/user/:id', async (req, res) => {
    if (req.cookies['userId']) {
        let { id } = req.params;


        let result = await db.query('select * from users where id=$1', [id]);
        let user = result.rows[0];

        result = await db.query('select * from posts where id=$1 order by created desc', [id]);
        user.posts = result.rows ? result.rows : [];

        result = await db.query('select count(1) from follow where follower=$1 and followee=$2', [req.cookies['userId'], id]);
        user.followed = parseInt(result.rows[0].count);

        res.json(user);
    }

    else res.end("auth_error");
})

app.get('/user/search/:uname', async (req, res) => {
    if (req.cookies['userId']) {
        let { uname } = req.params;

        let result = await db.query('select id from users where uname=$1', [uname]);
        if (result.rows[0].id) {
            res.json({ id: result.rows[0].id })
        }
        else res.end('not_found');
    }
    else res.json({ result: "auth_error" });
})

app.get('/user/:id/followings', async (req, res) => {
    if (req.cookies['userId']) {
        let { id } = req.params;

        let result = await db.query('select followee, u.dp, u.uname from follow f inner join users u on f.followee=u.id where follower=$1 ', [id]);

        res.json(result.rows);
    }
    else res.end("auth_error");
})

app.get('/user/:id/followers', async (req, res) => {
    if (req.cookies['userId']) {
        let { id } = req.params;

        let result = await db.query('select followee from follow f inner join users u on f.followee=u.id where followee=$1', [id]);
        res.json(result.rows);
    }
    else res.end("auth_error");
})

app.delete('/post/delete/:pid', async (req, res) => {
    if (req.cookies['userId']) {
        let { rows } = await db.query('select media_id from posts where pid=$1', [req.params.pid]);
        imagekit.deleteFile(rows[0].media_id);
        await db.query('delete from posts where pid=$1 and id=$2', [req.params.pid, req.cookies['userId']]);
        res.end("success");
    }
    else res.end("auth_error");
})

app.get('/post/content/:pid', async (req, res) => {
    if (req.cookies['userId']) {
        let { rows } = await db.query('select content from posts where pid=$1', [req.params.pid]);
        res.end(rows[0]);
    }
    else res.end("auth_error");
})

app.listen(port, () => {
    console.log('App started on port ' + port);
})