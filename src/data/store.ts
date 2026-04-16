export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: ProductCategory;
  rating: number;
  sold: number;
  stock: number;
}

export type ProductCategory = 'buku' | 'baju' | 'qurban' | 'emas-batang' | 'emas-dinar' | 'digital' | 'ebook';

export const CATEGORY_INFO: Record<ProductCategory, { label: string; emoji: string }> = {
  buku: { label: 'Buku Islami', emoji: '📚' },
  baju: { label: 'Baju Muslim', emoji: '👔' },
  qurban: { label: 'Hewan Qurban', emoji: '🐑' },
  'emas-batang': { label: 'Emas Batang', emoji: '🪙' },
  'emas-dinar': { label: 'Emas Dinar', emoji: '💰' },
  digital: { label: 'Produk Digital', emoji: '📱' },
  ebook: { label: 'E-Book', emoji: '📖' },
};

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Address {
  id: string;
  label: string;
  name: string;
  phone: string;
  full: string;
  isDefault: boolean;
}

export type OrderStatus = 'unpaid' | 'packing' | 'shipping' | 'done' | 'cancelled' | 'returned';

export const ORDER_STATUS_INFO: Record<OrderStatus, { label: string; color: string }> = {
  unpaid: { label: 'Belum Dibayar', color: 'text-amber-600 bg-amber-500/15' },
  packing: { label: 'Dikemas', color: 'text-blue-600 bg-blue-500/15' },
  shipping: { label: 'Dikirim', color: 'text-purple-600 bg-purple-500/15' },
  done: { label: 'Selesai', color: 'text-emerald-600 bg-emerald-500/15' },
  cancelled: { label: 'Dibatalkan', color: 'text-red-600 bg-red-500/15' },
  returned: { label: 'Dikembalikan', color: 'text-gray-600 bg-gray-500/15' },
};

export interface Order {
  id: string;
  items: CartItem[];
  status: OrderStatus;
  total: number;
  shipping: number;
  address: Address;
  shippingMethod: string;
  paymentMethod: string;
  createdAt: string;
  paidAt?: string;
}

export const DUMMY_ADDRESSES: Address[] = [
  { id: 'addr-1', label: 'Rumah', name: 'Ahmad Fauzi', phone: '08123456789', full: 'Jl. Masjid Al-Ikhlas No. 12, RT 03/RW 05, Kel. Menteng, Kec. Menteng, Jakarta Pusat, DKI Jakarta 10310', isDefault: true },
  { id: 'addr-2', label: 'Kantor', name: 'Ahmad Fauzi', phone: '08123456789', full: 'Gedung Graha Niaga Lt. 5, Jl. Jend. Sudirman Kav. 58, Senayan, Kebayoran Baru, Jakarta Selatan, DKI Jakarta 12190', isDefault: false },
];

export const SHIPPING_METHODS = [
  { id: 'reguler', label: 'Reguler (3-5 hari)', price: 15000 },
  { id: 'express', label: 'Express (1-2 hari)', price: 25000 },
  { id: 'instant', label: 'Instant (hari ini)', price: 40000 },
];

export const PAYMENT_METHODS = [
  { id: 'bca', label: 'Transfer BCA', icon: '🏦' },
  { id: 'mandiri', label: 'Transfer Mandiri', icon: '🏦' },
  { id: 'gopay', label: 'GoPay', icon: '💚' },
  { id: 'ovo', label: 'OVO', icon: '💜' },
  { id: 'dana', label: 'DANA', icon: '💙' },
  { id: 'shopeepay', label: 'ShopeePay', icon: '🧡' },
  { id: 'cod', label: 'Bayar di Tempat (COD)', icon: '💵' },
];

export const VOUCHERS = [
  { id: 'v1', code: 'AKYASH10', discount: 10000, minPurchase: 100000, description: 'Diskon Rp10.000 min. belanja Rp100.000' },
  { id: 'v2', code: 'MUSLIM25', discount: 25000, minPurchase: 200000, description: 'Diskon Rp25.000 min. belanja Rp200.000' },
];


