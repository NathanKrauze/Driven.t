import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import { bookingService } from '@/services';
import { InputBookingBody } from '@/protocols';

export async function getBooking(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;
    const booking = await bookingService.getBooking()
    return res.status(httpStatus.OK).send(booking)
}

export async function createBooking(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;
    const { roomId } = req.body as InputBookingBody;
    const result = await bookingService.createBooking(roomId, userId)
    return res.status(httpStatus.CREATED).send(result)
}

export async function changeBooking(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;
    const result = await bookingService.changeBooking()
    return res.status(httpStatus.OK).send(result)
} 