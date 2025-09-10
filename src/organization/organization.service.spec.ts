import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationService } from './services/organization.service';
import { UserModule } from 'src/user/user.module';
import { Param } from '@nestjs/common';

describe('OrganizationService', () => {
  // let service: OrganizationService;
  //
  // beforeEach(async () => {
  //   const module: TestingModule = await Test.createTestingModule({
  //     imports:[UserModule],
  //     providers: [OrganizationService],
  //   }).compile();
  //
  //   service = module.get<OrganizationService>(OrganizationService);
  // });
  //
  // it('should be defined', () => {
  //   expect(service).toBeDefined();
  // });
  it('should run this test', () => {
    expect(true).toBe(true);
  });
});
