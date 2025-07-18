import prisma from "../prisma/client.js";

export const createFavorite = async (req, res) => {
  try {
    const { user_id, product_id } = req.body;
    if (!user_id || !product_id) {
      return res.status(400).json({ error: "user_id e product_id são obrigatórios." });
    }

    const favorite = await prisma.favorites.create({
      data: { user_id, product_id }
    });

    res.status(201).json(favorite);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar favorito." });
  }
};

export const getFavorites = async (req, res) => {
  try {
    const { user_id } = req.params;
    const favorites = await prisma.favorite.findMany({
      where: { userId: Number(user_id) },
      include: { product: true }
    });
    res.json(favorites);
  } catch (error) {
    console.error("Erro no getFavorites:", error);
    res.status(500).json({ error: "Erro ao buscar favoritos." });
  }
};


export const deleteFavorite = async (req, res) => {
  try {
    const { user_id, product_id } = req.params;
    await prisma.favorites.delete({
      where: { user_id_product_id: { user_id: Number(user_id), product_id: Number(product_id) } }
    });
    res.json({ message: "Favorito removido com sucesso." });
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar favorito." });
  }
};
