const express = require("express");
const cors = require("cors");

// const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

function logRequests(request, response, next) {
	const { method, url } = request;

	const log = `[${method}] - ${url}`;

	console.time(log);

	next();

	console.timeEnd(log);
}

app.use(logRequests);

const repositories = [];

app.get("/repositories", (request, response) => {
	return response.json(repositories);
});

app.post("/repositories", (request, response) => {
	repositories.push({ ...request.body, likes: 0 });

	return response.status(201).json(repositories);
});

app.put("/repositories/:id", (request, response) => {
	// TODO
});

app.delete("/repositories/:id", (request, response) => {
	// TODO
});

app.post("/repositories/:id/like", (request, response) => {
	// TODO
});

module.exports = app;
