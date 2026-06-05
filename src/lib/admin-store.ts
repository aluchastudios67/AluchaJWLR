// ─────────────────────────────────────────────────────────────────────────────
// Client-Side Admin Store
// All data lives in localStorage so the admin dashboard works without a server.
// ─────────────────────────────────────────────────────────────────────────────

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: "admin" | "staff";
}

export interface LocalizedString {
  ka: string;
  en: string;
  ru: string;
}

export interface Product {
  id: string;
  name: LocalizedString;
  category: "Rings" | "Necklaces" | "Earrings" | "Bracelets";
  price: number;
  image: string;
  material: LocalizedString;
  story: LocalizedString;
  status: "active" | "draft" | "archived";
  sku: string;
  compareAtPrice?: number;
  tracksInventory: boolean;
  seoTitle?: string;
  seoDescription?: string;
  tags: string[];
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  price: number;
  sku: string;
  inventoryQuantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface Collection {
  id: string;
  name: LocalizedString;
  description: LocalizedString;
  slug: string;
  isFeatured: boolean;
  productIds: string[];
  createdAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  variantId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded";
  paymentStatus: "paid" | "unpaid" | "refunded";
  shippingAddress: {
    firstName: string;
    lastName: string;
    address1: string;
    city: string;
    country: string;
    phone: string;
  };
  shippingMethod: string;
  trackingNumber?: string;
  totalAmount: number;
  taxAmount: number;
  shippingAmount: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

export interface Customer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  acceptsMarketing: boolean;
  lifetimeValue: number;
  createdAt: string;
  updatedAt: string;
}

export interface ContentBlock {
  id: string;
  sectionKey: string;
  data: any;
  updatedAt: string;
}

export interface BlogPost {
  id: string;
  title: LocalizedString;
  slug: string;
  content: LocalizedString;
  excerpt: LocalizedString;
  coverImage: string;
  status: "draft" | "published";
  authorId: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  entity: string;
  entityId: string;
  details: string;
  createdAt: string;
}

export interface StoreSchema {
  products: Product[];
  variants: ProductVariant[];
  collections: Collection[];
  orders: Order[];
  customers: Customer[];
  contentBlocks: ContentBlock[];
  blogPosts: BlogPost[];
  auditLogs: AuditLog[];
}

// ─── Credentials (client-side only, demo environment) ───────────────────────
const CREDENTIALS = [
  { email: "admin@alucha.com", password: "admin123", id: "usr-admin", name: "Mariel Alucha", role: "admin" as const },
  { email: "staff@alucha.com", password: "staff123", id: "usr-staff", name: "Levan Dolidze", role: "staff" as const },
];

const SESSION_KEY = "alucha_admin_session";
const STORE_KEY = "alucha_admin_store";

// ─── Auth ────────────────────────────────────────────────────────────────────
export const auth = {
  login(email: string, password: string): AdminUser | null {
    const match = CREDENTIALS.find(
      (c) => c.email.toLowerCase() === email.toLowerCase() && c.password === password
    );
    if (!match) return null;
    const user: AdminUser = { id: match.id, email: match.email, name: match.name, role: match.role };
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    return user;
  },

  logout() {
    localStorage.removeItem(SESSION_KEY);
  },

  getUser(): AdminUser | null {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as AdminUser;
    } catch {
      return null;
    }
  },
};

