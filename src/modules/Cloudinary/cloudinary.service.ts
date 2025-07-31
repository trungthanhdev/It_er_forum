// src/modules/cloudinary/cloudinary.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

interface Cloudinary {
  uploader: {
    upload: (
      filePath: string,
      options?: { folder?: string; public_id?: string; overwrite?: boolean; transformation?: any[] },
    ) => Promise<UploadApiResponse>;
    upload_stream: (
      options: { folder?: string; public_id?: string; overwrite?: boolean; transformation?: any[]; resource_type?: string },
      callback: (error: UploadApiErrorResponse, result: UploadApiResponse) => void,
    ) => any;
  };
}

@Injectable()
export class CloudinaryService {
  constructor(@Inject('CLOUDINARY') private readonly cloudinary: Cloudinary) {}

  async uploadImage(
    file: Express.Multer.File | string,
    folder: string,
    publicId?: string,
  ): Promise<UploadApiResponse> {
    try {
      if (typeof file === 'string') {
        // Upload từ đường dẫn file (cho updateProfile)
        const result = await this.cloudinary.uploader.upload(file, {
          folder,
          public_id: publicId,
          overwrite: true,
          transformation: [{ width: 200, height: 200, crop: 'fill' }],
          // resource_type: 'image',
        });
        return result;
      } else {
        // Upload từ buffer (cho createPost)
        return new Promise((resolve, reject) => {
          const uploadStream = this.cloudinary.uploader.upload_stream(
            {
              folder,
              public_id: publicId,
              overwrite: true,
              // transformation: [{ width: 200, height: 200, crop: 'fill' }],
              resource_type: 'image',
            },
            (error, result) => {
              if (error) {
                console.error('Cloudinary upload error:', error);
                return reject(new Error(`Lỗi khi upload ảnh lên Cloudinary: ${error.message}`));
              }
              resolve(result);
            },
          );

          const { PassThrough } = require('stream');
          const bufferStream = new PassThrough();
          bufferStream.end(file.buffer);
          bufferStream.pipe(uploadStream);
        });
      }
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw new Error(`Lỗi khi upload ảnh lên Cloudinary: ${error.message}`);
    }
  }
}