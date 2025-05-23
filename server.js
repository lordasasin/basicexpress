const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(express.json());

const file_path = "leaderboard.txt";

app.get('/list', (req, res) => {
  fs.readFile(file_path, 'utf8', (err, data) => {
    if (err) return res.status(500).send({ error: 'Error' });

    let leaderboard = [];
    if (data) {
      leaderboard = JSON.parse(data);
    }

    res.json(leaderboard);
  });
});


app.post('/list', (req, res) => {
  const { name, score } = req.body;

  if (!name || typeof score !== 'number') {
    return res.status(400).send({ error: 'Invalid name or score' });
  }

  fs.readFile(file_path, 'utf8', (err, data) => {
    let leaderboard = [];

    if (!err && data) {
      leaderboard = JSON.parse(data);
    }

    leaderboard.push({ name, score });

    fs.writeFile(file_path, JSON.stringify(leaderboard, null, 2), (err) => {
      if (err) return res.status(500).send({ error: 'Failed to write file' });

      res.send("Score Added");
    });
  });
});


app.listen(PORT, () => {
  console.log(`Server working on PORT : ${PORT}`);
});
