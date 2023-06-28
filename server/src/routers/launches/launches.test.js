const request = require('supertest');
const app = require('../../app')
const { connectToDatabase, disconnect }  = require('../../services/mongo');

describe('Launches API', () => {
    beforeAll(async () => {
        await connectToDatabase();
    });

    afterAll(async () => {
        await disconnect();
    });

    describe('Test GET /launches', () => {
        test('It should respond with 200 success', async () => {
            await request(app)
                .get('/v1/launches')
                .expect('Content-Type', /json/)
                .expect(200);
        });
    });
    
    describe('Test POST /launch', () => {
        const launchData = {
            mission: 'USS Enterprise',
            rocket: 'NCC 1701-D',
            target: 'Kepler-62 f',
            launchDate: 'January 4, 2028'
        };
    
        const launchDataInvalidDate = {
            mission: 'USS Enterprise',
            rocket: 'NCC 1701-D',
            target: 'Kepler-62 f',
            launchDate: 'a'
        };
    
        const launchDataMissignDate = {
            mission: 'USS Enterprise',
            rocket: 'NCC 1701-D',
            target: 'Kepler-62 f',
        };
    
        test('It should respond with 201 success', async () => {
            const response = await request(app)
                .post('/v1/launches')
                .send(launchData)
                .expect('Content-Type', /json/)
                .expect(201);
    
            const requestDate = new Date(launchData.launchDate).valueOf();
            const responseDate = new Date(response.body.launchDate).valueOf();
    
            expect(requestDate).toBe(responseDate)
            expect(response.body).toMatchObject(launchDataMissignDate);
        })
    
        test('It should catch missing required properties', async () => {
            const response = await request(app)
                .post('/v1/launches')
                .send(launchDataMissignDate)
                .expect('Content-Type', /json/)
                .expect(400);
    
            expect(response.body).toStrictEqual({
                error: "Missing required property"
            });
        })
    
        test('It should catch invalid dates', async () => {
            const response = await request(app)
                .post('/v1/launches')
                .send(launchDataInvalidDate)
                .expect('Content-Type', /json/)
                .expect(400);
    
            expect(response.body).toStrictEqual({
                error: "Invalid date format"
            });
        });
    });
    
});