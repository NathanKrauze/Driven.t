import { prisma } from '@/config';
import * as jwt from 'jsonwebtoken';
import app, { init } from '@/app';
import { cleanDb, generateValidToken } from '../helpers';
import supertest from 'supertest';
import httpStatus from 'http-status';
import faker from '@faker-js/faker';
import { createEnrollmentWithAddress, createTicket, createTicketType, createUser } from '../factories';
import { TicketStatus } from '@prisma/client';
import { createHotel } from '../factories/hotels-factory';
import { number, object } from 'joi';


beforeAll(async () => {
    await init();
});

beforeEach(async () => {
    await cleanDb();
});

const server = supertest(app);

describe('GET /hotels', () => {
    it('should respond with status 401 if no token is given', async () => {
        const response = await server.get('/hotels');

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();

        const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if there is no session for given token', async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

        const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe('when token is valid', () => {
        it('should respond with status 404 when there are no enrollment for the user', async () => {
            const user = await createUser()
            const token = await generateValidToken(user);

            const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(404);
        });
        it('should respond with status 404 when there are no ticket for the user', async () => {
            const user = await createUser()
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);

            const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(404);
        });
        it('should respond with status 402 when the ticket has not been paid yet', async () => {
            const user = await createUser()
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await prisma.ticketType.create({
                data: {
                  name: faker.name.findName(),
                  price: faker.datatype.number(),
                  isRemote: false,
                  includesHotel: true,
                },
              });
            await createTicket(enrollment.id, ticketType.id, "RESERVED")

            const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(402);
        });
        it('should respond with status 402 when the ticketType is remote', async () => {
            const user = await createUser()
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await prisma.ticketType.create({
                data: {
                  name: faker.name.findName(),
                  price: faker.datatype.number(),
                  isRemote: true,
                  includesHotel: true,
                },
              });
            await createTicket(enrollment.id, ticketType.id, "PAID")

            const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(402);
        });
        it('should respond with status 402 when the ticket does not include hotel', async () => {
            const user = await createUser()
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await prisma.ticketType.create({
                data: {
                  name: faker.name.findName(),
                  price: faker.datatype.number(),
                  isRemote: false,
                  includesHotel: false,
                },
              });
            await createTicket(enrollment.id, ticketType.id, "PAID")

            const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(402);
        });
        it('should respond with status 200 and with an empty array when there are no hotels data', async () => {
            const user = await createUser()
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await prisma.ticketType.create({
                data: {
                  name: faker.name.findName(),
                  price: faker.datatype.number(),
                  isRemote: false,
                  includesHotel: true,
                },
              });
            await createTicket(enrollment.id, ticketType.id, 'PAID')

            const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
            
            expect(response.status).toBe(200);
            expect(response.body).toEqual([])
        });
        it('should respond with status 200 and with existing hotels data', async () => {
            const user = await createUser()
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await prisma.ticketType.create({
                data: {
                  name: faker.name.findName(),
                  price: faker.datatype.number(),
                  isRemote: false,
                  includesHotel: true,
                },
              });
            await createTicket(enrollment.id, ticketType.id, 'PAID');
            const hotel = await createHotel();

            const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
            
            expect(response.status).toBe(200);
            expect(response.body).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        id: hotel.id,
                        name: hotel.name,
                        image: hotel.image,
                        createdAt: hotel.createdAt.toISOString(),
                        updatedAt: hotel.updatedAt.toISOString()
                    })
                ])
            )
        });
    })
})