"use client";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  commissionSchema,
  ledgerSchema,
} from "@/features/finance/schemas/finance-schema";
import { financeApi } from "@/features/finance/api/finance-api";
import type {
  CommissionInput,
  LedgerEntry,
  LedgerType,
  ProductType,
} from "@/features/finance/types/finance";
import { queryKeys } from "@/lib/query/query-keys";
import { useAdminToast } from "@/components/admin/ui/admin-toast";
import {
  AdminDataTable,
  type AdminColumn,
} from "@/components/admin/ui/admin-data-table";
import {
  AdminDialog,
  AdminEmptyState,
  AdminErrorState,
  AdminPageHeader,
  AdminStatCard,
} from "@/components/admin/ui/admin-foundation";
import { AdminRadioGroup } from "@/components/admin/ui/admin-choice-group";
export function CommissionsPage() {
  const { toast } = useAdminToast();
  const [values, setValues] = useState<CommissionInput>({
    partnerId: "",
    productType: "BOOKING_ORDER",
    percentage: 0,
    fixedAmount: 0,
    currency: "XAF",
    ruleVersion: 1,
    effectiveFrom: "",
  });
  const mutation = useMutation({
    mutationFn: () =>
      financeApi.commission({
        ...commissionSchema.parse(values),
        effectiveFrom: new Date(values.effectiveFrom).toISOString(),
      }),
    onSuccess: () =>
      toast({ title: "Règle de commission créée", tone: "success" }),
  });
  return (
    <div className="admin-feature">
      <AdminPageHeader
        title="Commissions"
        description="Le backend permet la création, mais n’expose aucun historique de lecture."
      />
      <form
        className="admin-form"
        onSubmit={(e) => {
          e.preventDefault();
          mutation.mutate();
        }}
      >
        <label>
          Partenaire
          <input
            value={values.partnerId ?? ""}
            onChange={(e) =>
              setValues({ ...values, partnerId: e.target.value })
            }
          />
        </label>
        <AdminRadioGroup legend="Produit" value={values.productType} options={[{ value: "TICKET_ORDER", label: "Billetterie" }, { value: "BOOKING_ORDER", label: "Réservation" }, { value: "CAMPAIGN_CREDIT_ORDER", label: "Crédit campagne" }, { value: "EXPERIENCE_ORDER", label: "Expérience" }, { value: "PARTNER_SUBSCRIPTION", label: "Abonnement partenaire" }]} onChange={(productType: ProductType) => setValues({ ...values, productType })}/>
        {(
          ["percentage", "fixedAmount", "maximumAmount", "ruleVersion"] as const
        ).map((k) => (
          <label key={k}>
            {k}
            <input
              type="number"
              value={values[k] ?? ""}
              onChange={(e) =>
                setValues({ ...values, [k]: Number(e.target.value) })
              }
            />
          </label>
        ))}
        <label>
          Devise
          <input
            value={values.currency}
            onChange={(e) =>
              setValues({ ...values, currency: e.target.value.toUpperCase() })
            }
          />
        </label>
        <label>
          Effet
          <input
            type="datetime-local"
            value={values.effectiveFrom}
            onChange={(e) =>
              setValues({ ...values, effectiveFrom: e.target.value })
            }
          />
        </label>
        <button className="admin-button">Créer la règle</button>
        {mutation.error ? <AdminErrorState error={mutation.error} /> : null}
      </form>
      <AdminEmptyState
        title="Historique non exposé"
        description="Aucun GET /commerce/admin/commissions n’existe."
      />
    </div>
  );
}
export function LedgerPage() {
  const [partnerId, setPartnerId] = useState("");
  const [currency, setCurrency] = useState("XAF");
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [values, setValues] = useState({
    type: "ADJUSTMENT" as LedgerType,
    amount: 0,
    reason: "",
    orderId: "",
  });
  const client = useQueryClient();
  const { toast } = useAdminToast();
  const ledger = useQuery({
    queryKey: [...queryKeys.commerce.lists(), "ledger", partnerId],
    queryFn: () => financeApi.ledger(partnerId),
    enabled: Boolean(partnerId),
  });
  const balance = useQuery({
    queryKey: [...queryKeys.commerce.lists(), "balance", partnerId, currency],
    queryFn: () => financeApi.balance(partnerId, currency),
    enabled: Boolean(partnerId && currency),
  });
  const mutation = useMutation({
    mutationFn: () => {
      const parsed = ledgerSchema.parse({
        partnerId,
        currency,
        ...values,
        orderId: values.orderId || undefined,
      });
      const body = {
        orderId: parsed.orderId,
        amount: parsed.amount,
        currency: parsed.currency,
        reason: parsed.reason,
      };
      return parsed.type === "ADJUSTMENT"
        ? financeApi.adjustment(partnerId, body)
        : financeApi.movement(partnerId, { ...body, type: parsed.type });
    },
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: queryKeys.commerce.all });
      toast({ title: "Mouvement ledger enregistré", tone: "success" });
      setOpen(false);
      setConfirm(false);
    },
  });
  const columns: AdminColumn<LedgerEntry>[] = [
    {
      id: "date",
      header: "Date",
      cell: (x) => new Date(x.occurredAt).toLocaleString("fr-FR"),
    },
    { id: "type", header: "Type", cell: (x) => x.transactionType },
    {
      id: "amount",
      header: "Montant",
      cell: (x) =>
        new Intl.NumberFormat("fr-FR", {
          style: "currency",
          currency: x.currency,
        }).format(x.amount),
    },
    { id: "order", header: "Commande", cell: (x) => x.orderId ?? "—" },
    { id: "reason", header: "Motif", cell: (x) => x.reason },
    { id: "actor", header: "Créé par", cell: (x) => x.createdBy },
  ];
  return (
    <div className="admin-feature">
      <AdminPageHeader
        title="Ledger partenaires"
        actions={
          <button
            className="admin-button"
            disabled={!partnerId}
            onClick={() => setOpen(true)}
          >
            Nouveau mouvement
          </button>
        }
      />
      <div className="admin-filters">
        <input
          placeholder="Partner ID"
          value={partnerId}
          onChange={(e) => setPartnerId(e.target.value)}
        />
        <input
          value={currency}
          maxLength={3}
          onChange={(e) => setCurrency(e.target.value.toUpperCase())}
        />
      </div>
      {balance.data ? (
        <AdminStatCard
          label={`Solde ${currency}`}
          value={balance.data.balance}
        />
      ) : null}
      <section className="admin-section-card">
        <AdminDataTable
          rows={ledger.data ?? []}
          columns={columns}
          rowKey={(x) => x.id}
          loading={ledger.isLoading}
          error={ledger.error ?? undefined}
        />
      </section>
      <AdminDialog
        open={open}
        title="Mouvement financier manuel"
        onClose={() => setOpen(false)}
        footer={
          <button
            disabled={!values.reason || !values.amount}
            onClick={() => setConfirm(true)}
          >
            Vérifier le récapitulatif
          </button>
        }
      >
        <AdminRadioGroup legend="Type" value={values.type} options={[{ value: "ADJUSTMENT", label: "Ajustement" }, { value: "SALE_CREDIT", label: "Crédit vente" }, { value: "PLATFORM_COMMISSION", label: "Commission plateforme" }, { value: "REFUND_DEBIT", label: "Débit remboursement" }, { value: "PAYOUT", label: "Versement" }, { value: "CHARGEBACK", label: "Rétrofacturation" }]} onChange={(type: LedgerType) => setValues({ ...values, type })}/>
        <label className="admin-field">
          Montant
          <input
            type="number"
            value={values.amount}
            onChange={(e) =>
              setValues({ ...values, amount: Number(e.target.value) })
            }
          />
        </label>
        <label className="admin-field">
          Commande facultative
          <input
            value={values.orderId}
            onChange={(e) => setValues({ ...values, orderId: e.target.value })}
          />
        </label>
        <label className="admin-field">
          Raison
          <textarea
            value={values.reason}
            onChange={(e) => setValues({ ...values, reason: e.target.value })}
          />
        </label>
      </AdminDialog>
      <AdminDialog
        open={confirm}
        title="Double confirmation financière"
        onClose={() => setConfirm(false)}
        footer={
          <button
            data-destructive
            disabled={mutation.isPending}
            onClick={() => mutation.mutate()}
          >
            Confirmer définitivement
          </button>
        }
      >
        <p>
          Partenaire : <strong>{partnerId}</strong>
        </p>
        <p>
          Mouvement : <strong>{values.type}</strong>
        </p>
        <p>
          Montant :{" "}
          <strong>
            {values.amount} {currency}
          </strong>
        </p>
        <p>Motif : {values.reason}</p>
        {mutation.error ? <AdminErrorState error={mutation.error} /> : null}
      </AdminDialog>
    </div>
  );
}
