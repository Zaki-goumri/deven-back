import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IndividualParticipant } from '../entities/indivudal-participant.entity';
import { Between, FindOptionsSelect, Repository } from 'typeorm';
import {
  PaginationDtoRes,
  PaginationQueryDto,
} from 'src/common/dtos/pagination.dto';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class IndividualParticipantService {
  constructor(
    @InjectRepository(IndividualParticipant)
    private readonly individualParticipantRepo: Repository<IndividualParticipant>,
  ) {}
  async createParticipant(userId: number, hackathonId: number) {
    const participant = this.individualParticipantRepo.create({
      hackathonId,
      userId,
    });
    await this.individualParticipantRepo.save(participant);
  }
  //TODO: need to implement seach and filters here
  async findAllParticipants(
    hackathonId: number,
    { take = 10, lastId = 0 }: PaginationQueryDto,
  ) {
    const participants = await this.individualParticipantRepo.find({
      where: {
        id: Between(lastId, lastId + take),
        hackathonId,
      },
      //priotity to the old one
      order: { createdAt: 'ASC' },
      relations: ['user'],
      select: {
        user: { ...IndividualParticipantService.getDisplayUserSelect() },
      },
    });
    const hasMore = participants.length === take;
    const newLastId =
      participants.length > 0
        ? participants[participants.length - 1].id
        : lastId;
    return new PaginationDtoRes(participants, take, newLastId, hasMore);
  }
  async removeParticipant(participantId: number) {
    const { affected } =
      await this.individualParticipantRepo.delete(participantId);
    if (!affected)
      throw new NotFoundException(
        `the participant with id ${participantId} is not found`,
      );
    return {
      success: true,
      message: `participant with id ${participantId} is removed successfully`,
    };
  }

  static getDisplayUserSelect(): FindOptionsSelect<User> {
    return {
      id: true,
      username: true,
      info: {
        firstName: true,
        lastName: true,
      },
    };
  }
}
