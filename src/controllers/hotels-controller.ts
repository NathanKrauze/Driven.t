import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import { hotelsService } from '@/services';

export async function getHotels(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const result = await hotelsService.getHotels(userId);
  return res.status(httpStatus.OK).send(result);
}

export async function getHotelsById(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { hotelId } = req.params;
  const idHotel = parseInt(hotelId);
  const result = await hotelsService.getHotelsById(userId, idHotel);
  return res.status(httpStatus.OK).send(result);
}
