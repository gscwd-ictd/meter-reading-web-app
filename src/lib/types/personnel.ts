import { Area } from "./area";

export type Employee = {
  fullName: string;
  idNo: string;
  contactNumber: string;
  designation: string;
  isMeterReader?: boolean;
};

export type MeterReader = Employee & { zoneBooks: Area[] };
