const express = require("express");

const app = express();
app.use(express.json());

let projetos = [
  {
    id: "1",
    title: "Novo projeto",
    tasks: []
  }
];

let requisicoesTotais = 0;

app.use((req, res, next) => {
  requisicoesTotais++;
  console.log("requisicoes : " + requisicoesTotais);

  return next();
});

function checkProjectExists(req, res, next) {
  if (!req.params.id) {
    return res.status(400).json({ error: " id não informado " });
  }
  return next();
}

function checkProjectInArray(req, res, next) {
  const { id } = req.params;
  let projetoExistente = false;

  projetos.map(projeto => {
    if (projeto.id == id) {
      projetoExistente = projeto;
      req.projeto = projetoExistente;
    }
  });

  if (!projetoExistente) {
    return res.status(400).json({ error: " projeto não existente" });
  }

  return next();
}

app.get("/projects", (req, res) => {
  return res.json(projetos);
});

app.get(
  "/projects/:id",
  checkProjectExists,
  checkProjectInArray,
  (req, res) => {
    return res.json(req.projeto);
  }
);

app.post("/projects", (req, res) => {
  const projeto = req.body;
  projetos.push(projeto);
  return res.json(projetos);
});

app.put("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const projetoNovo = req.body;

  projetos.map(projeto => {
    if (projeto.id === id) {
      projeto.title = projetoNovo.title;
    }
  });

  return res.json(projetos);
});

app.delete("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;
  projetos = arrayRemove(projetos, id);
  return res.json(projetos);
});

app.put("/projects/:id/tasks", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const newTask = req.body;

  projetos.map(projeto => {
    if (projeto.id === id) {
      projeto.tasks.push(newTask);
    }
  });

  return res.json(projetos);
});

function arrayRemove(array, id) {
  return array.filter(function(item) {
    return item.id != id;
  });
}

var port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", function() {
  console.log("Listening on Port 3000");
});
