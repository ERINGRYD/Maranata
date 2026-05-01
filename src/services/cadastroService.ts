import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  runTransaction
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { z } from 'zod';

export const cadastroSchema = z.object({
  id: z.string().optional(),
  nome: z.string().min(3),
  telefone: z.string().min(1),
  email: z.string(),
  cidade: z.string(),
  membro: z.string(),
  acessibilidade: z.string().optional(),
  dataCadastro: z.string(), // ISO string from the client or empty if auto
  ativo: z.boolean(),
});

export type CadastroData = z.infer<typeof cadastroSchema>;

const COLLECTION_NAME = 'cadastros';
const CONFIG_REF = doc(db, 'config', 'vagas');

export const cadastroService = {
  // CREATE
  async create(data: Omit<CadastroData, 'id'>): Promise<string> {
    try {
      const docRef = doc(collection(db, COLLECTION_NAME));
      const payload = {
        ...data,
        dataCadastro: new Date().toISOString(),
        ativo: data.ativo ?? true,
      };

      await runTransaction(db, async (tx) => {
        const configSnap = await tx.get(CONFIG_REF);
        const inscritosAtivos = configSnap.exists() ? (configSnap.data().inscritosAtivos || 0) : 0;
        
        tx.set(docRef, payload);
        tx.update(CONFIG_REF, { inscritosAtivos: inscritosAtivos + 1 });
      });

      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, COLLECTION_NAME);
      throw error; 
    }
  },

  // READ
  async getAll(): Promise<CadastroData[]> {
    try {
      const q = query(collection(db, COLLECTION_NAME), orderBy('dataCadastro', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as CadastroData[];
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, COLLECTION_NAME);
      throw error;
    }
  },

  // UPDATE
  async update(id: string, data: Partial<CadastroData>): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      
      // Se estamos mudando o status 'ativo', precisamos atualizar o total no config
      if (data.ativo !== undefined) {
        await runTransaction(db, async (tx) => {
          const snap = await tx.get(docRef);
          if (!snap.exists()) throw new Error("Cadastro não encontrado");
          
          const currentData = snap.data();
          const configSnap = await tx.get(CONFIG_REF);
          let inscritosAtivos = configSnap.exists() ? (configSnap.data().inscritosAtivos || 0) : 0;
          
          if (currentData.ativo === true && data.ativo === false) {
            inscritosAtivos = Math.max(0, inscritosAtivos - 1);
          } else if (currentData.ativo === false && data.ativo === true) {
            inscritosAtivos += 1;
          }
          
          tx.update(docRef, data);
          tx.update(CONFIG_REF, { inscritosAtivos });
        });
      } else {
        await updateDoc(docRef, data);
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `${COLLECTION_NAME}/${id}`);
      throw error;
    }
  },

  // DELETE
  async delete(id: string): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await runTransaction(db, async (tx) => {
        const snap = await tx.get(docRef);
        if (snap.exists() && snap.data().ativo === true) {
          const configSnap = await tx.get(CONFIG_REF);
          const inscritosAtivos = configSnap.exists() ? (configSnap.data().inscritosAtivos || 0) : 0;
          tx.update(CONFIG_REF, { inscritosAtivos: Math.max(0, inscritosAtivos - 1) });
        }
        tx.delete(docRef);
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `${COLLECTION_NAME}/${id}`);
      throw error;
    }
  }
};
