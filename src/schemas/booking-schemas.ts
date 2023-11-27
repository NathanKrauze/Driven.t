import { InputBookingBody } from "@/protocols";
import Joi from "joi";

export const createOrUpdateBookingSchema = Joi.object<InputBookingBody>({
    roomId: Joi.number().integer().min(1).required()
});
