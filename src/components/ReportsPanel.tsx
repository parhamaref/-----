/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { Vehicle } from '../types';
import { convertToPersianNumbers } from '../utils/jalali';
import { 
  BarChart3, 
  TrendingUp, 
  ShieldAlert, 
  Map, 
  CheckCircle, 
  Clock, 
  Download,
  Calendar,
  Layers,
  AlertTriangle,
  Lightbulb,
  Fuel,
  Building,
  MapPin,
  Search,
  Phone,
  AlertCircle,
  Filter,
  ArrowUpDown,
  Wrench,
  Gauge,
  Activity,
  ShieldCheck,
  Droplet
} from 'lucide-react';
import { mockCompanies } from '../data/mockData';

const labelColorMap: Record<string, { gradient: string; hover: string; shadow: string; dot: string; text: string; bgLight: string }> = {
  // Today's hourly
  '۰۸:۰۰': {
    gradient: 'from-amber-500 to-orange-400',
    hover: 'group-hover/bar:from-amber-400 group-hover/bar:to-orange-300',
    shadow: 'shadow-amber-500/20 dark:shadow-amber-900/30',
    dot: 'bg-amber-400',
    text: 'text-amber-500',
    bgLight: 'bg-amber-50 dark:bg-amber-950/20'
  },
  '۱۱:۰۰': {
    gradient: 'from-yellow-500 to-amber-450',
    hover: 'group-hover/bar:from-yellow-450 group-hover/bar:to-amber-400',
    shadow: 'shadow-yellow-500/20 dark:shadow-yellow-900/30',
    dot: 'bg-yellow-400',
    text: 'text-yellow-500',
    bgLight: 'bg-yellow-50 dark:bg-yellow-950/20'
  },
  '۱۴:۰۰': {
    gradient: 'from-sky-500 to-blue-450',
    hover: 'group-hover/bar:from-sky-450 group-hover/bar:to-blue-400',
    shadow: 'shadow-sky-500/20 dark:shadow-sky-900/30',
    dot: 'bg-sky-400',
    text: 'text-sky-550',
    bgLight: 'bg-sky-50 dark:bg-sky-950/20'
  },
  '۱۷:۰۰': {
    gradient: 'from-rose-500 to-pink-500',
    hover: 'group-hover/bar:from-rose-400 group-hover/bar:to-pink-400',
    shadow: 'shadow-rose-500/20 dark:shadow-rose-900/30',
    dot: 'bg-rose-400',
    text: 'text-rose-500',
    bgLight: 'bg-rose-50 dark:bg-rose-950/20'
  },
  '۲۰:۰۰': {
    gradient: 'from-indigo-600 to-purple-500',
    hover: 'group-hover/bar:from-indigo-500 group-hover/bar:to-purple-400',
    shadow: 'shadow-indigo-500/20 dark:shadow-indigo-900/30',
    dot: 'bg-indigo-505',
    text: 'text-indigo-500',
    bgLight: 'bg-indigo-50 dark:bg-indigo-950/20'
  },
  '۲۳:۰۰': {
    gradient: 'from-slate-600 to-zinc-500',
    hover: 'group-hover/bar:from-slate-500 group-hover/bar:to-zinc-400',
    shadow: 'shadow-slate-500/20 dark:shadow-slate-900/30',
    dot: 'bg-slate-500',
    text: 'text-slate-500',
    bgLight: 'bg-slate-50 dark:bg-slate-900/30'
  },

  // Weekly Days
  'شنبه': {
    gradient: 'from-violet-600 to-fuchsia-500',
    hover: 'group-hover/bar:from-violet-500 group-hover/bar:to-fuchsia-400',
    shadow: 'shadow-violet-500/30 dark:shadow-violet-900/40',
    dot: 'bg-violet-500',
    text: 'text-violet-600 dark:text-violet-400',
    bgLight: 'bg-violet-50 dark:bg-violet-950/20'
  },
  'یکشنبه': {
    gradient: 'from-blue-600 to-indigo-500',
    hover: 'group-hover/bar:from-blue-500 group-hover/bar:to-indigo-400',
    shadow: 'shadow-blue-500/30 dark:shadow-blue-900/40',
    dot: 'bg-blue-500',
    text: 'text-blue-600 dark:text-blue-400',
    bgLight: 'bg-blue-50 dark:bg-blue-950/20'
  },
  'دوشنبه': {
    gradient: 'from-cyan-600 to-sky-400',
    hover: 'group-hover/bar:from-cyan-500 group-hover/bar:to-sky-300',
    shadow: 'shadow-cyan-500/30 dark:shadow-cyan-900/40',
    dot: 'bg-cyan-500',
    text: 'text-cyan-600 dark:text-cyan-400',
    bgLight: 'bg-cyan-50 dark:bg-cyan-950/20'
  },
  'سه‌شنبه': {
    gradient: 'from-emerald-600 to-teal-400',
    hover: 'group-hover/bar:from-emerald-500 group-hover/bar:to-teal-300',
    shadow: 'shadow-emerald-500/30 dark:shadow-emerald-900/40',
    dot: 'bg-emerald-500',
    text: 'text-emerald-600 dark:text-emerald-400',
    bgLight: 'bg-emerald-50 dark:bg-emerald-950/20'
  },
  'چهارشنبه': {
    gradient: 'from-amber-600 to-orange-400',
    hover: 'group-hover/bar:from-amber-500 group-hover/bar:to-orange-300',
    shadow: 'shadow-amber-500/30 dark:shadow-amber-950/40',
    dot: 'bg-amber-500',
    text: 'text-amber-600 dark:text-amber-400',
    bgLight: 'bg-amber-50 dark:bg-amber-950/20'
  },
  'پنج‌شنبه': {
    gradient: 'from-rose-500 to-pink-400',
    hover: 'group-hover/bar:from-rose-400 group-hover/bar:to-pink-300',
    shadow: 'shadow-rose-500/30 dark:shadow-rose-900/40',
    dot: 'bg-rose-500',
    text: 'text-rose-600 dark:text-rose-400',
    bgLight: 'bg-rose-50 dark:bg-rose-950/20'
  },
  'جمعه': {
    gradient: 'from-slate-500 to-slate-400',
    hover: 'group-hover/bar:from-slate-400 group-hover/bar:to-slate-350',
    shadow: 'shadow-slate-500/30 dark:shadow-slate-900/40',
    dot: 'bg-slate-500',
    text: 'text-slate-600 dark:text-slate-400',
    bgLight: 'bg-slate-50 dark:bg-slate-900/30'
  },

  // Monthly Weeks
  'هفته اول': {
    gradient: 'from-rose-600 to-amber-500',
    hover: 'group-hover/bar:from-rose-500 group-hover/bar:to-amber-400',
    shadow: 'shadow-rose-500/30 dark:shadow-rose-900/40',
    dot: 'bg-rose-500',
    text: 'text-rose-600 dark:text-rose-400',
    bgLight: 'bg-rose-50 dark:bg-rose-950/20'
  },
  'هفته دوم': {
    gradient: 'from-blue-600 to-cyan-500',
    hover: 'group-hover/bar:from-blue-500 group-hover/bar:to-cyan-400',
    shadow: 'shadow-blue-500/30 dark:shadow-blue-900/40',
    dot: 'bg-blue-500',
    text: 'text-blue-600 dark:text-blue-400',
    bgLight: 'bg-blue-50 dark:bg-blue-950/20'
  },
  'هفته سوم': {
    gradient: 'from-emerald-600 to-teal-500',
    hover: 'group-hover/bar:from-emerald-500 group-hover/bar:to-teal-400',
    shadow: 'shadow-emerald-500/30 dark:shadow-emerald-900/40',
    dot: 'bg-emerald-500',
    text: 'text-emerald-600 dark:text-emerald-400',
    bgLight: 'bg-emerald-50 dark:bg-emerald-950/20'
  },
  'هفته چهارم': {
    gradient: 'from-purple-600 to-fuchsia-500',
    hover: 'group-hover/bar:from-purple-500 group-hover/bar:to-fuchsia-400',
    shadow: 'shadow-purple-500/30 dark:shadow-purple-900/40',
    dot: 'bg-purple-500',
    text: 'text-purple-600 dark:text-purple-400',
    bgLight: 'bg-purple-50 dark:bg-purple-950/20'
  }
};

// Formatter to produce stylized Iranian Commercial vehicle plate coordinates (character Ayn series)
const formatLicenseToPlate = (licenseRaw: string) => {
  const numString = licenseRaw.replace(/\D/g, '');
  if (numString.length >= 8) {
    const part1 = numString.substring(0, 2);
    const part2 = numString.substring(2, 5);
    const part3 = numString.substring(5, 7);
    return {
      part1: convertToPersianNumbers(part1),
      letter: 'ع', // Commercial trailer ayn
      part2: convertToPersianNumbers(part2),
      province: convertToPersianNumbers(part3)
    };
  }
  return {
    part1: '۱۲',
    letter: 'ع',
    part2: '۳۴۵',
    province: '۵۹' // Golestan
  };
};

interface ReportsPanelProps {
  vehicles: Vehicle[];
}

