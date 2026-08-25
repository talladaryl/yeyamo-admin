"use client";

import Link from "next/link";
import { useMemo, useState, type ChangeEvent } from "react";
import {
  AlertCircle,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Download,
  FileText,
  FolderUp,
  MapPin,
  ShieldCheck,
  UploadCloud,
  Users2
} from "lucide-react";

import { AdminSectionCard } from "@/components/admin/dashboard/admin-section-card";
import { cn } from "@/lib/utils";

type ImportTrack = {
  id: string;
  title: string;
  description: string;
  icon: typeof MapPin;
  formats: string[];
  requiredFields: string[];
  actionLabel: string;
};

const importTracks: ImportTrack[] = [
  {
    id: "places",
    title: "Lieux",
    description: "Importez des fiches lieux avec coordonnées, régions, catégories et infos de contact.",
    icon: MapPin,
    formats: [".csv", ".xlsx", ".json"],
    requiredFields: ["Nom", "Région", "Latitude", "Longitude", "Catégorie"],
    actionLabel: "Importer des lieux"
  },
  {
    id: "events",
    title: "Événements",
    description: "Chargez des événements à venir avec dates, lieux, visuels et statut de publication.",
    icon: CalendarDays,
    formats: [".csv", ".xlsx"],
    requiredFields: ["Titre", "Date", "Lieu", "Ville", "Statut"],
    actionLabel: "Importer des événements"
  },
  {
    id: "partners",
    title: "Partenaires",
    description: "Synchronisez des partenaires, établissements et dossiers KYC depuis un export structuré.",
    icon: Users2,
    formats: [".csv", ".xlsx"],
    requiredFields: ["Raison sociale", "Email", "Téléphone", "Type", "KYC"],
    actionLabel: "Importer des partenaires"
  },
  {
    id: "content",
    title: "Autres contenus",
    description: "Ajoutez des contenus éditoriaux, médias, traductions ou blocs promotionnels en lot.",
    icon: FileText,
    formats: [".csv", ".xlsx", ".zip"],
    requiredFields: ["Titre", "Type", "Langue", "Source"],
    actionLabel: "Importer des contenus"
  }
];

const importStats = [
  { label: "Lots en attente", value: "14", hint: "3 à valider aujourd'hui" },
  { label: "Lignes traitées", value: "48 230", hint: "Depuis le dernier cycle" },
  { label: "Taux de succès", value: "96.4%", hint: "Sur les 30 derniers jours" },
  { label: "Erreurs bloquantes", value: "7", hint: "Nécessitent une correction" }
];

const preflightChecks = [
  "Colonnes obligatoires présentes",
  "Fichiers encodés en UTF-8",
  "Coordonnées géographiques valides",
  "Doublons détectés avant import",
  "Aperçu de 20 lignes généré"
];

const batchHistory = [
  {
    label: "Import lieux - Sud-Ouest",
    status: "Validé",
    meta: "2 430 lignes - il y a 25 min",
    tone: "success"
  },
  {
    label: "Import événements - Littoral",
    status: "En revue",
    meta: "840 lignes - il y a 2 h",
    tone: "warning"
  },
  {
    label: "Import partenaires - KYC",
    status: "Corriger",
    meta: "116 lignes - il y a 4 h",
    tone: "danger"
  }
] as const;

