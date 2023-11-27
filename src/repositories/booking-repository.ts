import { prisma } from '@/config';

async function getBooking() {
    return await prisma.booking.findMany();
}

async function createBooking(userId: number, roomId: number) {
    return await prisma.booking.create({
        data: {
            userId,
            roomId
        }
    });
}

async function changeBooking() {
    return await prisma.booking.findMany();
}

async function checkRoomReservation(roomId: number) {
    return await prisma.booking.findMany({
        where: {
            roomId,
        }
    })
}

async function findRoom(roomId: number) {
    return await prisma.room.findUnique({
        where: {
            id: roomId,
        }
    })
  }

export const bookingRepository = {
    getBooking,
    createBooking,
    changeBooking,
    checkRoomReservation,
    findRoom
}