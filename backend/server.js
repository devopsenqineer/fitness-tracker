const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'workouts.json');

// Nur diese Domain erlauben
const allowedOrigins = ['https://fitness.salad1n.dev'];

app.use(cors({
  origin: function(origin, callback) {
    // Erlaube Anfragen ohne Origin (z.B. Postman, curl)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `Die CORS Policy für Origin ${origin} ist nicht erlaubt.`;
      return callback(new Error(msg), false);
    }

    return callback(null, true);
  }
}));

app.use(express.json());

function readWorkouts() {
  if (!fs.existsSync(DATA_FILE)) return [];
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8') || '[]');
}

function writeWorkouts(workouts) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(workouts, null, 2));
}

app.get('/api/workouts', (req, res) => res.json(readWorkouts()));

app.post('/api/workouts', (req, res) => {
  let workouts = readWorkouts();
  const newWorkout = { id: Date.now(), ...req.body };
  workouts.unshift(newWorkout);
  writeWorkouts(workouts);
  res.status(201).json(newWorkout);
});

app.delete('/api/workouts/:id', (req, res) => {
  let workouts = readWorkouts().filter(w => w.id !== +req.params.id);
  writeWorkouts(workouts);
  res.status(204).end();
});

app.listen(PORT, () => console.log(`Server on ${PORT}`));
