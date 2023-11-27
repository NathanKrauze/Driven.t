import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { changeBooking, createBooking, getBooking } from '@/controllers';
import { createOrUpdateBookingSchema } from '@/schemas';

const bookingRouter = Router();

bookingRouter
  .all('/*', authenticateToken)
  .get('/', getBooking)
  .post('/', validateBody(createOrUpdateBookingSchema), createBooking)
  .put('/:bookingId', validateBody(createOrUpdateBookingSchema), changeBooking);

export { bookingRouter };
