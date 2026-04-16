import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, ClipboardList, ChevronLeft, Plus, Minus, Trash2, Star, MapPin, Truck, CreditCard, Tag, CheckCircle2, Package, ChevronRight, X } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import {
  PRODUCTS, CATEGORY_INFO, DUMMY_ADDRESSES, SHIPPING_METHODS, PAYMENT_METHODS, VOUCHERS, DUMMY_ORDERS, ORDER_STATUS_INFO,
  formatRupiah,
  type Product, type ProductCategory, type CartItem, type Address, type Order, type OrderStatus,
} from '@/data/store';

type StorePage = 'products' | 'cart' | 'checkout' | 'payment' | 'orders' | 'order-detail';

export const StoreView = () => {
  const [page, setPage] = useState<StorePage>('products');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>(DUMMY_ORDERS);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [ordersTab, setOrdersTab] = useState<OrderStatus | 'all'>('all');

  // Checkout state
  const [selectedAddress, setSelectedAddress] = useState<Address>(DUMMY_ADDRESSES[0]);
  const [selectedShipping, setSelectedShipping] = useState(SHIPPING_METHODS[0]);
  const [selectedPayment, setSelectedPayment] = useState(PAYMENT_METHODS[0]);
  const [selectedVoucher, setSelectedVoucher] = useState<typeof VOUCHERS[0] | null>(null);
  const [showAddressSheet, setShowAddressSheet] = useState(false);
  const [showShippingSheet, setShowShippingSheet] = useState(false);
  const [showPaymentSheet, setShowPaymentSheet] = useState(false);
  const [showVoucherSheet, setShowVoucherSheet] = useState(false);
  const [paidTotal, setPaidTotal] = useState(0);

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);
  const cartTotal = cart.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const discount = selectedVoucher && cartTotal >= selectedVoucher.minPurchase ? selectedVoucher.discount : 0;

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) return prev.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { product, quantity: 1 }];
    });
    toast(`${product.name} ditambahkan ke keranjang 🛒`);
  };

  const updateQty = (productId: string, delta: number) => {
    setCart(prev => prev.map(i => i.product.id === productId ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i));
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(i => i.product.id !== productId));
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setPage('checkout');
  };

  const handlePay = () => {
    const totalToPay = cartTotal + selectedShipping.price - discount;
    setPaidTotal(totalToPay);
    setPage('payment');
    setTimeout(() => {
      const newOrder: Order = {
        id: `ORD-${Date.now()}`,
        items: [...cart],
        status: 'unpaid',
        total: cartTotal - discount,
        shipping: selectedShipping.price,
        address: selectedAddress,
        shippingMethod: selectedShipping.label,
        paymentMethod: selectedPayment.label,
        createdAt: new Date().toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      };
      setOrders(prev => [newOrder, ...prev]);
      setCart([]);
      setSelectedVoucher(null);
    }, 2000);
  };

  const filteredProducts = selectedCategory === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.category === selectedCategory);
  const filteredOrders = ordersTab === 'all' ? orders : orders.filter(o => o.status === ordersTab);

  // ─── RENDER ─────────────────────────────────────────────

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pt-6 pb-20 h-[calc(100vh-4rem)] flex flex-col">
      <AnimatePresence mode="wait">
        {/* ═══ PRODUCT LISTING ═══ */}
        {page === 'products' && (
          <motion.div key="products" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full">
            {/* Header */}
            <div className="px-4 flex items-center justify-between mb-4 shrink-0">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Akyash Store</h2>
                <p className="text-sm text-muted-foreground">Belanja kebutuhan muslim</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setPage('cart')} className="relative p-2.5 bg-background border border-border/50 rounded-xl hover:bg-muted/50 transition-colors">
                  <ShoppingCart className="w-5 h-5 text-foreground" />
                  {cartCount > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">{cartCount}</span>}
                </button>
                <button onClick={() => { setOrdersTab('all'); setPage('orders'); }} className="p-2.5 bg-background border border-border/50 rounded-xl hover:bg-muted/50 transition-colors">
                  <ClipboardList className="w-5 h-5 text-foreground" />
                </button>
              </div>
            </div>

            {/* Category filters */}
            <div className="px-4 shrink-0">
              <ScrollArea className="w-full">
                <div className="flex gap-2 pb-3">
                  <button onClick={() => setSelectedCategory('all')} className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${selectedCategory === 'all' ? 'bg-primary text-primary-foreground shadow-lg' : 'bg-muted/30 text-muted-foreground'}`}>
                    🏪 Semua
                  </button>
                  {(Object.entries(CATEGORY_INFO) as [ProductCategory, { label: string; emoji: string }][]).map(([key, val]) => (
                    <button key={key} onClick={() => setSelectedCategory(key)} className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${selectedCategory === key ? 'bg-primary text-primary-foreground shadow-lg' : 'bg-muted/30 text-muted-foreground'}`}>
                      {val.emoji} {val.label}
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Product grid */}
            <div className="flex-1 overflow-hidden px-4">
              <ScrollArea className="h-full">
                <div className="grid grid-cols-2 gap-3 pb-6">
                  {filteredProducts.map(product => (
                    <div key={product.id} className="bg-background rounded-2xl shadow-neu-sm overflow-hidden flex flex-col">
                      <div className="h-28 bg-muted/20 flex items-center justify-center text-5xl select-none">{product.image}</div>
                      <div className="p-3 flex-1 flex flex-col">
                        <h4 className="text-xs font-bold text-foreground line-clamp-2 mb-1">{product.name}</h4>
                        <div className="flex items-center gap-1 mb-1">
                          <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                          <span className="text-[10px] text-muted-foreground">{product.rating} | {product.sold.toLocaleString()} terjual</span>
                        </div>
                        <div className="mt-auto">
                          {product.originalPrice && <p className="text-[10px] text-muted-foreground line-through">{formatRupiah(product.originalPrice)}</p>}
                          <p className="text-sm font-bold text-primary">{formatRupiah(product.price)}</p>
                        </div>
                        <button onClick={() => addToCart(product)} className="mt-2 w-full py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity">
                          + Keranjang
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </motion.div>
        )}

        {/* ═══ CART ═══ */}
        {page === 'cart' && (
          <motion.div key="cart" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col h-full px-4">
            <div className="flex items-center gap-3 mb-4 shrink-0">
              <button onClick={() => setPage('products')} className="p-2 bg-background border border-border/50 rounded-xl"><ChevronLeft className="w-5 h-5" /></button>
              <h2 className="text-xl font-bold text-foreground">Keranjang ({cartCount})</h2>
            </div>
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <ShoppingCart className="w-12 h-12 text-muted-foreground/30 mb-3" />
                    <p className="text-sm text-muted-foreground">Keranjang kosong</p>
                  </div>
                ) : (
                  <div className="space-y-3 pb-28">
                    {cart.map(item => (
                      <div key={item.product.id} className="bg-background rounded-2xl shadow-neu-sm p-3 flex gap-3">
                        <div className="w-16 h-16 bg-muted/20 rounded-xl flex items-center justify-center text-3xl select-none shrink-0">{item.product.image}</div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-foreground line-clamp-1">{item.product.name}</h4>
                          <p className="text-sm font-bold text-primary mt-1">{formatRupiah(item.product.price)}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <button onClick={() => removeFromCart(item.product.id)} className="p-1 text-red-500 hover:bg-red-500/10 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                            <div className="ml-auto flex items-center gap-2">
                              <button onClick={() => updateQty(item.product.id, -1)} className="w-7 h-7 bg-muted/30 rounded-lg flex items-center justify-center"><Minus className="w-3 h-3" /></button>
                              <span className="text-sm font-bold w-6 text-center">{item.quantity}</span>
                              <button onClick={() => updateQty(item.product.id, 1)} className="w-7 h-7 bg-primary text-primary-foreground rounded-lg flex items-center justify-center"><Plus className="w-3 h-3" /></button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>
            {cart.length > 0 && (
              <div className="shrink-0 pt-3 pb-2 border-t border-border/30 bg-background">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-muted-foreground">Total</span>
                  <span className="text-lg font-bold text-primary">{formatRupiah(cartTotal)}</span>
                </div>
                <button onClick={handleCheckout} className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold text-sm shadow-lg hover:opacity-90 transition-opacity">
                  Checkout ({cartCount} item)
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* ═══ CHECKOUT ═══ */}
        {page === 'checkout' && (
          <motion.div key="checkout" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col h-full px-4">
            <div className="flex items-center gap-3 mb-4 shrink-0">
              <button onClick={() => setPage('cart')} className="p-2 bg-background border border-border/50 rounded-xl"><ChevronLeft className="w-5 h-5" /></button>
              <h2 className="text-xl font-bold text-foreground">Checkout</h2>
            </div>
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="space-y-3 pb-28">
                  {/* Address */}
                  <button onClick={() => setShowAddressSheet(true)} className="w-full bg-background rounded-2xl shadow-neu-sm p-4 text-left">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span className="text-xs font-bold text-foreground">Alamat Pengiriman</span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto" />
                    </div>
                    <p className="text-sm font-semibold text-foreground">{selectedAddress.name} • {selectedAddress.phone}</p>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{selectedAddress.full}</p>
                  </button>

                  {/* Items */}
                  <div className="bg-background rounded-2xl shadow-neu-sm p-4">
                    <p className="text-xs font-bold text-foreground mb-3">Produk Dipesan</p>
                    {cart.map(item => (
                      <div key={item.product.id} className="flex items-center gap-3 py-2 border-b border-border/20 last:border-0">
                        <span className="text-2xl select-none">{item.product.image}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-foreground line-clamp-1">{item.product.name}</p>
                          <p className="text-xs text-muted-foreground">x{item.quantity}</p>
                        </div>
                        <p className="text-xs font-bold text-foreground">{formatRupiah(item.product.price * item.quantity)}</p>
                      </div>
                    ))}
                  </div>

                  {/* Shipping */}
                  <button onClick={() => setShowShippingSheet(true)} className="w-full bg-background rounded-2xl shadow-neu-sm p-4 text-left">
                    <div className="flex items-center gap-2 mb-1">
                      <Truck className="w-4 h-4 text-primary" />
                      <span className="text-xs font-bold text-foreground">Jasa Pengiriman</span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto" />
                    </div>
                    <p className="text-sm text-foreground">{selectedShipping.label} — <span className="font-bold text-primary">{formatRupiah(selectedShipping.price)}</span></p>
                  </button>

                  {/* Voucher */}
                  <button onClick={() => setShowVoucherSheet(true)} className="w-full bg-background rounded-2xl shadow-neu-sm p-4 text-left">
                    <div className="flex items-center gap-2 mb-1">
                      <Tag className="w-4 h-4 text-primary" />
                      <span className="text-xs font-bold text-foreground">Voucher</span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto" />
                    </div>
                    {selectedVoucher ? (
                      <p className="text-sm text-emerald-600 font-semibold">{selectedVoucher.code} — Hemat {formatRupiah(selectedVoucher.discount)}</p>
                    ) : (
                      <p className="text-xs text-muted-foreground">Pilih atau masukkan kode voucher</p>
                    )}
                  </button>

                  {/* Payment Method */}
                  <button onClick={() => setShowPaymentSheet(true)} className="w-full bg-background rounded-2xl shadow-neu-sm p-4 text-left">
                    <div className="flex items-center gap-2 mb-1">
                      <CreditCard className="w-4 h-4 text-primary" />
                      <span className="text-xs font-bold text-foreground">Metode Pembayaran</span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto" />
                    </div>
                    <p className="text-sm text-foreground">{selectedPayment.icon} {selectedPayment.label}</p>
                  </button>

                  {/* Summary */}
                  <div className="bg-background rounded-2xl shadow-neu-sm p-4 space-y-2">
                    <p className="text-xs font-bold text-foreground mb-2">Ringkasan Pembayaran</p>
                    <div className="flex justify-between text-xs"><span className="text-muted-foreground">Subtotal ({cartCount} item)</span><span className="text-foreground font-semibold">{formatRupiah(cartTotal)}</span></div>
                    <div className="flex justify-between text-xs"><span className="text-muted-foreground">Pengiriman</span><span className="text-foreground font-semibold">{formatRupiah(selectedShipping.price)}</span></div>
                    {discount > 0 && <div className="flex justify-between text-xs"><span className="text-muted-foreground">Voucher Diskon</span><span className="text-emerald-600 font-semibold">-{formatRupiah(discount)}</span></div>}
                    <div className="border-t border-border/30 pt-2 mt-2 flex justify-between"><span className="text-sm font-bold text-foreground">Total</span><span className="text-lg font-bold text-primary">{formatRupiah(cartTotal + selectedShipping.price - discount)}</span></div>
                  </div>
                </div>
              </ScrollArea>
            </div>
            <div className="shrink-0 pt-3 pb-2 bg-background border-t border-border/30">
              <button onClick={handlePay} className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold text-sm shadow-lg hover:opacity-90 transition-opacity">
                Bayar {formatRupiah(cartTotal + selectedShipping.price - discount)}
              </button>
            </div>

            {/* Bottom Sheets */}
            <BottomSheet open={showAddressSheet} onClose={() => setShowAddressSheet(false)} title="Pilih Alamat">
              {DUMMY_ADDRESSES.map(addr => (
                <button key={addr.id} onClick={() => { setSelectedAddress(addr); setShowAddressSheet(false); }} className={`w-full p-4 rounded-2xl text-left mb-2 border transition-all ${selectedAddress.id === addr.id ? 'border-primary bg-primary/5' : 'border-border/30 bg-background'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-foreground">{addr.label}</span>
                    {addr.isDefault && <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold">Utama</span>}
                  </div>
                  <p className="text-sm font-semibold text-foreground">{addr.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{addr.full}</p>
                </button>
              ))}
            </BottomSheet>

            <BottomSheet open={showShippingSheet} onClose={() => setShowShippingSheet(false)} title="Jasa Pengiriman">
              {SHIPPING_METHODS.map(method => (
                <button key={method.id} onClick={() => { setSelectedShipping(method); setShowShippingSheet(false); }} className={`w-full p-4 rounded-2xl text-left mb-2 border transition-all flex justify-between items-center ${selectedShipping.id === method.id ? 'border-primary bg-primary/5' : 'border-border/30 bg-background'}`}>
                  <span className="text-sm font-semibold text-foreground">{method.label}</span>
                  <span className="text-sm font-bold text-primary">{formatRupiah(method.price)}</span>
                </button>
              ))}
            </BottomSheet>

            <BottomSheet open={showPaymentSheet} onClose={() => setShowPaymentSheet(false)} title="Metode Pembayaran">
              {PAYMENT_METHODS.map(method => (
                <button key={method.id} onClick={() => { setSelectedPayment(method); setShowPaymentSheet(false); }} className={`w-full p-4 rounded-2xl text-left mb-2 border transition-all flex items-center gap-3 ${selectedPayment.id === method.id ? 'border-primary bg-primary/5' : 'border-border/30 bg-background'}`}>
                  <span className="text-xl">{method.icon}</span>
                  <span className="text-sm font-semibold text-foreground">{method.label}</span>
                  {selectedPayment.id === method.id && <CheckCircle2 className="w-5 h-5 text-primary ml-auto" />}
                </button>
              ))}
            </BottomSheet>

            <BottomSheet open={showVoucherSheet} onClose={() => setShowVoucherSheet(false)} title="Voucher">
              {VOUCHERS.map(v => {
                const eligible = cartTotal >= v.minPurchase;
                return (
                  <button key={v.id} disabled={!eligible} onClick={() => { setSelectedVoucher(v); setShowVoucherSheet(false); toast(`Voucher ${v.code} diterapkan!`); }} className={`w-full p-4 rounded-2xl text-left mb-2 border transition-all ${!eligible ? 'opacity-50 cursor-not-allowed border-border/30' : selectedVoucher?.id === v.id ? 'border-primary bg-primary/5' : 'border-border/30 bg-background'}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <Tag className="w-4 h-4 text-primary" />
                      <span className="text-sm font-bold text-foreground">{v.code}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{v.description}</p>
                  </button>
                );
              })}
              {selectedVoucher && (
                <button onClick={() => { setSelectedVoucher(null); setShowVoucherSheet(false); }} className="w-full py-2.5 text-sm font-semibold text-red-500 hover:bg-red-500/10 rounded-xl transition-colors">
                  Hapus Voucher
                </button>
              )}
            </BottomSheet>
          </motion.div>
        )}

        {/* ═══ PAYMENT ═══ */}
        {page === 'payment' && (
          <motion.div key="payment" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center h-full px-6 text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.3, damping: 12 }} className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <CheckCircle2 className="w-10 h-10 text-primary" />
            </motion.div>
            <h2 className="text-xl font-bold text-foreground mb-2">Pesanan Berhasil!</h2>
            <p className="text-sm text-muted-foreground mb-1">Pembayaran via <span className="font-semibold text-foreground">{selectedPayment.label}</span></p>
            <p className="text-2xl font-bold text-primary mb-6">{formatRupiah(paidTotal)}</p>
            <p className="text-xs text-muted-foreground mb-8">Silakan selesaikan pembayaran Anda. Detail pesanan dapat dilihat di menu Pesanan.</p>
            <div className="flex gap-3 w-full max-w-xs">
              <button onClick={() => { setOrdersTab('all'); setPage('orders'); }} className="flex-1 py-3 bg-muted/30 text-foreground rounded-xl font-semibold text-sm hover:bg-muted/50 transition-colors">Pesanan</button>
              <button onClick={() => setPage('products')} className="flex-1 py-3 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity shadow-lg">Kembali</button>
            </div>
          </motion.div>
        )}

        {/* ═══ ORDERS LIST ═══ */}
        {page === 'orders' && (
          <motion.div key="orders" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col h-full">
            <div className="px-4 flex items-center gap-3 mb-4 shrink-0">
              <button onClick={() => setPage('products')} className="p-2 bg-background border border-border/50 rounded-xl"><ChevronLeft className="w-5 h-5" /></button>
              <h2 className="text-xl font-bold text-foreground">Pesanan Saya</h2>
            </div>

            {/* Status tabs */}
            <div className="px-4 shrink-0">
              <ScrollArea className="w-full">
                <div className="flex gap-2 pb-3">
                  <button onClick={() => setOrdersTab('all')} className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${ordersTab === 'all' ? 'bg-primary text-primary-foreground shadow-lg' : 'bg-muted/30 text-muted-foreground'}`}>Semua</button>
                  {(Object.entries(ORDER_STATUS_INFO) as [OrderStatus, { label: string }][]).map(([key, val]) => (
                    <button key={key} onClick={() => setOrdersTab(key)} className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${ordersTab === key ? 'bg-primary text-primary-foreground shadow-lg' : 'bg-muted/30 text-muted-foreground'}`}>{val.label}</button>
                  ))}
                </div>
              </ScrollArea>
            </div>

            <div className="flex-1 overflow-hidden px-4">
              <ScrollArea className="h-full">
                {filteredOrders.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <Package className="w-12 h-12 text-muted-foreground/30 mb-3" />
                    <p className="text-sm text-muted-foreground">Belum ada pesanan</p>
                  </div>
                ) : (
                  <div className="space-y-3 pb-6">
                    {filteredOrders.map(order => {
                      const statusInfo = ORDER_STATUS_INFO[order.status];
                      return (
                        <button key={order.id} onClick={() => { setSelectedOrder(order); setPage('order-detail'); }} className="w-full bg-background rounded-2xl shadow-neu-sm p-4 text-left">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-mono text-muted-foreground">{order.id}</span>
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusInfo.color}`}>{statusInfo.label}</span>
                          </div>
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-2xl select-none">{order.items[0].product.image}</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-foreground line-clamp-1">{order.items[0].product.name}</p>
                              {order.items.length > 1 && <p className="text-[10px] text-muted-foreground">+{order.items.length - 1} produk lainnya</p>}
                            </div>
                          </div>
                          <div className="flex items-center justify-between pt-2 border-t border-border/20">
                            <span className="text-xs text-muted-foreground">{order.createdAt}</span>
                            <span className="text-sm font-bold text-primary">{formatRupiah(order.total + order.shipping)}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </ScrollArea>
            </div>
          </motion.div>
        )}

        {/* ═══ ORDER DETAIL ═══ */}
        {page === 'order-detail' && selectedOrder && (
          <motion.div key="order-detail" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col h-full px-4">
            <div className="flex items-center gap-3 mb-4 shrink-0">
              <button onClick={() => setPage('orders')} className="p-2 bg-background border border-border/50 rounded-xl"><ChevronLeft className="w-5 h-5" /></button>
              <h2 className="text-xl font-bold text-foreground">Detail Pesanan</h2>
            </div>
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="space-y-3 pb-6">
                  {/* Status */}
                  <div className="bg-background rounded-2xl shadow-neu-sm p-4 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-mono text-muted-foreground mb-1">{selectedOrder.id}</p>
                      <p className="text-xs text-muted-foreground">{selectedOrder.createdAt}</p>
                    </div>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${ORDER_STATUS_INFO[selectedOrder.status].color}`}>{ORDER_STATUS_INFO[selectedOrder.status].label}</span>
                  </div>

                  {/* Address */}
                  <div className="bg-background rounded-2xl shadow-neu-sm p-4">
                    <div className="flex items-center gap-2 mb-2"><MapPin className="w-4 h-4 text-primary" /><span className="text-xs font-bold text-foreground">Alamat Pengiriman</span></div>
                    <p className="text-sm font-semibold text-foreground">{selectedOrder.address.name} • {selectedOrder.address.phone}</p>
                    <p className="text-xs text-muted-foreground mt-1">{selectedOrder.address.full}</p>
                  </div>

                  {/* Items */}
                  <div className="bg-background rounded-2xl shadow-neu-sm p-4">
                    <p className="text-xs font-bold text-foreground mb-3">Produk</p>
                    {selectedOrder.items.map(item => (
                      <div key={item.product.id} className="flex items-center gap-3 py-2 border-b border-border/20 last:border-0">
                        <span className="text-2xl select-none">{item.product.image}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-foreground line-clamp-1">{item.product.name}</p>
                          <p className="text-xs text-muted-foreground">x{item.quantity}</p>
                        </div>
                        <p className="text-xs font-bold text-foreground">{formatRupiah(item.product.price * item.quantity)}</p>
                      </div>
                    ))}
                  </div>

                  {/* Payment info */}
                  <div className="bg-background rounded-2xl shadow-neu-sm p-4 space-y-2">
                    <p className="text-xs font-bold text-foreground mb-2">Info Pembayaran</p>
                    <div className="flex justify-between text-xs"><span className="text-muted-foreground">Metode</span><span className="text-foreground font-semibold">{selectedOrder.paymentMethod}</span></div>
                    <div className="flex justify-between text-xs"><span className="text-muted-foreground">Pengiriman</span><span className="text-foreground font-semibold">{selectedOrder.shippingMethod}</span></div>
                    <div className="flex justify-between text-xs"><span className="text-muted-foreground">Ongkir</span><span className="text-foreground font-semibold">{formatRupiah(selectedOrder.shipping)}</span></div>
                    {selectedOrder.paidAt && <div className="flex justify-between text-xs"><span className="text-muted-foreground">Dibayar</span><span className="text-foreground font-semibold">{selectedOrder.paidAt}</span></div>}
                    <div className="border-t border-border/30 pt-2 mt-2 flex justify-between"><span className="text-sm font-bold text-foreground">Total</span><span className="text-lg font-bold text-primary">{formatRupiah(selectedOrder.total + selectedOrder.shipping)}</span></div>
                  </div>
                </div>
              </ScrollArea>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ─── Bottom Sheet helper ──────────────────────────────────
function BottomSheet({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-end justify-center" onClick={onClose}>
          <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 300 }} className="bg-background rounded-t-3xl w-full max-w-lg p-6 pb-10 shadow-2xl max-h-[70vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex justify-center mb-3"><div className="w-10 h-1 bg-muted-foreground/20 rounded-full" /></div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-foreground">{title}</h3>
              <button onClick={onClose} className="p-2 bg-muted/50 rounded-full text-muted-foreground hover:bg-muted"><X className="w-4 h-4" /></button>
            </div>
            <ScrollArea className="flex-1 overflow-hidden">
              <div className="pb-4">{children}</div>
            </ScrollArea>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
