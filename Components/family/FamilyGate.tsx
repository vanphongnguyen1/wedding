"use client";

import { useEffect, useState } from "react";
import { Heart, LockKeyhole } from "lucide-react";
import { PaperTexture } from "@/Components/common/PaperTexture";
import { cn } from "@/lib/utils";

// Front-end only gate — keeps casual visitors out, not a real security boundary.
const PASSWORD = "Taotau";
const STORAGE_KEY = "family-unlocked";

type State = "checking" | "locked" | "unlocked";

interface FamilyGateProps {
  children: React.ReactNode;
}

/** Shows a password card until the viewer enters the family password; remembers it on this device. */
export function FamilyGate({ children }: FamilyGateProps) {
  const [state, setState] = useState<State>("checking");
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);

  // localStorage only exists in the browser → read it after mount (avoids hydration mismatch)
  useEffect(() => {
    let ok = false;
    try { ok = localStorage.getItem(STORAGE_KEY) === "1"; } catch {}
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState(ok ? "unlocked" : "locked");
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() === PASSWORD) {
      try { localStorage.setItem(STORAGE_KEY, "1"); } catch {}
      setState("unlocked");
    } else {
      setError(true);
      setValue("");
    }
  };

  if (state === "unlocked") return <>{children}</>;
  if (state === "checking") return <div className="min-h-[70vh]" aria-busy="true" />;

  return (
    <div className="relative flex min-h-[calc(100svh-57px)] items-center justify-center overflow-hidden bg-amber-50/60 px-4 py-16">
      <PaperTexture color="#92400e" />

      <form
        onSubmit={submit}
        className="relative w-full max-w-sm rotate-[-1deg] bg-white px-8 pt-10 pb-8 text-center shadow-[0_25px_50px_-20px_rgba(0,0,0,0.35)] animate-card-rise"
      >
        <span aria-hidden className="absolute -top-3 left-1/2 h-7 w-24 -translate-x-1/2 rotate-[-4deg] bg-rose-200/80 shadow-sm" />

        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 ring-1 ring-rose-200">
          <LockKeyhole className="h-6 w-6 text-rose-400" />
        </div>
        <p className="mt-4 font-script text-4xl text-rose-400">Gia đình nhỏ</p>
        <p className="mt-2 text-sm text-stone-500">Góc riêng của gia đình — nhập mật khẩu để xem nhé.</p>

        <label htmlFor="family-password" className="sr-only">Mật khẩu</label>
        <input
          id="family-password"
          type="password"
          value={value}
          onChange={(e) => { setValue(e.target.value); setError(false); }}
          autoFocus
          autoComplete="off"
          placeholder="Mật khẩu"
          aria-invalid={error}
          aria-describedby={error ? "family-password-error" : undefined}
          className={cn(
            "mt-6 w-full rounded-full border bg-stone-50 px-5 py-3 text-center tracking-widest text-stone-700 outline-none transition-colors",
            "focus:border-rose-300 focus:bg-white focus:ring-4 focus:ring-rose-100",
            error ? "border-rose-400 animate-[shake_0.4s_ease]" : "border-stone-200",
          )}
        />
        <p id="family-password-error" role="alert" className={cn("mt-2 h-5 text-xs text-rose-500", !error && "invisible")}>
          Mật khẩu chưa đúng, thử lại nhé.
        </p>

        <button
          type="submit"
          className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-rose-500 py-3 text-sm text-white transition-colors hover:bg-rose-600"
        >
          <Heart className="h-4 w-4 fill-white" />
          Vào xem
        </button>
      </form>
    </div>
  );
}
