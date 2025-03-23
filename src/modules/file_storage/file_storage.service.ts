import { Injectable, Inject, RequestTimeoutException, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Bucket } from '@google-cloud/storage';
@Injectable()
export class FileStorageService {
    constructor(@Inject('FIREBASE_STORAGE') private readonly bucket: Bucket) {}

    async upload(file: Express.Multer.File, token: string): Promise<string> {
        try {
            console.log("Upload service POST");

            const fileName = `${uuidv4()}_${file.originalname}`;
            const fileRef = this.bucket.file(`uploads/${fileName}`)

            // Upload file lên Firebase Storage
            await fileRef.save(file.buffer, {
                metadata: { contentType: file.mimetype }
            });

            console.log("✅ Saved file to Firebase Storage");

            // Lấy URL của file
            const [url] = await fileRef.getSignedUrl({
                action: 'read',
                expires: '03-01-2030', 
            });

            return url;
        } catch (error) {
            console.error(error);
            throw new RequestTimeoutException("Upload failed");
        }
    }

    async delete(fileUrl: string): Promise<void> {
        try {
            const filePath = this.extractFilePath(fileUrl);
            
            if (!filePath) {
                throw new Error('Invalid file URL');
            }

            const file = this.bucket.file(filePath);

            // Kiểm tra file có tồn tại không
            const [exists] = await file.exists();
            if (!exists) {
                throw new NotFoundException(`File not found: ${fileUrl}`);
            }

            // Xóa file khỏi Firebase Storage
            await file.delete();
            console.log(`🗑️ File deleted successfully: ${fileUrl}`);
        } catch (error) {
            console.error(`❌ Error deleting file: ${fileUrl}`, error);
            throw new Error('Failed to delete file from Firebase Storage');
        }
    }

    private extractFilePath(fileUrl: string): string {
        // Nếu URL dạng: https://storage.googleapis.com/{bucket}/uploads/file.jpg
        const match = fileUrl.match(new RegExp(`https://storage.googleapis.com/${this.bucket.name}/(.*)`));
        return match ? match[1] : '';
    }
}
