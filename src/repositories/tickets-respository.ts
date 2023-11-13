import { prisma } from '@/config';

async function getTicketsTypes() {
  return prisma.ticketType.findMany();
}

export const ticketsRepository = {
  getTicketsTypes,
};
