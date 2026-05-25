/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Vehicle, Company, VehicleStatus } from '../types';

// Seeded random number generator so data is deterministic and reproducible
function createRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

const firstNames = [
  'علی', 'محمد', 'حسین', 'رضا', 'امیر', 'احمد', 'جواد', 'عباس', 'سعید', 'مهدی',
  'حمید', 'مصطفی', 'حسن', 'مسعود', 'وحید', 'محسن', 'علیرضا', 'محمدرضا', 'امیرحسین', 'مهسا',
  'فاطمه', 'زهرا', 'مریم', 'رقیه', 'زینب', 'نرگس', 'الهام', 'سارا', 'نسیم', 'شیما',
  'پیمان', 'سامان', 'کیوان', 'سهراب', 'فرزاد', 'امید', 'نوید', 'کامران', 'مهران', 'هادی',
  'مرتضی', 'مجید', 'میلاد', 'شهاب', 'حامد', 'سینا', 'بهزاد', 'آرش', 'نیما', 'پویا',
  'جلال', 'فرهاد', 'شایان', 'کمال', 'ستار', 'رامین', 'امید', 'سپهر', 'اشکان', 'سام'
];

const lastNames = [
  'رضایی', 'حسینی', 'محمدی', 'کریمی', 'موسوی', 'جعفری', 'قاسمی', 'هاشمی', 'احمدی', 'نعیمی',
  'سادین', 'کوهساری', 'یازرلو', 'سارلی', 'سعیدی', 'میرزایی', 'شاهینی', 'توزی', 'نیکنام', 'سالاری',
  'شکری', 'منوچهری', 'خجسته', 'راد', 'اکبری', 'باقری', 'مرادی', 'نادری', 'صادقی', 'رحیمی',
  'عظیمی', 'زارع', 'شریفی', 'امیدی', 'ناظری', 'فلاح', 'خرمی', 'دهقان', 'تاجیک', 'ابراهیمی',
  'افشار', 'پناهی', 'غفاری', 'یزدانی', 'نوروزی', 'صالحی', 'خدادادی', 'فتحی', 'کریمیان', 'توکلی',
  'کاوه', 'رستمی', 'بهرامی', 'مصلحی', 'نیکزاد', 'فرهمند', 'عادلی', 'سهرابی', 'منصوری', 'کوهستانی'
];

const companiesConfig = [
  { id: 'co-azadshahr', name: 'جهادکشاورزی آزادشهر', count: 120, shortName: 'آزادشهر', minLat: 37.05, maxLat: 37.12, minLng: 55.12, maxLng: 55.22 },
  { id: 'co-gorgan', name: 'جهادکشاورزی گرگان', count: 150, shortName: 'گرگان', minLat: 36.80, maxLat: 36.88, minLng: 54.38, maxLng: 54.48 },
  { id: 'co-gonbad', name: 'جهادکشاورزی گنبد', count: 140, shortName: 'گنبد', minLat: 37.20, maxLat: 37.30, minLng: 55.10, maxLng: 55.25 },
  { id: 'co-industry-aliabad', name: 'صنعت معدن علی آباد', count: 110, shortName: 'علی‌آباد', minLat: 36.88, maxLat: 36.95, minLng: 54.80, maxLng: 54.91 },
  { id: 'co-industry-bandargaz', name: 'صنعت و معدن بندرگز', count: 80, shortName: 'بندرگز', minLat: 36.75, maxLat: 36.80, minLng: 53.90, maxLng: 53.98 },
  { id: 'co-industry-ramian', name: 'صنعت و معدن رامیان', count: 70, shortName: 'رامیان', minLat: 36.98, maxLat: 37.04, minLng: 55.10, maxLng: 55.18 },
  { id: 'co-industry-kordkuy', name: 'صنعت و معدن کردکوی', count: 80, shortName: 'کردکوی', minLat: 36.76, maxLat: 36.82, minLng: 54.08, maxLng: 54.15 },
  { id: 'co-rahdari-galikesh', name: 'راهداری و حمل‌ونقل گالیکش', count: 50, shortName: 'گالیکش', minLat: 37.22, maxLat: 37.30, minLng: 55.40, maxLng: 55.50 },
];

