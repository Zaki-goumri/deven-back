import { Injectable } from '@nestjs/common';

@Injectable()
export class TeamInviteService {
  async create(participantId: number, teamId: number, dto: any) {}
  async update(participantId: number, teamId: number, dto: any) {}
  async remove(invitationId: number) {}
}