export default function ReportsPanel({ vehicles }: ReportsPanelProps) {
  const [reportRange, setReportRange] = useState<'today' | 'week' | 'month'>('today');
  const [downloading, setDownloading] = useState(false);
  const [chartStyle, setChartStyle] = useState<'bars' | 'curve'>('curve');
  const [hoveredPointIdx, setHoveredPointIdx] = useState<number | null>(3); // default highlight peak point
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('all');

  // Stoppage panel states
  const [stopSearch, setStopSearch] = useState('');
  const [stopCompanyFilter, setStopCompanyFilter] = useState('all');
  const [stopMinDuration, setStopMinDuration] = useState<number>(4); // default 4 hours
  const [stopSortBy, setStopSortBy] = useState<'duration-desc' | 'duration-asc' | 'driver'>('duration-desc');
  const [visibleStopsCount, setVisibleStopsCount] = useState(6);
  const [stopToast, setStopToast] = useState<{ message: string; show: boolean } | null>(null);

  // Trigger a temporary UI feedback pop-up
  const triggerStopAction = (message: string) => {
    setStopToast({ message, show: true });
    setTimeout(() => {
      setStopToast(null);
    }, 4500);
  };

  // Fleet maintenance prediction panel state declarations
  const [maintSearch, setMaintSearch] = useState('');
  const [maintCompanyFilter, setMaintCompanyFilter] = useState('all');
  const [maintStatusFilter, setMaintStatusFilter] = useState<'all' | 'critical' | 'warning' | 'safe'>('all');
  const [maintToast, setMaintToast] = useState<{ message: string; show: boolean } | null>(null);
  const [visibleMaintCount, setVisibleMaintCount] = useState(6);

  const triggerMaintAction = (message: string) => {
    setMaintToast({ message, show: true });
    setTimeout(() => {
      setMaintToast(null);
    }, 4500);
  };

  // States for oil and filter table
  const [oilSearch, setOilSearch] = useState('');
  const [oilCompanyFilter, setOilCompanyFilter] = useState('all');
  const [oilStatusFilter, setOilStatusFilter] = useState<'all' | 'safe' | 'warning' | 'critical'>('all');
  const [oilSortBy, setOilSortBy] = useState<'odometer-desc' | 'oil-remaining-asc' | 'filters-remaining-asc' | 'driver'>('oil-remaining-asc');
  const [visibleOilCount, setVisibleOilCount] = useState(8);
  const [oilTableToast, setOilTableToast] = useState<{ message: string; show: boolean } | null>(null);

  const triggerOilAction = (message: string) => {
    setOilTableToast({ message, show: true });
    setTimeout(() => {
      setOilTableToast(null);
    }, 4500);
  };

  // Generate deterministic oil and filter replacement list
  const oilFiltersList = useMemo(() => {
    return vehicles.map((v) => {
      const numId = parseInt(v.id.replace(/\D/g, '')) || 1;
      
      // Consistent odometer calculation matching maintenance prediction
      const odo = 125000 + (numId * 17450) % 320000;
      
      // Oil working kilometer (average maximum is 15000)
      const oilWorked = (numId * 3420) % 15000;
      const oilRemaining = Math.max(0, 15000 - oilWorked);
      const oilPercent = Math.round((oilWorked / 15000) * 100);

      // Filters working kilometer (average maximum is 10000)
      const filtersWorked = (numId * 2310) % 10000;
      const filtersRemaining = Math.max(0, 10000 - filtersWorked);
      const filtersPercent = Math.round((filtersWorked / 10000) * 100);

      // Warning levels: "safe", "warning", "critical"
      let status: 'safe' | 'warning' | 'critical' = 'safe';
      if (oilRemaining < 1200 || filtersRemaining < 800) {
        status = 'critical';
      } else if (oilRemaining < 3000 || filtersRemaining < 2500) {
        status = 'warning';
      }

      const company = mockCompanies.find(c => c.id === v.companyId);
      const companyName = company ? company.name : 'شرکت فرعی';
      
      const brands = ['ولوو FH500', 'اسکانیا R450', 'بنز آکتورز ۱۸۴۴', 'داف XF150', 'رنو تی‌برند پی۵۰۰', 'اویکو استرالیس'];
      const vehicleModel = `${brands[numId % brands.length]} (${v.name})`;

      return {
        id: v.id,
        vehicleName: vehicleModel,
        driver: v.driver,
        license: v.license,
        companyId: v.companyId,
        companyName,
        odo,
        oilWorked,
        oilRemaining,
        oilPercent,
        filtersWorked,
        filtersRemaining,
        filtersPercent,
        status
      };
    });
  }, [vehicles]);

  // Aggregate stats for oil & filter
  const oilAggregateStats = useMemo(() => {
    const total = oilFiltersList.length;
    if (total === 0) {
      return { total: 0, critical: 0, warning: 0, safe: 0, avgOilLifeLeft: 0 };
    }
    const critical = oilFiltersList.filter(o => o.status === 'critical').length;
    const warning = oilFiltersList.filter(o => o.status === 'warning').length;
    const safe = oilFiltersList.filter(o => o.status === 'safe').length;
    
    const avgOilLifeLeft = Math.round(
      oilFiltersList.reduce((acc, curr) => acc + (100 - curr.oilPercent), 0) / total
    );

    return {
      total,
      critical,
      warning,
      safe,
      avgOilLifeLeft
    };
  }, [oilFiltersList]);

  // Apply filters and sorting to the list
  const filteredOilFilters = useMemo(() => {
    let result = oilFiltersList.filter(item => {
      // Company filter
      if (oilCompanyFilter !== 'all' && item.companyId !== oilCompanyFilter) {
        return false;
      }

      // Status filter
      if (oilStatusFilter !== 'all' && item.status !== oilStatusFilter) {
        return false;
      }

      // Query String filter
      if (oilSearch.trim() !== '') {
        const query = oilSearch.toLowerCase().trim();
        const matches = 
          item.driver.toLowerCase().includes(query) ||
          item.vehicleName.toLowerCase().includes(query) ||
          item.companyName.toLowerCase().includes(query) ||
          item.license.replace(/\s+/g, '').includes(query.replace(/\s+/g, ''));
        if (!matches) return false;
      }

      return true;
    });

    // Sort implementation
    if (oilSortBy === 'odometer-desc') {
      result.sort((a, b) => b.odo - a.odo);
    } else if (oilSortBy === 'oil-remaining-asc') {
      result.sort((a, b) => a.oilRemaining - b.oilRemaining);
    } else if (oilSortBy === 'filters-remaining-asc') {
      result.sort((a, b) => a.filtersRemaining - b.filtersRemaining);
    } else if (oilSortBy === 'driver') {
      result.sort((a, b) => a.driver.localeCompare(b.driver, 'fa'));
    }

    return result;
  }, [oilFiltersList, oilCompanyFilter, oilStatusFilter, oilSearch, oilSortBy]);

  // Generate deterministic vehicle maintenance & prediction list
  const maintenancePredictions = useMemo(() => {
    return vehicles.map((v) => {
      const numId = parseInt(v.id.replace(/\D/g, '')) || 1;
      
      // Deterministic odometer reading: e.g. between 125K and 445K kilometers
      const currentOdometer = 125000 + (numId * 17450) % 320000;
      
      // Average daily mileage driven: e.g. between 180 and 420 kilometers/day
      const dailyAverage = 180 + (numId * 35) % 240;

      // Maintenance item 1: Engine Oil (تعویض روغن موتور) - Interval: 15,000 km
      const oilUsageSinceLast = (numId * 3247) % 15000;
      const oilRemaining = 15000 - oilUsageSinceLast;
      const oilPercentage = Math.round((oilUsageSinceLast / 15000) * 100);

      // Maintenance item 2: Brake Pads (لنت ترمز) - Interval: 40,000 km
      const brakeUsageSinceLast = (numId * 5873) % 40000;
      const brakeRemaining = 40000 - brakeUsageSinceLast;
      const brakePercentage = Math.round((brakeUsageSinceLast / 40000) * 100);

      // Maintenance item 3: Tires rotation/change (لاستیک‌ها) - Interval: 80,000 km
      const tiresUsageSinceLast = (numId * 11425) % 80000;
      const tiresRemaining = 80000 - tiresUsageSinceLast;
      const tiresPercentage = Math.round((tiresUsageSinceLast / 80000) * 100);

      // Maintenance item 4: Belts & filters comprehensive check (سیستم هیدرولیک و تسمه‌ها) - Interval: 60,000 km
      const engineUsageSinceLast = (numId * 7950) % 60000;
      const engineRemaining = 60000 - engineUsageSinceLast;
      const enginePercentage = Math.round((engineUsageSinceLast / 60000) * 100);

      // Shortest remaining distance and days before a service is needed
      const shortestKm = Math.min(oilRemaining, brakeRemaining, tiresRemaining, engineRemaining);
      const estDaysRemaining = Math.max(0, Math.ceil(shortestKm / dailyAverage));

      // Identify which specific system is the most critical
      let primaryDueSystem = 'روغن موتور';
      let primaryDueKey: 'oil' | 'brake' | 'tires' | 'engine' = 'oil';
      let maxPercentage = oilPercentage;

      if (brakePercentage > maxPercentage) {
        primaryDueSystem = 'لنت‌های ترمز چرخ‌ها';
        primaryDueKey = 'brake';
        maxPercentage = brakePercentage;
      }
      if (tiresPercentage > maxPercentage) {
        primaryDueSystem = 'سرویس و جابجایی لاستیک‌ها';
        primaryDueKey = 'tires';
        maxPercentage = tiresPercentage;
      }
      if (enginePercentage > maxPercentage) {
        primaryDueSystem = 'تسمه تایم و فیلترهای هیدرولیک';
        primaryDueKey = 'engine';
        maxPercentage = enginePercentage;
      }

      // Priority classification
      let priority: 'critical' | 'warning' | 'safe' = 'safe';
      if (estDaysRemaining <= 8 || shortestKm < 1800) {
        priority = 'critical';
      } else if (estDaysRemaining <= 22 || shortestKm < 4500) {
        priority = 'warning';
      }

      const company = mockCompanies.find(c => c.id === v.companyId);
      const companyName = company ? company.name : 'شرکت فرعی';

      const brands = ['ولوو FH500', 'اسکانیا R450', 'بنز آکتورز ۱۸۴۴', 'داف XF150', 'رنو تی‌برند پی۵۰۰', 'اویکو استرالیس'];
      const vehicleModel = `${brands[numId % brands.length]} (${v.name})`;

      // Tailored recommendation message in Persian
      let recommendation = '';
      if (priority === 'critical') {
        recommendation = `⚠️ توصیه فوری تفصیلی: با توجه به انقضای شاخص ${primaryDueSystem} پس از طی مسافت مقرر، پیشنهاد می‌شود تریلر در اولین فرصت لجستیکی به نزدیک‌ترین کارگاه فنی مجاز گلستان اعزام شده و از سفرهای ترانزیتی سنگین برون‌مرزی پیش از سرویس جداً ممانعت شود.`;
      } else if (priority === 'warning') {
        recommendation = `ℹ️ توصیه پیشگیرانه: سطح استهلاک شاخص ${primaryDueSystem} به فاز هشدار اولیه رسیده است. زمان بهینه مراجعه تا حداکثر ${estDaysRemaining} روز آینده یا پیش از انباشت مسافتی معادل ${shortestKm} کیلومتر تخمین زده می‌شود.`;
      } else {
        recommendation = `✅ تاییدیه پایه‌ای: تمامی سیستم‌های تریلر اعم از لایه‌های هیدرولیک و روغن‌ها در وضعیت کاملاً بهینه قرار داشته و پایداری عملکردی سیستم تا مسافت تقریبی ${shortestKm} کیلومتر دیگر تضمین می‌گردد.`;
      }

      return {
        id: v.id,
        vehicleName: vehicleModel,
        driver: v.driver,
        license: v.license,
        companyId: v.companyId,
        companyName,
        currentOdometer,
        dailyAverage,
        oilUsageSinceLast,
        oilRemaining,
        oilPercentage,
        brakeUsageSinceLast,
        brakeRemaining,
        brakePercentage,
        tiresUsageSinceLast,
        tiresRemaining,
        tiresPercentage,
        engineUsageSinceLast,
        engineRemaining,
        enginePercentage,
        shortestKm,
        estDaysRemaining,
        primaryDueSystem,
        primaryDueKey,
        priority,
        recommendation
      };
    });
  }, [vehicles]);

  // Aggregate stats
  const maintenanceStats = useMemo(() => {
    const total = maintenancePredictions.length;
    const critical = maintenancePredictions.filter(m => m.priority === 'critical').length;
    const warning = maintenancePredictions.filter(m => m.priority === 'warning').length;
    const safe = maintenancePredictions.filter(m => m.priority === 'safe').length;
    
    // Average remaining days for warns/criticals
    const targetVehicles = maintenancePredictions.filter(m => m.priority !== 'safe');
    let avgDays = 0;
    if (targetVehicles.length > 0) {
      avgDays = Math.round(targetVehicles.reduce((acc, curr) => acc + curr.estDaysRemaining, 0) / targetVehicles.length);
    } else {
      avgDays = 45;
    }

    // Rough estimated preventive budget: criticals cost ~3.5M Toman average and warns cost ~1.8M Toman
    const estimatedCostMlnTomans = (critical * 3.8) + (warning * 1.5);

    return {
      total,
      critical,
      warning,
      safe,
      avgDays,
      estimatedCostMlnTomans: Number(estimatedCostMlnTomans.toFixed(1))
    };
  }, [maintenancePredictions]);

  // Filtered maintenance list
  const filteredMaintenance = useMemo(() => {
    return maintenancePredictions.filter(m => {
      // Company filter
      if (maintCompanyFilter !== 'all' && m.companyId !== maintCompanyFilter) {
        return false;
      }

      // Status priority filter
      if (maintStatusFilter !== 'all' && m.priority !== maintStatusFilter) {
        return false;
      }

      // Text Search
      if (maintSearch.trim() !== '') {
        const query = maintSearch.toLowerCase().trim();
        const matches = 
          m.driver.toLowerCase().includes(query) ||
          m.vehicleName.toLowerCase().includes(query) ||
          m.companyName.toLowerCase().includes(query) ||
          m.license.replace(/\s+/g, '').includes(query.replace(/\s+/g, ''));
        if (!matches) return false;
      }

      return true;
    });
  }, [maintenancePredictions, maintCompanyFilter, maintStatusFilter, maintSearch]);

  // Generate deterministic stops list from currently stopped or offline vehicles in the fleet
  const stopsList = useMemo(() => {
    return vehicles
      .filter(v => v.status === 'stopped' || v.status === 'offline')
      .map((v) => {
        // Deterministic numeric seed using vehicle ID
        const numId = parseInt(v.id.replace(/\D/g, '')) || 1;
        
        // Deterministic duration in hours: e.g. between 4.8 and 88 hours
        const rawDuration = 4.2 + (numId % 18) * 4.7;
        const duration = Number(rawDuration.toFixed(1));
        
        // Select locations within Golestan route checkpoints
        const locations = [
          `خط مرزی گمرک اینچه‌برون - ترمینال تخلیه بار شماره ${numId % 3 + 1}`,
          `پارکینگ عمومی نوبت‌دهی تریلرهای گمرک اینچه‌برون`,
          `سایت صنایع غذایی منطقه ویژه اقتصادی اترک`,
          `مجموعه انبارهای فله غلات و روغن سویا - جاده گنبد`,
          `بندر ترکمن - دپو موقت محموله‌های بندرگاهی`,
          `کمربندی غربی گرگان - تیرپارک و استراحتگاه بهارستان`,
          `ناحیه صنعتی علی‌آباد کتول - رمپ انتظار کارخانجات`,
          `پارک ترافیکی و خدمات فنی مرزی بندرگز`,
          `ترمینال صادرات صنایع ترانزیت کردکوی`
        ];
        const location = locations[numId % locations.length];
        
        // Select deterministic stopped reasons
        const reasons = [
          'در انتظار نوبت پذیرش ترخیص و اسناد کالا توسط ناظران گمرک',
          'استراحت الزامی راننده و اتمام حد تردد مجاز روزانه جاده‌ای',
          'ثبت نهایی مدارک حمل فرآورده‌های کشاورزی استان گلستان',
          'انجام تشریفات وزن‌کشی باسکول و بازرسی تعزیراتی کالا',
          'بارانداز موقت ترکیبی راه‌آهن-جاده‌ای برای محصولات دانه‌ای',
          'توقف موقت فنی جهت پایش پلمب محموله ترانزیتی',
          'بارگیری تکمیلی محصولات صنایع سلولزی صادراتی'
        ];
        const reason = reasons[numId % reasons.length];
        
        const company = mockCompanies.find(c => c.id === v.companyId);
        const companyName = company ? company.name : 'شرکت فرعی';
        
        const brands = ['ولوو FH500', 'اسکانیا R450', 'بنز آکتورز ۱۸۴۴', 'داف XF150', 'رنو تی‌برند پی۵۰۰', 'اویکو استرالیس'];
        const vehicleModel = `${brands[numId % brands.length]} (${v.name})`;

        // Start time calculation
        const daysAgo = Math.floor(numId / 3) % 4;
        const hour = 7 + (numId % 15);
        const startTime = daysAgo === 0 
          ? `امروز ساعت ${convertToPersianNumbers(`${String(hour).padStart(2, '0')}:۳۰`)}`
          : daysAgo === 1
          ? `دیروز ساعت ${convertToPersianNumbers(`${String(hour).padStart(2, '0')}:۱۵`)}`
          : `${convertToPersianNumbers(daysAgo)} روز پیش ساعت ${convertToPersianNumbers(`${String(hour).padStart(2, '0')}:۰۰`)}`;

        return {
          id: `stop-${v.id}`,
          vehicleId: v.id,
          vehicleName: vehicleModel,
          driver: v.driver,
          license: v.license,
          companyId: v.companyId,
          companyName,
          duration,
          startTime,
          location,
          reason,
          status: v.status
        };
      });
  }, [vehicles]);

  // Apply filters and sorting to the generated stops
  const filteredStops = useMemo(() => {
    let result = stopsList.filter(stop => {
      // Company search filter
      if (stopCompanyFilter !== 'all' && stop.companyId !== stopCompanyFilter) {
        return false;
      }

      // Min duration filter
      if (stop.duration < stopMinDuration) {
        return false;
      }

      // Query String search filter (driver, license, place, model, company)
      if (stopSearch.trim() !== '') {
        const query = stopSearch.toLowerCase().trim();
        const matches = 
          stop.driver.toLowerCase().includes(query) ||
          stop.license.replace(/\s+/g, '').includes(query.replace(/\s+/g, '')) || // handle spacing in Persian plates
          stop.vehicleName.toLowerCase().includes(query) ||
          stop.location.toLowerCase().includes(query) ||
          stop.reason.toLowerCase().includes(query) ||
          stop.companyName.toLowerCase().includes(query);
          
        if (!matches) return false;
      }

      return true;
    });

    // Sorting implementation
    if (stopSortBy === 'duration-desc') {
      result.sort((a, b) => b.duration - a.duration);
    } else if (stopSortBy === 'duration-asc') {
      result.sort((a, b) => a.duration - b.duration);
    } else if (stopSortBy === 'driver') {
      result.sort((a, b) => a.driver.localeCompare(b.driver, 'fa'));
    }

    return result;
  }, [stopsList, stopCompanyFilter, stopMinDuration, stopSearch, stopSortBy]);

  // Overall stops statistics
  const stopStatistics = useMemo(() => {
    const totalCount = filteredStops.length;
    if (totalCount === 0) {
      return { totalCount: 0, maxDuration: 0, avgDuration: 0, criticalCount: 0 };
    }

    const durations = filteredStops.map(s => s.duration);
    const maxDuration = Math.max(...durations);
    const sumDuration = durations.reduce((acc, curr) => acc + curr, 0);
    const avgDuration = Number((sumDuration / totalCount).toFixed(1));
    const criticalCount = filteredStops.filter(s => s.duration >= 36).length;

    return {
      totalCount,
      maxDuration,
      avgDuration,
      criticalCount
    };
  }, [filteredStops]);

  // Deterministic multiplier based on company ID for realistic consumption profiles
  const companyMultiplier = useMemo(() => {
    if (selectedCompanyId === 'all') return 1.0;
    let hash = 0;
    for (let i = 0; i < selectedCompanyId.length; i++) {
      hash = selectedCompanyId.charCodeAt(i) + ((hash << 5) - hash);
    }
    const factor = 0.82 + (Math.abs(hash % 35) / 100); // 0.82 to 1.17
    return factor;
  }, [selectedCompanyId]);

  // Dynamic set of average fuel consumption values
  const fuelData = useMemo(() => {
    let baseValues: { label: string; consumption: number; prevComparison: string; efficiencyRank: string; activeTrucks: number }[] = [];

    if (reportRange === 'today') {
      baseValues = [
        { label: '۰۸:۰۰', consumption: 31.2, prevComparison: '۱.۲٪+', efficiencyRank: 'A', activeTrucks: 14 },
        { label: '۱۱:۰۰', consumption: 33.8, prevComparison: '۲.۴٪+', efficiencyRank: 'B', activeTrucks: 38 },
        { label: '۱۴:۰۰', consumption: 36.4, prevComparison: '۳.۱٪+', efficiencyRank: 'C', activeTrucks: 52 },
        { label: '۱۷:۰۰', consumption: 37.9, prevComparison: '۴.۰٪+', efficiencyRank: 'D', activeTrucks: 74 },
        { label: '۲۰:۰۰', consumption: 32.5, prevComparison: '۰.۸٪-', efficiencyRank: 'B', activeTrucks: 29 },
        { label: '۲۳:۰۰', consumption: 27.2, prevComparison: '۳.۵٪-', efficiencyRank: 'A', activeTrucks: 11 },
      ];
    } else if (reportRange === 'week') {
      baseValues = [
        { label: 'شنبه', consumption: 32.1, prevComparison: '۰.۲٪+', efficiencyRank: 'B', activeTrucks: 185 },
        { label: 'یکشنبه', consumption: 33.5, prevComparison: '۱.۵٪+', efficiencyRank: 'B', activeTrucks: 240 },
        { label: 'دوشنبه', consumption: 31.8, prevComparison: '۰.۷٪-', efficiencyRank: 'A', activeTrucks: 210 },
        { label: 'سه‌شنبه', consumption: 35.6, prevComparison: '۳.۹٪+', efficiencyRank: 'C', activeTrucks: 290 },
        { label: 'چهارشنبه', consumption: 34.2, prevComparison: '۱.۸٪+', efficiencyRank: 'C', activeTrucks: 260 },
        { label: 'پنج‌شنبه', consumption: 29.5, prevComparison: '۴.۲٪-', efficiencyRank: 'A', activeTrucks: 150 },
        { label: 'جمعه', consumption: 26.3, prevComparison: '۸.۵٪-', efficiencyRank: 'A+', activeTrucks: 82 },
      ];
    } else {
      baseValues = [
        { label: 'هفته اول', consumption: 32.4, prevComparison: '۱.۱٪-', efficiencyRank: 'B', activeTrucks: 1120 },
        { label: 'هفته دوم', consumption: 34.8, prevComparison: '۲.۵٪+', efficiencyRank: 'C', activeTrucks: 1350 },
        { label: 'هفته سوم', consumption: 30.2, prevComparison: '۴.۱٪-', efficiencyRank: 'A', activeTrucks: 1040 },
        { label: 'هفته چهارم', consumption: 36.9, prevComparison: '۵.۸٪+', efficiencyRank: 'D', activeTrucks: 1680 },
      ];
    }

    return baseValues.map(item => {
      const adjustedValue = Number((item.consumption * companyMultiplier).toFixed(1));
      const activeTrucksAdjusted = selectedCompanyId === 'all' 
        ? item.activeTrucks 
        : Math.max(3, Math.round(item.activeTrucks * (companyMultiplier / 3)));
      
      let rank = 'A+';
      if (adjustedValue > 36) rank = 'D';
      else if (adjustedValue > 33) rank = 'C';
      else if (adjustedValue > 30) rank = 'B';
      else if (adjustedValue > 27) rank = 'A';

      return {
        ...item,
        consumption: adjustedValue,
        activeTrucks: activeTrucksAdjusted,
        efficiencyRank: rank
      };
    });
  }, [reportRange, companyMultiplier, selectedCompanyId]);

  const averageFuelConsumption = useMemo(() => {
    if (fuelData.length === 0) return 0;
    const sum = fuelData.reduce((acc, curr) => acc + curr.consumption, 0);
    return Number((sum / fuelData.length).toFixed(1));
  }, [fuelData]);

  const selectedCompanyName = useMemo(() => {
    if (selectedCompanyId === 'all') return 'ناوگان کل استان';
    const match = mockCompanies.find(c => c.id === selectedCompanyId);
    return match ? match.name : 'شرکت فرعی';
  }, [selectedCompanyId]);

  // Dynamic dataset selection based on reportRange
  const activeData = useMemo(() => {
    if (reportRange === 'today') {
      return [
        { label: '۰۸:۰۰', distance: 45, trailers: 14, speed: 74, delay: '۰ دقیقه', status: 'روان', route: 'محور گلوگاه ترانزیت غربی نوکنده-بندرگز' },
        { label: '۱۱:۰۰', distance: 115, trailers: 38, speed: 62, delay: '۱۲ دقیقه', status: 'نیمه‌روان', route: 'محور کمربندی پرتردد علی‌آباد کتول' },
        { label: '۱۴:۰۰', distance: 138, trailers: 52, speed: 48, delay: '۲۸ دقیقه', status: 'تراکم بالا', route: 'تقاطع مواصلاتی آزادشهر به مینودشت' },
        { label: '۱۷:۰۰', distance: 152, trailers: 74, speed: 31, delay: '۴۵ دقیقه', status: 'پیک تردد فوق‌سنگین', route: 'محوطه نوبت‌دهی گمرک مرزی اینچه‌برون' },
        { label: '۲۰:۰۰', distance: 88, trailers: 29, speed: 65, delay: '۱۵ دقیقه', status: 'عادی', route: 'گذرگاه جاده مینو‌دشت به جنگل گلستان' },
        { label: '۲۳:۰۰', distance: 35, trailers: 11, speed: 78, delay: '۲ دقیقه', status: 'روان', route: 'شریان خروجی شرقی استان به خراسان' },
      ];
    } else if (reportRange === 'week') {
      return [
        { label: 'شنبه', distance: 320, trailers: 185, speed: 68, status: 'نرمال', route: 'شروع مبادلات روزهای ابتدایی هفته' },
        { label: 'یکشنبه', distance: 410, trailers: 240, speed: 65, status: 'پرترافیک', route: 'حجم تردد گمرک اینچه برون' },
        { label: 'دوشنبه', distance: 380, trailers: 210, speed: 67, status: 'نرمال', route: 'حمل بارهای فله ترانزیتی' },
        { label: 'سه‌شنبه', distance: 512, trailers: 290, speed: 59, status: 'پیک هفتگی', route: 'اوج حرکت محموله‌های نفتی و سوخت' },
        { label: 'چهارشنبه', distance: 460, trailers: 260, speed: 63, status: 'پرترافیک', route: 'تراکم تریلرهای ترانزیت آسیای میانه' },
        { label: 'پنج‌شنبه', distance: 290, trailers: 150, speed: 70, status: 'روان', route: 'روان‌سازی بارهای گمرکی پایانه مرزی' },
        { label: 'جمعه', distance: 151, trailers: 82, speed: 75, status: 'روان', route: 'تعطیلات گمرک و کمینه کارکرد ناوگان' },
      ];
    } else {
      return [
        { label: 'هفته اول', distance: 2150, trailers: 1120, speed: 66, status: 'عادی', route: 'توسعه مبادلات فرامرزی ابتدای ماه' },
        { label: 'هفته دوم', distance: 2480, trailers: 1350, speed: 63, status: 'پیک متوسط', route: 'سهم عمده بارهای سنگین مصالح سیمانی' },
        { label: 'هفته سوم', distance: 1950, trailers: 1040, speed: 69, status: 'روان', route: 'جریان منظم جاده‌ای تریلرهای ترکمنستان' },
        { label: 'هفته چهارم', distance: 2840, trailers: 1680, speed: 60, status: 'پیک بحرانی', route: 'تعهد حمل کانتینری در مرز اینچه‌برون' },
      ];
    }
  }, [reportRange]);

  // System warnings stream
  const systemAlerts = [
    { id: 1, text: 'سرعت غیرمجاز ردیاب آزادشهر25: ۸۵ کیلومتر بر ساعت در بزرگراه کمربندی', time: '۱۰ دقیقه پیش', level: 'high' },
    { id: 2, type: 'info', text: 'مجوز صنفی راننده سعید یازرلو با موفقیت تایید و تمدید شد', time: '۲ ساعت پیش', level: 'low' },
    { id: 3, text: 'قطع فرکانس باتری در ماهواره ردیاب گرگان02', time: '۵ ساعت پیش', level: 'high' },
    { id: 4, text: 'ورود غیرمجاز خودرو صنعت معدن علی‌آباد01 به محدوده حصار جغرافیایی ۱', time: '۱ روز پیش', level: 'medium' },
    { id: 5, text: 'توقف بیش از حد مجاز (۴ ساعت) خودرو بندرگز 1 در پارکینگ بندرگز', time: '۲ روز پیش', level: 'low' }
  ];

  const totalKmRun = useMemo(() => {
    return activeData.reduce((acc, curr) => acc + curr.distance, 0);
  }, [activeData]);

  const averageDailyKm = useMemo(() => {
    return Math.round(totalKmRun / activeData.length);
  }, [totalKmRun, activeData]);

  // Dynamic axis limits to adjust gridlines beautifully
  const maxScaleLimit = useMemo(() => {
    if (reportRange === 'today') return 200;
    if (reportRange === 'week') return 600;
    return 3200;
  }, [reportRange]);

  // Compute exact coordinates, spline, and area curves for high fidelity graphics
  const parsedPoints = useMemo(() => {
    const total = activeData.length;
    const startX = 50;
    const endX = 510;
    const plotWidth = endX - startX;
    
    return activeData.map((val, idx) => {
      const x = startX + (idx * (plotWidth / (total - 1)));
      // Normalize to plot height baseline at coordinate Y = 175
      const y = 175 - ((val.distance / maxScaleLimit) * 140);
      return { x, y, val, idx };
    });
  }, [activeData, maxScaleLimit]);

  const dynamicCurveD = useMemo(() => {
    if (parsedPoints.length === 0) return '';
    let d = `M ${parsedPoints[0].x} ${parsedPoints[0].y}`;
    for (let i = 0; i < parsedPoints.length - 1; i++) {
      const p0 = parsedPoints[i];
      const p1 = parsedPoints[i + 1];
      // Spline tension constant
      const cpX1 = p0.x + (p1.x - p0.x) * 0.35;
      const cpY1 = p0.y;
      const cpX2 = p1.x - (p1.x - p0.x) * 0.35;
      const cpY2 = p1.y;
      d += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
    }
    return d;
  }, [parsedPoints]);

  const dynamicAreaD = useMemo(() => {
    if (parsedPoints.length === 0) return '';
    const firstX = parsedPoints[0].x;
    const lastX = parsedPoints[parsedPoints.length - 1].x;
    return `${dynamicCurveD} L ${lastX} 180 L ${firstX} 180 Z`;
  }, [parsedPoints, dynamicCurveD]);

  const guideLines = useMemo(() => {
    return [
      maxScaleLimit,
      Math.round((maxScaleLimit * 2) / 3),
      Math.round(maxScaleLimit / 3),
      0
    ];
  }, [maxScaleLimit]);

  const handleExport = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      alert('گزارش جامع اکسل با موفقیت بارگذاری و ذخیره شد.');
    }, 1200);
  };

  return (
    <div className="flex flex-col h-full gap-4 text-right animate-fade-in">
      {/* Header operations */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 flex-shrink-0">
        <button 
          type="button" 
          onClick={handleExport}
          disabled={downloading}
          className="w-full sm:w-auto px-4 py-2.5 bg-primary-600 dark:bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold shadow-md hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Download className={`w-4 h-4 ${downloading ? 'animate-bounce' : ''}`} />
          <span>{downloading ? 'در حال صدور اکسل...' : 'خروجی اکسل گزارش'}</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="bg-gray-100 dark:bg-gray-800 p-0.5 rounded-xl border border-gray-200/40 dark:border-gray-700 flex items-center select-none">
            <button
              onClick={() => setReportRange('month')}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-colors ${reportRange === 'month' ? 'bg-white dark:bg-gray-900 text-primary-600 dark:text-primary-400 font-semibold shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
            >
              ماه گذشته
            </button>
            <button
              onClick={() => setReportRange('week')}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-colors ${reportRange === 'week' ? 'bg-white dark:bg-gray-900 text-primary-600 dark:text-primary-400 font-semibold shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
            >
              هفته گذشته
            </button>
            <button
              onClick={() => setReportRange('today')}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-colors ${reportRange === 'today' ? 'bg-white dark:bg-gray-900 text-primary-600 dark:text-primary-400 font-semibold shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
            >
              امروز
            </button>
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">گزارشات آماری ناوگان</h2>
        </div>
      </div>

      {/* KPI Stats widgets grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-shrink-0">
        <div className="stat-card">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400">
              <BarChart3 className="w-5 h-5" />
            </div>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/20 px-2.5 py-0.5 rounded-full">
              {reportRange === 'today' ? '۴٪+ بهبود روزانه' : reportRange === 'week' ? '۱۲٪+ بهبود هفتگی' : '۱۹٪+ بهبود ماهانه'}
            </span>
          </div>
          <h4 className="text-gray-400 text-xs font-semibold mb-1">
            {reportRange === 'today' ? 'کُل مسافت امروز ناوگان' : reportRange === 'week' ? 'کُل مسافت هفتگی ناوگان' : 'کُل مسافت ماهانه ناوگان'}
          </h4>
          <p className="text-2xl font-bold text-gray-900 dark:text-white leading-none font-mono">
            {convertToPersianNumbers(totalKmRun)} <span className="text-xs text-gray-400">کیلومتر</span>
          </p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-xl text-purple-600 dark:text-purple-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-xs text-primary-600 dark:text-primary-400 font-bold bg-primary-50 dark:bg-primary-950/20 px-2.5 py-0.5 rounded-full">سیستم منطبق</span>
          </div>
          <h4 className="text-gray-400 text-xs font-semibold mb-1">
            {reportRange === 'today' ? 'میانگین هر بازه ساعتی' : reportRange === 'week' ? 'میانگین کارکرد روزانه هر خودرو' : 'میانگین کارکرد هفتگی ناوگان'}
          </h4>
          <p className="text-2xl font-bold text-gray-900 dark:text-white leading-none font-mono">
            {convertToPersianNumbers(averageDailyKm)}{' '}
            <span className="text-xs text-gray-400">
              {reportRange === 'today' ? 'کیلومتر در بازه' : reportRange === 'week' ? 'کیلومتر در روز' : 'کیلومتر در هفته'}
            </span>
          </p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-xl text-amber-600 dark:text-amber-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <span className="text-xs text-amber-600 dark:text-amber-400 font-bold bg-amber-50 dark:bg-amber-950/20 px-2.5 py-0.5 rounded-full">۴ هشدار حل نشده</span>
          </div>
          <h4 className="text-gray-400 text-xs font-semibold mb-1">ضریب عدم انطباق سرعت</h4>
          <p className="text-2xl font-bold text-gray-900 dark:text-white leading-none font-mono">
            {convertToPersianNumbers(3.2)} <span className="text-xs text-gray-400">درصد لغزش</span>
          </p>
        </div>
      </div>

      {/* Main Charts & Alert panels split row */}
      <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-4">
        {/* Alerts terminal history stream */}
        <div className="flex-[40] card overflow-hidden flex flex-col p-4 min-h-0">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3 mb-3 flex-shrink-0">
            <span className="bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 font-bold px-2 py-0.5 rounded text-[10px] animate-pulse">لایو مانیتور</span>
            <h3 className="font-bold text-gray-900 dark:text-white text-sm">ردیف رخدادها و هشدارهای امنیتی</h3>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800/60 custom-scrollbar pr-1">
            {systemAlerts.map((alert) => (
              <div key={alert.id} className="py-3 last:pb-0 flex items-start gap-2.5">
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-700 dark:text-gray-300 font-semibold leading-relaxed">{alert.text}</p>
                  <span className="text-[10px] text-gray-400 mt-1 block font-mono flex items-center gap-1 justify-end">
                    <span>{alert.time}</span>
                    <Clock className="w-3 h-3" />
                  </span>
                </div>
                <div className={`p-1.5 rounded-lg flex-shrink-0 mt-0.5 ${
                  alert.level === 'high' ? 'bg-red-50 dark:bg-red-950/20 text-red-500' :
                  alert.level === 'medium' ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-500' : 'bg-blue-50 dark:bg-blue-950/20 text-blue-500'
                }`}>
                  <AlertTriangle className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic bar charts distance */}
        <div className="flex-[60] card flex flex-col p-5 min-h-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3 mb-4 gap-3 flex-shrink-0">
            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
              {/* Curve vs Bar chart toggle styles */}
              <div className="flex items-center gap-1 bg-gray-150 dark:bg-gray-800 p-0.5 rounded-xl border border-gray-200/40 dark:border-gray-700 select-none">
                <button
                  onClick={() => setChartStyle('curve')}
                  className={`px-3 py-1 text-[10px] font-bold transition-all rounded-lg flex items-center gap-1.5 ${chartStyle === 'curve' ? 'bg-white dark:bg-gray-900 text-primary-650 dark:text-primary-450 shadow-sm' : 'text-gray-400 dark:text-gray-550 hover:text-gray-700'}`}
                >
                  <Layers className={`w-3.5 h-3.5 text-primary-500 ${chartStyle === 'curve' ? 'animate-pulse' : ''}`} />
                  <span>منحنی دیجیتالی تراکم</span>
                </button>
                <button
                  onClick={() => setChartStyle('bars')}
                  className={`px-3 py-1 text-[10px] font-bold transition-all rounded-lg flex items-center gap-1.5 ${chartStyle === 'bars' ? 'bg-white dark:bg-gray-900 text-primary-650 dark:text-primary-450 shadow-sm' : 'text-gray-400 dark:text-gray-550 hover:text-gray-700'}`}
                >
                  <BarChart3 className="w-3.5 h-3.5 text-gray-500" />
                  <span>ستونی متعارف</span>
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-gray-400 dark:text-gray-550 font-mono">
                  {reportRange === 'today' ? 'امروز' : reportRange === 'week' ? '۷ روز گذشته' : '۳۰ روز گذشته'}
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-primary-500 animate-pulse"></span>
              </div>
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white text-sm text-right">
              {reportRange === 'today' ? 'پایش تراکم تردد پایگاه‌های مواصلاتی استان گلستان' : reportRange === 'week' ? 'نمودار فراوانی مسافت هفتگی کل ناوگان' : 'برآورد دیجیتال عملکردهای مسافتی ماهانه'}
            </h3>
          </div>

          {/* Color Key/Legend chips row */}
          <div className="flex flex-wrap items-center justify-end gap-x-2 gap-y-1.5 px-1 mb-4 border-b border-gray-100/50 dark:border-gray-850/50 pb-3">
            {activeData.map((val, idx) => {
              const colors = labelColorMap[val.label];
              const dotColor = colors ? colors.dot : 'bg-primary-500';
              const bgLightColor = colors ? colors.bgLight : 'bg-primary-50 dark:bg-primary-950/20';
              const isHovered = hoveredPointIdx === idx;
              return (
                <button 
                  key={val.label} 
                  onMouseEnter={() => setHoveredPointIdx(idx)}
                  className={`flex items-center gap-1.5 text-[9px] font-extrabold transition-all px-2.5 py-1 rounded-lg ${
                    isHovered 
                      ? `${bgLightColor} ring-1 ring-primary-500/20 text-gray-900 dark:text-white scale-105 shadow-sm` 
                      : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 hover:scale-105'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ring-2 ring-white dark:ring-gray-900 ${dotColor} ${isHovered ? 'animate-ping' : ''}`}></span>
                  <span>{val.label}</span>
                </button>
              );
            })}
          </div>

          {/* Core CSS Responsive Chart builder with gridlines */}
          <div className="flex-1 flex flex-col justify-end relative">
            
            {/* Horizontal Guide lines */}
            <div className="absolute inset-x-0 top-2 bottom-8 flex flex-col justify-between pointer-events-none opacity-30 select-none z-0">
              {guideLines.map((limit, idx) => (
                <div key={idx} className="border-b border-dashed border-gray-200 dark:border-gray-800 w-full relative">
                  <span className="absolute left-0 -top-2 text-[8px] font-semibold font-mono text-gray-400 dark:text-gray-500 bg-white dark:bg-gray-900 px-1.5 rounded">
                    {limit > 0 ? `${convertToPersianNumbers(limit)} کیلومتر` : convertToPersianNumbers(0)}
                  </span>
                </div>
              ))}
            </div>

            {/* Sub-container representing Curve/Density wave or Classic Bars */}
            {chartStyle === 'curve' ? (
              <div 
                className="relative z-10 w-full h-48 sm:h-56 pb-2 select-none"
                onMouseLeave={() => setHoveredPointIdx(reportRange === 'today' ? 3 : 1)} // fallback to default highlight instead of empty
              >
                {/* SVG Curves plotting */}
                <svg viewBox="0 0 560 200" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.45" />
                      <stop offset="60%" stopColor="#818cf8" stopOpacity="0.12" />
                      <stop offset="100%" stopColor="#818cf8" stopOpacity="0.0" />
                    </linearGradient>
                    <linearGradient id="curveStroke" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="40%" stopColor="#3b82f6" />
                      <stop offset="70%" stopColor="#ec4899" />
                      <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>
                    <filter id="glowingShadow" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="5" stdDeviation="6" floodColor="#6366f1" floodOpacity="0.3" />
                    </filter>
                  </defs>

                  {/* Gradient Area Cover */}
                  <path d={dynamicAreaD} fill="url(#curveGradient)" className="transition-all duration-500 ease-out" />

                  {/* Spline Wave Line */}
                  <path 
                    d={dynamicCurveD} 
                    fill="none" 
                    stroke="url(#curveStroke)" 
                    strokeWidth="3.5" 
                    strokeLinecap="round" 
                    filter="url(#glowingShadow)"
                    className="transition-all duration-500 ease-out"
                  />

                  {/* Interactive guides & pulsing checkpoints node hubs */}
                  {parsedPoints.map((point, index) => {
                    const isHovered = hoveredPointIdx === index;
                    return (
                      <g key={index} className="transition-all duration-300">
                        {/* Hover vertical neon scanner beam */}
                        <line 
                          x1={point.x} 
                          y1="10" 
                          x2={point.x} 
                          y2="180" 
                          stroke={isHovered ? '#ec4899' : '#4f46e5'} 
                          strokeWidth={isHovered ? '1.5' : '0.5'}
                          strokeDasharray={isHovered ? '1,1' : '2,3'} 
                          className="opacity-40 transition-all duration-300"
                        />

                        {/* Interactive trigger indicator */}
                        <circle
                          cx={point.x}
                          cy={point.y}
                          r={isHovered ? '9' : '5.5'}
                          fill="#ffffff"
                          stroke={isHovered ? '#ec4899' : '#3b82f6'}
                          strokeWidth={isHovered ? '4.5' : '3'}
                          className="cursor-pointer transition-all duration-300 drop-shadow-md"
                          onMouseEnter={() => setHoveredPointIdx(index)}
                        />

                        {/* Peak heat pulse shadow animation */}
                        {isHovered && (
                          <circle
                            cx={point.x}
                            cy={point.y}
                            r="15"
                            fill="none"
                            stroke="#ec4899"
                            strokeWidth="2"
                            className="animate-ping opacity-50"
                          />
                        )}
                      </g>
                    );
                  })}
                </svg>

                {/* Highly structured, floating traffic details card overlay */}
                {hoveredPointIdx !== null && parsedPoints[hoveredPointIdx] && (
                  <div className="absolute left-[8%] md:left-[12%] top-2 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-2xl p-4 border border-indigo-500/10 shadow-2xl z-20 text-right w-64 md:w-72 animate-fade-in text-xs transition-all duration-300">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] text-gray-400 dark:text-gray-500 font-mono bg-gray-50 dark:bg-gray-800/40 px-2 py-0.5 rounded-full">
                        {convertToPersianNumbers(parsedPoints[hoveredPointIdx].val.distance)} کیلومتر مسافت
                      </span>
                      <div className="font-extrabold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                        <span>زمان پایش: {parsedPoints[hoveredPointIdx].val.label}</span>
                        <Clock className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
                      </div>
                    </div>
                    
                    <p className="text-[10px] text-primary-700 dark:text-primary-300 font-extrabold mb-3 bg-primary-50 dark:bg-primary-950/20 p-2 rounded-lg text-center leading-relaxed">
                      📍 {parsedPoints[hoveredPointIdx].val.route}
                    </p>

                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                      <div className="bg-gray-50 dark:bg-gray-800/50 p-2 rounded-xl border border-gray-100 dark:border-gray-800 flex flex-col justify-center">
                        <span className="text-gray-400 block mb-0.5">برآورد ناوگان فعال:</span>
                        <span className="font-mono font-bold text-gray-850 dark:text-gray-200">
                          {convertToPersianNumbers(parsedPoints[hoveredPointIdx].val.trailers || Math.round(parsedPoints[hoveredPointIdx].val.distance * 0.4))} تریلر
                        </span>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-800/50 p-2 rounded-xl border border-gray-100 dark:border-gray-800 flex flex-col justify-center">
                        <span className="text-gray-400 block mb-0.5">صف نوبت گمرک:</span>
                        <span className="font-mono font-bold text-rose-500">
                          {parsedPoints[hoveredPointIdx].val.delay || '۰ دقیقه'}
                        </span>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-800/50 p-2 rounded-xl border border-gray-100 dark:border-gray-800 col-span-2 flex justify-between items-center px-3">
                        <span className="font-extrabold text-emerald-500 animate-pulse">
                          {parsedPoints[hoveredPointIdx].val.status || 'روان'}
                        </span>
                        <span className="text-gray-400 font-semibold">شاخص تراکم تردد:</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Classic Bars container */
              <div className="relative z-10 flex justify-between items-end h-48 sm:h-56 gap-3 sm:gap-6 border-b border-gray-200 dark:border-gray-800 pb-1 flex-shrink-0 px-2">
                {activeData.map((val, idx) => {
                  const heightPercent = Math.round((val.distance / maxScaleLimit) * 100);
                  const colors = labelColorMap[val.label] || {
                    gradient: 'from-primary-600 to-primary-400',
                    hover: 'group-hover/bar:from-primary-500 group-hover/bar:to-primary-300',
                    shadow: 'shadow-primary-500/10',
                    dot: 'bg-primary-500',
                    text: 'text-primary-600 dark:text-primary-400',
                    bgLight: 'bg-primary-50 dark:bg-primary-950/20'
                  };

                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 group/bar relative">
                      
                      {/* Tooltip on bar hover */}
                      <div className="opacity-0 pointer-events-none group-hover/bar:opacity-100 bg-gray-900 dark:bg-black text-white font-sans text-[10px] px-2.5 py-1.5 rounded-lg shadow-xl absolute -top-16 transition-all duration-200 ease-out z-20 whitespace-nowrap text-center border border-gray-800">
                        <div className="font-bold flex items-center gap-1.5 justify-center mb-0.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`}></span>
                          <span>{val.label}</span>
                        </div>
                        <span className="font-mono text-[11px] font-semibold">{convertToPersianNumbers(val.distance)} <span className="text-[9px] text-gray-300">کیلومتر</span></span>
                      </div>

                      {/* Active Bar with colored gradient & dynamic shadow */}
                      <div 
                        className={`w-full bg-gradient-to-t ${colors.gradient} ${colors.hover} rounded-t-lg transition-all duration-300 shadow-lg ${colors.shadow} hover:-translate-y-1 hover:blur-[0.2px] cursor-pointer`}
                        style={{ height: `${heightPercent}%` }}
                      ></div>

                      {/* Day/Hour name label with miniature bullet color */}
                      <span className="text-[10px] text-gray-500 dark:text-gray-400 font-extrabold mt-1.5 whitespace-nowrap flex items-center gap-1">
                        {val.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Axis marks under chart */}
            <div className="flex justify-between text-[9px] text-gray-400 dark:text-gray-655 font-sans pt-2 pb-3 px-1">
              {reportRange === 'today' ? (
                <>
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-orange-400 rounded-full inline-block animate-ping"></span>
                    کمربندی صنعتی علی‌آباد کتول (آغاز گره صبحگاهی ترخیص محلی)
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-rose-500 rounded-full inline-block animate-pulse"></span>
                    پیک گمرک مرزی اینچه‌برون (تراکم بالای تعهدات ترانزیتی)
                  </span>
                </>
              ) : reportRange === 'week' ? (
                <>
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full inline-block"></span>
                    (کمینه کارکرد کل هفته در روز جمعه)
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block animate-ping"></span>
                    (اوج کارکرد ترانزیتی در روز سه‌شنبه)
                  </span>
                </>
              ) : (
                <>
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-amber-400 rounded-full inline-block"></span>
                    (کاهش محسوس حجم ترانزیت سیمان در هفته سوم)
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full inline-block animate-ping"></span>
                    (بالاترین حجم کارکرد با ۲,۸۴۰ کیلومتر در هفته چهارم)
                  </span>
                </>
              )}
            </div>
 
            {/* AI Advisor recommendations */}
            <div className="bg-primary-5/40 dark:bg-primary-950/15 border border-primary-100/50 dark:border-primary-900/30 rounded-xl p-3.5 flex items-start gap-3 mt-auto shadow-sm">
              <div className="flex-1 text-xs">
                <span className="font-semibold text-primary-700 dark:text-primary-300 flex items-center gap-1.5 justify-end">
                  توصیه هوشمند پایش سوخت و ترانزیت jupintrace.ir
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                </span>
                <p className="text-gray-600 dark:text-gray-400 mt-1.5 leading-relaxed text-right">
                  {reportRange === 'today' 
                    ? 'پایش ترانزیت روزانه نشان می‌دهد که حد فاصل ساعات ۱۴:۰۰ الی ۱۷:۰۰ به دلیل تغییر شیفت کادر گمرک اینچه برون، متوسط دیرکرد ترخیص تریلرها به حداکثر خود می‌رسد. پیشنهاد می‌شود ترخیص نوبتی از ۱۱:۰۰ صبح سازماندهی شود.'
                    : reportRange === 'week'
                    ? 'بر اساس نمودار ترافیک هفته جاری، با انتقال بیش از ۱۲٪ ترانزیت روز سه‌شنبه به پنج‌شنبه، میزان اتلاف سوخت کل ناوگان در ترافیک‌های کمربندی آزادشهر تا گنبد تا ۷.۴ درصد کاهش می‌یابد.'
                    : 'با تحلیل عملکرد ماهانه ناوگان ترانزیتی استان گلستان، مشخص گردید هفته چهارم به دلیل پیک تعهدات حمل، راندمان مصرف سوخت ناوگان افت داشته است. بهره‌گیری از بهینه‌ساز مسیر جایگزین jupintrace.ir پیشنهاد می‌شود.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Average Fuel Consumption Card */}
      <div className="card flex flex-col p-5 min-h-0">
        {/* Card Header: select filter on each company, labels, info */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3 mb-4 gap-3 flex-shrink-0">
          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-between md:justify-start">
            {/* Selector dropdown for transit companies */}
            <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-800/40 p-1.5 rounded-xl border border-gray-200/40 dark:border-gray-700">
              <label className="text-[10px] text-gray-500 font-extrabold pr-1.5 border-l border-gray-200 dark:border-gray-700 pl-1.5">فیلتر شرکت ترانزیتی:</label>
              <select
                value={selectedCompanyId}
                onChange={(e) => setSelectedCompanyId(e.target.value)}
                className="bg-transparent text-xs font-bold text-primary-650 dark:text-primary-450 outline-none cursor-pointer pr-1"
              >
                <option value="all" className="bg-white dark:bg-gray-900 text-gray-850 dark:text-gray-150">همه شرکت‌ها (کل ناوگان)</option>
                {mockCompanies.map(c => (
                  <option key={c.id} value={c.id} className="bg-white dark:bg-gray-900 text-gray-850 dark:text-gray-150">
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-gray-400 dark:text-gray-550 font-mono">
                {reportRange === 'today' ? 'پایش ساعتی امروز' : reportRange === 'week' ? '۷ روز گذشته' : '۳۰ روز گذشته'}
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping"></span>
            </div>
          </div>
          <h3 className="font-bold text-gray-900 dark:text-white text-sm text-right flex items-center gap-2">
            دستگاه سنجش و مقایسه میانگین مصرف سوخت ناوگان
            <Fuel className="w-4 h-4 text-emerald-500" />
          </h3>
        </div>

        <div className="flex flex-col lg:flex-row gap-5">
          {/* Sidebar Metrics detail */}
          <div className="lg:w-1/4 bg-gray-50/50 dark:bg-gray-900/30 border border-gray-100 dark:border-gray-800/80 rounded-2xl p-4 flex flex-col justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 justify-end mb-1">
                <span className="text-[10px] bg-emerald-100/50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 font-extrabold px-2 py-0.5 rounded-lg font-sans">بهینه</span>
                <span className="text-xs font-bold text-gray-500">شاخص انتخابی</span>
              </div>
              <h4 className="text-[11px] text-gray-450 font-bold text-right mb-2 leading-relaxed">میانگین کل مصرف دوره ({selectedCompanyName}):</h4>
              
              <div className="flex items-baseline justify-end gap-1.5 mb-2 font-mono">
                <span className="text-xs text-gray-400 font-sans">لیتر در ۱۰۰ کیلومتر</span>
                <span className="text-3xl font-extrabold text-gray-950 dark:text-gray-50">{convertToPersianNumbers(averageFuelConsumption)}</span>
              </div>
              
              <p className="text-[10px] text-gray-400 text-right leading-relaxed font-semibold">
                محاسبه نرخ انباشت مصرف نفت‌گاز کل ناوگان شرکت انتخابی با تکیه بر اطلاعات مسافت پیموده شده ردیاب‌ها و الگوهای مصرف مرزی.
              </p>
            </div>

            <div className="border-t border-gray-100 dark:border-gray-800/80 pt-3">
              <span className="text-[10px] text-gray-400 block text-right mb-1.5 font-bold">رتبه‌بندی مصرف شرکت:</span>
              <div className="flex items-center justify-between text-[11px] mb-2 font-bold">
                <span className="text-emerald-500 font-mono">۲۴ الی ۳۸ لیتر</span>
                <span className="text-gray-500">محدوده مصرف استاندارد تریلر</span>
              </div>
              
              {/* Dynamic score summary */}
              <div className="text-[10px] text-primary-700 dark:text-primary-300 bg-primary-50/50 dark:bg-primary-950/20 p-2.5 rounded-xl text-right leading-relaxed font-extrabold">
                {averageFuelConsumption < 30 
                  ? '✅ رتبه بهره‌وری عالی (سبز) و بسیار بهینه در جابجایی کالاها.'
                  : averageFuelConsumption < 34
                  ? 'ℹ️ رتبه بهره‌وری مطلوب و عادی متناسب با ظرفیت ترانزیتی استان.'
                  : '⚠️ هشدار مصرف سوخت بالا به علت توقف در مرز یا استهلاک تریلرها.'}
              </div>
            </div>
          </div>

          {/* Custom Bar Chart Canvas drawing */}
          <div className="flex-1 flex flex-col">
            {/* Chart bars canvas area */}
            <div className="relative w-full h-[200px] border-b border-gray-200 dark:border-gray-800 pb-1 px-4 flex justify-between items-end gap-3 sm:gap-6">
              
              {/* Grid horizontal guidelines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none select-none py-1">
                {[40, 30, 20, 10, 0].map((guide, gIdx) => (
                  <div key={gIdx} className="w-full flex items-center gap-2">
                    <span className="text-[8px] text-gray-400 dark:text-gray-600 font-mono w-5 text-left">{convertToPersianNumbers(guide)}</span>
                    <div className="flex-1 border-t border-dashed border-gray-250/20 dark:border-gray-850/20"></div>
                  </div>
                ))}
              </div>

              {/* Beautiful Fuel Bars */}
              {fuelData.map((val, idx) => {
                const heightPercent = Math.min(100, Math.round((val.consumption / 42) * 100));
                let colors = {
                  gradient: 'from-emerald-500 to-teal-400',
                  bgLight: 'bg-emerald-50 dark:bg-emerald-950/20',
                  text: 'text-emerald-500',
                  shadow: 'shadow-emerald-500/10'
                };
                if (val.consumption > 35) {
                  colors = {
                    gradient: 'from-rose-500 to-pink-500',
                    bgLight: 'bg-rose-50 dark:bg-rose-950/20',
                    text: 'text-rose-500',
                    shadow: 'shadow-rose-500/10'
                  };
                } else if (val.consumption > 32) {
                  colors = {
                    gradient: 'from-amber-500 to-orange-400',
                    bgLight: 'bg-amber-50 dark:bg-amber-950/20',
                    text: 'text-amber-500',
                    shadow: 'shadow-amber-500/10'
                  };
                } else if (val.consumption < 28) {
                  colors = {
                    gradient: 'from-sky-500 to-indigo-500',
                    bgLight: 'bg-sky-50 dark:bg-sky-950/20',
                    text: 'text-sky-500',
                    shadow: 'shadow-sky-500/10'
                  };
                }

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1 group/fuel relative z-10">
                    {/* Floating Tooltip detail info */}
                    <div className="opacity-0 pointer-events-none group-hover/fuel:opacity-100 bg-gray-900 dark:bg-black text-white text-[10px] px-3 py-2 rounded-xl shadow-2xl absolute -top-24 transition-all duration-200 ease-out z-20 whitespace-nowrap text-right border border-gray-800 w-44">
                      <div className="font-extrabold flex items-center justify-between mb-1.5 text-xs text-white">
                        <span className="px-1.5 py-0.5 rounded text-[8px] bg-white/15">رده {val.efficiencyRank}</span>
                        <span>بازه {val.label}</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-gray-300">
                        <span className="font-mono font-bold text-emerald-400">{convertToPersianNumbers(val.consumption)} L/100km</span>
                        <span>متوسط مصرف:</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-gray-300 mt-1">
                        <span className="font-mono font-bold text-gray-200">{convertToPersianNumbers(val.activeTrucks)} تریلر</span>
                        <span>تریلرهای فعال:</span>
                      </div>
                    </div>

                    {/* Bar and background shape */}
                    <div className="w-full bg-gray-100/40 dark:bg-gray-800/10 rounded-xl h-36 flex items-end relative overflow-hidden">
                      <div 
                        className={`w-full bg-gradient-to-t ${colors.gradient} rounded-xl transition-all duration-500 ease-out shadow-lg ${colors.shadow} hover:-translate-y-0.5 hover:scale-105 cursor-pointer`}
                        style={{ height: `${heightPercent}%` }}
                      >
                        <div className="absolute inset-x-0 top-0 h-0.5 bg-white/20 animate-pulse"></div>
                      </div>
                    </div>

                    {/* Fuel liters label overlay */}
                    <span className="font-mono text-[9px] font-extrabold text-gray-500 dark:text-gray-400 mt-1">
                      {convertToPersianNumbers(val.consumption)} <span className="text-[7px] font-sans">لیتر</span>
                    </span>

                    {/* X Axis Time point name label */}
                    <span className="text-[10px] text-gray-500 dark:text-gray-400 font-extrabold">
                      {val.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Axis notes under the Fuel Chart */}
            <div className="flex justify-between text-[9px] text-gray-400 dark:text-gray-550 pt-2 px-1">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-sky-500 rounded-full inline-block"></span>
                کم‌مصرف و سبک (زیر ۲۸ لیتر)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full inline-block"></span>
                مصرف نرمال (۲۸ الی ۳۴ لیتر)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-rose-500 rounded-full inline-block animate-pulse"></span>
                پرمصرف ترانزیتی (بالای ۳۵ لیتر)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Stoppage & Long-term Idle Fleet Monitor Section */}
      <div id="long-term-stops-section" className="card flex flex-col p-5 min-h-0 mt-5 relative">
        
        {/* Floating Custom Toast notifications */}
        {stopToast && (
          <div className="absolute top-4 left-4 bg-teal-500 text-white font-extrabold text-xs px-4 py-2.5 rounded-2xl shadow-2xl z-35 flex items-center gap-2 animate-bounce">
            <CheckCircle className="w-4 h-4" />
            <span>{stopToast.message}</span>
          </div>
        )}

        {/* Card Title & Header elements */}
        <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4 mb-4 gap-3 flex-shrink-0">
          <div className="flex flex-wrap items-center gap-2 w-full xl:w-auto justify-between xl:justify-start">
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-rose-50 dark:bg-rose-950/20 text-rose-500 border border-rose-100 dark:border-rose-900/30 px-2.5 py-0.5 rounded-lg font-bold animate-pulse">
                بروزرسانی زنده
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-ping"></span>
            </div>
          </div>
          <div className="flex flex-col gap-1 text-right">
            <h3 className="font-extrabold text-gray-900 dark:text-white text-sm flex items-center gap-2 justify-end">
              سامانه پایش وقفه‌ها و توقف‌های طولانی‌مدت کل ناوگان
              <Clock className="w-4 h-4 text-indigo-500" />
            </h3>
            <p className="text-[10px] text-gray-450 leading-relaxed font-semibold">شناسایی، ردگیری و تحلیل تریلرهای متوقف مانده در مبادی لجستیکی، بنادر و مرزهای مواصلاتی استان گلستان</p>
          </div>
        </div>

        {/* Fleet Stoppage Analytics Metrics Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mb-5 select-none hover:cursor-default">
          <div className="bg-gray-50/70 dark:bg-gray-800/10 p-3.5 rounded-2xl border border-gray-100/50 dark:border-gray-800/40 flex flex-col items-end">
            <span className="text-[10px] text-gray-450 dark:text-gray-400 font-extrabold mb-1">کل تریلرهای متوقف جاری</span>
            <div className="flex items-baseline gap-1">
              <span className="text-[9px] text-gray-400 font-semibold font-sans">دستگاه تریلر</span>
              <span className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400 font-mono">
                {convertToPersianNumbers(stopStatistics.totalCount)}
              </span>
            </div>
          </div>

          <div className="bg-gray-50/70 dark:bg-gray-800/10 p-3.5 rounded-2xl border border-gray-100/50 dark:border-gray-800/40 flex flex-col items-end">
            <span className="text-[10px] text-gray-450 dark:text-gray-400 font-extrabold mb-1">میانگین معطلی کل رانندگان</span>
            <div className="flex items-baseline gap-1">
              <span className="text-[9px] text-gray-400 font-semibold font-sans">ساعت انتظار</span>
              <span className="text-xl font-extrabold text-gray-800 dark:text-gray-100 font-mono">
                {convertToPersianNumbers(stopStatistics.avgDuration)}
              </span>
            </div>
          </div>

          <div className="bg-gray-50/70 dark:bg-gray-800/10 p-3.5 rounded-2xl border border-gray-100/50 dark:border-gray-800/40 flex flex-col items-end">
            <span className="text-[10px] text-gray-450 dark:text-gray-400 font-extrabold mb-1">بیشترین رکورد توقف</span>
            <div className="flex items-baseline gap-1">
              <span className="text-[9px] text-gray-400 font-semibold font-sans">ساعت متوالی</span>
              <span className="text-xl font-extrabold text-amber-600 dark:text-amber-500 font-mono">
                {convertToPersianNumbers(stopStatistics.maxDuration)}
              </span>
            </div>
          </div>

          <div className="bg-gray-50/70 dark:bg-gray-800/10 p-3.5 rounded-2xl border border-gray-100/50 dark:border-gray-800/40 flex flex-col items-end">
            <span className="text-[10px] text-gray-450 dark:text-gray-400 font-extrabold mb-1">توقف مفرط و بحرانی (بالای ۳۶ ساعت)</span>
            <div className="flex items-baseline gap-1">
              <span className="text-[9px] text-gray-400 font-semibold font-sans">مورد اضطرار</span>
              <span className="text-xl font-extrabold text-rose-500 font-mono data-animate animate-pulse">
                {convertToPersianNumbers(stopStatistics.criticalCount)}
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Filters Bar */}
        <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-3 p-3 bg-gray-50/40 dark:bg-gray-900/15 border border-gray-150/45 dark:border-gray-800/50 rounded-2xl mb-4 text-xs font-bold font-sans">
          
          {/* Right Filters fields */}
          <div className="flex flex-wrap items-center gap-2.5 justify-end flex-1">
            {/* Sort by dropdown */}
            <div className="flex items-center gap-1.5 bg-white dark:bg-gray-850 p-1.5 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
              <select
                value={stopSortBy}
                onChange={(e) => setStopSortBy(e.target.value as any)}
                className="bg-transparent text-[11px] font-bold text-gray-650 dark:text-gray-300 outline-none cursor-pointer pr-1 flex items-center"
              >
                <option value="duration-desc">توقف طولانی به کوتاه</option>
                <option value="duration-asc">توقف کوتاه به طولانی</option>
                <option value="driver">ترتیب نام راننده</option>
              </select>
              <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
            </div>

            {/* Minimum duration threshold select option */}
            <div className="flex items-center gap-1.5 bg-white dark:bg-gray-850 p-1.5 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
              <select
                value={stopMinDuration}
                onChange={(e) => {
                  setStopMinDuration(Number(e.target.value));
                  setVisibleStopsCount(6); // Reset pagination
                }}
                className="bg-transparent text-[11px] font-bold text-gray-650 dark:text-gray-300 outline-none cursor-pointer pr-1"
              >
                <option value={0}>تمام توقف‌ها</option>
                <option value={4}>توقف بالای ۴ ساعت</option>
                <option value={12}>توقف بالای ۱۲ ساعت</option>
                <option value={24}>توقف بالای ۲۴ ساعت</option>
                <option value={36}>توقف بالا و بحرانی (بیش از ۳۶ ساعت)</option>
              </select>
              <Filter className="w-3.5 h-3.5 text-gray-400" />
            </div>

            {/* Company select box */}
            <div className="flex items-center gap-1.5 bg-white dark:bg-gray-850 p-1.5 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
              <select
                value={stopCompanyFilter}
                onChange={(e) => {
                  setStopCompanyFilter(e.target.value);
                  setVisibleStopsCount(6); // Reset pagination
                }}
                className="bg-transparent text-[11px] font-bold text-gray-650 dark:text-gray-300 outline-none cursor-pointer pr-1"
              >
                <option value="all">همه شرکت‌های لجستیکی</option>
                {mockCompanies.map(comp => (
                  <option key={comp.id} value={comp.id}>{comp.name}</option>
                ))}
              </select>
              <Building className="w-3.5 h-3.5 text-gray-400" />
            </div>
          </div>

          {/* Search bar input elements */}
          <div className="relative w-full xl:w-80 flex-shrink-0">
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              dir="rtl"
              value={stopSearch}
              onChange={(e) => {
                setStopSearch(e.target.value);
                setVisibleStopsCount(6); // Reset pagination
              }}
              placeholder="جستجوی راننده، مدل، پلاک، کالا، پایانه..."
              className="w-full pl-3 pr-9 py-2 rounded-xl bg-white dark:bg-gray-850 border border-gray-150/80 dark:border-gray-800 text-xs font-semibold text-gray-800 dark:text-gray-100 outline-none focus:ring-2 focus:ring-indigo-500/30 font-sans text-right placeholder-gray-400 dark:placeholder-gray-550"
            />
          </div>
        </div>

        {/* List of Fleet Stops */}
        {filteredStops.length === 0 ? (
          <div className="p-10 border border-dashed border-gray-200 dark:border-gray-800 rounded-2xl text-center bg-gray-50/10 dark:bg-gray-900/5 flex flex-col justify-center items-center">
            <AlertCircle className="w-8 h-8 text-gray-300 dark:text-gray-650 mb-2.5 animate-bounce" />
            <span className="text-xs font-extrabold text-gray-400 block pb-1">هیچ وقفه فعالی منطبق با فیلترها و کلمات جستجو پیدا نشد.</span>
            <button
              onClick={() => {
                setStopSearch('');
                setStopCompanyFilter('all');
                setStopMinDuration(0);
              }}
              className="mt-3 text-[10px] font-extrabold text-primary-600 bg-primary-50 dark:bg-primary-950/20 hover:scale-105 active:scale-95 px-3 py-1.5 rounded-lg transition-all"
            >
              پاک‌کردن تمامی فیلترهای پایش
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            
            {/* Grid rows cards items */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredStops.slice(0, visibleStopsCount).map((s) => {
                const isCritical = s.duration >= 36;
                const isWarning = s.duration >= 18 && s.duration < 36;
                
                // Iran plate details format
                const plate = formatLicenseToPlate(s.license);

                return (
                  <div 
                    key={s.id} 
                    className="border border-gray-100 dark:border-gray-800/80 hover:border-indigo-500/20 dark:hover:border-indigo-400/20 bg-white dark:bg-gray-900/25 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between gap-3 relative overflow-hidden"
                  >
                    {/* Top status & header badge */}
                    <div className="flex items-center justify-between">
                      {/* Stylized Iranian Car Plate */}
                      <div className="flex items-center border border-gray-250 dark:border-gray-700 bg-white dark:bg-gray-800 rounded text-[10px] h-6 overflow-hidden select-none font-mono font-bold leading-none shadow-sm flex-shrink-0">
                        <div className="bg-blue-600 w-1.5 h-full"></div>
                        <span className="px-1 text-gray-850 dark:text-gray-150">{plate.part1}</span>
                        <span className="px-1.5 bg-gray-50 dark:bg-gray-900 border-x border-gray-200 dark:border-gray-700 text-primary-500 font-sans leading-none flex items-center justify-center pt-0.5">{plate.letter}</span>
                        <span className="px-1 text-gray-850 dark:text-gray-150">{plate.part2}</span>
                        <div className="bg-gray-100 dark:bg-gray-900 text-[8px] px-1 h-full flex flex-col justify-center items-center border-r border-gray-200 dark:border-gray-700 leading-none pb-0.5">
                          <span className="text-[5.5px] text-gray-400 dark:text-gray-550 font-sans leading-none pt-0.5">ایران</span>
                          <span className="font-extrabold">{plate.province}</span>
                        </div>
                      </div>

                      {/* Stoppage Time duration indicator */}
                      <div className="flex items-center gap-1 font-mono">
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-lg border ${
                          isCritical 
                            ? 'bg-rose-50 border-rose-100/55 text-rose-550 dark:bg-rose-950/20 dark:border-rose-900/30 dark:text-rose-400 animate-pulse' 
                            : isWarning 
                            ? 'bg-amber-50 border-amber-100/55 text-amber-600 dark:bg-amber-950/20 dark:border-amber-900/30 dark:text-amber-400'
                            : 'bg-emerald-50 border-emerald-100/55 text-emerald-600 dark:bg-emerald-950/20 dark:border-emerald-900/30 dark:text-emerald-400'
                        }`}>
                          {convertToPersianNumbers(s.duration)} ساعت
                        </span>
                      </div>
                    </div>

                    {/* Driver, vehicle and company names card body section */}
                    <div className="text-right border-b border-gray-100/50 dark:border-gray-800/40 pb-3 mt-1">
                      <h4 className="font-extrabold text-xs text-gray-900 dark:text-white flex items-center gap-1.5 justify-end">
                        {s.driver}
                        <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 inline-block"></span>
                      </h4>
                      <p className="text-[10px] text-gray-450 dark:text-gray-400 font-bold mt-1 font-sans">{s.vehicleName}</p>
                      <span className="text-[8.5px] text-gray-500 dark:text-gray-400 mt-1.5 block font-bold bg-gray-50 dark:bg-gray-800/40 px-2 py-0.5 rounded border border-gray-100 dark:border-gray-800/50 inline-block">
                        {s.companyName}
                      </span>
                    </div>

                    {/* Stopper location and stoppage justification details */}
                    <div className="text-right flex flex-col gap-2">
                      <div className="flex items-start gap-1.5 justify-end text-[10px] leading-relaxed font-semibold">
                        <div className="flex-1 text-gray-700 dark:text-gray-300 font-bold">{s.location}</div>
                        <MapPin className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0 mt-0.5" />
                      </div>

                      <div className="flex items-start gap-1.5 justify-end text-[10px] leading-relaxed font-semibold">
                        <div className="flex-1 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-850/20 p-2.5 rounded-xl text-justify border border-gray-100 dark:border-gray-800">
                          {s.reason}
                        </div>
                        <AlertCircle className={`w-3.5 h-3.5 flex-shrink-0 mt-0.5 ${
                          isCritical ? 'text-rose-500' : 'text-gray-400'
                        }`} />
                      </div>
                    </div>

                    {/* Start duration and action footer row */}
                    <div className="flex items-center justify-between border-t border-gray-100/50 dark:border-gray-850/50 pt-3 mt-1">
                      {/* Action trigger button */}
                      <button
                        onClick={() => triggerStopAction(`📡 درخواست اعلام موقعیت فوری به ردیاب خودرو و برقراری تماس مخابراتی با راننده (${s.driver}) ارسال گردید.`)}
                        className="text-[9px] font-bold text-indigo-650 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/25 px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-all hover:scale-105 active:scale-95"
                      >
                        <Phone className="w-3 h-3 text-indigo-500" />
                        <span>کنترل وضعیت و تماس</span>
                      </button>

                      {/* Start time label detail */}
                      <span className="text-[9px] text-gray-400 dark:text-gray-500 font-bold flex items-center gap-1 justify-end">
                        <span>شروع توقف: {s.startTime}</span>
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Load more paginator control triggers */}
            {filteredStops.length > visibleStopsCount && (
              <div className="flex justify-center mt-3">
                <button
                  onClick={() => setVisibleStopsCount(prev => prev + 6)}
                  className="px-6 py-2 border border-gray-200 dark:border-gray-800 text-xs text-gray-600 dark:text-gray-300 font-extrabold hover:bg-gray-100 dark:hover:bg-gray-850/40 rounded-2xl shadow-sm transition-all flex items-center gap-2 hover:scale-105"
                >
                  <span>بارگذاری و نمایش {convertToPersianNumbers(Math.min(6, filteredStops.length - visibleStopsCount))} توقف دیگر</span>
                  <Clock className="w-3.5 h-3.5 text-indigo-500 animate-spin" style={{ animationDuration: '6s' }} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* NEW SECTION: Predictive Maintenance & Service Schedule Forecast */}
      <div id="predictive-maintenance-section" className="card flex flex-col p-5 min-h-0 mt-5 relative">
        
        {/* Floating Custom Toast notifications */}
        {maintToast && (
          <div className="absolute top-4 left-4 bg-emerald-500 text-white font-extrabold text-xs px-4 py-2.5 rounded-2xl shadow-2xl z-35 flex items-center gap-2 animate-bounce">
            <CheckCircle className="w-4 h-4" />
            <span>{maintToast.message}</span>
          </div>
        )}

        {/* Card Title & Header elements */}
        <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4 mb-4 gap-3 flex-shrink-0">
          <div className="flex flex-wrap items-center gap-2 w-full xl:w-auto justify-between xl:justify-start">
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500 border border-indigo-100 dark:border-indigo-900/30 px-2.5 py-0.5 rounded-lg font-bold animate-pulse">
                هوشمند / هوش مصنوعی لجستیک
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-550 animate-ping"></span>
            </div>
          </div>
          <div className="flex flex-col gap-1 text-right">
            <h3 className="font-extrabold text-gray-900 dark:text-white text-sm flex items-center gap-2 justify-end">
              سیستم پیش‌بینی زمان سرویس دوره‌ای و مدیریت نگهداری پیشگیرانه (PM)
              <Wrench className="w-4 h-4 text-indigo-505" />
            </h3>
            <p className="text-[10px] text-gray-450 leading-relaxed font-semibold">تخمین فرسودگی قطعات مصرفی بر اساس الگوریتم استهلاک کارکرد (کیلومتر)، میانگین مسافت پیموده شده روزانه و پایش سلامت ناوگان</p>
          </div>
        </div>

        {/* Fleet Maintenance Metrics Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mb-5 select-none hover:cursor-default">
          <div className="bg-gray-50/70 dark:bg-gray-800/10 p-3.5 rounded-2xl border border-gray-100/50 dark:border-gray-800/40 flex flex-col items-end justify-between">
            <span className="text-[10px] text-gray-450 dark:text-gray-400 font-extrabold mb-1">تریلرهای نیازمند سرویس فوری</span>
            <div className="flex items-baseline gap-1">
              <span className="text-[9px] text-gray-400 font-semibold font-sans">بحرانی (زیر ۹ روز)</span>
              <span className="text-xl font-extrabold text-rose-600 dark:text-rose-400 font-mono">
                {convertToPersianNumbers(maintenanceStats.critical)}
              </span>
            </div>
          </div>

          <div className="bg-gray-50/70 dark:bg-gray-800/10 p-3.5 rounded-2xl border border-gray-100/50 dark:border-gray-800/40 flex flex-col items-end justify-between">
            <span className="text-[10px] text-gray-450 dark:text-gray-400 font-extrabold mb-1">خودروها در مرز هشدار سرویس</span>
            <div className="flex items-baseline gap-1">
              <span className="text-[9px] text-gray-400 font-semibold font-sans">تریلر غیربحرانی</span>
              <span className="text-xl font-extrabold text-amber-500 font-mono">
                {convertToPersianNumbers(maintenanceStats.warning)}
              </span>
            </div>
          </div>

          <div className="bg-gray-50/70 dark:bg-gray-800/10 p-3.5 rounded-2xl border border-gray-100/50 dark:border-gray-800/40 flex flex-col items-end justify-between">
            <span className="text-[10px] text-gray-450 dark:text-gray-400 font-extrabold mb-1">متوسط مهلت سرویس ناوگان</span>
            <div className="flex items-baseline gap-1">
              <span className="text-[9px] text-gray-400 font-semibold font-sans">روزهای باقیمانده</span>
              <span className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400 font-mono animate-pulse">
                {convertToPersianNumbers(maintenanceStats.avgDays)}
              </span>
            </div>
          </div>

          <div className="bg-gray-50/70 dark:bg-gray-800/10 p-3.5 rounded-2xl border border-gray-100/50 dark:border-gray-800/40 flex flex-col items-end justify-between">
            <span className="text-[10px] text-gray-450 dark:text-gray-400 font-extrabold mb-1">تخمین بودجه نگهداری پیشگیرانه</span>
            <div className="flex items-baseline gap-1">
              <span className="text-[9px] text-gray-400 font-semibold font-sans">میلیون تومان استان</span>
              <span className="text-xl font-extrabold text-emerald-550 font-mono">
                {convertToPersianNumbers(maintenanceStats.estimatedCostMlnTomans)}
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Maintenance Filters Bar */}
        <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-3 p-3 bg-gray-50/40 dark:bg-gray-900/15 border border-gray-150/45 dark:border-gray-800/50 rounded-2xl mb-4 text-xs font-bold font-sans">
          
          {/* Right Filter fields */}
          <div className="flex flex-wrap items-center gap-2.5 justify-end flex-1">
            {/* Status priority filter */}
            <div className="flex items-center gap-1.5 bg-white dark:bg-gray-850 p-1.5 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
              <select
                value={maintStatusFilter}
                onChange={(e) => {
                  setMaintStatusFilter(e.target.value as any);
                  setVisibleMaintCount(6); // Reset pagination
                }}
                className="bg-transparent text-[11px] font-bold text-gray-650 dark:text-gray-300 outline-none cursor-pointer pr-1"
              >
                <option value="all">همه اولویت‌های سلامت</option>
                <option value="critical">🚨 نیاز فوری و حیاتی (بحرانی)</option>
                <option value="warning">⚠️ در مرز سرویس (هشدار)</option>
                <option value="safe">✅ کارکرد نرمال و منظم (پایدار)</option>
              </select>
              <Filter className="w-3.5 h-3.5 text-gray-400" />
            </div>

            {/* Company select box */}
            <div className="flex items-center gap-1.5 bg-white dark:bg-gray-850 p-1.5 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
              <select
                value={maintCompanyFilter}
                onChange={(e) => {
                  setMaintCompanyFilter(e.target.value);
                  setVisibleMaintCount(6); // Reset pagination
                }}
                className="bg-transparent text-[11px] font-bold text-gray-650 dark:text-gray-300 outline-none cursor-pointer pr-1"
              >
                <option value="all">همه شرکت‌های ترانزیتی</option>
                {mockCompanies.map(comp => (
                  <option key={comp.id} value={comp.id}>{comp.name}</option>
                ))}
              </select>
              <Building className="w-3.5 h-3.5 text-gray-400" />
            </div>
          </div>

          {/* Search bar input elements */}
          <div className="relative w-full xl:w-80 flex-shrink-0">
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              dir="rtl"
              value={maintSearch}
              onChange={(e) => {
                setMaintSearch(e.target.value);
                setVisibleMaintCount(6); // Reset pagination
              }}
              placeholder="جستجوی مدل تریلر، راننده یا شماره پلاک..."
              className="w-full pl-3 pr-9 py-2 rounded-xl bg-white dark:bg-gray-850 border border-gray-150/80 dark:border-gray-800 text-xs font-semibold text-gray-800 dark:text-gray-100 outline-none focus:ring-2 focus:ring-indigo-500/30 font-sans text-right placeholder-gray-400 dark:placeholder-gray-550"
            />
          </div>
        </div>

        {/* List of maintenance predictions */}
        {filteredMaintenance.length === 0 ? (
          <div className="p-10 border border-dashed border-gray-200 dark:border-gray-800 rounded-2xl text-center bg-gray-50/10 dark:bg-gray-900/5 flex flex-col justify-center items-center">
            <AlertCircle className="w-8 h-8 text-gray-300 dark:text-gray-650 mb-2.5" />
            <span className="text-xs font-extrabold text-gray-400 block pb-1">هیچ تریلری منطبق با معیارهای جستجوی سلامت فنی شما یافت نشد.</span>
            <button
              onClick={() => {
                setMaintSearch('');
                setMaintCompanyFilter('all');
                setMaintStatusFilter('all');
              }}
              className="mt-3 text-[10px] font-extrabold text-primary-650 bg-primary-50 dark:bg-primary-950/20 px-3 py-1.5 rounded-lg transition-all"
            >
              ریست کردن فیلترهای فنی
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            
            {/* Grid rows cards items */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredMaintenance.slice(0, visibleMaintCount).map((m) => {
                const isCrit = m.priority === 'critical';
                const isWarn = m.priority === 'warning';
                
                // Iran plate details format
                const plate = formatLicenseToPlate(m.license);

                return (
                  <div 
                    key={m.id} 
                    className="border border-gray-100 dark:border-gray-800/80 hover:border-indigo-500/20 dark:hover:border-indigo-400/20 bg-white dark:bg-gray-900/25 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between gap-4 relative overflow-hidden"
                  >
                    {/* Top status & header badge */}
                    <div className="flex items-center justify-between">
                      {/* Stylized Iranian Car Plate */}
                      <div className="flex items-center border border-gray-250 dark:border-gray-700 bg-white dark:bg-gray-800 rounded text-[10px] h-6 overflow-hidden select-none font-mono font-bold leading-none shadow-sm flex-shrink-0">
                        <div className="bg-blue-600 w-1.5 h-full"></div>
                        <span className="px-1 text-gray-850 dark:text-gray-150">{plate.part1}</span>
                        <span className="px-1.5 bg-gray-50 dark:bg-gray-900 border-x border-gray-200 dark:border-gray-700 text-primary-500 font-sans leading-none flex items-center justify-center pt-0.5">{plate.letter}</span>
                        <span className="px-1 text-gray-850 dark:text-gray-150">{plate.part2}</span>
                        <div className="bg-gray-100 dark:bg-gray-900 text-[8px] px-1 h-full flex flex-col justify-center items-center border-r border-gray-200 dark:border-gray-700 leading-none pb-0.5">
                          <span className="text-[5.5px] text-gray-400 dark:text-gray-550 font-sans leading-none pt-0.5">ایران</span>
                          <span className="font-extrabold">{plate.province}</span>
                        </div>
                      </div>

                      {/* Remaining duration/days till repair shop visit */}
                      <div className="flex items-center gap-1">
                        <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-xl border ${
                          isCrit 
                            ? 'bg-rose-50 border-rose-150 text-rose-600 dark:bg-rose-950/20 dark:border-rose-900/30 dark:text-rose-450 animate-pulse' 
                            : isWarn 
                            ? 'bg-amber-50 border-amber-150 text-amber-600 dark:bg-amber-950/20 dark:border-amber-900/30 dark:text-amber-400'
                            : 'bg-emerald-50 border-emerald-150 text-emerald-600 dark:bg-emerald-950/20 dark:border-emerald-900/30 dark:text-emerald-450'
                        }`}>
                          {m.estDaysRemaining === 0 
                            ? 'سرویس فوری امروز' 
                            : `مراجعه به تعمیرگاه تا ${convertToPersianNumbers(m.estDaysRemaining)} روز آینده (${convertToPersianNumbers(m.shortestKm)} کیلومتر)`}
                        </span>
                      </div>
                    </div>

                    {/* Driver, vehicle, overall mileage, company and daily usage */}
                    <div className="text-right border-b border-gray-100 dark:border-gray-800 pb-3">
                      <div className="flex items-center justify-between pb-1.5">
                        <div className="flex items-baseline gap-1 bg-gray-50 dark:bg-gray-800 px-2.5 py-1 rounded-xl font-mono text-[10px] font-bold text-gray-700 dark:text-gray-300">
                          <span>کیلومتر</span>
                          <span className="text-sm font-extrabold text-gray-950 dark:text-white">
                            {convertToPersianNumbers(m.currentOdometer.toLocaleString())}
                          </span>
                        </div>
                        <h4 className="font-extrabold text-xs text-gray-900 dark:text-white flex items-center gap-1.5 justify-end">
                          {m.driver}
                          <span className="h-2 w-2 rounded-full bg-indigo-500 inline-block"></span>
                        </h4>
                      </div>

                      <div className="flex justify-between items-center text-[10px] text-gray-500 font-bold">
                        <span className="font-sans text-[9px] text-gray-400">
                          متوسط تردد روزانه: {convertToPersianNumbers(m.dailyAverage)} ک‌م در روز
                        </span>
                        <span className="font-sans pb-1">{m.vehicleName} ({m.companyName})</span>
                      </div>
                    </div>

                    {/* Technical components progress meters Grid */}
                    <div className="grid grid-cols-2 gap-x-4 gap-y-3 pb-2 select-none">
                      
                      {/* Sub Oil Progress Bar */}
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between text-[9px] font-extrabold text-gray-500">
                          <span className="font-mono">{convertToPersianNumbers(m.oilPercentage)}٪</span>
                          <span>روغن موتور (۱۵,۰۰۰ ک‌م)</span>
                        </div>
                        <div className="w-full bg-gray-100 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${
                              m.oilPercentage > 90 ? 'bg-rose-500' : m.oilPercentage > 75 ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${Math.min(100, m.oilPercentage)}%` }}
                          />
                        </div>
                      </div>

                      {/* Sub Brake pads Progress Bar */}
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between text-[9px] font-extrabold text-gray-500 font-sans">
                          <span className="font-mono">{convertToPersianNumbers(m.brakePercentage)}٪</span>
                          <span>لنت ترمز (۴۰,۰۰۰ ک‌م)</span>
                        </div>
                        <div className="w-full bg-gray-100 dark:bg-gray-850 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${
                              m.brakePercentage > 90 ? 'bg-rose-500' : m.brakePercentage > 75 ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${Math.min(100, m.brakePercentage)}%` }}
                          />
                        </div>
                      </div>

                      {/* Sub Tires rotation Progress Bar */}
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between text-[9px] font-extrabold text-gray-500">
                          <span className="font-mono">{convertToPersianNumbers(m.tiresPercentage)}٪</span>
                          <span>سایش لاستیک‌ها (۸۰,۰۰۰ ک‌م)</span>
                        </div>
                        <div className="w-full bg-gray-100 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${
                              m.tiresPercentage > 90 ? 'bg-rose-500' : m.tiresPercentage > 75 ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${Math.min(100, m.tiresPercentage)}%` }}
                          />
                        </div>
                      </div>

                      {/* Sub Belt & Hydraulics comprehensive check progress */}
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between text-[9px] font-extrabold text-gray-500">
                          <span className="font-mono">{convertToPersianNumbers(m.enginePercentage)}٪</span>
                          <span>تسمه تایم و فیلترها (۶۰,۰۰۰ ک‌م)</span>
                        </div>
                        <div className="w-full bg-gray-100 dark:bg-gray-850 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${
                              m.enginePercentage > 90 ? 'bg-rose-500' : m.enginePercentage > 75 ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${Math.min(100, m.enginePercentage)}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Recommendation details written in professional Persian */}
                    <div className="text-right bg-gray-50 dark:bg-gray-900/50 p-2.5 rounded-2xl border border-gray-100 dark:border-gray-800/80 text-[10px] leading-relaxed font-semibold">
                      <p className={isCrit ? 'text-rose-650 dark:text-rose-400' : isWarn ? 'text-amber-650 dark:text-amber-400' : 'text-gray-550 dark:text-gray-400'}>
                        {m.recommendation}
                      </p>
                    </div>

                    {/* Action footer triggers row */}
                    <div className="flex items-center justify-between border-t border-gray-100/50 dark:border-gray-850/50 pt-3 mt-1 text-[10px] font-extrabold">
                      {/* Action trigger button */}
                      <button
                        onClick={() => triggerMaintAction(`📅 دستور تعویض قطعات پیشگیرانه تریلر ${m.driver} صادر شد. نوبت رزرو تعمیرگاه در اولین پنجشنبه پیش‌رو در منطقه صنعتی گرگان ثبت گردید.`)}
                        className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 ${
                          isCrit
                            ? 'bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/30 dark:hover:bg-rose-950/55 dark:text-rose-400'
                            : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-600 dark:bg-indigo-950/30 dark:hover:bg-indigo-950/55 dark:text-indigo-400'
                        }`}
                      >
                        <Wrench className="w-3.5 h-3.5" />
                        <span>صدور دستور کار و نوبت تعمیرگاه</span>
                      </button>

                      {/* Display warning icon or stable badge */}
                      <span className="flex items-center gap-1 text-gray-400">
                        {isCrit ? (
                          <span className="flex items-center gap-1 text-rose-500 font-bold">
                            <span>اولویت بسیار بالا</span>
                            <Activity className="w-3.5 h-3.5 animate-pulse" />
                          </span>
                        ) : isWarn ? (
                          <span className="flex items-center gap-1 text-amber-500 font-bold">
                            <span>اولویت متوسط</span>
                            <Gauge className="w-3.5 h-3.5" />
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-emerald-500 font-bold">
                            <span>وضعیت پایدار</span>
                            <ShieldCheck className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </span>
                    </div>

                  </div>
                );
              })}
            </div>

            {/* Load more logic pagination */}
            {filteredMaintenance.length > visibleMaintCount && (
              <div className="flex justify-center mt-3">
                <button
                  onClick={() => setVisibleMaintCount(prev => prev + 6)}
                  className="px-6 py-2 border border-gray-200 dark:border-gray-800 text-xs text-gray-650 dark:text-gray-300 font-extrabold hover:bg-gray-100 dark:hover:bg-gray-850/40 rounded-2xl shadow-sm transition-all flex items-center gap-2 hover:scale-105"
                >
                  <span>نمایش {convertToPersianNumbers(Math.min(6, filteredMaintenance.length - visibleMaintCount))} وسیله نقلیه دیگر</span>
                  <Wrench className="w-3.5 h-3.5 text-indigo-500 animate-spin" style={{ animationDuration: '6s' }} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* SECTION: Oil & Filter Maintenance Monitoring Table */}
      <div id="oil-filters-monitoring-section" className="card flex flex-col p-5 min-h-0 mt-5 relative">
        
        {/* Floating Custom section Toast notification */}
        {oilTableToast && (
          <div className="absolute top-4 left-4 bg-emerald-500 text-white font-extrabold text-[11px] px-4 py-2.5 rounded-2xl shadow-2xl z-40 flex items-center gap-2 animate-bounce">
            <CheckCircle className="w-4 h-4" />
            <span>{oilTableToast.message}</span>
          </div>
        )}

        {/* Section Header */}
        <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4 mb-4 gap-3 flex-shrink-0">
          <div className="flex flex-wrap items-center gap-2 w-full xl:w-auto justify-between xl:justify-start">
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-sky-50 dark:bg-sky-950/20 text-sky-650 border border-sky-100 dark:border-sky-900/30 px-2.5 py-0.5 rounded-lg font-bold">
                پایش لحظه‌ای استهلاک روغن و فیلترها
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-sky-600 animate-ping"></span>
            </div>
          </div>
          <div className="flex flex-col gap-1 text-right">
            <h3 className="font-extrabold text-gray-900 dark:text-white text-sm flex items-center gap-2 justify-end">
              جدول سراسری پایش استهلاک روغن موتور و فیلترهای ناوگان ترانزیتی
              <Droplet className="w-4 h-4 text-sky-500 fill-sky-200 dark:fill-sky-900/30" />
            </h3>
            <p className="text-[10px] text-gray-450 leading-relaxed font-semibold">
              روانکار موتور (حدمجاز ۱۵,۰۰۰ ک‌م) و فیلترها (حدمجاز ۱۰,۰۰۰ ک‌م) بر مبنای مسافت پیموده شده واقعی
            </p>
          </div>
        </div>

        {/* Fleet Oil Status Aggregate Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mb-5 select-none hover:cursor-default">
          <div className="bg-gray-50/60 dark:bg-gray-800/5 p-3.5 rounded-2xl border border-gray-100/50 dark:border-gray-800/40 flex flex-col items-end justify-between">
            <span className="text-[10px] text-gray-400 dark:text-gray-400 font-extrabold mb-1">ناوگان با وضعیت نیازمند سرویس</span>
            <div className="flex items-baseline gap-1">
              <span className="text-[9px] text-rose-500 font-bold">بحرانی</span>
              <span className="text-xl font-extrabold text-rose-600 dark:text-rose-400 font-mono">
                {convertToPersianNumbers(oilAggregateStats.critical)}
              </span>
            </div>
          </div>

          <div className="bg-gray-50/60 dark:bg-gray-800/5 p-3.5 rounded-2xl border border-gray-100/50 dark:border-gray-800/40 flex flex-col items-end justify-between">
            <span className="text-[10px] text-gray-400 dark:text-gray-400 font-extrabold mb-1">خودروها در آستانه تعویض</span>
            <div className="flex items-baseline gap-1">
              <span className="text-[9px] text-amber-500 font-bold">پایش هشدار</span>
              <span className="text-xl font-extrabold text-amber-500 font-mono">
                {convertToPersianNumbers(oilAggregateStats.warning)}
              </span>
            </div>
          </div>

          <div className="bg-gray-50/60 dark:bg-gray-800/5 p-3.5 rounded-2xl border border-gray-100/50 dark:border-gray-800/40 flex flex-col items-end justify-between">
            <span className="text-[10px] text-gray-400 dark:text-gray-400 font-extrabold mb-1">میانگین کیفیت روانکار کل ناوگان</span>
            <div className="flex items-baseline gap-1">
              <span className="text-[9px] text-emerald-550 font-bold">ظرفیت پیشگیری</span>
              <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                {convertToPersianNumbers(oilAggregateStats.avgOilLifeLeft)}٪
              </span>
            </div>
          </div>

          <div className="bg-gray-50/60 dark:bg-gray-800/5 p-3.5 rounded-2xl border border-gray-100/50 dark:border-gray-800/40 flex flex-col items-end justify-between">
            <span className="text-[10px] text-gray-400 dark:text-gray-400 font-extrabold mb-1">خودروها با روانکار کاملا سالم</span>
            <div className="flex items-baseline gap-1">
              <span className="text-[9px] text-emerald-500 font-bold">سطح ایمن</span>
              <span className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400 font-mono">
                {convertToPersianNumbers(oilAggregateStats.safe)}
              </span>
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-3 p-3 bg-gray-50/40 dark:bg-gray-900/15 border border-gray-150/45 dark:border-gray-800/50 rounded-2xl mb-4 text-xs font-bold font-sans">
          
          {/* Filters Select boxes */}
          <div className="flex flex-wrap items-center gap-2.5 justify-end flex-1">
            {/* Status priority filter */}
            <div className="flex items-center gap-1.5 bg-white dark:bg-gray-850 p-1.5 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
              <select
                value={oilStatusFilter}
                onChange={(e) => {
                  setOilStatusFilter(e.target.value as any);
                  setVisibleOilCount(8); // Reset pagination
                }}
                className="bg-transparent text-[11px] font-bold text-gray-650 dark:text-gray-300 outline-none cursor-pointer pr-1 text-right"
              >
                <option value="all">همه وضعیت‌های سرویس</option>
                <option value="critical">🚨 نیازمند سرویس فوری</option>
                <option value="warning">⚠️ در آستانه تعویض</option>
                <option value="safe">✅ سالم و منظم</option>
              </select>
              <Filter className="w-3.5 h-3.5 text-gray-400" />
            </div>

            {/* Company select box */}
            <div className="flex items-center gap-1.5 bg-white dark:bg-gray-850 p-1.5 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
              <select
                value={oilCompanyFilter}
                onChange={(e) => {
                  setOilCompanyFilter(e.target.value);
                  setVisibleOilCount(8); // Reset pagination
                }}
                className="bg-transparent text-[11px] font-bold text-gray-650 dark:text-gray-300 outline-none cursor-pointer pr-1 text-right"
              >
                <option value="all">همه شرکت‌ها</option>
                {mockCompanies.map(comp => (
                  <option key={comp.id} value={comp.id}>{comp.name}</option>
                ))}
              </select>
              <Building className="w-3.5 h-3.5 text-gray-400" />
            </div>

            {/* Sorting select box */}
            <div className="flex items-center gap-1.5 bg-white dark:bg-gray-850 p-1.5 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
              <select
                value={oilSortBy}
                onChange={(e) => {
                  setOilSortBy(e.target.value as any);
                  setVisibleOilCount(8);
                }}
                className="bg-transparent text-[11px] font-bold text-gray-650 dark:text-gray-300 outline-none cursor-pointer pr-1 text-right"
              >
                <option value="oil-remaining-asc">اولویت استهلاک روغن موتور ⬆️</option>
                <option value="filters-remaining-asc">اولویت استهلاک فیلترها ⬆️</option>
                <option value="odometer-desc">کارکرد کل خودرو ⬇️</option>
                <option value="driver">نام راننده (الفبا)</option>
              </select>
              <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
            </div>
          </div>

          {/* Search bar input elements */}
          <div className="relative w-full xl:w-80 flex-shrink-0">
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none font-sans">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              dir="rtl"
              value={oilSearch}
              onChange={(e) => {
                setOilSearch(e.target.value);
                setVisibleOilCount(8); // Reset pagination
              }}
              placeholder="جستجوی پلاک، راننده یا مدل پایش..."
              className="w-full pl-3 pr-9 py-2 rounded-xl bg-white dark:bg-gray-850 border border-gray-150/80 dark:border-gray-800 text-xs font-semibold text-gray-800 dark:text-gray-100 outline-none focus:ring-2 focus:ring-indigo-500/30 font-sans text-right placeholder-gray-400 dark:placeholder-gray-550"
            />
          </div>
        </div>

        {/* Results Info Panel */}
        <div className="flex items-center justify-between text-[11px] text-gray-450 bg-gray-50/50 dark:bg-gray-900/10 border border-gray-100/50 dark:border-gray-800/40 p-2.5 rounded-xl mb-3 scroll-none select-none">
          <span className="font-semibold text-sky-650 dark:text-sky-450">
            مبنای تعویض روانکار: {convertToPersianNumbers('15,000')} کیلومتر | فیلترها: {convertToPersianNumbers('10,000')} کیلومتر
          </span>
          <span className="font-bold">
            نمایش {convertToPersianNumbers(Math.min(visibleOilCount, filteredOilFilters.length))} مورد از {convertToPersianNumbers(filteredOilFilters.length)} تریلر ترانزیتی
          </span>
        </div>

        {/* Responsive Table Wrapper */}
        {filteredOilFilters.length === 0 ? (
          <div className="p-10 border border-dashed border-gray-205 dark:border-gray-800 rounded-2xl text-center bg-gray-50/10 dark:bg-gray-900/5 flex flex-col justify-center items-center">
            <AlertCircle className="w-8 h-8 text-gray-300 dark:text-gray-650 mb-2.5" />
            <span className="text-xs font-extrabold text-gray-400 block pb-1">هیچ تریلری منطبق با معیارهای استهلاک فیلتر و روغن یافت نشد.</span>
            <button
              onClick={() => {
                setOilSearch('');
                setOilCompanyFilter('all');
                setOilStatusFilter('all');
                setOilSortBy('oil-remaining-asc');
              }}
              className="mt-3 text-[10px] font-extrabold text-primary-650 bg-primary-50 dark:bg-primary-950/20 px-3 py-1.5 rounded-lg transition-all"
            >
              حذف تمامی فیلترها و نمایش کل ناوگان
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto border border-gray-100 dark:border-gray-800/80 rounded-2xl shadow-sm bg-white dark:bg-gray-900/15">
            <table className="w-full text-right border-collapse text-xs font-sans">
              <thead>
                <tr className="bg-gray-50/80 dark:bg-gray-850/65 text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800 text-[10px] font-extrabold select-none">
                  <th className="p-3 text-right w-10">ردیف</th>
                  <th className="p-3 text-right">مدل تریلر و هلدینگ</th>
                  <th className="p-3 text-right">راننده ترانزیت / پلاک تجاری</th>
                  <th className="p-3 text-right">کارکرد تجمعی</th>
                  <th className="p-3 text-right">وضعیت استهلاک روغن موتور</th>
                  <th className="p-3 text-right">وضعیت استهلاک فیلترها</th>
                  <th className="p-3 text-center">وضعیت هشدار فنی</th>
                  <th className="p-3 text-left pl-4">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {filteredOilFilters.slice(0, visibleOilCount).map((item, index) => {
                  const isCrit = item.status === 'critical';
                  const isWarn = item.status === 'warning';
                  const plate = formatLicenseToPlate(item.license);

                  // Calculate percentages and status-based styling for progress bars
                  const oilBarColor = item.oilPercent > 90 ? 'bg-rose-500' : item.oilPercent > 75 ? 'bg-amber-500' : 'bg-emerald-505';
                  const filterBarColor = item.filtersPercent > 90 ? 'bg-rose-500' : item.filtersPercent > 75 ? 'bg-amber-500' : 'bg-emerald-505';

                  return (
                    <tr 
                      key={item.id}
                      className="border-b last:border-b-0 border-gray-100 dark:border-gray-800 hover:bg-gray-50/30 dark:hover:bg-gray-850/10 transition-all duration-150"
                    >
                      {/* Row Index */}
                      <td className="p-3 text-gray-400 dark:text-gray-550 font-mono font-bold">
                        {convertToPersianNumbers(index + 1)}
                      </td>

                      {/* Vehicle model & company */}
                      <td className="p-3">
                        <div className="flex flex-col">
                          <span className="font-extrabold text-gray-900 dark:text-white leading-tight">
                            {item.vehicleName.split(' ')[0]} {item.vehicleName.split(' ')[1] || ''}
                          </span>
                          <span className="text-[10px] text-gray-400 mt-0.5">
                            {item.companyName}
                          </span>
                        </div>
                      </td>

                      {/* Driver & License plate */}
                      <td className="p-3">
                        <div className="flex items-center gap-3 justify-start">
                          {/* Iranian Commercial Car Plate */}
                          <div className="flex items-center border border-gray-250 dark:border-gray-700 bg-white dark:bg-gray-800 rounded text-[9px] h-5.5 overflow-hidden select-none font-mono font-bold leading-none shadow-sm flex-shrink-0">
                            <div className="bg-blue-600 w-1 h-full"></div>
                            <span className="px-1 text-gray-850 dark:text-gray-150">{plate.part1}</span>
                            <span className="px-1 bg-gray-50 dark:bg-gray-900 border-x border-gray-200 dark:border-gray-700 text-primary-500 font-sans text-[8px] leading-none flex items-center justify-center pt-0.5">{plate.letter}</span>
                            <span className="px-1 text-gray-850 dark:text-gray-150">{plate.part2}</span>
                            <div className="bg-gray-100 dark:bg-gray-900 text-[6.5px] px-1 h-full flex flex-col justify-center items-center border-r border-gray-200 dark:border-gray-700 leading-none">
                              <span className="text-[4px] text-gray-400 dark:text-gray-550 font-sans leading-none">ایران</span>
                              <span className="font-extrabold">{plate.province}</span>
                            </div>
                          </div>

                          <span className="font-extrabold text-gray-750 dark:text-gray-250">
                            {item.driver}
                          </span>
                        </div>
                      </td>

                      {/* Cumulative mileage */}
                      <td className="p-3 font-mono font-extrabold text-gray-850 dark:text-gray-150 text-[11px]">
                        {convertToPersianNumbers(item.odo.toLocaleString())} <span className="text-[9px] text-gray-400 font-sans">ک‌م</span>
                      </td>

                      {/* Engine oil progress */}
                      <td className="p-3 min-w-[140px]">
                        <div className="flex flex-col gap-1 max-w-[160px]">
                          <div className="flex justify-between items-baseline text-[9px] font-bold text-gray-400 dark:text-gray-500">
                            <span>{convertToPersianNumbers(item.oilPercent)}٪ کارکرد</span>
                            <span className="font-mono text-gray-650 dark:text-gray-300">
                              {convertToPersianNumbers(item.oilWorked.toLocaleString())} / {convertToPersianNumbers('15,000')}
                            </span>
                          </div>
                          {/* Progress bar */}
                          <div className="w-full bg-gray-100 dark:bg-gray-800 h-1 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${oilBarColor}`}
                              style={{ width: `${Math.min(100, item.oilPercent)}%` }}
                            />
                          </div>
                          {/* Remaining distance */}
                          <span className={`text-[8.5px] font-semibold text-right ${item.oilRemaining < 1500 ? 'text-rose-550 dark:text-rose-450 font-bold' : 'text-gray-400'}`}>
                            {item.oilRemaining === 0 ? 'منقضی شده!' : `${convertToPersianNumbers(item.oilRemaining.toLocaleString())} کیلومتر باقیمانده`}
                          </span>
                        </div>
                      </td>

                      {/* Filters progress (oil & air & fuel filters combined) */}
                      <td className="p-3 min-w-[140px]">
                        <div className="flex flex-col gap-1 max-w-[160px]">
                          <div className="flex justify-between items-baseline text-[9px] font-bold text-gray-400 dark:text-gray-500">
                            <span>{convertToPersianNumbers(item.filtersPercent)}٪ کارکرد</span>
                            <span className="font-mono text-gray-650 dark:text-gray-300">
                              {convertToPersianNumbers(item.filtersWorked.toLocaleString())} / {convertToPersianNumbers('10,000')}
                            </span>
                          </div>
                          {/* Progress bar */}
                          <div className="w-full bg-gray-100 dark:bg-gray-800 h-1 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${filterBarColor}`}
                              style={{ width: `${Math.min(100, item.filtersPercent)}%` }}
                            />
                          </div>
                          {/* Remaining distance */}
                          <span className={`text-[8.5px] font-semibold text-right ${item.filtersRemaining < 1000 ? 'text-rose-550 dark:text-rose-450 font-bold' : 'text-gray-400'}`}>
                            {item.filtersRemaining === 0 ? 'منقضی شده!' : `${convertToPersianNumbers(item.filtersRemaining.toLocaleString())} کیلومتر باقیمانده`}
                          </span>
                        </div>
                      </td>

                      {/* Alert status designation in table */}
                      <td className="p-3 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border font-bold text-[9.5px] ${
                          isCrit 
                            ? 'bg-rose-50 border-rose-150 text-rose-600 dark:bg-rose-950/20 dark:border-rose-900/30 dark:text-rose-400' 
                            : isWarn 
                            ? 'bg-amber-50 border-amber-150 text-amber-600 dark:bg-amber-950/20 dark:border-amber-900/30 dark:text-amber-400'
                            : 'bg-emerald-50 border-emerald-150 text-emerald-600 dark:bg-emerald-950/20 dark:border-emerald-900/30 dark:text-emerald-400'
                        }`}>
                          {isCrit ? (
                            <>
                              <span className="h-1.5 w-1.5 rounded-full bg-rose-505 animate-pulse"></span>
                              <span>نیازمند سرویس فوری</span>
                            </>
                          ) : isWarn ? (
                            <>
                              <span className="h-1.5 w-1.5 rounded-full bg-amber-450"></span>
                              <span>در آستانه سرویس</span>
                            </>
                          ) : (
                            <>
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                              <span>سالم و پایدار</span>
                            </>
                          )}
                        </span>
                      </td>

                      {/* Operations and controls */}
                      <td className="p-3 pr-1">
                        <div className="flex items-center gap-1 w-full justify-end">
                          <button
                            onClick={() => triggerOilAction(`🔧 تعویض روغن موتور و فیلترهای فنی با موفقیت برای تریلر راننده ${item.driver} ثبت شد و گارانتی استهلاک تا ۱۵,۰۰۰ کیلومتر تمدید گردید.`)}
                            className="px-2 py-1 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/25 dark:hover:bg-indigo-950/50 text-[10px] font-extrabold text-indigo-650 dark:text-indigo-400 rounded-lg border border-indigo-100/60 dark:border-indigo-900/40 transition-all hover:scale-105"
                          >
                            ثبت تعویض دوره
                          </button>
                          <button
                            onClick={() => triggerOilAction(`📱 اخطاریه و هماهنگی مکاتبه‌ای خدمات فنی روانکار برای راننده (${item.driver}) با موفقیت بارگذاری و مخابره شد.`)}
                            className="px-2 py-1 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-750 text-[10px] font-extrabold text-gray-650 dark:text-gray-300 rounded-lg border border-gray-150/80 dark:border-gray-700/50 transition-all hover:scale-105"
                          >
                            ابلاغ به راننده
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Paginate / load more button for this table */}
        {filteredOilFilters.length > visibleOilCount && (
          <div className="flex justify-center mt-3.5">
            <button
              onClick={() => setVisibleOilCount(prev => prev + 8)}
              className="px-5 py-2 border border-gray-200 dark:border-gray-800 text-xs text-gray-650 dark:text-gray-300 font-extrabold hover:bg-gray-100 dark:hover:bg-gray-850/40 rounded-2xl shadow-sm transition-all flex items-center gap-1.5 hover:scale-105"
            >
              <span>نمایش قطعات مصرفی بقیه وسایل نقلیه ({convertToPersianNumbers(Math.min(8, filteredOilFilters.length - visibleOilCount))} تریلر دیگر)</span>
              <Droplet className="w-3.5 h-3.5 text-sky-550 animate-pulse" />
            </button>
          </div>
        )}

      </div>

    </div>
  );
}
