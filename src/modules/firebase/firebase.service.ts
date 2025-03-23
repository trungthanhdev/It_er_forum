import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { getStorage } from 'firebase-admin/storage';
@Injectable()
export class FirebaseService {
    private bucket = admin.storage().bucket();

    async getSignedUrl(filePath: string): Promise<string> {
        const [url] = await this.bucket.file(filePath).getSignedUrl({
            action: 'read',
            expires: Date.now() + 60 * 60 * 1000, // URL hết hạn sau 1 giờ
        });
        return url;
    }
}
