const express = require('express');
const db = require('./db');
const crypto = require('bcrypt');
const cookieParser = require('cookie-parser');
const ImageKit = require("imagekit");
const app = express();
const port = 3001;

const imagekit = new ImageKit({
    publicKey: "public_BA4Pcimv5MNjuSgVgorpdDADpyc=",
    privateKey: "private_IXir/oq8QXdwsn1dyq90mHqWiwM=",
    urlEndpoint: "https://ik.imagekit.io/2bb11e1dc25c4278b3c4/"
});

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/build'));

//-----HOME PAGE---------
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/build/index.html')
})
//-----------------------

//-------------------------------AUTH--------------------------------------
app.post('/user/register', async (req, res) => {
    const { name, username, passwd } = req.body;

    const hashedPasswd = await crypto.hash(passwd, 10);

    db.query('SELECT count(1) FROM users WHERE uname=$1', [username], (err, result) => {
        if (err) {
            res.end('sys_error');
        }

        else if (result.rows[0].count === '1') {
            res.end('user_exist');
        }

        else {

            db.query('INSERT INTO users(fname,uname,passwd) values($1,$2,$3);', [name, username, hashedPasswd], (err, result) => {
                if (err) {
                    res.end('sys_error');
                }
                res.end('success');
            })

        }
    })

});

app.post('/user/login', (req, res) => {
    const { username, passwd } = req.body;

    let query = 'select id, passwd from users where uname=$1';

    db.query(query, [username], (err, result) => {
        if (err) {
            res.json({
                result: "sys_error"
            })
        }
        else {
            let hashedPasswd = result.rows[0].passwd;
            crypto.compare(passwd, hashedPasswd).then(output => {
                if (output) {
                    res.cookie('userId', result.rows[0].id);
                    res.json({
                        userId: result.rows[0].id,
                        result: "success"
                    });
                }

                else {
                    req.json({
                        result: "auth_error"
                    });
                }
            })
        }
    })
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

    db.query("update users set passwd=$1", [hashedPasswd], (err, result) => {
        if (err) {
            res.json({ result: "sys_error" });
        }

        res.json({ result: "success" });
    })
})
//----------------------------------------------------------------

app.get('/feed/:count', (req, res) => {
    if (req.cookies['userId']) {
        let userId = parseInt(req.cookies['userId']);
        let limit = parseInt(req.params.limit);

        let query = `   select p.id, p.pid, p.content, p.media_url, p.likecount, p.commentcount, p.created, u.uname, u.dp 
                        from posts p inner join users u
                        on u.id=p.id
                        where p.id in (select followee from follow where follower=$1) 
                        order by created desc offset $2 limit 20;
                    `;

        db.query(query, [userId, limit], (err, result) => {
            if (err) {
                console.log(err);
                res.json({ result: "sys_error" });
            }
            else res.json(result.rows);
        })
    }
    else {
        res.json({ result: "auth_error" });
    }
})

