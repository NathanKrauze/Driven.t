import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import { ticketsService } from '@/services/tickets-service';

export async function getTicketsTypes(req: AuthenticatedRequest, res: Response) {
  const result = await ticketsService.getTicketsTypes();
  return res.status(httpStatus.OK).send(result);
}

export async function getTickets(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const result = await ticketsService.getTickets(userId);
  return res.status(httpStatus.OK).send(result);
}

export async function postTickets(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { ticketTypeId } = req.body;
  const result = await ticketsService.postTickets(userId, ticketTypeId);
  return res.status(httpStatus.CREATED).send(result);
}
