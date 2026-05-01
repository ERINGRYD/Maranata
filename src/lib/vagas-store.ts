import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";

export type VagasSnapshot = {
  limite: number;
  inscritos: number;
  restantes: number;
  esgotado: boolean;
};

// Hooks to read directly from Firestore
export function useVagas(): VagasSnapshot {
  const [state, setState] = useState<VagasSnapshot>({
    limite: 150,
    inscritos: 0,
    restantes: 150,
    esgotado: false,
  });

  useEffect(() => {
    const configRef = doc(db, 'config', 'vagas');
    const unsubscribe = onSnapshot(configRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        const limite = data.totalVagas ?? 150;
        const inscritos = data.inscritosAtivos ?? 0;
        const restantes = Math.max(0, limite - inscritos);
        setState({
          limite,
          inscritos,
          restantes,
          esgotado: restantes <= 0
        });
      }
    });

    return () => unsubscribe();
  }, []);

  return state;
}

export async function setLimite(n: number) {
  const configRef = doc(db, 'config', 'vagas');
  await setDoc(configRef, { totalVagas: n }, { merge: true });
}

// These are no longer used for writing but we can keep minimal exports if they are used elsewhere
export function incrementInscritos() {
  // It is automatically handled by the transaction in cadastroService.create
}
export function getInscritos() {
  return 0; // Deprecated, use useVagas()
}
export function isEsgotado() {
  return false; // Deprecated, use useVagas() esgotado property
}
