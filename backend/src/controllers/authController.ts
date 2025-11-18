import { Request, Response } from 'express';
import { UserModel } from '../models/User.js';
import { hashPassword, comparePassword, generateToken } from '../utils/auth.js';
import { AuthRequest } from '../middleware/auth.js';

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { email, password, firstName, lastName, company } = req.body;

      // Validation
      if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' });
      }

      // Check if user already exists
      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({ error: 'Email already registered' });
      }

      // Hash password and create user
      const hashedPassword = await hashPassword(password);
      const user = await UserModel.create(email, hashedPassword, firstName, lastName, company);

      // Generate token
      const token = generateToken(user.id);

      res.status(201).json({
        token,
        user: UserModel.toPublic(user),
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      // Validation
      if (!email || !password) {
        return res.status(400).json({ error: 'Missing email or password' });
      }

      // Find user
      const user = await UserModel.findByEmail(email);
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Verify password
      const isValid = await comparePassword(password, user.password);
      if (!isValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Generate token
      const token = generateToken(user.id);

      res.json({
        token,
        user: UserModel.toPublic(user),
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getProfile(req: AuthRequest, res: Response) {
    try {
      const user = await UserModel.findById(req.userId!);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({ user: UserModel.toPublic(user) });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async updateProfile(req: AuthRequest, res: Response) {
    try {
      const { firstName, lastName, company } = req.body;

      const user = await UserModel.update(req.userId!, {
        first_name: firstName,
        last_name: lastName,
        company,
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({ user: UserModel.toPublic(user) });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
