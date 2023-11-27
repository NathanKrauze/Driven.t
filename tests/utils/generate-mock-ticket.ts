import faker from "@faker-js/faker";
import { TicketStatus } from "@prisma/client";

export function generateMockTicket(
        enrollmentId: number,
        ticketStatus: TicketStatus, 
        isRemote: boolean, 
        includesHotel: boolean){
    return {
        id: faker.datatype.number(),
        status: ticketStatus,
        ticketTypeId: faker.datatype.number(),
        enrollmentId,
        TicketType: {
            id: faker.datatype.number(),
            name: faker.name.findName(),
            price: faker.datatype.number(),
            isRemote,
            includesHotel,
            createdAt: faker.date.recent(),
            updatedAt: faker.date.recent(),
        },
        createdAt: faker.date.recent(),
        updatedAt: faker.date.recent(),
    }
}