export function AdminImportsPage() {
  const [selectedFiles, setSelectedFiles] = useState<Record<string, File | null>>({});

  const selectedCount = useMemo(
    () => Object.values(selectedFiles).filter(Boolean).length,
    [selectedFiles]
  );

  const handleFileChange = (trackId: string) => (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setSelectedFiles((current) => ({
      ...current,
      [trackId]: file
    }));
  };

  return (
    <div className="admin-imports">
      <section className="admin-imports__hero">
        <div className="admin-imports__hero-copy">
          <span className="admin-module__eyebrow">Opérations</span>
          <h2 className="admin-imports__title">Imports de lieux, événements et autres contenus</h2>
          <p className="admin-imports__text">
            Centralisez les importations massives dans une interface unique avec modèles de fichiers,
            validation des colonnes, aperçu des données et suivi des lots.
          </p>

          <div className="admin-imports__actions">
            <Link href="/admin/catalog" className="admin-imports__primary-action">
              Ouvrir le catalogue
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <Link href="/admin/places-events" className="admin-imports__secondary-action">
              Revue lieux & events
            </Link>
          </div>
        </div>

        <div className="admin-imports__stats">
          {importStats.map((stat) => (
            <article key={stat.label} className="admin-imports__stat">
              <p>{stat.label}</p>
              <strong>{stat.value}</strong>
              <span>{stat.hint}</span>
            </article>
          ))}
          <article className="admin-imports__stat admin-imports__stat--selection">
            <p>Fichiers sélectionnés</p>
            <strong>{selectedCount}</strong>
            <span>Prêts pour l&apos;import</span>
          </article>
        </div>
      </section>

      <section className="admin-imports__grid" aria-label="Modules d'import">
        {importTracks.map((track) => {
          const Icon = track.icon;
          const file = selectedFiles[track.id];
          const inputId = `import-${track.id}`;

          return (
            <article key={track.title} className="admin-import-card">
              <div className="admin-import-card__header">
                <div className="admin-import-card__icon">
                  <Icon size={20} aria-hidden="true" />
                </div>
                <div className="admin-import-card__copy">
                  <h3>{track.title}</h3>
                  <p>{track.description}</p>
                </div>
              </div>

              <div className="admin-import-card__upload">
                <div className="admin-import-card__upload-body">
                  <UploadCloud size={20} aria-hidden="true" />
                  <div>
                    <p>Déposez un fichier ou choisissez-en un</p>
                    <span>Formats acceptés: {track.formats.join(", ")}</span>
                    <span className="admin-import-card__file-status">
                      {file ? `Fichier sélectionné: ${file.name}` : "Aucun fichier sélectionné"}
                    </span>
                  </div>
                </div>

                <label htmlFor={inputId} className="admin-import-card__button">
                  Sélectionner un fichier
                </label>
                <input
                  id={inputId}
                  type="file"
                  className="admin-import-card__file-input"
                  accept={track.formats.join(",")}
                  onChange={handleFileChange(track.id)}
                />
              </div>

              <div className="admin-import-card__meta">
                <div>
                  <span className="admin-import-card__meta-label">Champs requis</span>
                  <div className="admin-import-card__chips">
                    {track.requiredFields.map((field) => (
                      <span key={field} className="admin-import-card__chip">
                        {field}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="admin-import-card__foot">
                  <Link href="/admin/imports" className="admin-import-card__template">
                    <Download size={16} aria-hidden="true" />
                    Modèle
                  </Link>
                  <button type="button" className="admin-import-card__submit" disabled={!file}>
                    {track.actionLabel}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      <section className="admin-imports__lower-grid">
        <AdminSectionCard className="admin-imports__checklist-card">
          <div className="admin-section-card__head">
            <h3 className="admin-section-card__title">Contrôles avant import</h3>
            <span className="admin-section-card__pill">Préflight</span>
          </div>

          <div className="admin-imports__checklist">
            {preflightChecks.map((check) => (
              <div key={check} className="admin-imports__check-item">
                <CheckCircle2 size={18} aria-hidden="true" />
                <span>{check}</span>
              </div>
            ))}
          </div>

          <div className="admin-imports__notice">
            <AlertCircle size={18} aria-hidden="true" />
            <p>
              Les lignes invalides sont isolées dans un lot d&apos;erreurs afin que l&apos;import principal
              reste exploitable sans rechargement complet.
            </p>
          </div>
        </AdminSectionCard>

        <AdminSectionCard className="admin-imports__history-card">
          <div className="admin-section-card__head">
            <h3 className="admin-section-card__title">Historique des lots</h3>
            <Link href="/admin" className="admin-section-card__link">
              Retour dashboard
            </Link>
          </div>

          <div className="admin-imports__history">
            {batchHistory.map((batch) => (
              <article key={batch.label} className="admin-imports__batch">
                <div className={cn("admin-imports__batch-status", `tone-${batch.tone}`)}>
                  <span />
                </div>
                <div className="admin-imports__batch-copy">
                  <h4>{batch.label}</h4>
                  <p>{batch.meta}</p>
                </div>
                <span className="admin-imports__batch-label">{batch.status}</span>
              </article>
            ))}
          </div>

          <Link href="/admin/imports" className="admin-section-card__link admin-section-card__link--full">
            Voir tous les lots
            <Clock3 size={16} aria-hidden="true" />
          </Link>
        </AdminSectionCard>
      </section>

      <section className="admin-imports__footer">
        <AdminSectionCard className="admin-imports__guide">
          <div className="admin-section-card__head">
            <h3 className="admin-section-card__title">Guide de préparation</h3>
            <ShieldCheck size={18} aria-hidden="true" />
          </div>
          <p className="admin-section-card__text">
            Préparez les exports depuis vos outils externes, normalisez les régions et vérifiez les
            identifiants uniques avant soumission.
          </p>
        </AdminSectionCard>

        <AdminSectionCard className="admin-imports__guide">
          <div className="admin-section-card__head">
            <h3 className="admin-section-card__title">Support opérateur</h3>
            <FolderUp size={18} aria-hidden="true" />
          </div>
          <p className="admin-section-card__text">
            Besoin d&apos;un import récurrent ou d&apos;un mapping spécifique ? Documentez le modèle et
            associez-le à une source stable.
          </p>
        </AdminSectionCard>
      </section>
    </div>
  );
}
