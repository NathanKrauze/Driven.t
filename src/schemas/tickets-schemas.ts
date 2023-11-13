import Joi from 'joi';
import { CreateTicket } from '@/services';

export const createTicketSchema = Joi.object<CreateTicket>({
  ticketTypeId: Joi.number().required(),
});
