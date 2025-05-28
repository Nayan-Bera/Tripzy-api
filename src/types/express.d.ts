import { users } from '../db/schema/user';

declare global {
    namespace Express {
        interface Request {
            user?: typeof users.$inferSelect;
        }
    }
} 