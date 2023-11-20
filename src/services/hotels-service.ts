import { notFoundError, paymentRequiredError } from '@/errors';
import { enrollmentRepository, hotelsRepository, ticketsRepository } from '@/repositories';

async function getHotels(userId: number) {
  await checkEnrollmentAndTicketStatus(userId);
  const result = await hotelsRepository.getHotels();
  return result;
}

async function getHotelsById(userId: number, hotelId: number) {
  await checkEnrollmentAndTicketStatus(userId);
  const hotel = await hotelsRepository.getHotelsById(hotelId);
  if (!hotel) throw notFoundError();
  return hotel;
}

async function checkEnrollmentAndTicketStatus(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) {
    throw notFoundError();
  } else if (
    ticket.status === 'RESERVED' ||
    ticket.TicketType.includesHotel === false ||
    ticket.TicketType.isRemote === true
  ) {
    throw paymentRequiredError();
  }
}

export const hotelsService = {
  getHotels,
  getHotelsById,
};
