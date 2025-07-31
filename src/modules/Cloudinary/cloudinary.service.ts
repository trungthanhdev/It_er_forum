import { Injectable, Inject } from '@nestjs/common';
import { UploadApiResponse } from 'cloudinary';

interface Cloudinary {
  uploader: {
    upload: (
      file: string,
      options?: { folder?: string; public_id?: string; overwrite?: boolean; transformation?: any[] },
    ) => Promise<UploadApiResponse>;
  };
}

@Injectable()
export class CloudinaryService {
  constructor(@Inject('CLOUDINARY') private readonly cloudinary: Cloudinary) {}

  async uploadImage(filePath: string, folder: string, publicId: string): Promise<UploadApiResponse> {
    try {
      const result = await this.cloudinary.uploader.upload(filePath, {
        folder,
        public_id: publicId,
        overwrite: true,
        transformation: [{ width: 200, height: 200, crop: 'fill' }],
      });
      // console.log('Cloudinary result:', result);
      return result;
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw new Error(`Lỗi khi upload ảnh lên Cloudinary: ${error.message}`);
    }
  }
}