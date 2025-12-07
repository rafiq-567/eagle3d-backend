
import { auth } from './src/config/firebase'; 
import * as readline from 'readline';


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const setRole = async () => {
    rl.question('please give the uid for admin  ', async (uid) => {
        if (!uid) {
            console.error('no UID. rejected');
            rl.close();
            return;
        }

        try {
            
            await auth.setCustomUserClaims(uid, { role: 'admin' });
            
            
            await auth.revokeRefreshTokens(uid); 

            console.log(`\n is ok`);
            console.log('💡 Note: This user will now need to log in again for the new token to take effect.');
        } catch (error) {
            console.error('\n❌  error');
            console.error('detailed:', error);
        } finally {
            rl.close();
            process.exit(0);
        }
    });
};

setRole();