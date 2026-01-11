import { NextFunction, Request, Response } from 'express';
import { supabase } from '../config/supabase';

export interface AuthRequest extends Request {
  user?: {
    uid: string;
    email?: string;
  };
}

export const verifyToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized: No token provided',
      });
      return;
    }

    const token = authHeader.split('Bearer ')[1];

    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data?.user) {
      console.error('[Auth Middleware] Supabase token verification failed:', error);
      res.status(401).json({
        success: false,
        error: 'Unauthorized: Invalid token',
      });
      return;
    }

    req.user = {
      uid: data.user.id,
      email: data.user.email || undefined,
    };
    next();
  } catch (error) {
    console.error('[Auth Middleware] Error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};
