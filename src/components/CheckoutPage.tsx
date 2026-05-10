import { CheckoutForm } from "./CheckoutForm";
import type { CartItem } from "../types";

type CheckoutPageProps = {
  cart: CartItem[];
  totalPrice: number;
  onBack: () => void;
  onCheckout: (orderData: {
    name: string;
    memberId?: string;
    address: string;
    phone: string;
    note?: string;
  }) => void;
};

export function CheckoutPage({
  cart,
  totalPrice,
  onBack,
  onCheckout,
}: CheckoutPageProps) {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 rounded-[2rem] border border-slate-200 bg-white/90 p-8 shadow-glass sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-bataru-700">
            Checkout
          </p>
          <h1 className="mt-3 text-4xl font-semibold text-slate-900">
            Selesaikan Pesanan Anda
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
            Halaman checkout penuh untuk memeriksa detail pesanan, memasukkan
            alamat, dan mengirimkan pesanan koperasi BATARU.
          </p>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-300"
        >
          Kembali ke Toko
        </button>
      </div>

      {cart.length === 0 ? (
        <div className="rounded-[2rem] border border-dashed border-slate-200 bg-slate-50 p-10 text-center text-slate-600 shadow-sm">
          <p className="text-xl font-semibold text-slate-900">
            Keranjang kosong
          </p>
          <p className="mt-3 max-w-2xl mx-auto text-sm leading-7">
            Tambahkan produk terlebih dahulu dari halaman toko sebelum
            melanjutkan checkout.
          </p>
        </div>
      ) : (
        <div className="grid gap-8 xl:grid-cols-[0.95fr_0.75fr]">
          <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-900">
              Rincian Pesanan
            </h2>
            <div className="mt-6 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-3xl bg-slate-50 p-4"
                >
                  <div>
                    <p className="font-semibold text-slate-900">{item.name}</p>
                    <p className="mt-1 text-sm text-slate-600">
                      {item.quantity} × Rp{item.price.toLocaleString("id-ID")}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-slate-900">
                    Rp{(item.price * item.quantity).toLocaleString("id-ID")}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-[1.75rem] bg-bataru-50 p-6 text-slate-900">
              <p className="text-sm text-slate-500">Total Pembayaran</p>
              <p className="mt-3 text-3xl font-semibold">
                Rp{totalPrice.toLocaleString("id-ID")}
              </p>
            </div>
          </section>

          <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-900">
              Form Checkout
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Isi formulir berikut untuk menyelesaikan pemesanan Anda.
            </p>
            <div className="mt-6">
              <CheckoutForm onCheckout={onCheckout} cartLength={cart.length} />
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
