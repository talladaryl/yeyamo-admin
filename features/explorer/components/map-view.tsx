"use client";

import { useEffect, useRef } from "react";
import type { MapMarker } from "@/features/explorer/types";

export function MapView({ markers, selectedId, onSelect }: { markers: MapMarker[]; selectedId?: string; onSelect: (id: string) => void }) {
  const node = useRef<HTMLDivElement>(null); const mapRef = useRef<import("mapbox-gl").Map | null>(null);
  useEffect(() => { let disposed = false; const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN; if (!node.current || !token || markers.length === 0) return; void import("mapbox-gl").then(({ default: mapboxgl }) => { if (disposed || !node.current) return; mapboxgl.accessToken = token; const first = markers[0]; const map = new mapboxgl.Map({ container: node.current, style: "mapbox://styles/mapbox/streets-v12", center: [first.longitude!, first.latitude!], zoom: 10 }); mapRef.current = map; markers.forEach((marker) => new mapboxgl.Marker({ color: marker.id === selectedId ? "#c74b4b" : "#6b625b" }).setLngLat([marker.longitude!, marker.latitude!]).getElement().addEventListener("click", () => onSelect(marker.id))); }); return () => { disposed = true; mapRef.current?.remove(); mapRef.current = null; }; }, [markers, onSelect, selectedId]);
  if (!process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN) return <p className="yy-map-message">La configuration Mapbox est absente. Utilisez la liste des résultats.</p>;
  if (!markers.length) return <p className="yy-map-message">Aucun lieu avec des coordonnées valides à afficher.</p>;
  return <div className="yy-map" ref={node} aria-label="Carte des lieux disponibles" />;
}
