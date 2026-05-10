import { FormEvent, useEffect, useState } from "react";
import {
  addProduct,
  getOrders,
  getProducts,
  type Order,
  type Product,
  updateOrderStatus,
} from "../data/firebaseProducts";
import { addAdminEmail, getAdmins } from "../data/firebaseAdmin";

type AdminPageProps = {
  userEmail: string;
  onSignOut: () => void;
};

const initialForm = {
  name: "",
  price: "",
  description: "",
  tag: "",
  image: "",
};

export function AdminPage({ userEmail, onSignOut }: AdminPageProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [admins, setAdmins] = useState<string[]>([]);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [form, setForm] = useState(initialForm);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingAdmins, setLoadingAdmins] = useState(true);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
    loadOrders();
    loadAdmins();
  }, []);

  const loadProducts = async () => {
    setLoadingProducts(true);
    try {
      const items = await getProducts();
      setProducts(items);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingProducts(false);
    }
  };

  const loadOrders = async () => {
    setLoadingOrders(true);
    try {
      const items = await getOrders();
      setOrders(items);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingOrders(false);
    }
  };

  const loadAdmins = async () => {
    setLoadingAdmins(true);
    try {
      const items = await getAdmins();
      setAdmins(items);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingAdmins(false);
    }
  };

  const handleInputChange = (
    field: keyof typeof initialForm,
    value: string,
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddProduct = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.name || !form.price || !form.description || !form.tag) {
      setStatusMessage("Semua field wajib diisi.");
      return;
    }

    const price = Number(form.price.replace(/[^0-9]/g, ""));
    if (!price || Number.isNaN(price)) {
      setStatusMessage("Harga harus angka yang valid.");
      return;
    }

    try {
      await addProduct({
        name: form.name,
        price,
        description: form.description,
        tag: form.tag,
        image:
          form.image ||
          "https://images.unsplash.com/photo-1510626176961-4b7c9a9d0d25?auto=format&fit=crop&w=900&q=80",
      });
      setStatusMessage("Produk berhasil ditambahkan.");
      setForm(initialForm);
      await loadProducts();
    } catch (error) {
      setStatusMessage("Gagal menambahkan produk. Coba lagi.");
      console.error(error);
    }
  };

  const handleAddAdmin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!newAdminEmail.trim()) {
      setStatusMessage("Email admin baru wajib diisi.");
      return;
    }

    try {
      await addAdminEmail(newAdminEmail.trim());
      setStatusMessage("Admin baru berhasil ditambahkan.");
      setNewAdminEmail("");
      await loadAdmins();
    } catch (error) {
      setStatusMessage("Gagal menambahkan admin baru.");
      console.error(error);
    }
  };

  const handleStatusChange = async (orderId: string, status: string) => {
    try {
      await updateOrderStatus(orderId, status);
      setStatusMessage("Status pesanan berhasil diperbarui.");
      await loadOrders();
    } catch (error) {
      setStatusMessage("Gagal memperbarui status pesanan.");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-10 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-glass">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-bataru-700">
                Admin BATARU
              </p>
              <h1 className="mt-3 text-4xl font-semibold text-slate-900">
                Panel Admin Produk & Pesanan
              </h1>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-bataru-50 px-4 py-2 text-sm text-slate-700">
                {userEmail}
              </span>
              <button
                type="button"
                onClick={onSignOut}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Keluar
              </button>
            </div>
          </div>
          <p className="mt-4 max-w-2xl text-slate-600">
            Tambahkan produk baru, lihat pesanan yang masuk, dan proses status
            pesanan langsung dari sini.
          </p>
        </div>

        {statusMessage ? (
          <div className="mb-8 rounded-[1.75rem] border border-bataru-200 bg-bataru-50 p-4 text-sm text-slate-800">
            {statusMessage}
          </div>
        ) : null}

        <div className="grid gap-8 xl:grid-cols-2">
          <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-glass">
            <h2 className="text-2xl font-semibold text-slate-900">
              Tambah Produk
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Masukkan detail produk baru untuk ditampilkan di toko.
            </p>
            <form className="mt-8 space-y-5" onSubmit={handleAddProduct}>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2 text-sm text-slate-700">
                  Nama Produk
                  <input
                    value={form.name}
                    onChange={(event) =>
                      handleInputChange("name", event.target.value)
                    }
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-bataru-500 focus:outline-none"
                    placeholder="Beras Super 5kg"
                  />
                </label>
                <label className="space-y-2 text-sm text-slate-700">
                  Harga
                  <input
                    value={form.price}
                    onChange={(event) =>
                      handleInputChange("price", event.target.value)
                    }
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-bataru-500 focus:outline-none"
                    placeholder="63000"
                  />
                </label>
              </div>
              <div className="space-y-2 text-sm text-slate-700">
                <label className="block">Deskripsi</label>
                <textarea
                  value={form.description}
                  onChange={(event) =>
                    handleInputChange("description", event.target.value)
                  }
                  className="w-full rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-bataru-500 focus:outline-none"
                  rows={4}
                  placeholder="Deskripsi produk untuk anggota koperasi"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2 text-sm text-slate-700">
                  Kategori
                  <input
                    value={form.tag}
                    onChange={(event) =>
                      handleInputChange("tag", event.target.value)
                    }
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-bataru-500 focus:outline-none"
                    placeholder="Sembako"
                  />
                </label>
                <label className="space-y-2 text-sm text-slate-700">
                  Gambar URL
                  <input
                    value={form.image}
                    onChange={(event) =>
                      handleInputChange("image", event.target.value)
                    }
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-bataru-500 focus:outline-none"
                    placeholder="https://..."
                  />
                </label>
              </div>
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-full bg-bataru-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-bataru-700"
              >
                Simpan Produk
              </button>
            </form>

            <div className="mt-10">
              <h3 className="text-xl font-semibold text-slate-900">
                Produk Saat Ini
              </h3>
              {loadingProducts ? (
                <p className="mt-4 text-slate-500">Memuat produk...</p>
              ) : (
                <div className="mt-4 space-y-4">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-4"
                    >
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="font-semibold text-slate-900">
                            {product.name}
                          </p>
                          <p className="text-sm text-slate-600">
                            Rp{product.price.toLocaleString("id-ID")}
                          </p>
                        </div>
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                          {product.tag}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-10 rounded-[2rem] border border-slate-200 bg-slate-50 p-6">
              <h3 className="text-xl font-semibold text-slate-900">
                Kelola Admin
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Tambahkan admin baru dengan email yang terdaftar di Firebase
                Auth.
              </p>
              <form className="mt-6 space-y-4" onSubmit={handleAddAdmin}>
                <label className="block text-sm text-slate-700">
                  Email Admin Baru
                  <input
                    type="email"
                    value={newAdminEmail}
                    onChange={(event) => setNewAdminEmail(event.target.value)}
                    className="mt-2 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-bataru-500 focus:outline-none"
                    placeholder="admin-baru@bataru.co"
                  />
                </label>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-full bg-bataru-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-bataru-700"
                >
                  Tambah Admin
                </button>
              </form>

              <div className="mt-8">
                <h4 className="text-lg font-semibold text-slate-900">
                  Daftar Admin
                </h4>
                {loadingAdmins ? (
                  <p className="mt-4 text-slate-500">Memuat admin...</p>
                ) : admins.length === 0 ? (
                  <p className="mt-4 text-sm text-slate-600">
                    Belum ada admin terdaftar.
                  </p>
                ) : (
                  <ul className="mt-4 space-y-2">
                    {admins.map((admin) => (
                      <li
                        key={admin}
                        className="rounded-3xl bg-white px-4 py-3 text-sm text-slate-800 ring-1 ring-slate-200"
                      >
                        {admin}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </section>

          <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-glass">
            <h2 className="text-2xl font-semibold text-slate-900">
              Pesanan Masuk
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Lihat semua pesanan dan ubah status untuk memprosesnya.
            </p>

            {loadingOrders ? (
              <p className="mt-6 text-slate-500">Memuat pesanan...</p>
            ) : (
              <div className="mt-6 space-y-4">
                {orders.length === 0 ? (
                  <div className="rounded-[1.75rem] border border-dashed border-slate-200 bg-slate-50 p-6 text-slate-600">
                    Belum ada pesanan masuk.
                  </div>
                ) : (
                  orders.map((order) => (
                    <div
                      key={order.id}
                      className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="text-sm text-slate-500">Order ID</p>
                          <p className="font-semibold text-slate-900">
                            {order.id}
                          </p>
                          <p className="mt-2 text-sm text-slate-600">
                            {order.customerName} · {order.phone}
                          </p>
                          <p className="text-sm text-slate-600">
                            {order.address}
                          </p>
                        </div>
                        <div className="rounded-3xl bg-white px-4 py-3 text-sm font-semibold text-slate-900 ring-1 ring-slate-200">
                          Status: {order.status ?? "pending"}
                        </div>
                      </div>
                      <div className="mt-4 space-y-3">
                        {order.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between gap-4 rounded-2xl bg-white px-4 py-3"
                          >
                            <div>
                              <p className="font-medium text-slate-900">
                                {item.name}
                              </p>
                              <p className="text-sm text-slate-600">
                                {item.quantity} × Rp
                                {item.price.toLocaleString("id-ID")}
                              </p>
                            </div>
                            <p className="text-sm font-semibold text-slate-900">
                              Rp
                              {(item.price * item.quantity).toLocaleString(
                                "id-ID",
                              )}
                            </p>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm text-slate-600">
                          Total: Rp{order.totalPrice.toLocaleString("id-ID")}
                        </p>
                        <div className="flex flex-wrap items-center gap-2">
                          {[
                            { label: "Pending", value: "pending" },
                            { label: "Diproses", value: "diproses" },
                            { label: "Dikirim", value: "dikirim" },
                            { label: "Selesai", value: "selesai" },
                          ].map((status) => (
                            <button
                              key={status.value}
                              type="button"
                              onClick={() =>
                                handleStatusChange(order.id, status.value)
                              }
                              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                            >
                              {status.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
