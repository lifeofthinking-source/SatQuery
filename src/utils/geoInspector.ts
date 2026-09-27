import { InspectedPointData } from '../types/inspector';

// Generate consistent Track ID e.g. TRK-Y7C6ZW5V
export const generateTargetId = (lat: number, lng: number): string => {
  const latStr = Math.abs(lat).toFixed(4).replace('.', '');
  const lngStr = Math.abs(lng).toFixed(4).replace('.', '');
  let hash = 0;
  const str = `${latStr}-${lngStr}`;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let out = '';
  let num = Math.abs(hash);
  for (let i = 0; i < 8; i++) {
    out += chars[num % chars.length];
    num = Math.floor(num / chars.length) || (i * 7 + 13);
  }
  return `TRK-${out}`;
};

// Estimate Elevation (MSL) based on Indian topography
export const estimateElevation = (lat: number, lng: number): number => {
  // Coastal Tamil Nadu / Cheyyur / Chennai (0 - 25m)
  if (lat >= 11.5 && lat <= 13.5 && lng >= 79.8 && lng <= 80.4) {
    const distFromCoast = Math.max(0, (80.3 - lng) * 111);
    return Math.max(2, Math.round(4 + distFromCoast * 0.8));
  }
  // Coastal Andhra / Visakhapatnam (0 - 45m near coast, up to 300m hills)
  if (lat >= 17.5 && lat <= 18.2 && lng >= 83.0 && lng <= 83.5) {
    return Math.max(3, Math.round(8 + (83.35 - lng) * 20));
  }
  // Deccan Plateau (Hyderabad / Medchal) (500 - 620m)
  if (lat >= 17.2 && lat <= 17.8 && lng >= 78.2 && lng <= 78.8) {
    return Math.round(530 + Math.sin(lat * 10) * 25 + Math.cos(lng * 10) * 20);
  }
  // Bengaluru Plateau (880 - 940m)
  if (lat >= 12.8 && lat <= 13.2 && lng >= 77.4 && lng <= 77.8) {
    return Math.round(910 + Math.sin(lat * 8) * 15);
  }
  // Delhi NCR / Yamuna Plain (200 - 225m)
  if (lat >= 28.4 && lat <= 28.9 && lng >= 76.9 && lng <= 77.4) {
    return Math.round(214 + (lat - 28.5) * 8);
  }
  // Default general elevation model
  const base = Math.abs(Math.sin(lat * 0.5) * Math.cos(lng * 0.5)) * 400;
  return Math.max(5, Math.round(base + 12));
};

// Determine Terrain Type based on coordinate biome
export const inferTerrainType = (lat: number, lng: number): string => {
  // Coastal Tamil Nadu (Cheyyur / Chengalpattu / Mahabalipuram)
  if (lat >= 12.2 && lat <= 12.8 && lng >= 79.9 && lng <= 80.2) {
    if (lng > 80.12) return 'Coastal Sandy Aquifer / Dune Ridge';
    return 'Coastal Sandy Aquifer / Agricultural Infill';
  }
  // Coastal Bay of Bengal Marine
  if (lng > 80.25 && lat >= 12.0 && lat <= 14.0) {
    return 'Neritic Marine / Littoral Shelf';
  }
  // Visakhapatnam Harbor & Hills
  if (lat >= 17.6 && lat <= 17.8 && lng >= 83.15 && lng <= 83.35) {
    return 'Deepwater Coastal Port / Industrial Terminal';
  }
  // Hyderabad Northern Corridor
  if (lat >= 17.5 && lat <= 17.7 && lng >= 78.4 && lng <= 78.6) {
    return 'Industrial Warehousing & Suburban Infill';
  }
  // Delhi Yamuna Basin
  if (lat >= 28.5 && lat <= 28.8 && lng >= 77.15 && lng <= 77.35) {
    return 'Riverine Alluvial Floodplain / Peri-Urban Fabric';
  }
  // Bengaluru Tech Sector
  if (lat >= 12.9 && lat <= 13.1 && lng >= 77.6 && lng <= 77.8) {
    return 'High-Density Commercial Tech Fabric';
  }
  // General Fallback
  return 'Mixed Agricultural Land / Vegetated Canopy';
};

// Fast Offline Regional Geocoder for India + Instant fallback
export const fastResolveRegion = (lat: number, lng: number): string => {
  // Cheyyur / Chengalpattu / Tamil Nadu (matching reference screenshot!)
  if (lat >= 12.35 && lat <= 12.55 && lng >= 80.05 && lng <= 80.20) {
    return 'Cheyyur, Chengalpattu, Tamil Nadu';
  }
  if (lat >= 12.55 && lat <= 12.85 && lng >= 79.95 && lng <= 80.25) {
    return 'Chengalpattu District, Tamil Nadu';
  }
  if (lat >= 12.85 && lat <= 13.25 && lng >= 80.15 && lng <= 80.35) {
    return 'Chennai Metropolitan Area, Tamil Nadu';
  }
  // Visakhapatnam
  if (lat >= 17.60 && lat <= 17.85 && lng >= 83.15 && lng <= 83.40) {
    return 'Visakhapatnam, Andhra Pradesh';
  }
  // Hyderabad
  if (lat >= 17.52 && lat <= 17.68 && lng >= 78.40 && lng <= 78.60) {
    return 'Gundlapochampally, Medchal-Malkajgiri, Telangana';
  }
  if (lat >= 17.30 && lat <= 17.55 && lng >= 78.35 && lng <= 78.58) {
    return 'Hyderabad Urban Core, Telangana';
  }
  // Delhi
  if (lat >= 28.50 && lat <= 28.75 && lng >= 77.05 && lng <= 77.35) {
    return 'National Capital Territory of Delhi, Delhi';
  }
  // Bengaluru
  if (lat >= 12.88 && lat <= 13.08 && lng >= 77.50 && lng <= 77.80) {
    return 'Bengaluru Urban, Karnataka';
  }
  // Mumbai
  if (lat >= 18.90 && lat <= 19.25 && lng >= 72.75 && lng <= 73.10) {
    return 'Mumbai Metropolitan Region, Maharashtra';
  }
  // Amaravati / Vijayawada
  if (lat >= 16.45 && lat <= 16.65 && lng >= 80.45 && lng <= 80.70) {
    return 'Amaravati Capital Region, Andhra Pradesh';
  }

  return `Geospatial Zone (${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E), India`;
};

// Dynamic Satellite Tile URL calculator for the optical quick look
export const getTileCoordinates = (lat: number, lng: number, zoom: number = 15) => {
  const latRad = (lat * Math.PI) / 180;
  const n = Math.pow(2, zoom);
  const x = Math.floor(((lng + 180) / 360) * n);
  const y = Math.floor(((1 - Math.asinh(Math.tan(latRad)) / Math.PI) / 2) * n);
  return { x, y, z: zoom };
};

export const getSatelliteTileUrl = (lat: number, lng: number, zoom: number = 15): string => {
  const { x, y, z } = getTileCoordinates(lat, lng, zoom);
  return `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${z}/${y}/${x}`;
};
