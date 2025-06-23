import { Response } from '../utils/Response.js';


export class AuthController {
  constructor(authService, tokenService) {
    this.authService = authService;
    this.tokenService = tokenService;
  }

  register = async (req, res, next) => {
    try {
      const result = await this.authService.register(req.body);
      
      res.cookie('token', result.token, this.tokenService.createCookieOptions());
      
      res.status(201).json(
        Response.success('User registered successfully', { user: result.user })
      );
    } catch (error) {
      next(error);
    }
  };

  login = async (req, res, next) => {
    try {
      const result = await this.authService.login(req.body);
      
      res.cookie('token', result.token, this.tokenService.createCookieOptions());
      
      res.json(
        Response.success('Login successful', { user: result.user })
      );
    } catch (error) {
      next(error);
    }
  };

  logout = async (req, res, next) => {
    try {
      await this.authService.logout(req.user.userId);
      
      res.clearCookie('token');
      res.json(Response.success('Logout successful'));
    } catch (error) {
      next(error);
    }
  };

  getProfile = async (req, res, next) => {
    try {
      const user = await this.authService.getProfile(req.user.userId);
      res.json(Response.success('Profile retrieved', { user }));
    } catch (error) {
      next(error);
    }
  };
}
