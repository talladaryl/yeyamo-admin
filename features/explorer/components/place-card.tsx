"use client";
import Link from "next/link";
import type { Route } from "next";
import { Heart, MapPin } from "lucide-react";
import type { PlaceSummary } from "@/features/explorer/types";
import { useProtectedAction } from "@/features/user-auth/protected-action-context";
export function PlaceCard({ place, selected, onSelect }: { place: PlaceSummary; selected?: boolean; onSelect?: () => void }) { const protectedAction = useProtectedAction(); return <article className={`yy-explorer-card${selected ? " is-selected" : ""}`}><button type="button" className="yy-explorer-card__body" onClick={onSelect}><span className="yy-place-fallback"><MapPin aria-hidden="true" /></span><span><strong>{place.name}</strong>{place.categoryName ? <small>{place.categoryName}</small> : null}{place.address ? <small>{place.address}</small> : null}{place.distanceKm !== null ? <small>{place.distanceKm} km</small> : null}</span></button><div className="yy-explorer-card__actions"><Link href={`/places/${place.id}` as Route}>Voir</Link><button type="button" aria-label={`Ajouter ${place.name} aux favoris`} onClick={() => protectedAction({ reason: "Connectez-vous pour enregistrer un lieu", level: "L1", intent: { type: "FAVORITE", resourceType: "place", resourceId: place.id }, run: () => undefined })}><Heart aria-hidden="true" /></button></div></article>; }
