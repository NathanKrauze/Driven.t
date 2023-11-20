import { Hotel } from '@prisma/client';
import { prisma } from '@/config';

async function getHotels() {
  const result = await prisma.hotel.findMany();
  return result;
}

async function getHotelsById(hotelId: number) {
  const result = await prisma.hotel.findUnique({
    where: {
      id: hotelId,
    },
    include: {
      Rooms: true,
    },
  });
  return result;
}
export const hotelsRepository = {
  getHotels,
  getHotelsById,
};
