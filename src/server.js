import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
// import estoqueRoutes from "./routes/estoqueRoutes.js";
// import freteRoutes from "./routes/freteRoutes.js";
// import pagamentoRoutes from "./routes/pagamentoRoutes.js";
// import productRoutes from "./routes/productRoutes.js";
// import favoriteRoutes from "./routes/favoriteRoutes.js";
// import cartRoutes from "./routes/cartRoutes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API funcionando!");
});

app.use("/users", userRoutes);
app.use("/auth", authRoutes);
// app.use("/estoque", estoqueRoutes);
// app.use("/frete", freteRoutes);
// app.use("/pagamento", pagamentoRoutes);
// app.use("/products", productRoutes);
// app.use("/favorites", favoriteRoutes);
// app.use("/cart", cartRoutes);

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
