import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[#0C0C0C] text-[#A3A3A3] border-t border-neutral-900 pt-20 pb-12 font-sans text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Multi-Column Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 pb-16 border-b border-neutral-900">
          {/* Brand Col */}
          <div className="col-span-2">
            <Link
              href="/"
              className="inline-block font-mono text-2xl font-bold tracking-tighter text-white uppercase mb-4"
            >
              <span>Six</span>
              <span className="text-neutral-500 font-light">&</span>
              <span>7</span>
            </Link>
            <p className="text-neutral-400 font-light leading-relaxed max-w-sm text-xs">
              Architectural footwear designed in Copenhagen, hand-finished in Tuscany. Built for timeless structural poise.
            </p>
            <div className="mt-6 flex items-center gap-2 font-mono text-[11px] text-neutral-500 uppercase">
              <span className="w-2 h-2 rounded-full bg-emerald-500/80 inline-block" />
              <span>Atelier Operations / Global Dispatch Active</span>
            </div>
          </div>

          {/* Links: Collections */}
          <div>
            <h4 className="font-mono text-white text-[11px] uppercase tracking-widest mb-4">
              Silhouettes
            </h4>
            <ul className="space-y-3 font-light text-neutral-400">
              <li>
                <Link href="/shop" className="hover:text-white transition-colors">
                  All Footwear
                </Link>
              </li>
              <li>
                <Link href="/men" className="hover:text-white transition-colors">
                  Men&apos;s Edition
                </Link>
              </li>
              <li>
                <Link href="/women" className="hover:text-white transition-colors">
                  Women&apos;s Edition
                </Link>
              </li>
              <li>
                <Link href="/kids" className="hover:text-white transition-colors">
                  Junior / Kids
                </Link>
              </li>
              <li>
                <Link href="/sports" className="hover:text-white transition-colors">
                  Athletic & Track
                </Link>
              </li>
            </ul>
          </div>

          {/* Links: Client Services */}
          <div>
            <h4 className="font-mono text-white text-[11px] uppercase tracking-widest mb-4">
              Client Care
            </h4>
            <ul className="space-y-3 font-light text-neutral-400">
              <li>
                <Link href="/size-guide" className="hover:text-white transition-colors">
                  Sizing & Fit Guide
                </Link>
              </li>
              <li>
                <Link href="/shipping-and-returns" className="hover:text-white transition-colors">
                  Shipping & Tracking
                </Link>
              </li>
              <li>
                <Link href="/shipping-and-returns" className="hover:text-white transition-colors">
                  Complimentary Returns
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  Sole Restoration Program
                </Link>
              </li>
            </ul>
          </div>

          {/* Links: Company & Studio */}
          <div>
            <h4 className="font-mono text-white text-[11px] uppercase tracking-widest mb-4">
              The Studio
            </h4>
            <ul className="space-y-3 font-light text-neutral-400">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  Design Philosophy
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  Material Transparency
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Studio Inquiries
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-neutral-500 text-[11px] font-mono">
          <div className="flex items-center gap-6">
            <span>&copy; 2026 SIX&7 ATELIER CORP. ALL RIGHTS RESERVED.</span>
          </div>

          <div className="flex items-center gap-6">
            <span className="text-neutral-400">CURRENCY: USD ($)</span>
            <span className="text-neutral-600">|</span>
            <Link href="/privacy-policy" className="hover:text-white transition-colors">
              PRIVACY POLICY
            </Link>
            <Link href="/terms-and-conditions" className="hover:text-white transition-colors">
              TERMS OF SERVICE
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
