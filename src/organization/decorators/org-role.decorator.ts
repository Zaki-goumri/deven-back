import { SetMetadata } from '@nestjs/common';

export const OrganizationRole = {
  OWNER: 'owner',
  MODERATOR: 'moderator',
};
export type OrganizationRoleType = keyof typeof OrganizationRole;
export const ORG_ROLE_KEY = 'orgRole';
export const OrgRole = (...roles: OrganizationRoleType[]) =>
  SetMetadata(ORG_ROLE_KEY, roles);