export const PRODUCTS: Product[] = [
  // Buku Islami
  { id: 'p1', name: 'Tafsir Ibnu Katsir (Lengkap)', description: 'Kitab tafsir Al-Quran lengkap terjemahan Bahasa Indonesia, hardcover premium.', price: 450000, originalPrice: 550000, image: '📚', category: 'buku', rating: 4.9, sold: 1250, stock: 50 },
  { id: 'p2', name: 'Riyadhus Shalihin', description: 'Kumpulan hadits pilihan dari Imam An-Nawawi, edisi terjemahan lengkap.', price: 185000, originalPrice: 210000, image: '📗', category: 'buku', rating: 4.8, sold: 890, stock: 120 },
  { id: 'p3', name: 'Fiqih Sunah Sayyid Sabiq', description: 'Buku fiqih komprehensif 3 jilid, panduan ibadah sehari-hari.', price: 320000, image: '📕', category: 'buku', rating: 4.7, sold: 670, stock: 80 },

  // Baju Muslim
  { id: 'p4', name: 'Jubah Premium Pria', description: 'Jubah katun premium pria, nyaman untuk shalat & sehari-hari. Tersedia size M-XXL.', price: 275000, originalPrice: 350000, image: '👔', category: 'baju', rating: 4.6, sold: 2300, stock: 200 },
  { id: 'p5', name: 'Gamis Syar\'i Wanita', description: 'Gamis syar\'i bahan wolfis premium, busui friendly, free khimar.', price: 320000, originalPrice: 400000, image: '👗', category: 'baju', rating: 4.8, sold: 3500, stock: 150 },
  { id: 'p6', name: 'Koko Modern Slim Fit', description: 'Baju koko modern dengan potongan slim fit, bahan katun bambu premium.', price: 195000, image: '🧥', category: 'baju', rating: 4.5, sold: 1800, stock: 300 },

  // Hewan Qurban
  { id: 'p7', name: 'Sapi Qurban Lokal Premium', description: 'Sapi lokal sehat, berat 300-350kg. Termasuk biaya penyembelihan & distribusi.', price: 22000000, image: '🐄', category: 'qurban', rating: 4.9, sold: 45, stock: 10 },
  { id: 'p8', name: 'Kambing Qurban', description: 'Kambing etawa jantan umur >1 tahun, berat 30-40kg. Siap qurban.', price: 3500000, image: '🐑', category: 'qurban', rating: 4.8, sold: 180, stock: 30 },

  // Emas Batang
  { id: 'p9', name: 'Emas Batang Antam 1 gram', description: 'Emas batang Antam bersertifikat, 24 karat. Investasi aman & halal.', price: 1350000, image: '🪙', category: 'emas-batang', rating: 5.0, sold: 560, stock: 100 },
  { id: 'p10', name: 'Emas Batang Antam 5 gram', description: 'Emas batang Antam 5 gram bersertifikat resmi. Pilihan investasi terbaik.', price: 6700000, image: '🏅', category: 'emas-batang', rating: 5.0, sold: 230, stock: 50 },

  // Emas Dinar
  { id: 'p11', name: 'Dinar Emas 1 Dinar (4.25g)', description: 'Koin dinar emas 22 karat, berat 4.25 gram. Sesuai standar Syariah.', price: 5800000, image: '💰', category: 'emas-dinar', rating: 4.9, sold: 120, stock: 40 },
  { id: 'p12', name: 'Dinar Emas 1/2 Dinar', description: 'Koin setengah dinar emas 22 karat, pilihan investasi terjangkau.', price: 2950000, image: '🥇', category: 'emas-dinar', rating: 4.8, sold: 95, stock: 60 },

  // Produk Digital
  { id: 'p13', name: 'Kelas Online: Tahsin Al-Quran', description: 'Akses seumur hidup, 50+ video lesson, sertifikat digital.', price: 299000, originalPrice: 499000, image: '🎓', category: 'digital', rating: 4.9, sold: 4200, stock: 999 },
  { id: 'p14', name: 'Template Planner Islami (Notion)', description: 'Template Notion untuk tracking ibadah, jadwal tilawah & hafalan.', price: 79000, image: '📋', category: 'digital', rating: 4.7, sold: 1500, stock: 999 },

  // E-Book
  { id: 'p15', name: 'E-Book: 40 Hadits Pilihan', description: 'Kumpulan 40 hadits shahih tentang kehidupan sehari-hari, format PDF + EPUB.', price: 49000, originalPrice: 75000, image: '📱', category: 'ebook', rating: 4.6, sold: 3100, stock: 999 },
  { id: 'p16', name: 'E-Book: Panduan Umrah Lengkap', description: 'Panduan lengkap dari persiapan hingga pulang, doa-doa & tips praktis.', price: 65000, image: '📖', category: 'ebook', rating: 4.8, sold: 2800, stock: 999 },
];

