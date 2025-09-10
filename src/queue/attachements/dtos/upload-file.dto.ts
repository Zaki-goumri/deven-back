import { UploadingOptions } from 'src/cloudinary/types/upload-options.interface';

export class UploadFileDto {
  file: Express.Multer.File;
  options: UploadingOptions;
}
