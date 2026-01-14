# Sistema de Ponto Eletrônico (Fullstack)

![Badge em Desenvolvimento](http://img.shields.io/static/v1?label=STATUS&message=EM%20DESENVOLVIMENTO&color=GREEN&style=for-the-badge)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)

> Um sistema completo para gestão de jornada de trabalho, rodando 100% containerizado.

## Demonstração

![Sistema em funcionamento](./assets/demo.gif)
![Dashboard](./assets/dashboardDemo.gif)

### Funcionalidades

- Registro de ponto eletrônico (Entrada, Saída Almoço, Volta Almoço, Saída)
- Cadastro de funcionários
- Listagem de registros de ponto em tempo real
- **Exportação de relatórios em PDF e Excel**
- Dashboard gerencial com gráficos e estatísticas
- Edição e exclusão de registros de ponto
- Sistema de busca e filtros
- Paginação automática
- Interface responsiva e moderna com Tailwind CSS
- Notificações toast para feedback de ações
- Validação de formulários
- Sistema totalmente containerizado com Docker

### Tecnologias Utilizadas

Este projeto foi desenvolvido com foco em arquitetura moderna e escalável:

- **Frontend:** React + Vite + TypeScript
- **Estilização:** Tailwind CSS
- **Backend:** Node.js + Express + TypeScript
- **Banco de Dados:** PostgreSQL
- **ORM:** Prisma
- **Infraestrutura:** Docker & Docker Compose

### Como rodar o projeto

Você só precisa ter o **Docker** instalado. Não é necessário instalar Node ou Banco de Dados na sua máquina.

1. Clone o repositório:

```bash
git clone https://github.com/PauloHenriqueJunio/sistema-ponto.git
cd sistema-ponto
```

2. Suba os containers:

```bash
docker compose up -d
```

> **As migrations do banco são aplicadas automaticamente na inicialização!**

3. Acesse a aplicação:
   - **Frontend:** http://localhost:5173
   - **Backend:** http://localhost:3000
   - **Banco de Dados:** localhost:5432

### Comandos Úteis

**Parar os containers:**

```bash
docker compose down
```

**Ver logs:**

```bash
docker compose logs -f
```

**Reiniciar um serviço específico:**

```bash
docker compose restart frontend
docker compose restart backend
```

**Acessar o banco de dados:**

```bash
docker compose exec db psql -U admin -d pontodb
```

**Criar nova migration (apenas se necessário):**

```bash
docker compose exec backend npx prisma migrate dev --name nome_da_migration
```

### API - Rotas Disponíveis

#### Usuários

**GET** `/users`

- Lista todos os usuários cadastrados
- Resposta: `200 OK`

```json
[
  {
    "id": 1,
    "name": "João Silva",
    "email": "joao@email.com",
    "role": "FUNCIONARIO",
    "createdAt": "2025-12-27T10:00:00.000Z"
  }
]
```

**POST** `/users`

- Cria um novo usuário
- Body:

```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "123456",
  "role": "FUNCIONARIO"
}
```

- Resposta: `201 Created`

#### Pontos

**GET** `/pontos`

- Lista todos os registros de ponto
- Resposta: `200 OK`

```json
[
  {
    "id": 1,
    "userId": 1,
    "type": "ENTRADA",
    "timestamp": "2025-12-27T08:00:00.000Z",
    "user": {
      "name": "João Silva"
    }
  }
]
```

**POST** `/pontos`

- Registra um novo ponto
- Body:

```json
{
  "userId": 1,
  "type": "ENTRADA"
}
```

- Tipos válidos: `ENTRADA`, `SAIDA_ALMOCO`, `VOLTA_ALMOCO`, `SAIDA`
- Resposta: `201 Created`

### Estrutura do Projeto

```
sistema-ponto/
├── backend/
│   ├── src/
│   │   └── server.ts
│   ├── prisma/
│   │   └── schema.prisma
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── Dockerfile
│   └── package.json
└── docker-compose.yml
```

### Desenvolvimento Local

Para desenvolvimento sem Docker:

**Backend:**

```bash
cd backend
npm install
npx prisma migrate dev
npm run dev
```

**Frontend:**

```bash
cd frontend
npm install
npm run dev
```

### Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'feat: Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

### Licença

Este projeto está sob a licença MIT.

### Autor

Feito por **Paulo Henrique**

##

[![Linkedin Badge](https://img.shields.io/badge/-Paulo_Henrique-blue?style=flat-square&logo=Linkedin&logoColor=white&link=LINK_DO_SEU_LINKEDIN)](https://www.linkedin.com/in/paulo-henrique-junio/)
[![Gmail Badge](https://img.shields.io/badge/-paulohenriquejunio@hotmail.com-c14438?style=flat-square&logo=Gmail&logoColor=white&link=mailto:paulohenriquejunio@hotmail.com)](mailto:paulohenriquejunio@hotmail.com)
