import { useMemo, useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { ProductCard } from "./components/ProductCard";
import { Navbar } from "./components/Navbar";
import { CartDrawer } from "./components/CartDrawer";
import { CheckoutPage } from "./components/CheckoutPage";
import { Hero } from "./components/Hero";
import { AdminPage } from "./components/AdminPage";
import { AdminLogin } from "./components/AdminLogin";
import { auth } from "./firebase";
import {
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";
import { isAdminEmail } from "./data/firebaseAdmin";
import { getProducts, saveOrder, type Product } from "./data/firebaseProducts";
import type { CartItem } from "./types";

function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [authAdmin, setAuthAdmin] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authMessage, setAuthMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user?.email) {
        setAuthUser(null);
        setAuthAdmin(false);
        setAuthLoading(false);
        return;
      }

      const isAdmin = await isAdminEmail(user.email);
      if (!isAdmin) {
        await signOut(auth);
        setAuthUser(null);
        setAuthAdmin(false);
        setAuthError("Akun tidak memiliki akses admin.");
        setAuthLoading(false);
        return;
      }

      setAuthUser(user);
      setAuthAdmin(true);
      setAuthLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleAdminLogin = async (email: string, password: string) => {
    setAuthError(null);
    setAuthMessage(null);

    if (!email || !password) {
      setAuthError("Email dan password harus diisi.");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      const isAdmin = await isAdminEmail(email.trim());
      if (!isAdmin) {
        await signOut(auth);
        setAuthError(
          "Akun belum terdaftar sebagai admin. Hubungi administrator.",
        );
        return;
      }
      setAuthMessage("Login berhasil, redirect...");
      navigate("/admin");
    } catch (error: any) {
      console.error("Login error:", error.code, error.message);
      let message = "Login gagal. Cek email dan password.";

      if (error.code === "auth/wrong-password") {
        message = "Password salah. Coba lagi atau gunakan Reset Password.";
      } else if (error.code === "auth/user-not-found") {
        message =
          "Email tidak terdaftar di sistem. Pastikan email sudah dibuat di Firebase.";
      } else if (error.code === "auth/invalid-email") {
        message = "Format email tidak valid.";
      } else if (error.code === "auth/too-many-requests") {
        message =
          "Terlalu banyak percobaan login. Coba lagi nanti atau reset password.";
      } else if (error.code === "auth/network-request-failed") {
        message = "Gagal terhubung ke server. Cek koneksi internet Anda.";
      }

      setAuthError(message);
    }
  };

  const handlePasswordReset = async (email: string) => {
    setAuthError(null);
    setAuthMessage(null);
    try {
      await sendPasswordResetEmail(auth, email);
      setAuthMessage("Email reset password telah dikirim.");
    } catch (error: any) {
      console.error("Reset password error:", error);
      const message =
        error.code === "auth/invalid-email"
          ? "Email tidak valid."
          : error.code === "auth/user-not-found"
            ? "Akun tidak ditemukan."
            : "Gagal mengirim email reset password.";
      setAuthError(message);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    navigate("/admin/login");
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const fetchedProducts = await getProducts();
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const totalItems = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart],
  );

  const totalPrice = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity * item.price, 0),
    [cart],
  );

  const addToCart = (productId: string) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === productId);
      if (existing) {
        return prev.map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      const product = products.find((item) => item.id === productId);
      if (!product) return prev;
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
        },
      ];
    });
    setDrawerOpen(true);
  };

  const updateQuantity = (productId: string, next: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: Math.max(0, next) }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const handleCheckout = async (orderData: {
    name: string;
    memberId?: string;
    address: string;
    phone: string;
    note?: string;
  }) => {
    try {
      await saveOrder({
        customerName: orderData.name,
        memberId: orderData.memberId,
        address: orderData.address,
        phone: orderData.phone,
        note: orderData.note,
        items: cart,
        totalPrice,
        orderDate: new Date(),
      });

      setCart([]);
      setDrawerOpen(false);
      navigate("/");
    } catch (error) {
      console.error("Failed to save order:", error);
      // You might want to show an error message to the user here
    }
  };

  const goToCheckoutPage = () => {
    if (cart.length > 0) {
      navigate("/checkout");
    } else {
      setDrawerOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-bataru-50 text-slate-800">
      <Navbar totalItems={totalItems} onCartClick={() => setDrawerOpen(true)} />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Hero />

              <main className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
                <section
                  id="tentang"
                  className="rounded-[2rem] border border-slate-200/80 bg-slate-50 p-10 shadow-glass ring-1 ring-slate-200/60 sm:p-12"
                >
                  <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
                    <div>
                      <p className="text-sm uppercase tracking-[0.3em] text-bataru-700">
                        Tentang BATARU
                      </p>
                      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                        Koperasi modern untuk kebutuhan anggota dan keluarga.
                      </h2>
                      <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600">
                        Koperasi BATARU hadir untuk menyediakan produk harian
                        berkualitas dengan harga terjangkau, pelayanan cepat,
                        dan program khusus anggota. Kami mendukung kesejahteraan
                        anggota lewat belanja ekonomi dan layanan yang lebih
                        transparan.
                      </p>
                      <div className="mt-8 grid gap-4 sm:grid-cols-2">
                        <div className="rounded-3xl bg-bataru-50 p-5">
                          <p className="text-sm text-slate-500">Misi Kami</p>
                          <p className="mt-3 font-semibold text-slate-900">
                            Memberdayakan anggota melalui akses produk koperasi
                            terbaik.
                          </p>
                        </div>
                        <div className="rounded-3xl bg-bataru-50 p-5">
                          <p className="text-sm text-slate-500">Visi BATARU</p>
                          <p className="mt-3 font-semibold text-slate-900">
                            Menjadi koperasi digital terpercaya di komunitas
                            lokal.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-[2rem] bg-slate-100 p-8 shadow-sm ring-1 ring-slate-200">
                      <p className="text-sm uppercase tracking-[0.3em] text-bataru-700">
                        Keunggulan
                      </p>
                      <ul className="mt-6 space-y-4 text-slate-600">
                        <li className="flex gap-3 text-base leading-7">
                          <span className="mt-1 h-2.5 w-2.5 rounded-full bg-bataru-600" />
                          Harga koperasi dan promo khusus anggota.
                        </li>
                        <li className="flex gap-3 text-base leading-7">
                          <span className="mt-1 h-2.5 w-2.5 rounded-full bg-bataru-600" />
                          Pilihan produk harian, sembako, dan camilan
                          berkualitas.
                        </li>
                        <li className="flex gap-3 text-base leading-7">
                          <span className="mt-1 h-2.5 w-2.5 rounded-full bg-bataru-600" />
                          Layanan cepat dan dukungan anggota setiap hari.
                        </li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section id="produk" className="space-y-4 py-10">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-sm uppercase tracking-[0.3em] text-bataru-700">
                        Kategori Produk
                      </p>
                      <h2 className="mt-2 text-3xl font-semibold sm:text-4xl">
                        Jajanan, Sembako, dan Kebutuhan Harian
                      </h2>
                    </div>
                    <div className="rounded-3xl bg-slate-100 p-4 shadow-glass ring-1 ring-slate-200">
                      <p className="text-sm text-slate-500">Promo Eksklusif</p>
                      <p className="mt-2 text-xl font-semibold text-slate-900">
                        Belanja hemat hingga 15% untuk anggota BATARU
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {loading ? (
                      <div className="col-span-full text-center py-12">
                        <p className="text-slate-500">Memuat produk...</p>
                      </div>
                    ) : (
                      products.map((product) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          onAdd={() => addToCart(product.id)}
                        />
                      ))
                    )}
                  </div>
                </section>

                <section
                  id="kontak"
                  className="rounded-[2rem] border border-slate-200 bg-white p-10 shadow-glass ring-1 ring-slate-200 sm:p-12"
                >
                  <div className="grid gap-10 lg:grid-cols-[0.9fr_0.7fr] lg:items-center">
                    <div>
                      <p className="text-sm uppercase tracking-[0.3em] text-bataru-700">
                        Kontak
                      </p>
                      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                        Hubungi tim layanan BATARU
                      </h2>
                      <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600">
                        Butuh bantuan atau ingin bergabung sebagai anggota? Tim
                        kami siap membantu dengan layanan cepat dan informasi
                        lengkap.
                      </p>
                      <div className="mt-8 space-y-4 text-slate-700">
                        <p className="flex items-center gap-3 text-sm font-medium uppercase tracking-[0.25em] text-bataru-700">
                          Email
                        </p>
                        <p className="rounded-3xl bg-slate-100 p-5 text-base text-slate-900">
                          halo@bataru-koperasi.id
                        </p>
                        <p className="flex items-center gap-3 text-sm font-medium uppercase tracking-[0.25em] text-bataru-700">
                          Telepon
                        </p>
                        <p className="rounded-3xl bg-slate-100 p-5 text-base text-slate-900">
                          (021) 1234 5678
                        </p>
                      </div>
                    </div>
                    <div className="rounded-[2rem] bg-bataru-600 p-10 text-white shadow-lg">
                      <p className="text-sm uppercase tracking-[0.35em] text-bataru-100">
                        Kunjungi Kami
                      </p>
                      <h3 className="mt-4 text-3xl font-semibold">
                        Kantor Pusat BATARU
                      </h3>
                      <p className="mt-5 text-slate-100/90 leading-8">
                        Jl. Koperasi No. 12, Jakarta. Siap melayani anggota
                        koperasi dengan profesional dan ramah.
                      </p>
                    </div>
                  </div>
                </section>
              </main>

              <CartDrawer
                open={drawerOpen}
                cart={cart}
                totalPrice={totalPrice}
                onClose={() => setDrawerOpen(false)}
                onQuantityChange={updateQuantity}
                onProceedToCheckout={goToCheckoutPage}
              />
            </>
          }
        />
        <Route
          path="/checkout"
          element={
            <CheckoutPage
              cart={cart}
              totalPrice={totalPrice}
              onBack={() => navigate("/")}
              onCheckout={handleCheckout}
            />
          }
        />
        <Route
          path="/admin/login"
          element={
            <AdminLogin
              onLogin={handleAdminLogin}
              onResetPassword={handlePasswordReset}
              errorMessage={authError}
              statusMessage={authMessage}
              loading={authLoading}
            />
          }
        />
        <Route
          path="/admin"
          element={
            authLoading ? (
              <div className="min-h-screen flex items-center justify-center text-slate-600">
                Memuat halaman admin...
              </div>
            ) : authUser ? (
              <AdminPage
                userEmail={authUser.email ?? "admin"}
                onSignOut={handleSignOut}
              />
            ) : (
              <Navigate to="/admin/login" replace />
            )
          }
        />
      </Routes>

      <button
        type="button"
        onClick={() => setDrawerOpen(true)}
        className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-3 rounded-full bg-bataru-700 px-5 py-4 text-base font-bold text-white shadow-[0_24px_60px_rgba(11,79,97,0.22)] ring-2 ring-bataru-700/40 transition duration-200 hover:bg-bataru-900 focus:outline-none focus-visible:ring-4 focus-visible:ring-bataru-300/40"
      >
        Keranjang
        {totalItems > 0 ? (
          <span className="inline-flex h-7 min-w-[28px] items-center justify-center rounded-full bg-white px-2 text-sm font-bold text-bataru-800">
            {totalItems}
          </span>
        ) : null}
      </button>
    </div>
  );
}

export default App;
