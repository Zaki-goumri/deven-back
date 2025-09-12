import { BadRequestException } from '@nestjs/common';

export const ensureHackathonNotStarted = (startDate: Date) => {
  if (startDate <= new Date()) {
    throw new BadRequestException(
      'Cannot kick members after hackathon has started',
    );
  }
};

export const ensureCodeMatches = (teamCode: string, insertCode: string) => {
  if (teamCode !== insertCode) {
    throw new BadRequestException('Invalid code');
  }
};

export const ensureRegistrationOpen = (hackathonRegistrationDate: Date) => {
  if (new Date(hackathonRegistrationDate) < new Date()) {
    throw new BadRequestException('Registration is closed');
  }
};
