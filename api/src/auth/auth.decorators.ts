import { createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common';

export const IS_PUBLIC = 'isPublic';

/** Opts a route out of the global JWT guard. */
export const Public = () => SetMetadata(IS_PUBLIC, true);

export interface AuthUser {
  accountId: string;
  email: string;
}

export const CurrentUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): AuthUser => ctx.switchToHttp().getRequest().user,
);
