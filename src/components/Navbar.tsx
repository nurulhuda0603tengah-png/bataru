type NavbarProps = {
  totalItems: number;
  onCartClick: () => void;
};

export function Navbar({ totalItems, onCartClick }: NavbarProps) {
  return (
    <header className="border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="Logo Koperasi BATARU"
            className="h-12 w-12 rounded-2xl object-contain shadow-glass"
          />
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.4em] text-bataru-700">
              Koperasi BATARU
            </p>
            <p className="text-slate-500 text-sm">Toko Online Resmi</p>
          </div>
        </div>

        <nav className="hidden items-center gap-8 md:flex">
          <a
            className="text-slate-600 transition hover:text-bataru-700"
            href="#produk"
          >
            Produk
          </a>
          <a
            className="text-slate-600 transition hover:text-bataru-700"
            href="#tentang"
          >
            Tentang
          </a>
          <a
            className="text-slate-600 transition hover:text-bataru-700"
            href="#kontak"
          >
            Kontak
          </a>
          <a
            className="text-slate-600 transition hover:text-bataru-700"
            href="/admin"
          >
            Admin
          </a>
        </nav>

        <button
          type="button"
          onClick={onCartClick}
          className="relative inline-flex min-w-[150px] items-center justify-center gap-2 rounded-full bg-bataru-900 px-6 py-3 text-base font-bold text-white shadow-[0_20px_40px_rgba(11,79,97,0.24)] ring-2 ring-bataru-700/40 transition duration-200 hover:bg-bataru-950 focus:outline-none focus-visible:ring-4 focus-visible:ring-bataru-300/40"
        >
          Keranjang
          {totalItems > 0 ? (
            <span className="rounded-full bg-white px-2 py-1 text-xs font-bold text-bataru-700 shadow-sm">
              {totalItems}
            </span>
          ) : null}
        </button>
      </div>
    </header>
  );
}
