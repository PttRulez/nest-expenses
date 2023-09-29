import { Role } from '@prisma/client';
import type { Session } from 'express-session';

type UserSessionData = { id: number; email: string; role: Role };

export type UserSession = Session & Record<'user', UserSessionData>;
