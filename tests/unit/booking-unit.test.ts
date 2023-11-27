import { bookingRepository, enrollmentRepository, ticketsRepository } from "@/repositories";
import { bookingService } from "@/services";
import { generateCPF, getStates } from "@brazilian-utils/brazilian-utils";
import faker from "@faker-js/faker";
import { TicketStatus } from "@prisma/client";
import { generateMockTicket } from "../utils/generate-mock-ticket";


beforeEach(() => {
    jest.clearAllMocks();
})

describe('POST booking tests', () => {
    const mockEnrollment = {
        id: faker.datatype.number(),
        name: faker.name.findName(),
        cpf: generateCPF(),
        birthday: faker.date.past(),
        phone: faker.phone.phoneNumber('(##) 9####-####'),
        userId: faker.datatype.number(),
        createdAt: faker.date.recent(),
        updatedAt: faker.date.recent(),
        Address: [{
            id: faker.datatype.number(),
            street: faker.address.streetName(),
            cep: faker.address.zipCode(),
            city: faker.address.city(),
            neighborhood: faker.address.city(),
            number: faker.datatype.number().toString(),
            state: faker.helpers.arrayElement(getStates()).name,
            addressDetail: faker.lorem.words(5),
            enrollmentId: faker.datatype.number(),
            createdAt: faker.date.recent(),
            updatedAt: faker.date.recent(),
        }]
    }
    it("should throw error 403 when user don't have an enrollment", () => {
        const mockUserId = faker.datatype.number();
        jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockResolvedValueOnce(undefined);

        const promise = bookingService.checkEnrollmentAndTicket(mockUserId);
        expect(promise).rejects.toEqual({
            name: 'forbiddenError',
            message: 'Outside the business rule!'
        })
    })
    it("should throw error 403 when user don't have a ticket", () => {
        const mockUserId = faker.datatype.number();
        jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockResolvedValueOnce(mockEnrollment)
        jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockResolvedValueOnce(undefined);

        const promise = bookingService.checkEnrollmentAndTicket(mockUserId);
        expect(promise).rejects.toEqual({
            name: 'forbiddenError',
            message: 'Outside the business rule!'
        })
    })
    it("should throw error 403 when the ticket is not paid", () => {
        const mockUserId = faker.datatype.number();
        const mockTicket = generateMockTicket(mockEnrollment.id, TicketStatus.RESERVED, false, true)
        jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockResolvedValueOnce(mockEnrollment)
        jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockResolvedValueOnce(mockTicket);

        const promise = bookingService.checkEnrollmentAndTicket(mockUserId);
        expect(promise).rejects.toEqual({
            name: 'forbiddenError',
            message: 'Outside the business rule!'
        })
    })
    it("should throw error 403 when the ticket is remote", () => {
        const mockUserId = faker.datatype.number();
        const mockTicket = generateMockTicket(mockEnrollment.id, TicketStatus.PAID, true, true)
        jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockResolvedValueOnce(mockEnrollment)
        jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockResolvedValueOnce(mockTicket);

        const promise = bookingService.checkEnrollmentAndTicket(mockUserId);
        expect(promise).rejects.toEqual({
            name: 'forbiddenError',
            message: 'Outside the business rule!'
        })
    })
    it("should throw error 403 when the ticket doesn't include hotel", () => {
        const mockUserId = faker.datatype.number();
        const mockTicket = generateMockTicket(mockEnrollment.id, TicketStatus.RESERVED, false, false)
        jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockResolvedValueOnce(mockEnrollment)
        jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockResolvedValueOnce(mockTicket);

        const promise = bookingService.checkEnrollmentAndTicket(mockUserId);
        expect(promise).rejects.toEqual({
            name: 'forbiddenError',
            message: 'Outside the business rule!'
        })
    })
    it("should throw error 404 when the roomId does not match an existing room", () => {
        const mockRoomId = faker.datatype.number();
        jest.spyOn(bookingRepository, 'findRoom').mockResolvedValueOnce(undefined)

        const promise = bookingService.checkVacancy(mockRoomId);
        expect(promise).rejects.toEqual({
            name: 'NotFoundError',
            message: 'No result for this search!'
        })
    })
    it("should throw error 403 when the room has reached its maximum capacity", () => {
        const mockRoomId = faker.datatype.number();
        const mockRoom = {
            capacity: 1
        }
        const mockBooking = [{
            id: faker.datatype.number(),
            roomId: faker.datatype.number(),
            userId: faker.datatype.number(),
            createdAt: faker.date.recent(),
            updatedAt: faker.date.recent(),
        }]
        jest.spyOn(bookingRepository, 'findRoom').mockResolvedValueOnce(mockRoom);
        jest.spyOn(bookingRepository, 'checkRoomReservation').mockResolvedValueOnce(mockBooking)

        const promise = bookingService.checkVacancy(mockRoomId);
        expect(promise).rejects.toEqual({
            name: 'forbiddenError',
            message: 'Outside the business rule!'
        })
    })
})