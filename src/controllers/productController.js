import prisma from "../prisma/client.js";

export const createProduct = async (req, res) => {
  try {
    const { bling_id, name, price, image_url } = req.body;

    if (!bling_id || !name) {
      return res.status(400).json({ error: "bling_id e name são obrigatórios." });
    }

    const product = await prisma.products.create({
      data: { bling_id, name, price, image_url }
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar produto." });
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await prisma.products.findMany();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar produtos." });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.products.delete({ where: { id: Number(id) } });
    res.json({ message: "Produto deletado com sucesso." });
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar produto." });
  }
};
