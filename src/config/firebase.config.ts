import * as admin from 'firebase-admin';
import { join } from 'path';

export const initFirebase = () => {
    if (!admin.apps.length) {
        const serviceAccount = require(join(process.cwd(), 'src/config/serviceAccountKey.json'));

        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });
    }

    return {
        firestore: admin.firestore(),
        auth: admin.auth(),
        storage: admin.storage(),
    };
};
