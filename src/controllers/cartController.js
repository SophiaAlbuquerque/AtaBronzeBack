import prisma from "../prisma/client.js";

export const addItemToCart = async (req, res) => {
  try {
    const { user_id, product_id, quantity } = req.body;
    if (!user_id || !product_id || !quantity || quantity <= 0) {
      return res.status(400).json({ error: "user_id, product_id e quantity (maior que 0) são obrigatórios." });
    }

    // Verifica se item já existe no carrinho para esse usuário
    const existingItem = await prisma.cart_items.findFirst({
      where: { user_id, product_id }
    });

    if (existingItem) {
      // Atualiza quantidade
      const updatedItem = await prisma.cart_items.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity }
      });
      return res.json(updatedItem);
    }

    // Cria novo item no carrinho
    const newItem = await prisma.cart_items.create({
      data: { user_id, product_id, quantity }
    });

    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ error: "Erro ao adicionar item ao carrinho." });
  }
};

export const getCartItems = async (req, res) => {
  try {
    const { user_id } = req.params;
    const items = await prisma.cart_items.findMany({
      where: { user_id: Number(user_id) },
      include: { product: true }
    });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar itens do carrinho." });
  }
};

export const deleteCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.cart_items.delete({ where: { id: Number(id) } });
    res.json({ message: "Item removido do carrinho." });
  } catch (error) {
    res.status(500).json({ error: "Erro ao remover item do carrinho." });
  }
};
