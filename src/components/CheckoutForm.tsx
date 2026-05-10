import { useEffect, useState } from "react";
import type { FormEvent } from "react";

type CheckoutFormProps = {
  onCheckout: (orderData: {
    name: string;
    memberId?: string;
    address: string;
    phone: string;
    note?: string;
  }) => void;
  cartLength: number;
};

export function CheckoutForm({ onCheckout, cartLength }: CheckoutFormProps) {
  const [name, setName] = useState("");
  const [memberId, setMemberId] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (cartLength > 0) {
      setSubmitted(false);
      setError("");
    }
  }, [cartLength]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name.trim() || !address.trim() || !phone.trim()) {
      setError("Mohon lengkapi nama, alamat, dan telepon untuk melanjutkan.");
      return;
    }

    setError("");
    onCheckout({
      name: name.trim(),
      memberId: memberId.trim() || undefined,
      address: address.trim(),
      phone: phone.trim(),
      note: note.trim() || undefined,
    });
    setSubmitted(true);
    setName("");
    setMemberId("");
    setAddress("");
    setPhone("");
    setNote("");
  };

  if (submitted) {
    return (
      <div className="rounded-[1.75rem] bg-slate-50 p-6 text-center shadow-sm ring-1 ring-slate-200/60">
        <p className="text-lg font-semibold text-slate-900">
          Pemesanan Berhasil
        </p>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          Terima kasih! Pesanan Anda berhasil dicatat. Tim BATARU akan segera
          menghubungi untuk verifikasi dan pengiriman.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error ? (
        <div className="rounded-3xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      ) : null}
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2 text-sm text-slate-700">
          Nama Lengkap
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-bataru-500 focus:outline-none"
            placeholder="Nama anggota"
          />
        </label>
        <label className="space-y-2 text-sm text-slate-700">
          Nomor Anggota
          <input
            value={memberId}
            onChange={(event) => setMemberId(event.target.value)}
            className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-bataru-500 focus:outline-none"
            placeholder="ID anggota (opsional)"
          />
        </label>
      </div>

      <label className="space-y-2 text-sm text-slate-700">
        Alamat Pengiriman
        <textarea
          value={address}
          onChange={(event) => setAddress(event.target.value)}
          className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-bataru-500 focus:outline-none"
          rows={3}
          placeholder="Jl. Contoh No. 12, Jakarta"
        />
      </label>

      <label className="space-y-2 text-sm text-slate-700">
        Nomor Telepon
        <input
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-bataru-500 focus:outline-none"
          placeholder="08xxxxxxxxxx"
        />
      </label>

      <label className="space-y-2 text-sm text-slate-700">
        Catatan Pesanan
        <textarea
          value={note}
          onChange={(event) => setNote(event.target.value)}
          className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-bataru-500 focus:outline-none"
          rows={2}
          placeholder="Contoh: kirim setelah jam 10 pagi"
        />
      </label>

      <button
        type="submit"
        className="w-full rounded-full bg-bataru-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-bataru-700"
      >
        Selesaikan Checkout
      </button>
    </form>
  );
}
