export function Hero() {
  return (
    <section className="overflow-hidden bg-gradient-to-br from-bataru-50 via-white to-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:flex lg:items-center lg:justify-between lg:px-8 lg:py-20">
        <div className="max-w-2xl">
          <span className="inline-flex rounded-full bg-bataru-100 px-4 py-1 text-sm font-semibold uppercase tracking-[0.35em] text-bataru-700 shadow-sm">
            Resmi & Modern
          </span>
          <h1 className="mt-8 text-4xl font-semibold tracking-tight text-slate-800 sm:text-5xl">
            Belanja kebutuhan koperasi BATARU makin mudah.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
            Aplikasi toko online untuk anggota BATARU: harga koperasi, layanan
            cepat, dan promo khusus koperasi.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <a
              href="#produk"
              className="inline-flex items-center justify-center rounded-full bg-bataru-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-bataru-700"
            >
              Jelajah Produk
            </a>
            <a
              href="#tentang"
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-300"
            >
              Tentang BATARU
            </a>
          </div>
        </div>

        <div className="mt-12 lg:mt-0 lg:w-[38rem]">
          <div className="relative overflow-hidden rounded-[2.5rem] border border-slate-200/80 bg-slate-50 p-6 shadow-glass sm:p-8">
            <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-bataru-100 blur-3xl" />
            <div className="absolute -left-16 bottom-0 h-44 w-44 rounded-full bg-bataru-100 blur-3xl" />
            <div className="relative">
              <p className="text-sm uppercase tracking-[0.35em] text-bataru-700">
                Anggota Koperasi
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-slate-100 p-5 border border-slate-200">
                  <p className="text-sm text-slate-500">Produk tersedia</p>
                  <p className="mt-4 text-3xl font-semibold text-slate-800">
                    6+
                  </p>
                </div>
                <div className="rounded-3xl bg-slate-100 p-5 border border-slate-200">
                  <p className="text-sm text-slate-500">Promo koperasi</p>
                  <p className="mt-4 text-3xl font-semibold text-slate-800">
                    Diskon 15%
                  </p>
                </div>
              </div>
              <div className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-sm font-semibold text-slate-900">
                  Dapatkan Layanan Khusus
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  Pengiriman cepat, pembayaran aman, dan harga koperasi untuk
                  anggota BATARU.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