app.get('/post/:pid', (req, res) => {

    if (req.cookies['userId']) {
        let pid = parseInt(req.params.pid);

        db.query("select * from posts where pid=$1", [pid], (err, result) => {
            if (err) {
                console.log(err);
                res.end('sys_error');
            }
            else {
                let post = result.rows[0];
                let query = `
                                select c.cid,c.pid,c.id,c.created,c.comment,u.uname,u.dp 
                                from comments c inner join users u 
                                on u.id=c.id 
                                where c.pid=$1
                                order by created desc 
                            `
                db.query(query, [pid], (err, result) => {
                    if (err) {
                        console.log(err);
                        res.json({ result: "sys_error" });
                    }
                    else {
                        post.comments = result.rows;
                        res.json(post);
                    }
                })
            }
        })
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

app.post('/comment/:pid', (req, res) => {
    if (req.cookies['userId']) {
        let { comment } = req.body;
        let { pid } = req.params;
        let query = `
                    insert into comments(id,pid,comment) values($1,$2,$3) returning 
                    cid,pid,id,comment,created,(select uname from users where id=$1),(select dp from users where id=$1)
                    `
        db.query(query, [req.cookies['userId'], pid, comment], (err, result) => {
            if (err) {
                console.log(err);
                res.json({ result: 'sys_error' });
            }
            else {
                res.json(res.rows[0]);
            }
        })
    }
    else {
        res.end('auth_error');
    }
})

app.get('/comment/:pid', (req, res) => {
    if (req.cookies['userId']) {
        let { pid } = req.params;
        let query = `
                    select c.cid, c.pid, c.comment, c.created, u.id, u.uname, u.dp 
                    from comments c inner join users u on c.id=u.id where c.pid=$1
                    `
        db.query(query, [parseInt(pid)], (err, result) => {
            if (err) {
                console.log(err);
                res.json({ result: "sys_error" });
            }
            else res.json(result.rows);
        })
    }
    else res.json({ result: "auth_error" });
})

app.put('/post/:pid/edit', (req, res) => {
    if (req.cookies['userId']) {
        let pid = req.params.pid;

        let newDp = req.body.image;
        let newDpType = req.body.imageType;
        let newPostText = req.body.text;
        let deleteImage = req.body.deleteImage;

        if (newDp || deleteImage) {
            db.query('select media_id from posts where pid=$1', [pid], (err, result) => {
                if (err) {
                    res.json({ result: 'sys_error' });
                }
                else {
                    let media_id = result.rows[0].media_id;

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
                                db.query('update posts set media_url=$1, media_id=$2, content=$3 where pid=$4', [result.url, result.fileId, newPostText, pid], (err, res) => {
                                    if (err) {
                                        res.json({ result: 'sys_error' });
                                    }

                                    else res.json({ media_url: result.url });
                                })
                            }
                        })
                    }

                    else {
                        db.query("update posts set media_url='', media_id='', content=$1 where pid=$2", [newPostText, pid], (err, res) => {
                            if (err) {
                                res.json({ result: 'sys_error' });
                            }

                            else res.json({ media_url: '' });
                        })
                    }
                }

            })
        }

        else {
            db.query('update posts set content=$1 where pid=$2', [newPostText, pid], (err, res) => {
                if (err) res.json({ result: 'sys_error' });
                else res.json({ result: 'success' });
            })
        }
    }
    else {
        res.end('auth_error');
    }
})

app.put('/user/edit', (req, res) => {
    if (req.cookies['userId']) {
        let id = req.cookies['userId'];

        let newDp = req.body.image;
        let newDpType = req.body.imageType;
        let newBio = req.body.bio;
        let deleteDp = req.body.deleteDp;

        if (newDp || deleteDp) {
            db.query('select dp_file_id from users where id=$1', [id], (err, result) => {
                if (err) {
                    res.json({ result: 'sys_error' });
                }
                else {
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
                                    if (err) {
                                        res.json({ result: 'sys_error' });
                                    }

                                    else res.json({ result: "success" });
                                })
                            }
                        })
                    }

                    else {
                        db.query("update users set dp='', dp_file_id='', content=$1 where id=$2", [newBio, id], (err, res) => {
                            if (err) {
                                res.json({ result: 'sys_error' });
                            }

                            else res.json({ result: "success" });
                        })
                    }
                }

            })
        }

        else {
            db.query('update users set content=$1 where id=$2', [newBio, id], (err, res) => {
                if (err) res.json({ result: 'sys_error' });
                else res.json({ result: 'success' });
            })
        }
    }
    else {
        res.end('auth_error');
    }
})

app.post('/like/:pid', (req, res) => {
    if (req.cookies['userId']) {
        let pid = parseInt(req.params.pid);

        db.query("select count(1) from likes where pid=$1 and id=$2", [pid, parseInt(req.cookies['userId'])], (err, result) => {
            if (err) {
                console.log(err);
                res.json({ result: 'sys_error' });
            }

            //unlike
            else if (result.rows[0].count === '1') {
                db.query("delete from likes where pid=$1 and id=$2", [pid, parseInt(req.cookies['userId'])], (err, result) => {
                    if (err) {
                        console.log(err);
                        res.json({ result: 'sys_error' });
                    }
                    else {
                        res.json({ result: "success" });
                    }
                })
            }

            // like
            else {
                db.query("insert into likes(pid, id) values($1,$2)", [pid, parseInt(req.cookies['userId'])], (err, result) => {
                    if (err) {
                        console.log(err);
                        res.json({ result: 'sys_error' });
                    }
                    else {
                        res.json({ result: "success" });
                    }
                })
            }
        })

    }
    else {
        res.end('auth_error');
    }
})

