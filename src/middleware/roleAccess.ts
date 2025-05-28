import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/express';

type UserRole = 'admin' | 'hotel_owner' | 'customer';

export const requireRole = (allowedRoles: UserRole[]) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        const user = req.user;

        if (!user) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        if (!allowedRoles.includes(user.role as UserRole)) {
            return res.status(403).json({ 
                message: 'Access denied. Insufficient permissions.',
                requiredRoles: allowedRoles,
                currentRole: user.role
            });
        }

        next();
    };
};

// Specific role middleware
export const requireAdmin = requireRole(['admin']);
export const requireHotelOwner = requireRole(['hotel_owner', 'admin']);
export const requireCustomer = requireRole(['customer', 'admin']);

// Portal-specific middleware
export const requireAdminPortal = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
        return res.status(401).json({ message: 'Authentication required' });
    }

    if (user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admin portal only.' });
    }

    // Add portal context to request
    req.portal = 'admin';
    next();
};

export const requireHotelPortal = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
        return res.status(401).json({ message: 'Authentication required' });
    }

    if (user.role !== 'hotel_owner' && user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Hotel portal only.' });
    }

    // Add portal context to request
    req.portal = 'hotel';
    next();
};

export const requireCustomerPortal = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
        return res.status(401).json({ message: 'Authentication required' });
    }

    if (user.role !== 'customer' && user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Customer portal only.' });
    }

    // Add portal context to request
    req.portal = 'customer';
    next();
}; 