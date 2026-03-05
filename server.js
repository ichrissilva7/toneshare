// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const User = require("./models/User");
const Timbre = require("./models/Timbre");

const app = express();
app.use(express.json());
app.use(cors());

// 🔹 Criar pasta uploads se não existir
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// 🔹 Configuração do Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});
const upload = multer({ storage });

// 🔹 Conexão MongoDB local
mongoose.connect("mongodb://127.0.0.1:27017/toneshare")
  .then(() => console.log("MongoDB conectado LOCAL"))
  .catch((err) => console.log("Erro ao conectar:", err));

// 🔹 Rota raiz
app.get("/", (req, res) => {
  res.send("Servidor funcionando 🚀");
});

// ================= REGISTER =================
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: "Email já cadastrado" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword
    });

    await user.save();

    res.status(201).json({ message: "Usuário criado com sucesso" });

  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Erro ao criar usuário" });
  }
});

// ================= LOGIN =================
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Usuário não encontrado" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: "Senha incorreta" });
    }

    const token = jwt.sign(
      { id: user._id },
      "segredo_super_secreto",
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login realizado com sucesso",
      token
    });

  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Erro ao fazer login" });
  }
});

// ================= AUTH MIDDLEWARE =================
function auth(req, res, next) {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  try {
    const decoded = jwt.verify(token, "segredo_super_secreto");
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ error: "Token inválido" });
  }
}

// ================= UPLOAD TIMBRES =================
app.post("/upload", auth, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Nenhum arquivo enviado" });
    }

    const { name, description } = req.body;

    const timbre = new Timbre({
      name,
      description,
      file: req.file.filename,
      user: req.userId
    });

    await timbre.save();

    res.json({ message: "Timbre enviado com sucesso" });

  } catch (error) {
    console.log("Erro no upload:", error);
    res.status(400).json({ error: "Erro no upload" });
  }
});

// ================= ROTA TESTE =================
app.get("/register", (req, res) => {
  res.send("Rota register está funcionando");
});

// 🔹 Iniciar servidor
app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});