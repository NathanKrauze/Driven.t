import { TicketType, Ticket } from '@prisma/client';
import { ticketsRepository } from '@/repositories';
import { notFoundError } from '@/errors';

async function getTicketsTypes() {
  const result = await ticketsRepository.getTicketsTypes();
  return result;
}

async function getTickets(userId: number) {
  const enrollment = await ticketsRepository.findUserEnrollment(userId);
  if (!enrollment) {
    throw notFoundError();
  }
  const result = await ticketsRepository.getTickets(enrollment.id);
  if (!result) {
    throw notFoundError();
  }
  return result;
}

export type CreateTicket = Pick<Ticket, 'ticketTypeId'>;

export const ticketsSevice = {
  getTicketsTypes,
  getTickets,
};
