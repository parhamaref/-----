/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type VehicleStatus = 'moving' | 'stopped' | 'offline';

export interface Vehicle {
  id: string;
  name: string;
  driver: string;
  license: string;
  speed: number | null; // in km/h
  battery: number | null; // percent
  satellites: number | null;
  gsm: number | null; // out of 31
  status: VehicleStatus;
  companyId: string;
  lat: number; // Y coordinate on the map
  lng: number; // X coordinate on the map
  lastUpdate: string;
}

export interface Company {
  id: string;
  name: string;
  vehicles: Vehicle[];
}

export type ActiveTab = 'live-tracking' | 'vehicles' | 'reports' | 'users';
export type FilterType = 'all' | 'organization' | 'status' | 'city';
export type MapStyle = 'vector-dark' | 'vector-light' | 'grid' | 'satellite';
