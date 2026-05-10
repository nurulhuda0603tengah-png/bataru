import type { CartItem } from "../types";

type CartDrawerProps = {
  open: boolean;
  cart: CartItem[];
  totalPrice: number;
  onClose: () => void;
  onQuantityChange: (productId: string, next: number) => void;
  onProceedToCheckout: () => void;
};

export function CartDrawer({
  open,
  cart,
  totalPrice,
  onClose,
  onQuantityChange,
  onProceedToCheckout,
}: CartDrawerProps) {
  return (
    <div
      className={`fixed inset-0 z-50 transition-all duration-300 ${
        open
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0"
      }`}
    >
      <div
        className="absolute inset-0 bg-slate-950/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <aside
        className={`absolute right-0 top-0 h-full w-full max-w-md bg-slate-50 p-6 shadow-2xl transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-bataru-700">
              Keranjang
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">
              Pesanan Anda
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-slate-200 px-4 py-2 text-sm text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
          >
            Tutup
          </button>
        </div>

        <div className="mt-8 space-y-5">
          {cart.length === 0 ? (
            <div className="rounded-[2rem] border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-slate-500">
              Keranjang masih kosong. Pilih produk terbaik dari koperasi BATARU.
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-4"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      {item.name}
                    </h3>
                    <p className="mt-1 text-sm text-slate-600">
                      Rp{item.price.toLocaleString("id-ID")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 rounded-full bg-white px-3 py-1 shadow-sm">
                    <button
                      type="button"
                      className="rounded-full px-2 text-lg text-bataru-700"
                      onClick={() =>
                        onQuantityChange(item.id, item.quantity - 1)
                      }
                    >
                      −
                    </button>
                    <span className="w-8 text-center font-semibold text-slate-900">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      className="rounded-full px-2 text-lg text-bataru-700"
                      onClick={() =>
                        onQuantityChange(item.id, item.quantity + 1)
                      }
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-8 rounded-[2rem] bg-bataru-700/5 p-5 text-slate-900">
          <p className="text-sm text-slate-500">Total pembayaran</p>
          <p className="mt-3 text-3xl font-semibold">
            Rp{totalPrice.toLocaleString("id-ID")}
          </p>
          <p className="mt-4 text-sm text-slate-700">
            Lanjutkan ke halaman checkout untuk menyelesaikan pesanan.
          </p>
          <button
            type="button"
            onClick={onProceedToCheckout}
            className="mt-5 w-full rounded-full bg-bataru-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-bataru-700 disabled:bg-slate-300 disabled:text-slate-500"
            disabled={cart.length === 0}
          >
            Lanjutkan ke Checkout
          </button>
        </div>
      </aside>
    </div>
  );
}
