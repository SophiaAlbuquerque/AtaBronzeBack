import { Request, Response } from 'express';
import { BlingService } from '../services/BlingService';
import { logger } from '../config/logger';

export class BlingController {
  private blingService: BlingService;

  constructor() {
    this.blingService = new BlingService();
  }

  /**
   * Get OAuth authorization URL
   */
  async getAuthUrl(req: Request, res: Response): Promise<void> {
    try {
      const authUrl = this.blingService.getAuthorizationUrl();
      
      res.json({
        success: true,
        authUrl,
        message: 'Acesse o link para autorizar a integração com o Bling'
      });
    } catch (error: any) {
      logger.error('Error getting Bling auth URL', { error: error.message });
      res.status(500).json({
        success: false,
        message: 'Erro ao gerar URL de autorização'
      });
    }
  }

  /**
   * Handle OAuth callback
   */
  async handleCallback(req: Request, res: Response): Promise<void> {
    try {
      const { code, state } = req.query;

      if (!code) {
        res.status(400).json({
          success: false,
          message: 'Código de autorização não fornecido'
        });
        return;
      }

      const tokenData = await this.blingService.getAccessToken(code as string);
      
      res.json({
        success: true,
        message: 'Autorização realizada com sucesso',
        data: {
          expiresIn: tokenData.expires_in,
          scope: tokenData.scope
        }
      });
    } catch (error: any) {
      logger.error('Error handling Bling callback', { error: error.message });
      res.status(500).json({
        success: false,
        message: 'Erro ao processar autorização'
      });
    }
  }

  /**
   * Get authentication status
   */
  async getStatus(req: Request, res: Response): Promise<void> {
    try {
      const isAuthenticated = this.blingService.isAuthenticated();
      
      res.json({
        success: true,
        authenticated: isAuthenticated,
        message: isAuthenticated 
          ? 'Integração com Bling está ativa' 
          : 'Integração com Bling não está autorizada'
      });
    } catch (error: any) {
      logger.error('Error checking Bling status', { error: error.message });
      res.status(500).json({
        success: false,
        message: 'Erro ao verificar status da integração'
      });
    }
  }
}
