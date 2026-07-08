import { RentalRequestStatus } from "../../../generated/prisma/enums";

export interface RentalRequestData {
	tenantId: string;
	propertyId: string;
	message: string;
	moveInDate: Date;
	status: RentalRequestStatus;
}
