import { UploadingOptions } from 'src/cloudinary/cloudinary.service';

export class UploadFileDto {
  file: Express.Multer.File;
  options: UploadingOptions;
}
