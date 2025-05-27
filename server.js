const express = require('express');
const fs = require('fs').promises;
const app = express();
const PORT = 3000;

app.use(express.json());

const file_path = "leaderboard.txt";

app.get('/list', async (req, res) => {
  try {
    const data = await fs.readFile(file_path, 'utf8');
    const leaderboard = data ? JSON.parse(data) : [];
    res.json(leaderboard);
  } catch (err) {
    res.status(500).send({ error: 'Error reading leaderboard' });
  }
});

app.post('/list', async (req, res) => {
  try {
    const { name, score } = req.body;
    if (!name || typeof score !== 'number') {
      throw new Error('Invalid name or score');
    }

    const data = await fs.readFile(file_path, 'utf8').catch(() => '[]');
    const leaderboard = JSON.parse(data);
    leaderboard.push({ name, score });

    await fs.writeFile(file_path, JSON.stringify(leaderboard, null, 2));
    res.send('User Added');
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});


app.put('/list/:name', async (req, res) => {
  try {
    const userName = req.params.name;
    const { name, score } = req.body;

    const data = await fs.readFile(file_path, 'utf8').catch(() => '[]');
    const leaderboard = JSON.parse(data);
  
    
    leaderboard.push({ name, score });
    res.send('User Updated');

    } catch (err) {
    res.status(500).send({ error: err.message });
  }
});



app.delete('/list', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      throw new Error('Name is required');
    }

    const data = await fs.readFile(file_path, 'utf8');
    const leaderboard = JSON.parse(data);
    const filtered = leaderboard.filter(entry => entry.name !== name);

    if (filtered.length === leaderboard.length) {
      return res.status(404).send({ error: 'User not found' });
    }

    await fs.writeFile(file_path, JSON.stringify(filtered, null, 2));
    res.send('User deleted');
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server working on PORT : ${PORT}`);
});
