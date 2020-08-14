const express = require('express');
const cors = require('cors');

const { uuid } = require('uuidv4');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get('/repositories', (request, response) => {
  const { title } = request.query
  const results = title ? repositories.filter(repository => repository.title.toLowerCase().includes(title.toLowerCase())) : repositories

  response.json(results)
});

app.post('/repositories', (request, response) => {
  const { title, url, techs } = request.body

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }

  repositories.push(repository)

  response.json(repository)
});

app.put('/repositories/:id', (request, response) => {
  const { id } = request.params
  const { title, url, techs } = request.body

  const repositoryIndex = repositories.findIndex(repository => repository.id === id)

  if (repositoryIndex < 0) {
    return response.status(400).json({ message: 'Repository not found' })
  }

  let repository = repositories[repositoryIndex]

  repository = {
    id,
    title: title || repository.title,
    url: url || repository.url,
    techs: techs || repository.techs,
    likes: repository.likes
  }

  repositories[repositoryIndex] = repository

  response.json(repository)
});

app.delete('/repositories/:id', (request, response) => {
  const { id } = request.params

  const repositoryIndex = repositories.findIndex(repository => repository.id === id)

  if (repositoryIndex < 0) {
    return response.status(400).json({ message: 'Repository not found' })
  }

  repositories.splice(repositoryIndex, 1)

  response.status(204).send()
});

app.post('/repositories/:id/like', (request, response) => {
  const { id } = request.params

  const repositoryIndex = repositories.findIndex(repository => repository.id === id)

  if (repositoryIndex < 0) {
    return response.status(400).json({ message: 'Repository not found' })
  }

  repositories[repositoryIndex].likes += 1

  response.json(repositories[repositoryIndex])
});

module.exports = app;
