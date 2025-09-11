import { UserRepository } from '../repositories/UserRepository';
import { CreateUserInput, UpdateUserInput, LoginInput, AuthToken } from '../types/user';
import { hashPassword, comparePassword } from '../utils/password';
import { generateToken } from '../utils/jwt';
import { logger } from '../config/logger';

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async createUser(data: CreateUserInput): Promise<Omit<any, 'passwordHash'>> {
    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new Error('Usuário já existe com este email');
    }

    // Hash password
    const passwordHash = await hashPassword(data.password);

    // Create user
    const user = await this.userRepository.create({
      ...data,
      passwordHash,
    });

    logger.info('User created', { userId: user.id, email: user.email });

    // Return user without password
    const { passwordHash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async login(data: LoginInput): Promise<AuthToken> {
    // Find user by email
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw new Error('Credenciais inválidas');
    }

    // Check password
    const isPasswordValid = await comparePassword(data.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new Error('Credenciais inválidas');
    }

    // Generate token
    const token = generateToken({
      id: user.id,
      email: user.email,
    });

    logger.info('User logged in', { userId: user.id, email: user.email });

    const { passwordHash: _, ...userWithoutPassword } = user;
    return {
      token,
      user: userWithoutPassword,
    };
  }

  async getUserById(id: string): Promise<Omit<any, 'passwordHash'> | null> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      return null;
    }

    const { passwordHash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async updateUser(id: string, data: UpdateUserInput): Promise<Omit<any, 'passwordHash'>> {
    // Check if email is being updated and already exists
    if (data.email) {
      const existingUser = await this.userRepository.findByEmail(data.email);
      if (existingUser && existingUser.id !== id) {
        throw new Error('Email já está em uso');
      }
    }

    const user = await this.userRepository.update(id, data);
    logger.info('User updated', { userId: user.id, email: user.email });

    const { passwordHash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async deleteUser(id: string): Promise<void> {
    await this.userRepository.delete(id);
    logger.info('User deleted', { userId: id });
  }

  async getUsers(page: number = 1, limit: number = 10): Promise<Omit<any, 'passwordHash'>[]> {
    const skip = (page - 1) * limit;
    const users = await this.userRepository.findMany(skip, limit);
    
    return users.map(user => {
      const { passwordHash: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  }
}
