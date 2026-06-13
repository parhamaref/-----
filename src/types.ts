/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type VehicleStatus = 'moving' | 'stopped' | 'offline';

export interface DriverScore {
  score: number; // 0-100 score
  harshBrakesCount: number; // ترمزهای شدید
  rapidAccelerationCount: number; // شتابهای ناگهانی
  speedingEventsCount: number; // سرعت غیرمجاز
  fuelConsumptionRate: number; // مصرف سوخت (litres/100km)
  behaviorGrade: string; // رفتار رانندگی (عالی / خوب / متوسط / ضعیف)
}

export interface FuelIntegrity {
  status: 'safe' | 'warning' | 'critical'; // ایمن / مشکوک / خطرناک
  unauthorizedDropDetected: boolean; // تخلیه غیرمجاز سوخت
  fuelSaleSuspected: boolean; // فروش سوخت غیرمجاز
  abnormalConsumptionDetected: boolean; // مصرف غیرعادی
  tankTamperedDetected: boolean; // دستکاری باک
  lastCheckedVolume: number; // آخرین حجم کنترل شده باک به لیتر
  stopDurationMinutes: number; // زمان توقف در لوکیشن مشکوک
  integrityScore: number; // درصد ضریب اصالت سوخت (0-100)
  logMessage?: string; // هشدار تشخیصی خودکار سیستم بر اساس جی‌پی‌اس و باک
}

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
  driverScore?: DriverScore;
  fuelIntegrity?: FuelIntegrity;
}

export interface Company {
  id: string;
  name: string;
  vehicles: Vehicle[];
}

export type ActiveTab = 'live-tracking' | 'vehicles' | 'reports' | 'users';
export type FilterType = 'all' | 'organization' | 'status' | 'city';
export type MapStyle = 'vector-dark' | 'vector-light' | 'grid' | 'satellite';
