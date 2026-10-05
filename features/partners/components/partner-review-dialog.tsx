"use client";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { partnersApi } from "@/features/partners/api/partners-api";
import type {
  PartnerValidation,
  PartnerValidationStatus,
} from "@/features/partners/types/partner";
import { partnerReviewSchema } from "@/features/partners/schemas/partner-review-schema";
import {
  AdminDialog,
  AdminErrorState,
} from "@/components/admin/ui/admin-foundation";
import { queryKeys } from "@/lib/query/query-keys";
import { useAdminToast } from "@/components/admin/ui/admin-toast";
import { AdminRadioGroup } from "@/components/admin/ui/admin-choice-group";
export function PartnerReviewDialog({
  validation,
  onClose,
}: {
  validation?: PartnerValidation;
  onClose: () => void;
}) {
  const [status, setStatus] = useState<PartnerValidationStatus>("APPROVED");
  const [comment, setComment] = useState("");
  const [risk, setRisk] = useState("");
  const [error, setError] = useState<string>();
  const client = useQueryClient();
  const { toast } = useAdminToast();
  const mutation = useMutation({
    mutationFn: () => {
      if (!validation) throw new Error("Validation absente");
      const parsed = partnerReviewSchema.safeParse({
        status,
        reviewComment: comment,
        riskScore: risk === "" ? undefined : risk,
      });
      if (!parsed.success) throw new Error(parsed.error.issues[0]?.message);
      return partnersApi.review(validation.id, parsed.data);
    },
    onSuccess: async () => {
      toast({ title: "Décision KYC enregistrée", tone: "success" });
      await client.invalidateQueries({ queryKey: queryKeys.partners.all });
      onClose();
    },
    onError: (e) =>
      setError(e instanceof Error ? e.message : "Décision impossible"),
  });
  return (
    <AdminDialog
      open={Boolean(validation)}
      title="Décision KYC"
      onClose={onClose}
      footer={
        <>
          <button onClick={onClose}>Annuler</button>
          <button
            className="admin-button"
            disabled={mutation.isPending}
            onClick={() => mutation.mutate()}
          >
            Confirmer
          </button>
        </>
      }
    >
      {error ? <AdminErrorState error={error} /> : null}
      <div className="admin-form">
        <AdminRadioGroup legend="Décision" value={status} options={[{ value: "APPROVED", label: "Approuver" }, { value: "REJECTED", label: "Rejeter" }, { value: "NEEDS_INFO", label: "Informations requises" }, { value: "REQUIRES_CHANGES", label: "Modifications requises" }]} onChange={(value: PartnerValidationStatus) => setStatus(value)}/>
        <label>
          Commentaire
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />
        </label>
        <label>
          Risk score
          <input
            type="number"
            min="0"
            max="100"
            value={risk}
            onChange={(e) => setRisk(e.target.value)}
          />
        </label>
      </div>
    </AdminDialog>
  );
}
