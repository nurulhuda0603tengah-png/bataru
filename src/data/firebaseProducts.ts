import {
  collection,
  getDocs,
  addDoc,
  query,
  orderBy,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase";

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  tag: string;
  image: string;
}

// Static products for seeding if Firestore is empty
const staticProducts: Product[] = [
  {
    id: "beras-super",
    name: "Beras Super 5kg",
    price: 63000,
    description:
      "Beras kualitas premium, cocok untuk kebutuhan keluarga koperasi.",
    tag: "Sembako",
    image:
      "https://images.unsplash.com/photo-1581795410328-37e9fe4dbabd?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "gula-pasir",
    name: "Gula Pasir 1kg",
    price: 15500,
    description:
      "Gula tebu asli, manis alami untuk masakan dan minuman sehari-hari.",
    tag: "Sembako",
    image:
      "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "teh-bubuk",
    name: "Teh Bubuk Premium",
    price: 24500,
    description: "Aroma segar, kebaikan teh pilihan untuk kolega dan anggota.",
    tag: "Minuman",
    image:
      "https://images.unsplash.com/photo-1510626176961-4b7c9a9d0d25?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "sabun-cuci",
    name: "Sabun Cuci Serbaguna",
    price: 11200,
    description:
      "Membersihkan noda dengan lembut, ideal untuk kebutuhan rumah tangga.",
    tag: "Kebersihan",
    image:
      "https://images.unsplash.com/photo-1580910051070-06fc0bcd4d17?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "minyak-goreng",
    name: "Minyak Goreng 2L",
    price: 43000,
    description:
      "Minyak berkualitas tinggi untuk masakan sehari-hari anggota koperasi.",
    tag: "Dapur",
    image:
      "https://images.unsplash.com/photo-1556228724-4c39f2ec99a1?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "snack-kacang",
    name: "Snack Kacang Pedas",
    price: 17500,
    description:
      "Camilan gurih dan renyah untuk dinikmati bersama keluarga dan rekan.",
    tag: "Camilan",
    image:
      "https://images.unsplash.com/photo-1617196036192-d3cf44a69111?auto=format&fit=crop&w=900&q=80",
  },
];

export async function getProducts(): Promise<Product[]> {
  try {
    const productsRef = collection(db, "products");
    const q = query(productsRef, orderBy("name"));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      // Seed static products to Firestore
      console.log(
        "No products found in Firestore, seeding with static data...",
      );
      await seedProducts();
      return staticProducts;
    }

    const products: Product[] = [];
    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() } as Product);
    });

    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    // Fallback to static products if Firebase fails
    return staticProducts;
  }
}

async function seedProducts() {
  try {
    const productsRef = collection(db, "products");
    for (const product of staticProducts) {
      await addDoc(productsRef, product);
    }
    console.log("Products seeded to Firestore successfully");
  } catch (error) {
    console.error("Error seeding products:", error);
  }
}

export async function saveOrder(order: {
  customerName: string;
  memberId?: string;
  address: string;
  phone: string;
  note?: string;
  items: Array<{ id: string; name: string; price: number; quantity: number }>;
  totalPrice: number;
  orderDate: Date;
}) {
  try {
    const ordersRef = collection(db, "orders");
    const docRef = await addDoc(ordersRef, order);
    console.log("Order saved with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error saving order:", error);
    throw error;
  }
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  memberId?: string;
  address: string;
  phone: string;
  note?: string;
  items: OrderItem[];
  totalPrice: number;
  orderDate: Date;
  status?: string;
}

export async function getOrders(): Promise<Order[]> {
  try {
    const ordersRef = collection(db, "orders");
    const q = query(ordersRef, orderBy("orderDate", "desc"));
    const querySnapshot = await getDocs(q);
    const orders: Order[] = [];

    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data() as Omit<Order, "id">;
      orders.push({
        id: docSnap.id,
        ...data,
        orderDate:
          data.orderDate && typeof (data.orderDate as any).toDate === "function"
            ? (data.orderDate as any).toDate()
            : (data.orderDate as Date),
      });
    });

    return orders;
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
}

export async function addProduct(product: Omit<Product, "id">) {
  try {
    const productsRef = collection(db, "products");
    const docRef = await addDoc(productsRef, product);
    return docRef.id;
  } catch (error) {
    console.error("Error adding product:", error);
    throw error;
  }
}

export async function updateOrderStatus(orderId: string, status: string) {
  try {
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, { status });
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
}

export async function deleteProduct(productId: string) {
  try {
    const productRef = doc(db, "products", productId);
    await deleteDoc(productRef);
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
}
