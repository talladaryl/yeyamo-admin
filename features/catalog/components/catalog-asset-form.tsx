"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { catalogApi } from "@/features/catalog/api/catalog-api";
import type { CatalogAsset } from "@/features/catalog/types/catalog";
import {
  AdminPageHeader,
  AdminSkeleton,
} from "@/components/admin/ui/admin-foundation";
import { AdminRadioGroup } from "@/components/admin/ui/admin-choice-group";
const AdminLocationPicker = dynamic(
  () =>
    import("@/features/geography/components/admin-location-picker").then(
      (module) => module.AdminLocationPicker,
    ),
  { ssr: false, loading: () => <AdminSkeleton rows={3} /> },
);
const schema = z.object({
  type: z.enum(["DESTINATION", "PLACE", "EXPERIENCE", "EVENT"]),
  name: z.string().min(2).max(200),
  slug: z.string().max(220).optional(),
  description: z.string().max(10000).optional(),
  categoryCode: z.string().max(100).optional(),
  regionCode: z.string().max(40).optional(),
  city: z.string().max(160).optional(),
  district: z.string().max(160).optional(),
  address: z.string().max(300).optional(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});
export function CatalogAssetForm({
  asset,
  type,
}: {
  asset?: CatalogAsset;
  type?: "PLACE";
}) {
  const router = useRouter();
  const [values, setValues] = useState({
    type: asset?.type ?? type ?? "PLACE",
    name: asset?.name ?? "",
    slug: asset?.slug ?? "",
    description: asset?.description ?? "",
    categoryCode: asset?.categoryCode ?? "",
    regionCode: asset?.regionCode ?? "",
    city: asset?.city ?? "",
    district: asset?.district ?? "",
    address: asset?.address ?? "",
    latitude: asset?.latitude ?? 3.8667,
    longitude: asset?.longitude ?? 11.5167,
  });
  const [error, setError] = useState("");
  const mutation = useMutation({
    mutationFn: () => {
      const parsed = schema.safeParse(values);
      if (!parsed.success) throw new Error(parsed.error.issues[0]?.message);
      return asset
        ? catalogApi.update(asset.id, parsed.data)
        : catalogApi.create(parsed.data);
    },
    onSuccess: (result) => router.push(`/admin/catalog/${result.id}` as never),
    onError: (e) => setError(e instanceof Error ? e.message : "Erreur"),
  });
  return (
    <div className="admin-feature">
      <AdminPageHeader title={asset ? "Modifier l’asset" : "Nouvel asset"} />
      <form
        className="admin-form"
        onSubmit={(e) => {
          e.preventDefault();
          mutation.mutate();
        }}
      >
        {error ? <p className="admin-resource__error">{error}</p> : null}
        <AdminRadioGroup legend="Type" value={values.type} options={[{ value: "DESTINATION", label: "Destination" }, { value: "PLACE", label: "Lieu" }, { value: "EXPERIENCE", label: "Expérience" }, { value: "EVENT", label: "Événement" }]} onChange={(type: typeof values.type) => setValues({ ...values, type })}/>
        {(
          [
            "name",
            "slug",
            "categoryCode",
            "regionCode",
            "city",
            "district",
            "address",
          ] as const
        ).map((key) => (
          <label key={key}>
            {key}
            <input
              value={values[key]}
              onChange={(e) => setValues({ ...values, [key]: e.target.value })}
              required={key === "name"}
            />
          </label>
        ))}
        <label>
          Description
          <textarea
            value={values.description}
            onChange={(e) =>
              setValues({ ...values, description: e.target.value })
            }
          />
        </label>
        <AdminLocationPicker
          latitude={values.latitude}
          longitude={values.longitude}
          onChange={(point) => setValues({ ...values, ...point })}
        />
        <button className="admin-button" disabled={mutation.isPending}>
          Enregistrer
        </button>
      </form>
    </div>
  );
}
