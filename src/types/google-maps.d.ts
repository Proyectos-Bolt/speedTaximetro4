// Declaraciones de tipos para Google Maps API
declare global {
  interface Window {
    google: typeof google;
  }
}

declare namespace google {
  namespace maps {
    class LatLng {
      constructor(lat: number, lng: number);
      lat(): number;
      lng(): number;
    }

    namespace geometry {
      namespace spherical {
        function computeDistanceBetween(from: LatLng, to: LatLng): number;
        function computeHeading(from: LatLng, to: LatLng): number;
      }
    }

    class Geocoder {
      geocode(request: GeocoderRequest): Promise<GeocoderResponse>;
    }

    interface GeocoderRequest {
      location?: { lat: number; lng: number };
      address?: string;
    }

    interface GeocoderResponse {
      results: GeocoderResult[];
    }

    interface GeocoderResult {
      formatted_address: string;
      geometry: {
        location: LatLng;
      };
    }
  }
}

export {};