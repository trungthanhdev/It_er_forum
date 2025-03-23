import { Module } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { FirebaseService } from './firebase.service';

@Module({
    providers: [
        {
          provide: 'FIREBASE_ADMIN',
          useFactory: () => {
            const app = admin.initializeApp({
              credential: admin.credential.cert(require('/Applications/IT_er_project/it_er_forum/to-do-list-6c37a-firebase-adminsdk-rf827-e1bed752fb.json')),
              storageBucket: "to-do-list-6c37a.firebasestorage.app",
            });
            console.log(' Firebase đã kết nối thành công!');
            return app;
          },
        },
        {
          provide: 'FIREBASE_STORAGE',
          useFactory: (app: admin.app.App) => {
            return app.storage().bucket();
          },
          inject: ['FIREBASE_ADMIN'],
        },
        FirebaseService,
      ],
      exports: ['FIREBASE_ADMIN','FIREBASE_STORAGE', FirebaseService],
})
export class FirebaseModule {}
