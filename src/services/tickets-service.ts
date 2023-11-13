import { TicketType, Ticket } from '@prisma/client';
import { ticketsRepository } from '@/repositories';
import { notFoundError } from '@/errors';

async function getTicketsTypes() {
  const result = await ticketsRepository.getTicketsTypes();
  return result;
}

async function findUserEnrollment(userId: number) {
  const enrollment = await ticketsRepository.findUserEnrollment(userId);
  if (!enrollment) {
    throw notFoundError();
  }
  return enrollment;
}

async function getTickets(userId: number) {
  const enrollment = await findUserEnrollment(userId);
  const result = await ticketsRepository.getTickets(enrollment.id);
  if (!result) {
    throw notFoundError();
  }
  return result;
}

async function findTicketType(ticketTypeId: number) {
  const ticketType = await ticketsRepository.findTicketType(ticketTypeId);
  if (!ticketType) {
    throw notFoundError();
  }
  return ticketType;
}

async function postTickets(userId: number, ticketTypeId: number) {
  const enrollment = await findUserEnrollment(userId);
  await findTicketType(ticketTypeId);
  const ticket = await ticketsRepository.postTickets(ticketTypeId, enrollment.id);
  const result = await ticketsRepository.getTickets(ticket.enrollmentId);
  return result;
}

export type CreateTicket = Pick<Ticket, 'ticketTypeId'>;

export const ticketsService = {
  getTicketsTypes,
  getTickets,
  postTickets,
};
