import { forbiddenError, notFoundError } from "@/errors";
import { bookingRepository, enrollmentRepository, ticketsRepository } from "@/repositories";
import { TicketStatus } from "@prisma/client";


async function getBooking() {
    return ('get')
}

async function createBooking(roomId: number, userId: number) {
    await checkEnrollmentAndTicket(userId);
    await checkVacancy(roomId);
    const result = await bookingRepository.createBooking(userId, roomId);
    return result;
}

async function changeBooking() {
    return ('put')
}

async function checkVacancy(roomId: number){
    const room = await bookingRepository.findRoom(roomId);
    if(!room){
        throw notFoundError();
    }
    const roomReservation = await bookingRepository.checkRoomReservation(roomId);
    if(roomReservation.length === room.capacity) {
        throw forbiddenError();
    }
}

async function checkEnrollmentAndTicket(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw forbiddenError();

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) throw forbiddenError();

  const type = ticket.TicketType;

  if (ticket.status === TicketStatus.RESERVED || type.isRemote || !type.includesHotel) {
    throw forbiddenError();
  }
}

export const bookingService = {
    getBooking,
    createBooking,
    changeBooking,
}