// ─── Seed Data ───────────────────────────────────────────────────────────────
function seedStore(): StoreSchema {
  const now = new Date().toISOString();

  const products: Product[] = [
    {
      id: "aurelia-signet",
      name: { ka: "აურელიას ბეჭედი-ბეჭდური", en: "Aurelia Signet Ring", ru: "Кольцо-печатка Aurelia" },
      category: "Rings",
      price: 420,
      image: "/src/assets/product-1.jpg",
      material: { ka: "18-კარატიანი გადამუშავებული ოქრო ვერსალი", en: "18k recycled gold vermeil", ru: "18-каратное позолоченное переработанное серебро (вермей)" },
      story: { ka: "რომაული ბეჭდებით შთაგონებული...", en: "Inspired by Roman seals, the Aurelia signet is hand-finished to carry a story only its wearer knows.", ru: "Вдохновленное римскими печатями..." },
      status: "active", sku: "AL-AUR-RG-18K", tracksInventory: true,
      tags: ["rings", "featured", "gold"], isFeatured: true,
      createdAt: now, updatedAt: now,
    },
    {
      id: "soleil-pendant",
      name: { ka: "სოლეილის ალმასის გულსაკიდი", en: "Soleil Diamond Pendant", ru: "Подвеска с бриллиантом Soleil" },
      category: "Necklaces",
      price: 560,
      image: "/src/assets/product-2.jpg",
      material: { ka: "14-კარატიანი სუფთა ოქრო, კონფლიქტის გარეშე მოპოვებული ალმასი", en: "14k solid gold, conflict-free diamond", ru: "14-каратное цельное золото, бесконфликтный бриллиант" },
      story: { ka: "ერთი მანათობელი წერტილი...", en: "A single luminous point — for the moments worth keeping close to the heart.", ru: "Единственная светящаяся точка..." },
      status: "active", sku: "AL-SOL-NC-14K", tracksInventory: true,
      tags: ["necklaces", "diamonds", "gold"], isFeatured: true,
      createdAt: now, updatedAt: now,
    },
    {
      id: "lumen-hoops",
      name: { ka: "ლუმენის პატარა რგოლები", en: "Lumen Petite Hoops", ru: "Маленькие серьги-кольца Lumen" },
      category: "Earrings",
      price: 285,
      image: "/src/assets/product-3.jpg",
      material: { ka: "18-კარატიანი გადამუშავებული ოქრო ვერსალი", en: "18k recycled gold vermeil", ru: "18-каратное позолоченное переработанное серебро (вермей)" },
      story: { ka: "უმსუბუქო, გაპრიალებული...", en: "Weightless, polished, endlessly wearable. The hoop, refined to its essential gesture.", ru: "Невесомые, отполированные..." },
      status: "active", sku: "AL-LUM-ER-18K", tracksInventory: true,
      tags: ["earrings", "classics"], isFeatured: false,
      createdAt: now, updatedAt: now,
    },
    {
      id: "maree-bangle",
      name: { ka: "მარეს მარგალიტის სამაჯური", en: "Marée Pearl Bangle", ru: "Браслет с жемчугом Marée" },
      category: "Bracelets",
      price: 340,
      image: "/src/assets/product-4.jpg",
      material: { ka: "14-კარატიანი ოქროთი დაფარული, მტკნარი წყლის მარგალიტი", en: "14k gold-filled, freshwater pearl", ru: "14-каратное напыление золота, пресноводный жемчуг" },
      story: { ka: "ერთი მარგალიტი მიჰყვება...", en: "A single pearl drifts along a fine gold tide — quiet, luminous, lasting.", ru: "Одинокая жемчужина дрейфует..." },
      status: "active", sku: "AL-MAR-BR-PEARL", tracksInventory: true,
      tags: ["bracelets", "pearls"], isFeatured: true,
      createdAt: now, updatedAt: now,
    },
  ];

  const variants: ProductVariant[] = [];
  products.forEach((p) => {
    ["XS", "S", "M", "L"].forEach((size, idx) => {
      variants.push({
        id: `var-${p.id}-${size.toLowerCase()}`,
        productId: p.id,
        name: `Size ${size}`,
        price: p.price,
        sku: `${p.sku}-${size}`,
        inventoryQuantity: 10 + idx * 5,
        createdAt: now,
        updatedAt: now,
      });
    });
  });

  const collections: Collection[] = [
    { id: "rings", name: { ka: "ბეჭდები", en: "Rings", ru: "Кольца" }, description: { ka: "...", en: "A curated edit of rings from the Alucha archive.", ru: "..." }, slug: "rings", isFeatured: true, productIds: ["aurelia-signet"], createdAt: now },
    { id: "necklaces", name: { ka: "ყელსაბამები", en: "Necklaces", ru: "Ожерелья" }, description: { ka: "...", en: "A curated edit of necklaces from the Alucha archive.", ru: "..." }, slug: "necklaces", isFeatured: true, productIds: ["soleil-pendant"], createdAt: now },
    { id: "earrings", name: { ka: "საყურეები", en: "Earrings", ru: "Серьги" }, description: { ka: "...", en: "A curated edit of earrings from the Alucha archive.", ru: "..." }, slug: "earrings", isFeatured: true, productIds: ["lumen-hoops"], createdAt: now },
    { id: "bracelets", name: { ka: "სამაჯურები", en: "Bracelets", ru: "Браслеты" }, description: { ka: "...", en: "A curated edit of bracelets from the Alucha archive.", ru: "..." }, slug: "bracelets", isFeatured: true, productIds: ["maree-bangle"], createdAt: now },
  ];

  const customers: Customer[] = [
    { id: "cust-1", email: "elena@example.com", firstName: "Elena", lastName: "Rossi", phone: "+39 333 1234567", acceptsMarketing: true, lifetimeValue: 420, createdAt: now, updatedAt: now },
    { id: "cust-2", email: "camille@example.com", firstName: "Camille", lastName: "Dupont", phone: "+33 6 12345678", acceptsMarketing: true, lifetimeValue: 1120, createdAt: now, updatedAt: now },
    { id: "cust-3", email: "sofia@example.com", firstName: "Sofía", lastName: "Mendoza", phone: "+1 212 555 0199", acceptsMarketing: false, lifetimeValue: 285, createdAt: now, updatedAt: now },
  ];

  const orders: Order[] = [
    {
      id: "ord-1001",
      customerId: "cust-1",
      customerName: "Elena Rossi",
      customerEmail: "elena@example.com",
      status: "delivered",
      paymentStatus: "paid",
      shippingAddress: { firstName: "Elena", lastName: "Rossi", address1: "Via Montenapoleone 8", city: "Milan", country: "Italy", phone: "+39 333 1234567" },
      shippingMethod: "Express International",
      trackingNumber: "DHL123456789",
      totalAmount: 420,
      taxAmount: 70,
      shippingAmount: 0,
      notes: "Please include gift wrapping.",
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
      items: [{ id: "item-1", orderId: "ord-1001", productId: "aurelia-signet", variantId: "var-aurelia-signet-s", name: "Aurelia Signet Ring (Size S)", quantity: 1, price: 420 }],
    },
    {
      id: "ord-1002",
      customerId: "cust-2",
      customerName: "Camille Dupont",
      customerEmail: "camille@example.com",
      status: "processing",
      paymentStatus: "paid",
      shippingAddress: { firstName: "Camille", lastName: "Dupont", address1: "42 Rue Saint-Honoré", city: "Paris", country: "France", phone: "+33 6 12345678" },
      shippingMethod: "Standard Atelier Courier",
      totalAmount: 1120,
      taxAmount: 186,
      shippingAmount: 0,
      notes: "Signature required on delivery.",
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      items: [{ id: "item-2", orderId: "ord-1002", productId: "soleil-pendant", variantId: "var-soleil-pendant-m", name: "Soleil Diamond Pendant (Size M)", quantity: 2, price: 560 }],
    },
    {
      id: "ord-1003",
      customerId: "cust-3",
      customerName: "Sofía Mendoza",
      customerEmail: "sofia@example.com",
      status: "pending",
      paymentStatus: "unpaid",
      shippingAddress: { firstName: "Sofía", lastName: "Mendoza", address1: "123 Park Avenue", city: "New York", country: "USA", phone: "+1 212 555 0199" },
      shippingMethod: "Standard Courier",
      totalAmount: 285,
      taxAmount: 25,
      shippingAmount: 15,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      items: [{ id: "item-3", orderId: "ord-1003", productId: "lumen-hoops", variantId: "var-lumen-hoops-s", name: "Lumen Petite Hoops (Size S)", quantity: 1, price: 285 }],
    },
  ];

  const contentBlocks: ContentBlock[] = [
    {
      id: "home_hero",
      sectionKey: "home_hero",
      data: {
        eyebrow: { ka: "გაზაფხულის კოლექცია · 2026", en: "The Spring Edit · 2026", ru: "Весенняя коллекция · 2026" },
        title_1: { ka: "სამკაული", en: "Jewelry", ru: "Украшения" },
        title_2: { ka: "მნიშვნელობით.", en: "With Meaning.", ru: "со смыслом." },
        description: { ka: "შექმნილია...", en: "Crafted to celebrate stories, memories, and moments that last forever — by hand, in small numbers, from recycled gold.", ru: "Создано..." },
      },
      updatedAt: now,
    },
    {
      id: "marquee_notices",
      sectionKey: "marquee_notices",
      data: {
        items: [
          { ka: "უფასო საერთაშორისო მიწოდება 250$-ზე მეტ შენაძენზე", en: "Complimentary worldwide shipping over $250", ru: "Бесплатная международная доставка от $250" },
          { ka: "ხელოსნობის უვადო გარანტია", en: "Lifetime craftsmanship guarantee", ru: "Пожизненная гарантия на работу" },
          { ka: "დამზადებულია მცირე პარტიებად", en: "Made in small batches", ru: "Сделано небольшими партиями" },
          { ka: "გადამუშავებული ოქრო · ეთიკურად მოპოვებული ქვები", en: "Recycled gold · ethically sourced stones", ru: "Переработанное золото · этичные камни" },
        ],
      },
      updatedAt: now,
    },
  ];

  const blogPosts: BlogPost[] = [
    {
      id: "post-1",
      title: { ka: "ოქრომჭედლობის ხელოვნება", en: "The Art of Goldsmithing: Old and New", ru: "Искусство ювелирного дела" },
      slug: "art-of-goldsmithing",
      excerpt: { ka: "გაეცანით...", en: "Take a journey inside our Paris atelier and discover how we keep ancient lost-wax casting alive.", ru: "Загляните..." },
      content: { ka: "ეს არის ვრცელი სტატია...", en: "This is a detailed article about how we craft rings in our Paris atelier using ancient techniques.", ru: "Это подробная статья..." },
      coverImage: "/src/assets/craft.jpg",
      status: "published",
      authorId: "usr-admin",
      publishedAt: now,
      createdAt: now,
      updatedAt: now,
    },
  ];

  return {
    products,
    variants,
    collections,
    orders,
    customers,
    contentBlocks,
    blogPosts,
    auditLogs: [
      {
        id: "log-init",
        userId: "system",
        userName: "System",
        action: "INITIALIZE",
        entity: "Store",
        entityId: "all",
        details: "Admin store initialized with seed data.",
        createdAt: now,
      },
    ],
  };
}

