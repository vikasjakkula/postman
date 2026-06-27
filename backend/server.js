// =============================================================
//  POSTMAN + EXPRESS LEARNING BACKEND
//  Master every HTTP method: GET, POST, PUT, PATCH, DELETE
//  Run:  node server.js   (or: npm start)
//  Open: http://localhost:5000
// =============================================================

const express = require('express');
const path = require('path');

const app = express();
const PORT = 5000;

// ---- MIDDLEWARE -------------------------------------------------
// 1) Parse JSON bodies. In Postman: Body -> raw -> JSON.
//    In fetch: headers {'Content-Type':'application/json'} + JSON.stringify(body)
app.use(express.json());

// 2) Serve the frontend (index.html) from the same origin -> no CORS issues.
app.use(express.static(__dirname));

// 3) Tiny logger so you SEE every request that hits the server.
app.use((req, res, next) => {
  console.log(`${req.method}  ${req.url}`);
  next();
});

// ---- FAKE DATABASE (in memory; resets when server restarts) ----
let tasks = [
  { id: 1, title: 'Learn GET requests', done: true },
  { id: 2, title: 'Learn POST requests', done: false },
  { id: 3, title: 'Master Postman', done: false },
];
let nextId = 4;

// =============================================================
//  ROUTES  —  all live under /api
// =============================================================

// HEALTH CHECK — simplest possible GET. Try in browser or Postman.
// GET http://localhost:5000/api/health
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is alive', time: new Date() });
});

// READ ALL — GET with optional QUERY PARAMS.
// GET http://localhost:5000/api/tasks
// GET http://localhost:5000/api/tasks?done=true        (filter)
// GET http://localhost:5000/api/tasks?search=postman   (search title)
// In Postman: use the "Params" tab. In fetch: add ?key=value to the URL.
app.get('/api/tasks', (req, res) => {
  const { done, search } = req.query;
  let result = [...tasks];

  if (done === 'true') result = result.filter((t) => t.done === true);
  if (done === 'false') result = result.filter((t) => t.done === false);
  if (search) {
    result = result.filter((t) =>
      t.title.toLowerCase().includes(search.toLowerCase())
    );
  }

  res.json({ count: result.length, tasks: result });
});

// READ ONE — GET with a ROUTE PARAM (:id is part of the URL path).
// GET http://localhost:5000/api/tasks/2
app.get('/api/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find((t) => t.id === id);
  if (!task) return res.status(404).json({ error: `No task with id ${id}` });
  res.json(task);
});

// CREATE — POST with a JSON BODY.
// POST http://localhost:5000/api/tasks
// Body (raw JSON):  { "title": "Buy milk" }
app.post('/api/tasks', (req, res) => {
  const { title, done } = req.body;
  if (!title) return res.status(400).json({ error: 'title is required' });

  const task = { id: nextId++, title, done: done === true };
  tasks.push(task);
  res.status(201).json(task); // 201 = Created
});

// REPLACE — PUT replaces the WHOLE object (you must send every field).
// PUT http://localhost:5000/api/tasks/2
// Body (raw JSON):  { "title": "Updated title", "done": true }
app.put('/api/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1)
    return res.status(404).json({ error: `No task with id ${id}` });

  const { title, done } = req.body;
  if (!title) return res.status(400).json({ error: 'title is required (PUT replaces everything)' });

  tasks[index] = { id, title, done: done === true };
  res.json(tasks[index]);
});

// UPDATE PART — PATCH changes only the fields you send.
// PATCH http://localhost:5000/api/tasks/2
// Body (raw JSON):  { "done": true }
app.patch('/api/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find((t) => t.id === id);
  if (!task) return res.status(404).json({ error: `No task with id ${id}` });

  if (req.body.title !== undefined) task.title = req.body.title;
  if (req.body.done !== undefined) task.done = req.body.done === true;
  res.json(task);
});

// DELETE — remove one task.
// DELETE http://localhost:5000/api/tasks/2
app.delete('/api/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1)
    return res.status(404).json({ error: `No task with id ${id}` });

  const [removed] = tasks.splice(index, 1);
  res.json({ message: 'Deleted', task: removed });
});

// BONUS — echo request HEADERS back (great for learning Postman Headers tab).
// GET http://localhost:5000/api/headers   (add custom headers and see them here)
app.get('/api/headers', (req, res) => {
  res.json({ yourHeaders: req.headers });
});

// ---- START ------------------------------------------------------
app.listen(PORT, () => {
  console.log(`Server running -> http://localhost:${PORT}`);
});
