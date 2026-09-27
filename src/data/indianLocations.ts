export interface LocationTarget {
  id: string;
  name: string;
  state: string;
  region: string;
  lat: number;
  lng: number;
  zoom: number;
  category: 'Metropolitan' | 'Coastal / Port' | 'Industrial' | 'Capital';
  description: string;
  typicalAoi: Array<{ lat: number; lng: number }>;
}

export const INDIAN_LOCATIONS: LocationTarget[] = [
  {
    id: 'vizag',
    name: 'Visakhapatnam (Vizag)',
    state: 'Andhra Pradesh',
    region: 'Coastal Andhra / Eastern Seaboard',
    lat: 17.6868,
    lng: 83.2185,
    zoom: 12,
    category: 'Coastal / Port',
    description: 'Deepwater port, Visakhapatnam Steel Plant, Rushikonda coastal development, and Gangavaram industrial corridor.',
    typicalAoi: [
      { lat: 17.75, lng: 83.18 },
      { lat: 17.75, lng: 83.35 },
      { lat: 17.62, lng: 83.35 },
      { lat: 17.62, lng: 83.18 }
    ]
  },
  {
    id: 'delhi',
    name: 'Delhi / NCR',
    state: 'NCT of Delhi',
    region: 'National Capital Region',
    lat: 28.6139,
    lng: 77.209,
    zoom: 11,
    category: 'Capital',
    description: 'Yamuna river basin floodplains, Central Ridge forest sanctuary, Dwarka expansion, and peri-urban logistics.',
    typicalAoi: [
      { lat: 28.72, lng: 77.08 },
      { lat: 28.72, lng: 77.34 },
      { lat: 28.52, lng: 77.34 },
      { lat: 28.52, lng: 77.08 }
    ]
  },
  {
    id: 'hyderabad',
    name: 'Hyderabad North Corridor',
    state: 'Telangana',
    region: 'Deccan Plateau / Medchal Spine',
    lat: 17.588,
    lng: 78.51,
    zoom: 12,
    category: 'Industrial',
    description: 'Kompally residential belt, Medchal industrial warehousing logistics, and Outer Ring Road growth corridor.',
    typicalAoi: [
      { lat: 17.654, lng: 78.431 },
      { lat: 17.654, lng: 78.589 },
      { lat: 17.521, lng: 78.589 },
      { lat: 17.521, lng: 78.431 }
    ]
  },
  {
    id: 'bengaluru',
    name: 'Bengaluru Tech Corridor',
    state: 'Karnataka',
    region: 'South Deccan Urban Core',
    lat: 12.9716,
    lng: 77.5946,
    zoom: 12,
    category: 'Metropolitan',
    description: 'Outer Ring Road tech parks, Bellandur-Varthur lake catchment areas, and Whitefield eastern expansion.',
    typicalAoi: [
      { lat: 13.04, lng: 77.65 },
      { lat: 13.04, lng: 77.78 },
      { lat: 12.91, lng: 77.78 },
      { lat: 12.91, lng: 77.65 }
    ]
  },
  {
    id: 'mumbai',
    name: 'Mumbai Metropolitan Region (MMR)',
    state: 'Maharashtra',
    region: 'Konkan Coast / Arabian Sea',
    lat: 19.076,
    lng: 72.8777,
    zoom: 11,
    category: 'Coastal / Port',
    description: 'Navi Mumbai International Airport greenfield site, Thane Creek flamingo sanctuary, and JNPT port expansion.',
    typicalAoi: [
      { lat: 19.15, lng: 72.82 },
      { lat: 19.15, lng: 73.05 },
      { lat: 18.95, lng: 73.05 },
      { lat: 18.95, lng: 72.82 }
    ]
  },
  {
    id: 'chennai',
    name: 'Chennai Coast & Ennore',
    state: 'Tamil Nadu',
    region: 'Coromandel Coastal Plain',
    lat: 13.0827,
    lng: 80.2707,
    zoom: 12,
    category: 'Coastal / Port',
    description: 'Ennore thermal & port basin, Buckingham Canal wetland buffer, and Old Mahabalipuram Road (OMR) tech corridor.',
    typicalAoi: [
      { lat: 13.22, lng: 80.18 },
      { lat: 13.22, lng: 80.32 },
      { lat: 13.02, lng: 80.32 },
      { lat: 13.02, lng: 80.18 }
    ]
  },
  {
    id: 'amaravati',
    name: 'Amaravati / Vijayawada',
    state: 'Andhra Pradesh',
    region: 'Krishna River Basin',
    lat: 16.5417,
    lng: 80.5158,
    zoom: 12,
    category: 'Capital',
    description: 'Andhra Pradesh greenfield capital region, Krishna river flood bunds, and agricultural parcel land pooling zones.',
    typicalAoi: [
      { lat: 16.6, lng: 80.45 },
      { lat: 16.6, lng: 80.62 },
      { lat: 16.48, lng: 80.62 },
      { lat: 16.48, lng: 80.45 }
    ]
  },
  {
    id: 'kolkata',
    name: 'Kolkata & New Town',
    state: 'West Bengal',
    region: 'Lower Gangetic Plain',
    lat: 22.5726,
    lng: 88.3639,
    zoom: 12,
    category: 'Metropolitan',
    description: 'Rajarhat New Town, East Kolkata Ramsar wetland conservation zone, and Hooghly riverbank urban infill.',
    typicalAoi: [
      { lat: 22.65, lng: 88.35 },
      { lat: 22.65, lng: 88.52 },
      { lat: 22.52, lng: 88.52 },
      { lat: 22.52, lng: 88.35 }
    ]
  },
  {
    id: 'kochi',
    name: 'Kochi & Backwaters',
    state: 'Kerala',
    region: 'Malabar Coast / Vembanad',
    lat: 9.9312,
    lng: 76.2673,
    zoom: 12,
    category: 'Coastal / Port',
    description: 'Vembanad lagoon wetlands, Vallarpadam international container transshipment terminal, and coastal infill.',
    typicalAoi: [
      { lat: 10.02, lng: 76.2 },
      { lat: 10.02, lng: 76.35 },
      { lat: 9.88, lng: 76.35 },
      { lat: 9.88, lng: 76.2 }
    ]
  },
  {
    id: 'bhubaneswar',
    name: 'Bhubaneswar Capital Zone',
    state: 'Odisha',
    region: 'Mahanadi Coastal Delta',
    lat: 20.2961,
    lng: 85.8245,
    zoom: 12,
    category: 'Capital',
    description: 'Chandaka elephant sanctuary buffer zone, InfoValley industrial zone, and Kuakhai river floodplain.',
    typicalAoi: [
      { lat: 20.38, lng: 85.75 },
      { lat: 20.38, lng: 85.9 },
      { lat: 20.24, lng: 85.9 },
      { lat: 20.24, lng: 85.75 }
    ]
  },
  {
    id: 'ahmedabad',
    name: 'Ahmedabad & GIFT City',
    state: 'Gujarat',
    region: 'Sabarmati River Basin',
    lat: 23.0225,
    lng: 72.5714,
    zoom: 12,
    category: 'Industrial',
    description: 'Gujarat International Finance Tec-City (GIFT City), Sanand industrial estate, and Sabarmati riverfront.',
    typicalAoi: [
      { lat: 23.18, lng: 72.55 },
      { lat: 23.18, lng: 72.72 },
      { lat: 22.98, lng: 72.72 },
      { lat: 22.98, lng: 72.55 }
    ]
  },
  {
    id: 'pune',
    name: 'Pune Industrial Belt',
    state: 'Maharashtra',
    region: 'Western Ghats Rain Shadow',
    lat: 18.5204,
    lng: 73.8567,
    zoom: 12,
    category: 'Industrial',
    description: 'Hinjawadi Rajiv Gandhi Infotech Park, Chakan automobile industrial corridor, and Mula-Mutha river basin.',
    typicalAoi: [
      { lat: 18.65, lng: 73.72 },
      { lat: 18.65, lng: 73.92 },
      { lat: 18.45, lng: 73.92 },
      { lat: 18.45, lng: 73.72 }
    ]
  },
  {
    id: 'guwahati',
    name: 'Guwahati & Brahmaputra',
    state: 'Assam',
    region: 'Brahmaputra River Valley',
    lat: 26.1445,
    lng: 91.7362,
    zoom: 12,
    category: 'Coastal / Port',
    description: 'Deepor Beel Ramsar wetland, Brahmaputra river channel seasonal sandbars (chars), and South Bank urban sprawl.',
    typicalAoi: [
      { lat: 26.22, lng: 91.65 },
      { lat: 26.22, lng: 91.82 },
      { lat: 26.08, lng: 91.82 },
      { lat: 26.08, lng: 91.65 }
    ]
  }
];
