// Coarse landmass outlines as [lon, lat] rings, enough to make a 3° dot grid read as
// continents. Accuracy past that doesn't survive the dot resolution, so keep these short.
type Ring = [number, number][];

const LAND: Ring[] = [
    // Eurasia
    [
        [-9, 37],
        [-9, 43],
        [-2, 47],
        [-5, 48],
        [5, 58],
        [5, 62],
        [15, 69],
        [30, 70],
        [60, 70],
        [80, 73],
        [100, 77],
        [120, 73],
        [140, 72],
        [160, 70],
        [180, 66],
        [160, 60],
        [162, 54],
        [155, 59],
        [142, 53],
        [135, 43],
        [130, 42],
        [129, 35],
        [126, 34],
        [126, 38],
        [122, 37],
        [120, 30],
        [117, 24],
        [110, 21],
        [108, 12],
        [105, 9],
        [103, 2],
        [101, 6],
        [98, 8],
        [98, 15],
        [94, 19],
        [91, 22],
        [87, 21],
        [80, 15],
        [80, 8],
        [76, 8],
        [73, 18],
        [70, 22],
        [67, 24],
        [57, 25],
        [56, 27],
        [52, 24],
        [59, 22],
        [57, 19],
        [53, 17],
        [44, 13],
        [43, 16],
        [39, 21],
        [35, 28],
        [32, 31],
        [36, 36],
        [30, 36],
        [26, 40],
        [23, 37],
        [20, 40],
        [16, 41],
        [18, 40],
        [16, 38],
        [12, 42],
        [10, 44],
        [5, 43],
        [0, 40],
        [-2, 37],
        [-6, 36],
    ],
    // Africa
    [
        [-10, 30],
        [-17, 21],
        [-17, 15],
        [-15, 11],
        [-8, 5],
        [0, 5],
        [8, 4],
        [9, 2],
        [9, -1],
        [12, -5],
        [12, -10],
        [12, -17],
        [15, -27],
        [18, -34],
        [26, -34],
        [32, -29],
        [35, -24],
        [40, -15],
        [40, -10],
        [39, -5],
        [41, -1],
        [43, 5],
        [51, 12],
        [43, 12],
        [39, 16],
        [37, 20],
        [33, 28],
        [32, 31],
        [25, 32],
        [20, 32],
        [10, 37],
        [0, 36],
        [-6, 35],
    ],
    // Australia
    [
        [114, -22],
        [114, -34],
        [118, -35],
        [124, -33],
        [130, -32],
        [138, -35],
        [140, -38],
        [147, -39],
        [150, -37],
        [153, -28],
        [153, -25],
        [146, -19],
        [142, -11],
        [141, -17],
        [136, -12],
        [132, -12],
        [129, -15],
        [122, -17],
    ],
    // North America
    [
        [-165, 60],
        [-168, 66],
        [-155, 71],
        [-130, 70],
        [-110, 68],
        [-90, 68],
        [-80, 62],
        [-60, 55],
        [-55, 48],
        [-65, 45],
        [-70, 42],
        [-75, 35],
        [-80, 32],
        [-80, 25],
        [-82, 28],
        [-88, 30],
        [-97, 27],
        [-97, 20],
        [-90, 20],
        [-88, 16],
        [-84, 10],
        [-79, 8],
        [-87, 13],
        [-95, 16],
        [-105, 20],
        [-110, 23],
        [-115, 30],
        [-120, 34],
        [-124, 40],
        [-124, 48],
        [-130, 55],
        [-140, 60],
        [-150, 60],
    ],
    // South America
    [
        [-79, 8],
        [-72, 12],
        [-62, 10],
        [-52, 5],
        [-50, 0],
        [-35, -5],
        [-39, -13],
        [-41, -22],
        [-48, -26],
        [-53, -34],
        [-58, -38],
        [-65, -42],
        [-68, -50],
        [-68, -55],
        [-72, -50],
        [-74, -45],
        [-71, -30],
        [-70, -18],
        [-77, -12],
        [-81, -5],
        [-80, 0],
        [-78, 5],
    ],
    // Greenland
    [
        [-45, 60],
        [-55, 67],
        [-70, 77],
        [-60, 82],
        [-30, 83],
        [-20, 70],
    ],
    // British Isles
    [
        [-5, 50],
        [1, 51],
        [2, 53],
        [-2, 58],
        [-6, 58],
        [-5, 54],
    ],
    // Japan
    [
        [130, 31],
        [131, 34],
        [136, 34],
        [140, 36],
        [141, 40],
        [142, 45],
        [140, 43],
        [133, 36],
    ],
    // Sumatra, Borneo, Java, New Guinea
    [
        [95, 5],
        [106, -6],
        [104, -2],
        [98, 4],
    ],
    [
        [109, 1],
        [117, 7],
        [119, 0],
        [116, -4],
        [110, -3],
    ],
    [
        [105, -6],
        [114, -8],
        [106, -7],
    ],
    [
        [131, -1],
        [141, -3],
        [150, -10],
        [141, -9],
        [135, -4],
    ],
    // Madagascar
    [
        [44, -25],
        [48, -14],
        [50, -16],
        [47, -25],
    ],
];

const inRing = (lon: number, lat: number, ring: Ring) => {
    let inside = false;
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
        const [xi, yi] = ring[i];
        const [xj, yj] = ring[j];
        if (yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) inside = !inside;
    }
    return inside;
};

export const isLand = (lon: number, lat: number) => LAND.some((r) => inRing(lon, lat, r));

export interface GlobeDot {
    /** Radians. */
    lat: number;
    lon: number;
    land: boolean;
}

/** A near-uniform dot grid over the sphere, computed once. ~3° spacing. */
export const buildDots = (stepDeg = 3): GlobeDot[] => {
    const dots: GlobeDot[] = [];
    for (let lat = -87; lat <= 87; lat += stepDeg) {
        const n = Math.max(1, Math.round((360 / stepDeg) * Math.cos((lat * Math.PI) / 180)));
        for (let k = 0; k < n; k++) {
            const lon = -180 + (360 * k) / n;
            dots.push({ lat: (lat * Math.PI) / 180, lon: (lon * Math.PI) / 180, land: isLand(lon, lat) });
        }
    }
    return dots;
};

export interface City {
    name: string;
    tz: string;
    lat: number;
    lon: number;
    /** Which side of the pin the label sits on. */
    side: 'top' | 'bottom' | 'left' | 'right';
    home?: boolean;
}

// Hyderabad, and the zones a remote team would want to know about overlap with.
export const CITIES: City[] = [
    { name: 'Hyderabad', tz: 'Asia/Kolkata', lat: 17.4, lon: 78.5, side: 'top', home: true },
    { name: 'Dubai', tz: 'Asia/Dubai', lat: 25.2, lon: 55.3, side: 'left' },
    { name: 'London', tz: 'Europe/London', lat: 51.5, lon: -0.1, side: 'left' },
    { name: 'Singapore', tz: 'Asia/Singapore', lat: 1.35, lon: 103.8, side: 'bottom' },
    { name: 'Tokyo', tz: 'Asia/Tokyo', lat: 35.7, lon: 139.7, side: 'right' },
    { name: 'Sydney', tz: 'Australia/Sydney', lat: -33.9, lon: 151.2, side: 'bottom' },
];
