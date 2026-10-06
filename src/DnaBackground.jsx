import React, { useEffect, useRef } from "react";
import { startDna } from "./dnaEngine";

/*
  Fundo com DNA animado, delicado e minimalista.
  Usado SOMENTE no hero da página "Início".
*/
export default function DnaBackground() {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return undefined;
    return startDna(ref.current);
  }, []);

  return <canvas ref={ref} className="dna-bg" aria-hidden="true" />;
}
