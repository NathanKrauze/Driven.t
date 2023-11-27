import { prisma } from '@/config';

async function findBookingByUserId(userId: number) {
    return await prisma.booking.findUnique({
        where: {
            userId,
        }
    });
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
        },
        select: {
            capacity: true
        }
    })
  }

export const bookingRepository = {
    findBookingByUserId,
    createBooking,
    changeBooking,
    checkRoomReservation,
    findRoom
}