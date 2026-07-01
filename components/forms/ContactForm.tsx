import Link from "next/link";
import { Mail, MessageCircle, Store } from "lucide-react";
import { businessInfo } from "@/lib/brand/businessInfo";

export function ContactForm() {
  return (
    <section className="seed-card rounded-seed p-5 md:p-6">
      <div className="flex items-start gap-3">
        <MessageCircle
          aria-hidden
          className="mt-1 size-7 shrink-0 text-forest-700"
        />
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-clay">
            Contact form status
          </p>
          <h2 className="mt-2 font-display text-3xl font-black text-forest-900">
            Email the farm directly
          </h2>
          <p className="mt-3 leading-7 text-forest-900/72">
            The web contact form is disabled for launch until a real email
            service or database is connected. This avoids collecting customer
            messages that might not be delivered.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <a
          className="focus-ring flex min-h-12 items-center justify-center gap-2 rounded-full border border-forest-900 bg-forest-700 px-5 py-3 font-black text-cream-50 shadow-soft hover:bg-forest-900"
          href={businessInfo.emailHref}
        >
          <Mail aria-hidden className="size-5" />
          {businessInfo.email}
        </a>
        <Link
          className="focus-ring flex min-h-12 items-center justify-center gap-2 rounded-full border border-harvest-700/40 bg-harvest-300 px-5 py-3 font-black text-forest-900 hover:bg-harvest-100"
          href="/policies/wholesale"
        >
          <Store aria-hidden className="size-5" />
          Wholesale Info
        </Link>
      </div>

      <div className="mt-6 rounded-2xl border border-forest-900/10 bg-white/55 p-4 text-sm leading-6 text-forest-900/72">
        <p className="font-black text-forest-900">Helpful details to include</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Your name and best reply email.</li>
          <li>Whether you need product help, order support, or wholesale info.</li>
          <li>Any order number or product name involved.</li>
        </ul>
      </div>

      <p className="mt-5 rounded-2xl border border-clay/20 bg-clay/10 p-4 text-sm font-bold leading-6 text-forest-900">
        Production database is not configured yet. Connect Supabase, Resend,
        Formspree, or another approved backend before using this feature live.
      </p>
    </section>
  );
}