// ─── Store Operations ─────────────────────────────────────────────────────────
function loadStore(): StoreSchema {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) return JSON.parse(raw) as StoreSchema;
  } catch {
    // corrupt data — reset
  }
  const seed = seedStore();
  saveStore(seed);
  return seed;
}

function saveStore(data: StoreSchema) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Failed to save store", e);
  }
}

function addAuditLog(data: StoreSchema, userId: string, userName: string, action: string, entity: string, entityId: string, details: string) {
  data.auditLogs.unshift({
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    userId, userName, action, entity, entityId, details,
    createdAt: new Date().toISOString(),
  });
  if (data.auditLogs.length > 500) data.auditLogs = data.auditLogs.slice(0, 500);
}

// ─── Store API ────────────────────────────────────────────────────────────────
export const store = {
  // Reset store (for debugging)
  reset() {
    localStorage.removeItem(STORE_KEY);
    return loadStore();
  },

  // ── Products ──
  getProducts(): Product[] {
    return loadStore().products;
  },
  getActiveProducts(): Product[] {
    return loadStore().products.filter((p) => p.status !== "archived");
  },
  getProductById(id: string): Product | undefined {
    return loadStore().products.find((p) => p.id === id);
  },
  createProduct(user: AdminUser, product: Omit<Product, "createdAt" | "updatedAt">): Product {
    const data = loadStore();
    const now = new Date().toISOString();
    const newProduct: Product = { ...product, createdAt: now, updatedAt: now };
    data.products.push(newProduct);
    addAuditLog(data, user.id, user.name, "CREATE_PRODUCT", "Product", newProduct.id, `Created "${newProduct.name.en}"`);
    saveStore(data);
    return newProduct;
  },
  updateProduct(user: AdminUser, id: string, updates: Partial<Omit<Product, "id" | "createdAt">>): Product | undefined {
    const data = loadStore();
    const idx = data.products.findIndex((p) => p.id === id);
    if (idx === -1) return undefined;
    const updated: Product = { ...data.products[idx], ...updates, updatedAt: new Date().toISOString() };
    data.products[idx] = updated;
    addAuditLog(data, user.id, user.name, "UPDATE_PRODUCT", "Product", id, `Updated "${updated.name.en}"`);
    saveStore(data);
    return updated;
  },
  deleteProduct(user: AdminUser, id: string): boolean {
    const data = loadStore();
    const idx = data.products.findIndex((p) => p.id === id);
    if (idx === -1) return false;
    const name = data.products[idx].name.en;
    data.products.splice(idx, 1);
    // Also remove variants
    data.variants = data.variants.filter((v) => v.productId !== id);
    addAuditLog(data, user.id, user.name, "DELETE_PRODUCT", "Product", id, `Deleted "${name}"`);
    saveStore(data);
    return true;
  },

  // ── Variants ──
  getVariantsByProduct(productId: string): ProductVariant[] {
    return loadStore().variants.filter((v) => v.productId === productId);
  },
  updateVariant(user: AdminUser, variantId: string, updates: Partial<ProductVariant>): ProductVariant | undefined {
    const data = loadStore();
    const idx = data.variants.findIndex((v) => v.id === variantId);
    if (idx === -1) return undefined;
    const updated: ProductVariant = { ...data.variants[idx], ...updates, updatedAt: new Date().toISOString() };
    data.variants[idx] = updated;
    addAuditLog(data, user.id, user.name, "UPDATE_VARIANT", "Variant", variantId, `Updated variant ${updated.name}`);
    saveStore(data);
    return updated;
  },
  createVariant(user: AdminUser, variant: Omit<ProductVariant, "createdAt" | "updatedAt">): ProductVariant {
    const data = loadStore();
    const now = new Date().toISOString();
    const newVariant: ProductVariant = { ...variant, createdAt: now, updatedAt: now };
    data.variants.push(newVariant);
    addAuditLog(data, user.id, user.name, "CREATE_VARIANT", "Variant", newVariant.id, `Created variant ${newVariant.name}`);
    saveStore(data);
    return newVariant;
  },
  deleteVariant(user: AdminUser, variantId: string): boolean {
    const data = loadStore();
    const idx = data.variants.findIndex((v) => v.id === variantId);
    if (idx === -1) return false;
    data.variants.splice(idx, 1);
    addAuditLog(data, user.id, user.name, "DELETE_VARIANT", "Variant", variantId, `Deleted variant`);
    saveStore(data);
    return true;
  },

  // ── Collections ──
  getCollections(): Collection[] {
    return loadStore().collections;
  },
  updateCollection(user: AdminUser, id: string, updates: Partial<Omit<Collection, "id" | "createdAt">>): Collection | undefined {
    const data = loadStore();
    const idx = data.collections.findIndex((c) => c.id === id);
    if (idx === -1) return undefined;
    data.collections[idx] = { ...data.collections[idx], ...updates };
    addAuditLog(data, user.id, user.name, "UPDATE_COLLECTION", "Collection", id, `Updated collection ${id}`);
    saveStore(data);
    return data.collections[idx];
  },

  // ── Orders ──
  getOrders(): Order[] {
    return loadStore().orders;
  },
  getOrderById(id: string): Order | undefined {
    return loadStore().orders.find((o) => o.id === id);
  },
  updateOrder(user: AdminUser, id: string, updates: Partial<Omit<Order, "id" | "createdAt">>): Order | undefined {
    const data = loadStore();
    const idx = data.orders.findIndex((o) => o.id === id);
    if (idx === -1) return undefined;
    const updated: Order = { ...data.orders[idx], ...updates, updatedAt: new Date().toISOString() };
    data.orders[idx] = updated;
    addAuditLog(data, user.id, user.name, "UPDATE_ORDER", "Order", id, `Updated order ${id} — status: ${updated.status}`);
    saveStore(data);
    return updated;
  },

  // ── Customers ──
  getCustomers(): Customer[] {
    return loadStore().customers;
  },

  // ── Content ──
  getContentBlock(sectionKey: string): ContentBlock | undefined {
    return loadStore().contentBlocks.find((b) => b.sectionKey === sectionKey);
  },
  updateContentBlock(user: AdminUser, sectionKey: string, newData: any): ContentBlock {
    const data = loadStore();
    const idx = data.contentBlocks.findIndex((b) => b.sectionKey === sectionKey);
    const block: ContentBlock = {
      id: sectionKey,
      sectionKey,
      data: newData,
      updatedAt: new Date().toISOString(),
    };
    if (idx === -1) {
      data.contentBlocks.push(block);
    } else {
      data.contentBlocks[idx] = block;
    }
    addAuditLog(data, user.id, user.name, "UPDATE_CONTENT", "Content", sectionKey, `Updated ${sectionKey}`);
    saveStore(data);
    return block;
  },
  getBlogPosts(): BlogPost[] {
    return loadStore().blogPosts;
  },
  updateBlogPost(user: AdminUser, id: string, updates: Partial<Omit<BlogPost, "id" | "createdAt">>): BlogPost | undefined {
    const data = loadStore();
    const idx = data.blogPosts.findIndex((p) => p.id === id);
    if (idx === -1) return undefined;
    const updated: BlogPost = { ...data.blogPosts[idx], ...updates, updatedAt: new Date().toISOString() };
    data.blogPosts[idx] = updated;
    addAuditLog(data, user.id, user.name, "UPDATE_BLOG_POST", "BlogPost", id, `Updated post "${updated.title.en}"`);
    saveStore(data);
    return updated;
  },
  createBlogPost(user: AdminUser, post: Omit<BlogPost, "createdAt" | "updatedAt">): BlogPost {
    const data = loadStore();
    const now = new Date().toISOString();
    const newPost: BlogPost = { ...post, createdAt: now, updatedAt: now };
    data.blogPosts.push(newPost);
    addAuditLog(data, user.id, user.name, "CREATE_BLOG_POST", "BlogPost", newPost.id, `Created post "${newPost.title.en}"`);
    saveStore(data);
    return newPost;
  },

  // ── Audit Logs ──
  getAuditLogs(): AuditLog[] {
    return loadStore().auditLogs;
  },

  // ── Analytics ──
  getAnalytics() {
    const data = loadStore();
    const totalRevenue = data.orders
      .filter((o) => o.paymentStatus === "paid")
      .reduce((sum, o) => sum + o.totalAmount, 0);
    const totalOrders = data.orders.length;
    const averageOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

    // Low stock (quantity <= 10)
    const lowStock = data.variants
      .filter((v) => v.inventoryQuantity <= 10)
      .map((v) => {
        const product = data.products.find((p) => p.id === v.productId);
        return {
          variantId: v.id,
          productName: product?.name.en ?? "Unknown",
          variantName: v.name,
          sku: v.sku,
          quantity: v.inventoryQuantity,
        };
      })
      .sort((a, b) => a.quantity - b.quantity);

    // Top selling products (from order items)
    const productSales: Record<string, { quantity: number; revenue: number; name: string }> = {};
    data.orders.forEach((o) => {
      o.items.forEach((item) => {
        if (!productSales[item.productId]) {
          const product = data.products.find((p) => p.id === item.productId);
          productSales[item.productId] = { quantity: 0, revenue: 0, name: product?.name.en ?? item.name };
        }
        productSales[item.productId].quantity += item.quantity;
        productSales[item.productId].revenue += item.quantity * item.price;
      });
    });
    const topSelling = Object.entries(productSales)
      .map(([id, v]) => ({ id, name: v.name, quantity: v.quantity, revenue: v.revenue }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // Sales history (last 6 months)
    const salesHistory: { month: string; revenue: number; orders: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const label = d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
      const monthStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const monthOrders = data.orders.filter((o) => o.createdAt.startsWith(monthStr));
      salesHistory.push({
        month: label,
        revenue: monthOrders.filter((o) => o.paymentStatus === "paid").reduce((s, o) => s + o.totalAmount, 0),
        orders: monthOrders.length,
      });
    }

    // Top customers by LTV
    const topCustomers = [...data.customers]
      .sort((a, b) => b.lifetimeValue - a.lifetimeValue)
      .slice(0, 5)
      .map((c) => ({ id: c.id, email: c.email, name: `${c.firstName} ${c.lastName}`, ltv: c.lifetimeValue }));

    return {
      kpis: { totalRevenue, totalOrders, averageOrderValue, conversionRate: 3.2 },
      lowStock,
      topSelling,
      salesHistory,
      topCustomers,
    };
  },
};
