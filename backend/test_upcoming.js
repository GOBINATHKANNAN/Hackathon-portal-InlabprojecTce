const mongoose = require('mongoose');
const dotenv = require('dotenv');
const UpcomingHackathon = require('./models/UpcomingHackathon');
const Admin = require('./models/Admin');

dotenv.config();

const test = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('DB Connected');

        const admin = await Admin.findOne();
        if (!admin) {
            console.log('No admin found');
            process.exit(1);
        }

        const data = {
            title: 'Test Event ' + Date.now(),
            organization: 'TCE',
            description: 'Test description',
            registrationDeadline: new Date(Date.now() + 86400000), // tomorrow
            hackathonDate: new Date(Date.now() + 172800000), // day after
            createdBy: admin._id,
            eventType: 'Hackathon',
            mode: 'Online'
        };

        const event = await UpcomingHackathon.create(data);
        console.log('Event Created Successfully:', event.title);
        process.exit(0);
    } catch (err) {
        console.error('FAILED TO CREATE EVENT:', err);
        process.exit(1);
    }
};

test();
