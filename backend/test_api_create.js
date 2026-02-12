const axios = require('axios');

const test = async () => {
    try {
        // First login to get token
        const loginRes = await axios.post('http://localhost:5000/api/auth/admin/login', {
            email: 'admin@portal.com',
            password: 'admin' // I assume this is the password based on typical seeds
        });
        const token = loginRes.data.token;
        console.log('Logged in, token received');

        // Now create upcoming hackathon
        const res = await axios.post('http://localhost:5000/api/upcoming-hackathons', {
            title: 'Automated Test ' + Date.now(),
            organization: 'TCE-TEST',
            description: 'Automated test description',
            registrationDeadline: '2026-12-01',
            hackathonDate: '2026-12-05',
            mode: 'Online',
            eventType: 'Hackathon',
            minCGPA: 7.5,
            minCredits: 20,
            allowedDepartments: JSON.stringify(['CSBS', 'CSE']),
            eligibleYears: JSON.stringify(['3rd', '4th'])
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        console.log('SUCCESS:', res.data.message);
    } catch (err) {
        console.error('FAILED:', err.response ? err.response.data : err.message);
    }
};

test();
