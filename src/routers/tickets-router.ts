import { Router } from 'express';
import { getTickets, getTicketsTypes, postTickets } from '@/controllers/tickets-controller';
import { authenticateToken, validateBody } from '@/middlewares';
import { createTicketSchema } from '@/schemas';

const ticketsRouter = Router();

ticketsRouter.all('/*', authenticateToken);
ticketsRouter.get('/types', getTicketsTypes);
ticketsRouter.get('/', getTickets);
ticketsRouter.post('/', validateBody(createTicketSchema), postTickets);

export { ticketsRouter };
