import Image from "next/image";

export function FinalCta() {
  return (
    <section className="final-cta" aria-label="Appel à l'action final">
      <div className="final-cta__art" aria-hidden="true">
        <div className="final-cta__sun" />
        <div className="final-cta__wave" />
        <Image src="/mascot/yamo.png" alt="" width={250} height={314} className="final-cta__mascot" />
      </div>

      <div className="final-cta__copy">
        <h2>Prêt à explorer le Cameroun autrement ?</h2>
        <p>Rejoignez YeYamo et vivez des expériences uniques dès aujourd&apos;hui.</p>
      </div>
    </section>
  );
}
