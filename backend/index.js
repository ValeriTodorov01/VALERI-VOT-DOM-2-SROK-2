// const express = require('express');
// const cors = require('cors');
// const app = express();
// const PORT = process.env.PORT || 5000;



// app.use(express.json());
// app.use(cors());


// let posts = [];

// // Get all posts
// app.get('/api/posts', (req, res) => {
//   res.json(posts);
// });

// // Create a post
// app.post('/api/posts', (req, res) => {
//   const { title } = req.body;
//   const newPost = { id: posts.length + 1, title };
//   posts.push(newPost);
//   res.status(201).json(newPost);
// });

// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));




const express = require('express');
const cors = require('cors');
const mariadb = require('mariadb');
const app = express();
const PORT = process.env.PORT || 5000;

const pool = mariadb.createPool({
    host: 'maxscale', // Replace with your MariaDB host
    user: 'admin',     // Replace with your MariaDB username
    password: 'admin', // Replace with your MariaDB password
    database: 'testdb', // Replace with your MariaDB database name
    connectionLimit: 5,         // Optional: limit the number of connections in the pool
    port: 3309,
    connectTimeout: 5000       // Optional: maximum time in milliseconds that pool will try to get connection before throwing error
});

app.use(express.json());
app.use(cors());


(async function initializeDatabase() {
    let conn;
    try {
      conn = await pool.getConnection();
      await conn.query(`
        CREATE TABLE IF NOT EXISTS posts (
          id INT AUTO_INCREMENT PRIMARY KEY,
          title VARCHAR(255) NOT NULL
        )
      `);
    } catch (err) {
      console.error('Error initializing database:', err);
    } finally {
      if (conn) conn.end();
    }
  })();


let posts = [];

// Get all posts
app.get('/api/posts', async (req, res) => {
    let conn;
    try {
      conn = await pool.getConnection();
      const rows = await conn.query('SELECT * FROM posts');
      // Convert BigInt to String
      const modifiedRows = rows.map(row => ({
        ...row,
        id: row.id.toString(), // Assuming `id` is the BigInt field
      }));
      res.json(modifiedRows);
    } catch (err) {
      console.error('Error fetching posts:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } finally {
      if (conn) conn.end();
    }
});

// Create a post
app.post('/api/posts', async (req, res) => {
    const { title } = req.body;
    let conn;
    try {
      conn = await pool.getConnection();
      const result = await conn.query('INSERT INTO posts (title) VALUES (?)', [title]);
      // Convert BigInt to String for `id`
      const newPost = { id: result.insertId.toString(), title }; // Assuming `insertId` is a BigInt
      res.status(201).json(newPost);
    } catch (err) {
      console.error('Error creating post:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } finally {
      if (conn) conn.end();
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