app.get('/like/:pid', (req, res) => {
    if (req.cookies['userId']) {
        let { pid } = req.params;
        let query = `
                        select dp, uname, id from users 
                        where id in (select id from likes where pid=$1);
                    `;

        db.query(query, [parseInt(pid)], (err, resp) => {
            if (err) {
                console.log(err);
                res.json({ result: "sys_error" });
            }
            else res.json({ result: resp.rows });
        })
    }
    else res.json({ result: "auth_error" });
})

app.post('/follow/:id', (req, res) => {
    if (req.cookies['userId']) {
        let { id: followeeId } = req.params;

        db.query('select count(1) from follow where follower=$1 and followee=$2', [req.cookies['userId'], followeeId], (err, result) => {
            if (err) {
                console.log(err);
                res.end('sys_error');
            }

            // unfollow
            else if (result.rows[0].count === '1') {
                db.query('delete from follow where follower=$1 and followee=$2', [req.cookies['userId'], followeeId], (err, result) => {
                    if (err) {
                        console.log(err);
                        res.end('sys_error');
                    }
                    else {
                        res.end('success');
                    }
                })
            }

            // follow
            else {
                db.query('insert into follow(follower, followee) values($1, $2)', [req.cookies['userId'], followeeId], (err, result) => {
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
        res.end('auth_error');
    }
})

app.get('/user/:id', (req, res) => {
    if (req.cookies['userId']) {
        let { id } = req.params;

        db.query('select * from users where id=$1', [id], (err, result) => {
            if (err) {
                console.log(err);
                res.json({ result: 'sys_error' });
            }
            else {
                let user = result.rows[0];

                db.query('select * from posts where id=$1 order by created desc', [id], (err, result) => {
                    if (err) {
                        console.log(err);
                        res.json({ result: 'sys_error' });
                    }
                    else {
                        user.posts = result.rows;
                        res.json(user);
                    }
                })
            }
        })
    }

    else res.json({ result: "auth_error" });
})

app.get('/user/search/:uname', (req, res) => {
    if (req.cookies['userId']) {
        let { uname } = req.params;
        db.query('select id from users where uname=$1', [uname], (err, result) => {
            if (err) {
                console.log(err);
                res.json({ result: "sys_error" });
            }
            else if (result.rows[0].id) {
                res.json({ id: result.rows[0].id });
            }
            else res.json({ result: "not_found" });
        })
    }
    else res.json({ result: "auth_error" });
})

app.get('/user/:id/followings', (req, res) => {
    if (req.cookies['userId']) {
        let { id } = req.params;

        db.query('select followee, u.dp, u.uname from follow f inner join users u on f.followee=u.id where follower=$1 ', [id], (err, result) => {
            if (err) {
                console.log(err);
                res.json({ result: "sys_error" });
            }
            else res.json(result.rows);
        })
    }
    else res.json({ result: "auth_error" });
})

app.get('/user/:id/followers', (req, res) => {
    if (req.cookies['userId']) {
        let { id } = req.params;

        db.query('select followee from follow f inner join users u on f.followee=u.id where followee=$1', [id], (err, result) => {
            if (err) {
                console.log(err);
                res.json({ result: "sys_error" });
            }
            else res.json(result.rows);
        })
    }
    else res.json({ result: "auth_error" });
})

app.delete('/post/delete/:pid', (req, res) => {
    if (req.cookies['userId']) {
        db.query('delete from posts where pid=$1 and id=$2', [req.params.pid, req.cookies['userId']], (err, result) => {
            if (err) {
                console.log(err);
                res.json({ result: "sys_error" });
            }

            else res.json({ result: "success" });
        })
    }
    else res.json({ result: "auth_error" });
})

app.listen(port, () => {
    console.log('App started on port ' + port);
})