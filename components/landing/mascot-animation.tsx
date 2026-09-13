import Image from "next/image";

export function MascotAnimation() {
  return <div className="hero-mascot" aria-hidden="true">
    <div className="hero-mascot__halo" />
    <div className="hero-mascot__shadow" />
    <Image src="/mascot/yamo.png" alt="" fill priority sizes="(max-width: 700px) 85vw, 500px" className="hero-mascot__image" />
  </div>;
}
