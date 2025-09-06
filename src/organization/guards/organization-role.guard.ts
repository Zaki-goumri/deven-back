import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { OrganizationService } from '../services/organization.service';
import { ExtendedRequest } from 'src/authentication/types/extended-req.type';
import { Reflector } from '@nestjs/core';
import {
  ORG_ROLE_KEY,
  OrganizationRoleType,
} from '../decorators/org-role.decorator';

@Injectable()
export class OrganizationRoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly organizationService: OrganizationService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<ExtendedRequest>();
    const userId = request.user.id;
    const orgId = parseInt(request.params['orgId'], 10);
    if (isNaN(orgId)) {
      return true; // If no orgId param, allow access
    }
    const allowedRoles = this.reflector.getAllAndOverride<
      OrganizationRoleType[]
    >(ORG_ROLE_KEY, [context.getHandler(), context.getClass()]);
    if (!allowedRoles || allowedRoles.length === 0) {
      return true; // If no roles specified, allow access
    }

    const { isMod, isOwner } = await this.organizationService.getUserRoles(
      orgId,
      userId,
    );
    return this.checkOveralapRoles(allowedRoles, isMod, isOwner);
  }
  // Helper method to check role overlap
  // In case we need later to add more complex role overlap check
  checkOveralapRoles(
    allowedRoles: OrganizationRoleType[],
    isMod: boolean,
    isOwner: boolean,
  ): boolean {
    if (isOwner) {
      return true; // Owners have full access
    }
    if (isMod) {
      return allowedRoles.includes('MODERATOR'); // Mods have access if 'mod' role is allowed
    }
    return false; // Deny access by default}
  }
}
