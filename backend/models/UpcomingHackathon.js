const mongoose = require('mongoose');

const upcomingHackathonSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    eventType: {
        type: String,
        enum: ['Hackathon', 'Conference', 'Workshop', 'Seminar', 'Other'],
        default: 'Hackathon'
    },
    organization: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    minCGPA: {
        type: Number,
        default: 0
    },
    minCredits: {
        type: Number,
        default: 0
    },
    allowedDepartments: {
        type: [String],
        default: []
    },
    eligibleYears: {
        type: [String],
        default: []
    },
    posterPath: {
        type: String,
        required: false  // Temporarily optional for testing
    },
    registrationDeadline: {
        type: Date,
        required: true
    },
    hackathonDate: {
        type: Date,
        required: true
    },
    mode: {
        type: String,
        enum: ['Online', 'Offline', 'Hybrid'],
        default: 'Online'
    },
    location: {
        type: String,
        required: false
    },
    maxParticipants: {
        type: Number,
        default: 100
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('UpcomingHackathon', upcomingHackathonSchema);
