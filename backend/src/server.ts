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
  try {
    const pontos = await prisma.ponto.findMany({
      take: 10,
      orderBy: { timestamp: "desc" },
      include: { user: true },
    });
    res.json(pontos);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar históricos" });
  }
});

app.delete('/pontos/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.ponto.delete({
      where: { id: Number(id) },
    });

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao excluir registro' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
