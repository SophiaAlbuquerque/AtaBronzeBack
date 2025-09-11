import { Request, Response } from 'express';
import { UserService } from '../services/UserService';
import { userValidation } from '../utils/validation';
import { logger } from '../config/logger';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async register(req: Request, res: Response): Promise<void> {
    try {
      const { error, value } = userValidation.create.validate(req.body);
      if (error) {
        res.status(400).json({ error: error.details[0].message });
        return;
      }

      const user = await this.userService.createUser(value);
      res.status(201).json({
        message: 'Usuário criado com sucesso',
        user,
      });
    } catch (error: any) {
      logger.error('Error creating user', { error: error.message });
      res.status(400).json({ error: error.message });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { error, value } = userValidation.login.validate(req.body);
      if (error) {
        res.status(400).json({ error: error.details[0].message });
        return;
      }

      const authToken = await this.userService.login(value);
      res.json({
        message: 'Login realizado com sucesso',
        ...authToken,
      });
    } catch (error: any) {
      logger.error('Error during login', { error: error.message });
      res.status(401).json({ error: error.message });
    }
  }

  async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const user = await this.userService.getUserById(userId);
      
      if (!user) {
        res.status(404).json({ error: 'Usuário não encontrado' });
        return;
      }

      res.json({ user });
    } catch (error: any) {
      logger.error('Error getting user profile', { error: error.message });
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      const { error, value } = userValidation.update.validate(req.body);
      if (error) {
        res.status(400).json({ error: error.details[0].message });
        return;
      }

      const userId = (req as any).user.id;
      const user = await this.userService.updateUser(userId, value);
      
      res.json({
        message: 'Perfil atualizado com sucesso',
        user,
      });
    } catch (error: any) {
      logger.error('Error updating user profile', { error: error.message });
      res.status(400).json({ error: error.message });
    }
  }

  async getUsers(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const users = await this.userService.getUsers(page, limit);
      res.json({ users });
    } catch (error: any) {
      logger.error('Error getting users', { error: error.message });
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = await this.userService.getUserById(id);
      
      if (!user) {
        res.status(404).json({ error: 'Usuário não encontrado' });
        return;
      }

      res.json({ user });
    } catch (error: any) {
      logger.error('Error getting user by id', { error: error.message });
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.userService.deleteUser(id);
      res.json({ message: 'Usuário removido com sucesso' });
    } catch (error: any) {
      logger.error('Error deleting user', { error: error.message });
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}
