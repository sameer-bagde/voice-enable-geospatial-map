/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
declare module '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions' {
    import { Map } from 'mapbox-gl';
  
    interface DirectionsOptions {
      accessToken: string;
      unit?: 'metric' | 'imperial';
      profile?: 'mapbox/driving' | 'mapbox/walking' | 'mapbox/cycling';
    }
  
    class MapboxDirections {
      constructor(options: DirectionsOptions);
      setOrigin(origin: [number, number] | string): void;
      setDestination(destination: [number, number] | string): void;
      on(event: string, callback: (data: any) => void): void;
    }
    export default MapboxDirections;
  }
  