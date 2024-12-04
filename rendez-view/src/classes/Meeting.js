import { db } from '../firebase';
import { doc, addDoc, collection, updateDoc } from 'firebase/firestore';

class Meeting {
    constructor(data) {
        this.meeting_id = data.meeting_id || null;
        this.title = data.title || '';
        this.date = data.date || '';
        this.startTime = data.startTime || '';
        this.endTime = data.endTime || '';
        this.location = data.location || '';
        this.accept = data.accept || false;
        this.userId = data.userId || null;
    }

    async save() {
        if (this.meeting_id) {
            // Update existing meeting
            await updateDoc(doc(db, 'events', this.meeting_id), {
                title: this.title,
                date: this.date,
                startTime: this.startTime,
                endTime: this.endTime,
                location: this.location,
                accept: this.accept,
                userId: this.userId,
                updatedAt: new Date().toISOString()
            });
        } else {
            // Create new meeting
            const docRef = await addDoc(collection(db, 'events'), {
                title: this.title,
                date: this.date,
                startTime: this.startTime,
                endTime: this.endTime,
                location: this.location,
                accept: this.accept,
                userId: this.userId,
                createdAt: new Date().toISOString()
            });
            this.meeting_id = docRef.id;
        }
        return this;
    }

    setAcceptance(status) {
        this.accept = status;
        return this.save();
    }

    getDetails() {
        return {
            meeting_id: this.meeting_id,
            title: this.title,
            date: this.date,
            startTime: this.startTime,
            endTime: this.endTime,
            location: this.location,
            accept: this.accept,
            userId: this.userId
        };
    }
}

export default Meeting;