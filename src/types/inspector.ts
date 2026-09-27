export interface InspectedPointData {
  lat: number;
  lng: number;
  zoom: number;
  targetId: string;
  resolvedRegion: string;
  terrainType: string;
  elevationMsl: number;
  gridResolution: string;
  dataTimestamp: string;
  ndvi: number;
  sarBackscatterDb: number;
  moistureIndex: number;
  tileUrl: string;
  auditLogs: string[];
}

export interface WishlistTarget {
  id: string;
  targetId: string;
  region: string;
  lat: number;
  lng: number;
  timestamp: string;
  terrainType: string;
  elevationMsl: number;
}
