export class CreateOrganizationDto {
  name: string;
  university?: string;
  description: string;
  links: createLinkDto[];
  location: CreateLocationDto;
}
export class createLinkDto {
  providerId: number;
  url: string;
}

export class CreateLocationDto {
  name: string;
  city?: string;
  mapsLink?: string;
}
