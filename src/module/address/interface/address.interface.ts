export interface ICreateAddress {
  country: string;
  state: string;
  city: string;
  address: string;
}

export interface IUpdateAddress {
  country?: string;
  state?: string;
  city?: string;
  address?: string;
}