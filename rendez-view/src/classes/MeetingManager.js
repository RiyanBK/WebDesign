import { db } from '../firebase';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import Meeting from './Meeting';

class MeetingManager {
    constructor(user) {
        this.user = user;
    }

    async pickMeeting(meetings) {
        // P2: AI-driven meeting suggestion will be implemented here
        // Currently returns first available meeting
        return meetings.length > 0 ? meetings[0] : null;
    }

    async confirmMeeting(meeting) {
        if (!meeting.accept) {
            throw new Error('Meeting must be accepted before confirming');
        }

        const meetingDetails = meeting.getDetails();
        await addDoc(collection(db, 'confirmedMeetings'), {
            ...meetingDetails,
            confirmedAt: new Date().toISOString(),
            confirmedBy: this.user.uid
        });

        return meeting;
    }

    async getUserMeetings() {
        const eventsRef = collection(db, 'events');
        const q = query(eventsRef, where('userId', '==', this.user.uid));
        const querySnapshot = await getDocs(q);
        
        return querySnapshot.docs.map(doc => 
            new Meeting({ meeting_id: doc.id, ...doc.data() })
        );
    }

    async createMeeting(meetingData) {
        const meeting = new Meeting({
            ...meetingData,
            userId: this.user.uid
        });
        return meeting.save();
    }
}

export default MeetingManager;