function generateFleet(): { companies: Company[]; allVehicles: Vehicle[] } {
  const rg = createRandom(1405); // fixed seed
  const allVehicles: Vehicle[] = [];

  // 1. Create a pool of statuses to guarantee exactly 412 online-moving, 187 online-stopped,
  // and 201 offline (for a total of 800 vehicles).
  const statusPool: VehicleStatus[] = [];
  for (let i = 0; i < 412; i++) statusPool.push('moving');
  for (let i = 0; i < 187; i++) statusPool.push('stopped');
  for (let i = 0; i < 201; i++) statusPool.push('offline');

  // Shuffle the status pool deterministically
  for (let i = statusPool.length - 1; i > 0; i--) {
    const j = Math.floor(rg() * (i + 1));
    const temp = statusPool[i];
    statusPool[i] = statusPool[j];
    statusPool[j] = temp;
  }

  // Force ID '3' to be 'moving' to match App.tsx's default selected active vehicle
  const targetIdIndex = 2; // ID '3' corresponds to index 2 in raw generation loop
  if (statusPool[targetIdIndex] !== 'moving') {
    const movingIdx = statusPool.indexOf('moving');
    if (movingIdx !== -1) {
      const temp = statusPool[targetIdIndex];
      statusPool[targetIdIndex] = statusPool[movingIdx];
      statusPool[movingIdx] = temp;
    }
  }

  let globalVehicleIndex = 0;

  const companies: Company[] = companiesConfig.map((config) => {
    const companyVehicles: Vehicle[] = [];

    for (let i = 1; i <= config.count; i++) {
      const id = (globalVehicleIndex + 1).toString();
      const status = statusPool[globalVehicleIndex];
      globalVehicleIndex++;

      // Professional Iranian driver name selection
      const fn = firstNames[Math.floor(rg() * firstNames.length)];
      const ln = lastNames[Math.floor(rg() * lastNames.length)];
      const driverName = `${fn} ${ln}`;

      // Typical Iranian national license / permit code (e.g. 140********)
      const licensePart1 = 1400 + Math.floor(rg() * 5);
      const licensePart2 = Math.floor(rg() * 900000) + 100000;
      const license = `${licensePart1}${licensePart2}`;

      // Deterministic coordinates inside the local bounding box of county
      const lat = config.minLat + rg() * (config.maxLat - config.minLat);
      const lng = config.minLng + rg() * (config.maxLng - config.minLng);

      // Unique vehicle naming convention
      const name = `${config.shortName}${i < 10 ? '0' : ''}${i}`;

      let speed: number | null = null;
      let battery: number | null = null;
      let satellites: number | null = null;
      let gsm: number | null = null;
      let lastUpdate = 'هم‌اکنون';

      if (status === 'moving') {
        speed = Math.floor(rg() * 55) + 30; // 30 to 85 km/h
        battery = Math.floor(rg() * 30) + 70; // 70 to 100%
        satellites = Math.floor(rg() * 10) + 10; // 10 to 20 sats 
        gsm = Math.floor(rg() * 15) + 15; // 15 to 30 GSM DB
        lastUpdate = 'هم‌اکنون';
      } else if (status === 'stopped') {
        speed = 0;
        battery = Math.floor(rg() * 60) + 40; // 40 to 100%
        satellites = Math.floor(rg() * 8) + 8; // 8 to 16 sats
        gsm = Math.floor(rg() * 20) + 10; // 10 to 30 GSM DB
        
        const minutesAgo = Math.floor(rg() * 55) + 1;
        lastUpdate = `${minutesAgo} دقیقه پیش`;
      } else {
        // offline
        const hoursAgo = Math.floor(rg() * 23) + 1;
        lastUpdate = rg() > 0.5 ? `${hoursAgo} ساعت پیش` : '۱ روز پیش';
      }

      const vehicle: Vehicle = {
        id,
        name,
        driver: driverName,
        license,
        speed,
        battery,
        satellites,
        gsm,
        status,
        companyId: config.id,
        lat,
        lng,
        lastUpdate
      };

      companyVehicles.push(vehicle);
      allVehicles.push(vehicle);
    }

    return {
      id: config.id,
      name: config.name,
      vehicles: companyVehicles
    };
  });

  return { companies, allVehicles };
}

const generated = generateFleet();

export const mockCompanies: Company[] = generated.companies;
export const allVehicles: Vehicle[] = generated.allVehicles;
