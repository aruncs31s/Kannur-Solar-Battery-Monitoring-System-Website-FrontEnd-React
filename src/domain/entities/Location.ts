export class Location {
  constructor(
    public id: number,
    public name: string,
    public description: string,
    public code: string,
    public address?: string,
    public city?: string,
    public state?: string,
    public zipCode?: string,
    public country?: string,
    public latitude?: number,
    public longitude?: number,
    public deviceCount?: number,
    public userCount?: number,
    public status?: 'active' | 'inactive' | 'maintenance',
    public createdAt?: string,
    public updatedAt?: string
  ) {}
}

export interface LocationResponseDTO {
  id: number;
  name: string;
  description: string;
  code: string;
  city?: string;
  state?: string;
  pin_code?: string;
  device_count?: number;
  user_count?: number;
  status?: 'active' | 'inactive' | 'maintenance';
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateLocationDTO {
  name: string;
  description?: string;
  code: string;
  city?: string;
  state?: string;
  pin_code?: string;
}

export interface UpdateLocationDTO {
  name?: string;
  description?: string;
  code?: string;
  city?: string;
  state?: string;
  pin_code?: string;
}

export interface LocationDeviceDTO {
  id: number;
  name: string;
  type: string;
  hardware_type: number;
  status: string;
  ip_address: string;
  mac_address: string;
  firmware_version: string;
}