var express = require("express");
var app = express();
const bodyParser = require("body-parser");
const path = require("path");
const http = require("http");
const fs = require("fs");
const { Pool } = require("pg");
const session = require("express-session");
const bcrypt = require("bcrypt");
const axios = require('axios');
var port = process.env.PORT || 3000;

const saltRounds = 6;

var options = {
  dotfiles: "ignore",
  extensions: ["htm", "html", "json"],
};

const db = new Pool({
  connectionString:
    "postgres://postgres:postgres@localhost:5432/planet_online",
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  session({ secret: "secret key", resave: true, saveUninitialized: true })
);

app.use("/", express.static("./", options));

app.use("/", function (req, res, next) {
  console.log(req.method, "request: ", req.url, JSON.stringify(req.body));
  next();
});

app.use(express.static(path.join(__dirname, "dist/planet-online")));

//account register
app.post("/api/register", async (req, res) => {
  console.log(req.body);
  try {
    const { username, password } = req.body;
    db.query(
      "SELECT username from users WHERE username = $1",
      [username],
      (err, result) => {
        // check if username is taken (usernames are unique)
        if (result.rowCount > 0) {
          res.status(409).send({ error: "Username already taken" }); // <<<----------- Needs to be fixed
          return;
        } else {
          // insert into users table
          try {
            let password = req.body.password;
              bcrypt.hash(password, saltRounds, function(err, hash) {
                console.log(hash)
                db.query(
                  "INSERT INTO users(username, password) VALUES($1, $2)",
                  [username, hash],
                  (err, result) => {
                    if (result) {
                      console.log("Successful registration.");
                      res.json({url: "/login"});
                    } else if (err) {
                      console.log("Registration Error");
                      console.log(err);
                    }
                  }
                );
                });
          } catch (err) {
            res.end(err);
          }
        }
      }
    );
  } catch (err) {
    res.end(err);
  }
});

app.post("/addmessage", async (req, res) => {
  console.log(req.body);
  try {
    const { user1, user2, content } = req.body;
    db.query(
      "SELECT id from conversations WHERE (user1_name = $1 AND user2_name = $2) OR (user1_name = $2 AND user2_name = $1)",
      [user1,user2],
      (err, result) => {
        // if conversation is already generated, add message to that conversation
        console.log(result)
        if (result.rowCount > 0) {
          var conv_id = result.rows[0]["id"]
          try {
            db.query(
              "INSERT INTO messages(sender_name, receiver_name, content, conversation_id) VALUES($1, $2, $3, $4)",
              [user1, user2, content, conv_id],
              (err, result) => {
                if (result) {
                  console.log("Add message successful.");
                  res.json({result: conv_id});
                } else if (err) {
                  console.log("Add message Error");
                  console.log(err);
                }
              }
            );
          } catch (err) {
            console.log(err)
            res.end(err);
          }
        // else if conversation is not generated, create new conversation then add that message
        } else {
          try {
            console.log(user2);
            db.query(
              
              "INSERT INTO conversations(user1_name, user2_name) VALUES($1, $2) RETURNING id",
              [user1, user2],
              (err, result) => {
                if (result) {
                  var conv_id = result.rows[0]["id"]
                  db.query(
                    "INSERT INTO messages(sender_name, receiver_name, content, conversation_id) VALUES($1, $2, $3, $4)",
                    [user1, user2, content, conv_id],
                    (err, result) => {
                      if (result) {
                        console.log("Add message successful.");
                        res.json({result: conv_id});
                      } else if (err) {
                        console.log("Add message Error");
                        console.log(err);
                      }
                    }
                  );
                }
                else{
                  res.json({result: "-1"});
                } 
              }
            );
          } catch (err) {
            res.end(err);
          }
        }
      }
    );
  } catch (err) {
    res.end(err);
  }
});
//Get all conversations related to the request user
app.get('/conversations', (req, res) => {
  const  username  = req.session.username;
  console.log(username)
  try {
    db.query(
      "SELECT * from conversations WHERE user1_name = $1 OR user2_name = $1",
      [username],
      (err, result) => {
        console.log(username)
        console.log(result)
        if (result) {
          res.json({rows: result.rows});
        } else if (err) {
          res.json({status: "No conversation found"});
        }
      }
    );
  } catch (err) {
    console.log(err)
    res.end(err);
  }
});
//Get all messages related to the request conversation id
app.post('/messages', (req, res) => {
  console.log(req.body);
  const {id}  = req.body;
  try {
    db.query(
      "SELECT * from messages where conversation_id = $1",
      [id],
      (err, result) => {
        console.log(result);
        if (result) {
          res.json({ids: result.rows});
        } else if (err) {
          res.json({status: "No messages found"});
        }
      }
    );
  } catch (err) {
    console.log(err)
    res.end(err);
  }
});
app.post('/user', (req, res) => {
  console.log(req.body);
  const {username}  = req.body;
  try {
    db.query(
      "SELECT * from users where username = $1",
      [username],
      (err, result) => {
        console.log(result);
        if (result) {
          res.json({ids: result.rows});
        } else if (err) {
          res.json({status: "No user found found"});
        }
      }
    );
  } catch (err) {
    console.log(err)
    res.end(err);
  }
});
app.post('/findnearbyusers', (req, res) => {
  console.log(req.body);
  const {username, city, country}  = req.body;
  try {
    db.query(
      "SELECT * from users where city = $1 and country = $2 and username != $3 ",
      [city, country, username],
      (err, result) => {
        console.log(result);
        if (result) {
          res.json({ids: result.rows});
        } else if (err) {
          res.json({status: "No nearby users found"});
        }
      }
    );
  } catch (err) {
    console.log(err)
    res.end(err);
  }
});
app.post('/findallusers', (req, res) => {
  try {
    db.query(
      "SELECT * from users",
      (err, result) => {
        if (result) {
          res.json({ids: result.rows});
        } else if (err) {
          res.json({status: "No nearby users found"});
        }
      }
    );
  } catch (err) {
    console.log(err)
    res.end(err);
  }
});
app.post('/updatelocation', (req, res) => {
  console.log(req.body);
  const {username, city, country, lat , long}  = req.body;
  try {
    db.query(
      "UPDATE users SET city = $1,country = $2, lat = $4, long = $5 WHERE username = $3 RETURNING *",
      [city, country, username, lat, long],
      (err, result) => {
        console.log(result);
        if (result) {
          res.json({ids: result.rows});
        } else if (err) {
          res.json({status: "Update location failed"});
        }
      }
    );
  } catch (err) {
    console.log(err)
    res.end(err);
  }
});
app.post('/updatepassword', (req, res) => {
  console.log(req.body);
  const {username, password}  = req.body;
  try {
    bcrypt.hash(password, saltRounds, function(err, hash) {
      db.query(
        "UPDATE users SET password = $2 WHERE username = $1 RETURNING *",
        [username, hash],
        (err, result) => {
          if (result) {
            console.log("Successful password update.");
            res.json({ids: result.rows});
          } else if (err) {
            res.json({status: "Update password failed"});
            console.log(err);
          }
        }
      );
    });
  } catch (err) {
    console.log(err)
    res.end(err);
  }
});

// app.post('/addcomments', (req, res) => {
//   console.log(req.body);
//   const {topic_id, post_id, body, posted_by }  = req.body;
//   try {
//     db.query(
//       "INSERT INTO comments(post_id, body, posted_by) values($1, $2, $3) returning *",
//       [post_id, body, posted_by],
//       (err, result) => {
//         console.log(result);
//         if (result) {
//           res.json({ids: result.rows});
//         } else if (err) {
//           res.json({status: "Add comment failed"});
//         }
//       }
//     );
//   } catch (err) {
//     console.log(err)
//     res.end(err);
//   }
// });
// app.post('/getcomments', (req, res) => {
//   console.log(req.body);
//   const {post_id }  = req.body;
//   try {
//     db.query(
//       "SELECT * from comments where  post_id = $1",
//       [ post_id],
//       (err, result) => {
//         //console.log(result);
//         if (result) {
//           res.json({ids: result.rows});
//         } else if (err) {
//           res.json({status: "Get comments failed"});
//         }
//       }
//     );
//   } catch (err) {
//     console.log(err)
//     res.end(err);
//   }
// });
//Log-in; takes the user to post when successful
app.post("/api/loggedin", async (req, res) => {
  try {
    await db.query(
      "SELECT * from users WHERE username = $1",
      [req.body.username],
      (err, result) => {
        console.log(err);
        if (result.rowCount > 0) {
          if (result.rows[0].role != 'b') {
            // not banned
            bcrypt.compare(req.body.password, result.rows[0].password, function(err, result) {
              if (result) {
                req.session.username = req.body.username;
                req.session.loggedIn = true;
                res.json({ status: "success", url: "/post" });
              } else {
                res.json({
                  status: "failure",
                  message: `Password is not correct.`,
                });
              }
            });
          } else {
            //banned
            res.json({
              status: "failure",
              message: `You are banned.`,
            });
          }
        } else {
          res.json({
            status: "failure",
            message: `User ${req.body.username} does not exist`,
          });
        }
      }
    );
  } catch (err) {
    console.error(err);
    res.json({
      status: "error",
      message: "An error occurred while logging in",
    });
  }
});


// LOGOUT HANDLE
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.json("logged out!");
});

