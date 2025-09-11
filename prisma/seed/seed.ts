import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../../src/utils/password';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // Create admin user
  const adminPassword = await hashPassword('admin123');
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@atabronze.com' },
    update: {},
    create: {
      name: 'Administrador',
      email: 'admin@atabronze.com',
      passwordHash: adminPassword,
    },
  });

  console.log('Admin user created:', adminUser.email);

  // Create sample products
  const sampleProducts = [
    {
      name: 'Produto Exemplo 1',
      description: 'Descrição do produto exemplo 1',
      price: 99.99,
      stock: 100,
      blingId: 'bling_001',
    },
    {
      name: 'Produto Exemplo 2',
      description: 'Descrição do produto exemplo 2',
      price: 149.99,
      stock: 50,
      blingId: 'bling_002',
    },
    {
      name: 'Produto Exemplo 3',
      description: 'Descrição do produto exemplo 3',
      price: 79.99,
      stock: 75,
    },
  ];

  for (const productData of sampleProducts) {
    const product = await prisma.product.upsert({
      where: { blingId: productData.blingId || `temp_${productData.name}` },
      update: {},
      create: productData,
    });
    console.log('Product created:', product.name);
  }

  // Create sample test user
  const testPassword = await hashPassword('test123');
  const testUser = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      name: 'Usuário Teste',
      email: 'test@example.com',
      passwordHash: testPassword,
    },
  });

  console.log('Test user created:', testUser.email);

  console.log('Database seed completed!');
}

main()
  .catch((e) => {
    console.error('Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
