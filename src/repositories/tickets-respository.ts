import { prisma } from '@/config';

async function getTicketsTypes() {
  return prisma.ticketType.findMany();
}

async function findUserEnrollment(userId: number) {
  return prisma.enrollment.findUnique({
    where: {
      userId: userId,
    },
    select: {
      id: true,
    },
  });
}

async function getTickets(enrollmentId: number) {
  return prisma.ticket.findUnique({
    include: {
      TicketType: true,
    },
    where: {
      enrollmentId: enrollmentId,
    },
  });
}

export const ticketsRepository = {
  getTicketsTypes,
  findUserEnrollment,
  getTickets,
};