// TOPICS HANDLER
app.get("/api/topics", async (req, res) => {
  if (req.session.loggedIn) {
    try {
      const result = await db.query(
        "SELECT * from topics ORDER BY topic_id DESC"
      );
      console.log(result.rows);
      res.json({ topics: result.rows });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
});

// FORUM MAIN PAGE
app.get("/forum", async (req, res) => {
  if (req.session.username) {
    try {
      await db.query(
        "SELECT * from topics ORDER BY topic_id DESC",
        [],
        (err, result) => {
          res.render("forum", {
            username: req.session.username,
            topics: result.rows,
          });
        }
      );
    } catch (err) {
      res.end(err);
    }
  } else {
    res.render("unauthorized");
  }
});

// FORUM TOPICS PAGE
// JSON is sent, which is the difference from Vincent's code
app.post("/api/threads", async (req, res) => {
  if (req.session.username) {
    try {
      await db.query(
        "SELECT * from topics WHERE topic_id = $1",
        [req.body.topic_id],
        (err, result) => {
          if (result && result.rowCount == 1) {
            var topic = result.rows[0];
            try {
              db.query(
                "SELECT * from posts WHERE p_topic_id = $1 AND p_thread_id = -1 ORDER BY p_post_id DESC",
                [req.body.topic_id],
                (err, result2) => {
                  console.log("result2.rows")
                  console.log(result2.rows)
                  res.json({ topic: topic, threads: result2.rows });
                }
              );
            } catch (err) {
              res.status(500).json({ error: "Server error" });
            }
          } else {
            res.status(404).json({ error: "Topic not found" });
          }
        }
      );
    } catch (err) {
      res.status(500).json({ error: "Server error" });
    }
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
});



app.get("/search/:search_id", async (req, res) => {
  console.log("search!");
  if (req.session.username) {
    try {
      await db.query(
        "SELECT * from posts WHERE p_username = $1 AND p_thread_id = -1",
        [req.params.search_id],
        (err, result) => {
          console.log(result.rowCount);
          if(result.rowCount<=0){
            res.json({threads: "nothing!"});
          }
          else{
            res.json({ threads: result.rows});
          }
        }
      );
    } catch (err) {
      res.status(500).json({ error: "Server error" });
    }
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
});


// add threads
app.post("/api/add-thread", async (req, res) => {
  if (req.session.username) {
    try {
      await db.query(
        "SELECT * from users WHERE username = $1", 
        [req.session.username],
        (err, result) => {
          let country_code = "";
          if (result.rows[0].lat && result.rows[0].long) {
            let lat = result.rows[0].lat;
            let long = result.rows[0].long;
            axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${long}&zoom=3`).then(apiRes => {
              if(apiRes) {
                country_code = apiRes.data.address.country_code.toUpperCase()
                db.query(
                  "INSERT INTO posts(p_username, p_topic_id, p_text, t_subject, p_country_code) VALUES($1,$2,$3,$4,$5)",
                  [req.session.username, req.body.topic_id, req.body.content, req.body.subject, country_code],
                  (err, result) => {
                    res.json({ status: "success", url: "/home" });
                  }
                );
              }
            })
          } else {
            db.query(
              "INSERT INTO posts(p_username, p_topic_id, p_text, t_subject, p_country_code) VALUES($1,$2,$3,$4,$5)",
              [req.session.username, req.body.topic_id, req.body.content, req.body.subject, country_code],
              (err, result) => {
                res.json({ status: "success", url: "/home" });
              }
            );
          }
        }
      )
    } catch (err) {
      res.json({
        status: "error",
        message: "An error occurred while posting",
      });
    }
  } else {
    res.render("unauthorized");
  }
});


// fetch posts
app.post("/api/posts", async (req, res) => {
  if (req.session.username) {
    try {
      await db.query(
        "SELECT * from posts p LEFT JOIN Replies r ON r.parent_id = p.p_post_id WHERE p_post_id = $1 OR p_thread_id = $2 ORDER BY p_post_id ASC, r.reply_id ASC",
        [req.body.post_id,req.body.post_id],
        (err, result) => {
          console.log(result.rows[0]);
          res.json({ 
            thread: result.rows[0],
            posts: result.rows.slice(1)
          });
        }
      );
    } catch (err) {
      res.status(500).json({ error: "Server error" });
    }
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }

});



// add posts
app.post("/api/add-post", async (req, res) => {
  function find_replies(text) {
    const replyRegex = />>[0-9]+/g;
    const replyingTo = text.match( replyRegex );
    let replyingToSet = new Set( replyingTo );
    return replyingToSet
  }
  if (req.session.username) {
    
    try {
      await db.query(
        "SELECT * from users WHERE username = $1", 
        [req.session.username],
        (err, result) => {
          // console.log("START")
          let country_code = "";
          if (result.rows[0].lat && result.rows[0].long) {
            let lat = result.rows[0].lat;
            let long = result.rows[0].long;
            console.log("BEFORE")
            axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${long}&zoom=3`).then(apiRes => {
              if(apiRes && result.rows[0].lat !="" && result.rows[0].long != "") {
                console.log("MAIN")
                country_code = apiRes.data.address.country_code.toUpperCase()
                db.query(
                  "SELECT * FROM post_reply ($1, $2, $3, CAST($4 AS INTEGER), $5) as pid",
                  [req.session.username, req.body.topic_id, req.body.content, req.body.thread_id, country_code],
                  (err, result) => {
                    console.log([req.session.username, req.body.topic_id, req.body.content, req.body.thread_id, country_code])
                    // adding replies
                    let newPostId = result.rows[0].pid;
                    let replyingToSet = find_replies(req.body.content);
                    let replyQuery = "INSERT INTO Replies(parent_id, reply_id) VALUES($1, $2)";
                    replyingToSet.forEach((parentId) => {
                      db.query( replyQuery, [ parentId.slice(2), newPostId ], ( error, result ) => {
                      });
                    });
                    res.json({ status: "success", url: "/home" });
                  }
                );
              } 
            });
          } else {
            // console.log("ALT")
            db.query(
              "SELECT * FROM post_reply ($1, $2, $3, CAST($4 AS INTEGER), $5) as pid",
              [req.session.username, req.body.topic_id, req.body.content, req.body.thread_id, country_code],
              (err, result) => {
                console.log([req.session.username, req.body.topic_id, req.body.content, req.body.thread_id, country_code])
                // adding replies
                let newPostId = result.rows[0].pid;
                let replyingToSet = find_replies(req.body.content);
                let replyQuery = "INSERT INTO Replies(parent_id, reply_id) VALUES($1, $2)";
                replyingToSet.forEach((parentId) => {
                  db.query( replyQuery, [ parentId.slice(2), newPostId ], ( error, result ) => {
                  });
                });
                res.json({ status: "success", url: "/home" });
              }
            )
          }
        })
    } catch (err) {
      res.json({
        status: "error",
        message: "An error occurred while posting",
      });
    }
  } else {
    res.render("unauthorized");
  }
});

app.post("/api/delete-post", async(req, res) => {
  await db.query("DELETE FROM replies WHERE parent_id=$1 OR reply_id=$2",
  [req.body.post_id, req.body.post_id],
  (err0, result0) => {
    db.query(
      "DELETE FROM posts WHERE p_post_id=$1",
      [req.body.post_id],
      (err, result) => {
        console.log(result)
        if(result) {
          if (result.rowCount == 0) {
            res.json({"deleted": false})
          } else {
            res.json({"deleted": true})
          }
        }
      }
    )
  })
  
});

app.post("/api/ban-user", async(req, res) => {
  if (req.session.username) {
    await db.query(
      "SELECT * FROM users WHERE username =$1",
      [req.session.username],
      (err, result) => {
        if(result) {
          if(result.rows[0].role == 'a') {
            db.query(
              "UPDATE users SET role = 'b' WHERE username=$1",
              [req.body.user_id],
              (err, result) => {
                if (result.rowCount == 0) {
                  res.json({"error": "none", "banned": false})
                } else {
                  res.json({"error": "none", "banned": true})
                }
              }
            )
          } else {
            res.json({"error": "not admin"})
          }
        } else {
          res.json({"error": "server error"})
        }
    })
  }
});


app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist/planet-online/index.html"));
});

app.set("port", port);
const server = http.createServer(app);
app.listen(port, function () {
  console.log(`app running on port ${port}`);
});
