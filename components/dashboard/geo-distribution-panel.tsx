"use client";

import "mapbox-gl/dist/mapbox-gl.css";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";

const markers = [
  { label: "24", lng: 10.1815, lat: 5.9631 },
  { label: "18", lng: 9.7043, lat: 4.0511 },
  { label: "8", lng: 11.5021, lat: 3.848 },
  { label: "12", lng: 14.3159, lat: 10.5913 }
];

const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

export function GeoDistributionPanel() {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current || !accessToken) {
      return;
    }

    mapboxgl.accessToken = accessToken;

    const map = new mapboxgl.Map({
      container: mapRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [11.5, 5.7],
      zoom: 5.2,
      attributionControl: true
    });

    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-left");

    markers.forEach((marker) => {
      const element = document.createElement("div");
      element.className =
        "flex h-12 w-12 items-center justify-center rounded-full bg-[#e30613] text-sm font-bold text-white shadow-[0_10px_20px_rgba(227,6,19,0.35)] ring-8 ring-rose-200/70";
      element.textContent = marker.label;

      new mapboxgl.Marker({ element }).setLngLat([marker.lng, marker.lat]).addTo(map);
    });

    map.on("load", () => setMapReady(true));
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  if (!accessToken) {
    return (
      <div className="flex h-[210px] items-center justify-center rounded-2xl border border-rose-100 bg-slate-50 px-6 text-center text-sm text-slate-600">
        Ajoute `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` pour afficher la carte Mapbox interactive.
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-rose-100">
      <div ref={mapRef} className="h-[210px] w-full bg-slate-100" />
      {!mapReady ? (
        <div className="absolute inset-0 flex items-center justify-center bg-white/70 text-sm font-medium text-slate-600">
          Chargement de la carte...
        </div>
      ) : null}
    </div>
  );
}
