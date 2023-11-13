import { TicketType, Ticket } from '@prisma/client';
import { ticketsRepository } from '@/repositories';

async function getTicketsTypes() {
  const result = await ticketsRepository.getTicketsTypes();
  return result;
}

export const ticketsSevice = {
  getTicketsTypes,
};
