import app, { init } from "@/app";
import { cleanDb, generateValidToken } from "../helpers";
import supertest from "supertest";
import { prisma } from '@/config';
import httpStatus from 'http-status';
import faker from '@faker-js/faker';
import { createBooking, createEnrollmentWithAddress, createPayment, createTicket, createTicketType, createUser } from "../factories";
import * as jwt from 'jsonwebtoken';
import { TicketStatus } from "@prisma/client";
import { createHotel, createRoomWithHotelId } from "../factories/hotels-factory";

beforeAll(async () => {
    await init();
});

beforeEach(async () => {
    await cleanDb();
});

const server = supertest(app);

describe('POST /booking', () => {
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
        it('should respond with status 400 when body is missing', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const { status } = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({});
            expect(status).toBe(400);
        })

        it('should respond with status 400 when body is invalid', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const body = { [faker.lorem.word()]: faker.lorem.word() };
            const { status } = await server.post('/booking').set('Authorization', `Bearer ${token}`).send(body);
            expect(status).toBe(400);
        })

        describe('when body is valid', () => {
            it('should respond with status 201 and the bookingId', async () => {
                const user = await createUser();
                const token = await generateValidToken(user);
                const enrollment = await createEnrollmentWithAddress(user);
                const ticketType = await createTicketType(false, true);
                const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
                await createPayment(ticket.id, ticketType.price);
                const hotel = await createHotel();
                const room = await createRoomWithHotelId(hotel.id);

                const roomId = room.id;

                const { status, body } = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({ roomId });
                expect(status).toBe(201);
                expect(body).toEqual({
                    bookingId: expect.any(Number)
                })
            })
        })

    })
})

describe('POST /booking', () => {
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
        it('should respond with status 404 when user has not a booking', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const { status } = await server.get('/booking').set('Authorization', `Bearer ${token}`)
            expect(status).toBe(404);
        });
        it('should respond with status 200 and the user booking', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketType(false, true);
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            await createPayment(ticket.id, ticketType.price);
            const hotel = await createHotel();
            const room = await createRoomWithHotelId(hotel.id);
            const booking = await createBooking(user.id, room.id);

            const { status, body } = await server.get('/booking').set('Authorization', `Bearer ${token}`)
            expect(status).toBe(200);
            expect(body).toEqual({
                id: booking.id,
                userId: booking.userId,
                roomId: booking.roomId,
                createdAt: booking.createdAt.toISOString(),
                updatedAt: booking.updatedAt.toISOString(),
            })
        })
    })
})