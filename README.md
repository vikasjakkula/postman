# Postman + Fetch Playground

A tiny full-stack project to **master every HTTP method** (GET, POST, PUT, PATCH, DELETE)
with **Express**, **Postman**, and the **fetch API**. The frontend is plain HTML/JS so you
can focus 100% on the backend + fetch logic you'll reuse in React.

## Run it

```bash
cd backend
npm install        # only needed once
npm start          # or: npm run dev  (auto-restarts on save)
```

Then open **http://localhost:5000** in your browser. The page calls the backend with
`fetch()` and prints the JSON. The exact fetch code for each method is in `index.html`.

## What's inside

| File          | What it does                                          |
| ------------- | ----------------------------------------------------- |
| `server.js`   | Express backend, all routes, fake in-memory "database" |
| `index.html`  | Frontend with one `fetch()` example per HTTP method   |

> The data lives in memory, so it **resets every time you restart the server**. That's fine for learning.

## API reference

Base URL: `http://localhost:5000`

| Method | Endpoint           | What it does                | Body (raw JSON)                       |
| ------ | ------------------ | --------------------------- | ------------------------------------- |
| GET    | `/api/health`      | Check the server is alive   | —                                     |
| GET    | `/api/tasks`       | List all tasks              | —                                     |
| GET    | `/api/tasks?done=true`   | Filter (query param)  | —                                     |
| GET    | `/api/tasks?search=post` | Search (query param)  | —                                     |
| GET    | `/api/tasks/:id`   | Get one task (route param)  | —                                     |
| POST   | `/api/tasks`       | Create a task               | `{ "title": "Buy milk" }`             |
| PUT    | `/api/tasks/:id`   | Replace a task (all fields) | `{ "title": "New", "done": true }`    |
| PATCH  | `/api/tasks/:id`   | Update part of a task       | `{ "done": true }`                    |
| DELETE | `/api/tasks/:id`   | Delete a task               | —                                     |
| GET    | `/api/headers`     | Echo your request headers   | —                                     |

## The 4 things every request can carry

1. **Route params** → part of the URL path: `/api/tasks/2` (the `2`)
2. **Query params** → after `?` in the URL: `/api/tasks?done=true`
3. **Headers** → metadata, e.g. `Content-Type: application/json`
4. **Body** → the data you send (only for POST / PUT / PATCH), as raw JSON

## Using Postman

1. Pick the method from the dropdown (GET, POST, PUT, PATCH, DELETE).
2. Paste the URL, e.g. `http://localhost:5000/api/tasks`.
3. For **query params** use the **Params** tab (key/value rows).
4. For a **body** (POST/PUT/PATCH): **Body → raw → JSON**, then type the JSON.
5. Hit **Send** and read the response + status code.

### Try this order in Postman
1. `GET /api/tasks` — see the 3 starter tasks
2. `POST /api/tasks` with `{ "title": "From Postman" }` — get a new id back (201 Created)
3. `GET /api/tasks/4` — read the one you just made
4. `PATCH /api/tasks/4` with `{ "done": true }` — flip it to done
5. `PUT /api/tasks/4` with `{ "title": "Replaced", "done": false }` — full replace
6. `DELETE /api/tasks/4` — remove it

## The fetch cheat sheet

```js
const API = "http://localhost:5000/api";

// GET (default)
const res = await fetch(`${API}/tasks`);
const data = await res.json();

// GET with query params
await fetch(`${API}/tasks?done=true&search=postman`);

// GET one (route param)
await fetch(`${API}/tasks/2`);

// POST / PUT / PATCH — need method + headers + body
await fetch(`${API}/tasks`, {
  method: "POST",                                  // or "PUT" / "PATCH"
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ title: "Buy milk" }),
});

// DELETE — just the method
await fetch(`${API}/tasks/2`, { method: "DELETE" });
```

That's the entire fetch surface you need for modern React projects.
```js
useEffect(() => { fetch(`${API}/tasks`).then(r => r.json()).then(setTasks); }, []);
```
# postman
# postman
