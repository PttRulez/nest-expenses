import { SetMetadata } from '@nestjs/common';

export const AdminRoute = () => SetMetadata('ONLY_ADMIN', true);
