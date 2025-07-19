const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'workouts.json');
app.use(cors());
app.use(express.json());
function readWorkouts() { if (!fs.existsSync(DATA_FILE)) return []; return JSON.parse(fs.readFileSync(DATA_FILE,'utf8')||'[]'); }
function writeWorkouts(w){fs.writeFileSync(DATA_FILE,JSON.stringify(w,null,2));}
app.get('/api/workouts',(req,res)=>res.json(readWorkouts()));
app.post('/api/workouts',(req,res)=>{let w=readWorkouts();const nw={id:Date.now(),...req.body};w.unshift(nw);writeWorkouts(w);res.status(201).json(nw);});
app.delete('/api/workouts/:id',(req,res)=>{let w=readWorkouts().filter(x=>x.id!==+req.params.id);writeWorkouts(w);res.status(204).end();});
app.listen(PORT,()=>console.log(`Server on ${PORT}`));