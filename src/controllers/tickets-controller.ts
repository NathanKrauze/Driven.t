import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { ticketsSevice } from '@/services/tickets-service';

export async function getTicketsTypes(req: Request, res: Response) {
  const result = await ticketsSevice.getTicketsTypes();
  return res.status(httpStatus.OK).send(result);
}

export async function getTickets(req: Request, res: Response) {
  return res.status(httpStatus.OK).send('ok');
}

export async function postTickets(req: Request, res: Response) {
  return res.status(httpStatus.OK).send('ok');
}
