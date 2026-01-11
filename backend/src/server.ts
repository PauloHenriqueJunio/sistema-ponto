import express from "express";
import cors from "cors";
import { prisma } from "./lib/prisma";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend do Ponto Eletrônico rodando!");
});

app.get("/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar usuários" });
  }
});

app.post("/users", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password,
        role: role || "FUNCIONARIO",
      },
    });

    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Erro ao criar usuário (Email já existe?)" });
  }
});

app.post("/pontos", async (req, res) => {
  try {
    const { userId, type } = req.body;

    if (!userId || !type) {
      return res.status(400).json({
        error: "UserId e Type são obrigatórios",
      });
    }

    const ponto = await prisma.ponto.create({
      data: {
        userId: Number(userId),
        type: type,
      },
    });
    res.status(201).json(ponto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao registrar ponto" });
  }
});

app.get("/pontos", async (req, res) => {
  const MAX_LIMIT = 100;
  const DEFAULT_LIMIT = 10;
  const DEFAULT_PAGE = 1;

  let page = parseInt(String(req.query.page || ''), 10);
  if (isNaN(page) || page < 1) {
    page = DEFAULT_PAGE;
  }

  let limit = parseInt(String(req.query.limit || ''), 10);
  if (isNaN(limit) || limit < 1) {
    limit = DEFAULT_LIMIT;
  }
  if (limit > MAX_LIMIT) {
    limit = MAX_LIMIT;
  }

  const skip = (page - 1) * limit;

  try {
    const pontos = await prisma.ponto.findMany({
      include: { user: true },
      orderBy: { timestamp: "desc" },
      take: limit,
      skip: skip,
    });

    const total = await prisma.ponto.count();

    res.json({
      data: pontos,
      total,
      paginaAtual: page,
      totalPaginas: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar pontos. Verifique sua conexão ou tente novamente." });
  }
});

app.delete("/pontos/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.ponto.delete({
      where: { id: Number(id) },
    });

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao excluir registro" });
  }
});

app.put("/pontos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.body;

    const ponto = await prisma.ponto.update({
      where: { id: Number(id) },
      data: { type },
    });

    res.json(ponto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao atualizar registro" });
  }
});

app.get("/stats", async (req, res) => {
  try {
    const porTipo = await prisma.ponto.groupBy({
      by: ["type"],
      _count: { type: true },
    });

    const porUsuario = await prisma.user.findMany({
      select: {
        name: true,
        _count: {
          select: { pontos: true },
        },
      },
    });
    const totalRegistro = await prisma.ponto.count();
    const totalUsuarios = await prisma.user.count();

    res.json({
      pizza: porTipo.map((item) => ({
        name: item.type,
        value: item._count.type,
      })),
      barras: porUsuario.map((user) => ({
        nome: user.name,
        registros: user._count.pontos,
      })),
      resumo: {
        totalRegistro,
        totalUsuarios,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar estatísticas" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
