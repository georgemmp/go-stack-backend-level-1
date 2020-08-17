const express = require("express");
const { uuid, isUuid } = require("uuidv4");

const cors = require("cors");

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

function checkId(request, response, next) {
	const { id } = request.params;

	const isValid = isUuid(id);

	if (!isValid) {
		return response.status(400).json({ error: "Not is uuid" });
	}

	return next();
}

// app.use(logRequests);
// app.use("/repositories/:id", checkId);

const repositories = [];

app.get("/repositories", (request, response) => {
	return response.json(repositories);
});

app.post("/repositories", (request, response) => {
	const { title, url, techs } = request.body;

	const repository = {
		id: uuid(),
		title,
		url,
		techs,
		likes: 0,
	};

	repositories.push(repository);

	return response.status(201).json(repository);
});

app.put("/repositories/:id", (request, response) => {
	const { id } = request.params;

	const index = repositories.findIndex((item) => item.id === id);

	if (index < 0) {
		return response.status(404).json({ error: "Repository not found" });
	}

	const repository = repositories[index];

	return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
	const { id } = request.params;

	const index = repositories.findIndex((item) => item.id === id);

	if (index < 0) {
		return response.status(404).json({ error: "Repository not found" });
	}

	repositories.splice(index, 1);

	return response.status(204).json();
});

app.post("/repositories/:id/like", (request, response) => {
	const { id } = request.params;

	const index = repositories.findIndex((item) => item.id === id);

	if (index < 0) {
		return response.status(404).json({ error: "Repository not found" });
	}

	const repository = repositories[index];

	const likes = repository.likes + 1;

	repositories.splice(index, 1);
	repositories.splice(index, 0, { ...repository, likes });

	const liked = repositories[index];

	return response.json(liked);
});

module.exports = app;
