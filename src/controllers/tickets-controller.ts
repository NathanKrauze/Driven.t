import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import { ticketsSevice } from '@/services/tickets-service';

export async function getTicketsTypes(req: AuthenticatedRequest, res: Response) {
  const result = await ticketsSevice.getTicketsTypes();
  return res.status(httpStatus.OK).send(result);
}

export async function getTickets(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const result = await ticketsSevice.getTickets(userId);
  return res.status(httpStatus.OK).send(result);
}

export async function postTickets(req: AuthenticatedRequest, res: Response) {
  return res.status(httpStatus.OK).send('ok');
}
