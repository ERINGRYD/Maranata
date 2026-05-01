import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Lock, Info } from "lucide-react";
import { toast } from "sonner";
import { auth } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      if (result.user.email === "eringryd@gmail.com") {
        toast.success("Acesso liberado");
        navigate("/admin/cadastros");
      } else {
        toast.error("Acesso negado. Esta conta não tem permissões administrativas.");
        await auth.signOut();
      }
    } catch (error) {
      console.error(error);
      const message = error instanceof Error ? error.message : "Ocorreu um erro ao fazer login.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="surface-ink">
        <div className="container py-6 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-ink-foreground/80 hover:text-accent transition-colors text-sm font-display tracking-[0.2em] uppercase"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar ao site
          </Link>
          <span className="font-display text-xs tracking-[0.3em] uppercase text-ink-muted">
            Área restrita
          </span>
        </div>
      </header>

      <section className="flex-1 flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex h-12 w-12 items-center justify-center bg-foreground text-background mb-4">
              <Lock className="h-5 w-5" />
            </div>
            <h1 className="font-display text-3xl uppercase tracking-tight">
              Acesso administrativo
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Entre exclusivamente com sua conta Google autorizada.
            </p>
          </div>

          <div className="bg-card border border-border p-8 space-y-6">
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full px-8 py-4 bg-foreground text-background font-display text-sm tracking-[0.25em] uppercase hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50"
            >
              {loading ? "Autenticando..." : "Login com Google"}
            </button>
          </div>

          <div className="mt-6 border border-border bg-muted/40 p-4 text-xs text-muted-foreground flex gap-3">
            <Info className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-foreground">
                Acesso Restrito
              </p>
              <p className="mt-1">
                Apenas o administrador (eringryd@gmail.com) tem acesso a este painel administrativo.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