export const DUMMY_ORDERS: Order[] = [
  {
    id: 'ORD-20260415-001',
    items: [{ product: PRODUCTS[0], quantity: 1 }, { product: PRODUCTS[5], quantity: 2 }],
    status: 'unpaid',
    total: 840000,
    shipping: 15000,
    address: DUMMY_ADDRESSES[0],
    shippingMethod: 'Reguler (3-5 hari)',
    paymentMethod: 'Transfer BCA',
    createdAt: '15 Apr 2026, 08:30',
  },
  {
    id: 'ORD-20260414-002',
    items: [{ product: PRODUCTS[3], quantity: 1 }],
    status: 'packing',
    total: 275000,
    shipping: 25000,
    address: DUMMY_ADDRESSES[0],
    shippingMethod: 'Express (1-2 hari)',
    paymentMethod: 'GoPay',
    createdAt: '14 Apr 2026, 14:20',
    paidAt: '14 Apr 2026, 14:22',
  },
  {
    id: 'ORD-20260412-003',
    items: [{ product: PRODUCTS[8], quantity: 2 }],
    status: 'shipping',
    total: 2700000,
    shipping: 0,
    address: DUMMY_ADDRESSES[1],
    shippingMethod: 'Express (1-2 hari)',
    paymentMethod: 'Transfer Mandiri',
    createdAt: '12 Apr 2026, 10:00',
    paidAt: '12 Apr 2026, 10:05',
  },
  {
    id: 'ORD-20260410-004',
    items: [{ product: PRODUCTS[12], quantity: 1 }],
    status: 'done',
    total: 299000,
    shipping: 0,
    address: DUMMY_ADDRESSES[0],
    shippingMethod: 'Instant',
    paymentMethod: 'DANA',
    createdAt: '10 Apr 2026, 09:00',
    paidAt: '10 Apr 2026, 09:01',
  },
  {
    id: 'ORD-20260408-005',
    items: [{ product: PRODUCTS[14], quantity: 1 }, { product: PRODUCTS[15], quantity: 1 }],
    status: 'done',
    total: 114000,
    shipping: 0,
    address: DUMMY_ADDRESSES[0],
    shippingMethod: 'Digital',
    paymentMethod: 'OVO',
    createdAt: '8 Apr 2026, 15:30',
    paidAt: '8 Apr 2026, 15:31',
  },
  {
    id: 'ORD-20260405-006',
    items: [{ product: PRODUCTS[4], quantity: 1 }],
    status: 'cancelled',
    total: 320000,
    shipping: 15000,
    address: DUMMY_ADDRESSES[0],
    shippingMethod: 'Reguler',
    paymentMethod: 'Transfer BCA',
    createdAt: '5 Apr 2026, 12:00',
  },
];

export function formatRupiah(n: number): string {
  return 'Rp' + n.toLocaleString('id-ID');
}
