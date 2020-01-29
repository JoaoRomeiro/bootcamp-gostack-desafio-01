const express = require("express");

const server = express();

server.use(express.json());

/**
 * Middleware responsável por verificar se o projeto existe
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
function checkProject(req, res, next) {
    let index = projects.findIndex((obj => obj.id == req.params.id));

    if (!projects[index]) {
        return res.status(400).json({error: "Project does not exists"});
    }

    return next();
}

/**
 * Middleware responsável por contar o número de requisições
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
function contarRequisicoes(req, res, next) {
    console.count("Número de requisições");

    next();
}

server.use(contarRequisicoes);

/**
 * Array responsável por armazenar os projetos
 */
const projects = [];

/**
 * Cadastra um novo projeto
 */
server.post("/projects", (req, res) => {
    const { id, titulo } = req.body;

    projects.push({ id, titulo, tasks: [] });

    return res.json(projects);
});

/**
 * Lista todos os projetos cadastrados
 */
server.get("/projects", (req, res) => {
    return res.json(projects);
});

/**
 * Edita o titulo de um projeto
 */
server.put("/projects/:id", checkProject, (req, res) => {
    const { id } = req.params;
    const { titulo } = req.body;

    let index = projects.findIndex((obj => obj.id == id));

    projects[index].titulo = titulo;

    return res.json(projects);
});

/**
 * Exclui um projeto
 */
server.delete("/projects/:id", checkProject, (req, res) => {
    const { id } = req.params;

    let index = projects.findIndex((obj => obj.id == id));

    projects.splice(index, 1);

    return res.json(projects);
});

/**
 * Cadastra uma nova tarefa
 * Retornar todos os projetos cadastrados e suas respectivas tarefas
 */
server.post("/projects/:id/tasks", checkProject, (req, res) => {
    const { id } = req.params;
    const { tarefa } = req.body;

    let index = projects.findIndex((obj => obj.id == id));

    projects[index].tasks.push(tarefa);

    return res.json(projects);
});

server.listen(3000);