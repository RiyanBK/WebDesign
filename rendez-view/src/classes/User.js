import { auth, db } from '../firebase';
import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs, addDoc } from 'firebase/firestore';

class User {
    // Core user data
    constructor(uid, email) {
        this.uid = uid;
        this.email = email;
        this.friends = [];
        this.permissions = [];
        this.schedule = [];
        this.location = '';
    }

    // Initialize user from Firebase Auth
    static async fromAuth(authUser) {
        const user = new User(authUser.uid, authUser.email);
        await user.loadUserData();
        return user;
    }

    // Load user data from Firestore
    async loadUserData() {
        const userDoc = await getDoc(doc(db, 'users', this.uid));
        if (userDoc.exists()) {
            const data = userDoc.data();
            this.friends = data.friends || [];
            this.permissions = data.permissions || [];
            this.schedule = data.schedule || [];
            this.location = data.location || '';
        }
    }

    // Friend management
    async addFriend(friendId) {
        if (!this.friends.includes(friendId)) {
            this.friends.push(friendId);
            await this.updateUserData();
            
            // Create friendship record
            await addDoc(collection(db, 'friendships'), {
                senderId: this.uid,
                receiverId: friendId,
                status: 'pending',
                createdAt: new Date().toISOString()
            });
        }
    }

    // Permission management
    async setPermission(friendId, level) {
        const permissionIndex = this.permissions.findIndex(p => p.friendId === friendId);
        if (permissionIndex > -1) {
            this.permissions[permissionIndex].level = level;
        } else {
            this.permissions.push({ friendId, level });
        }
        await this.updateUserData();
    }

    getPermission(friendId) {
        const permission = this.permissions.find(p => p.friendId === friendId);
        return permission ? permission.level : null;
    }

    // Schedule management
    async uploadSchedule(calendarData) {
        this.schedule = calendarData;
        await this.updateUserData();
    }

    async viewFriendSchedule(friendId) {
        const permission = this.getPermission(friendId);
        if (!permission) return null;

        const friendDoc = await getDoc(doc(db, 'users', friendId));
        return friendDoc.exists() ? friendDoc.data().schedule : null;
    }

    // Update user data in Firestore
    async updateUserData() {
        await updateDoc(doc(db, 'users', this.uid), {
            email: this.email,
            friends: this.friends,
            permissions: this.permissions,
            schedule: this.schedule,
            location: this.location
        });
    }

    // Static methods for user management
    static async createNewUser(authUser) {
        const user = new User(authUser.uid, authUser.email);
        await setDoc(doc(db, 'users', authUser.uid), {
            email: authUser.email,
            createdAt: new Date().toISOString(),
            friends: [],
            permissions: [],
            schedule: [],
            location: ''
        });
        return user;
    }
}

export default User;