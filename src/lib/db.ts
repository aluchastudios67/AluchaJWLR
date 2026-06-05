import { type Language } from "./translations";
import fs from "node:fs";
import path from "node:path";


// --- Database Types ---

export interface User {
  id: string;
  email: string;
  passwordHash: string; // Plain-text base64 or SHA-256 for simple secure storage
  role: "admin" | "staff";
  name: string;
  createdAt: string;
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
  barcode?: string;
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
  name: string; // e.g., "Size XS", "Size S", "Size M", "Size L"
  price: number;
  sku: string;
  inventoryQuantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  altText: string;
  sortOrder: number;
  createdAt: string;
}

export interface Collection {
  id: string;
  name: LocalizedString;
  description: LocalizedString;
  slug: string;
  isFeatured: boolean;
  productIds: string[]; // List of product IDs ordered
  createdAt: string;
}

export interface Address {
  id: string;
  customerId: string;
  type: "shipping" | "billing";
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
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
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded";
  paymentStatus: "paid" | "unpaid" | "refunded";
  shippingAddress: Omit<Address, "id" | "customerId">;
  billingAddress: Omit<Address, "id" | "customerId">;
  shippingMethod: string;
  trackingNumber?: string;
  trackingUrl?: string;
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

export interface NewsletterSubscriber {
  id: string;
  email: string;
  status: "subscribed" | "unsubscribed";
  createdAt: string;
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

export interface DbSchema {
  users: User[];
  products: Product[];
  variants: ProductVariant[];
  images: ProductImage[];
  collections: Collection[];
  orders: Order[];
  customers: Customer[];
  contentBlocks: ContentBlock[];
  blogPosts: BlogPost[];
  subscribers: NewsletterSubscriber[];
  auditLogs: AuditLog[];
}

// --- Database Engine (JSON store) ---

let dbData: DbSchema | null = null;
const DB_PATH = "data/db.json";

function getFs() {
  if (typeof window === "undefined") {
    return fs;
  }
  return null;
}

function getPath() {
  if (typeof window === "undefined") {
    return path;
  }
  return null;
}

function loadDatabase(): DbSchema {
  if (dbData) return dbData;

  const fs = getFs();
  const path = getPath();

  if (!fs || !path) {
    // Return empty schema on client side
    return createEmptySchema();
  }

  const absolutePath = path.resolve(DB_PATH);
  const dir = path.dirname(absolutePath);

  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    if (!fs.existsSync(absolutePath)) {
      const initial = createSeededSchema();
      fs.writeFileSync(absolutePath, JSON.stringify(initial, null, 2), "utf-8");
      dbData = initial;
      return initial;
    }

    const content = fs.readFileSync(absolutePath, "utf-8");
    dbData = JSON.parse(content);
    return dbData!;
  } catch (error) {
    console.error("Error loading database file. Initializing default empty data.", error);
    dbData = createSeededSchema();
    return dbData;
  }
}

function saveDatabase(data: DbSchema) {
  dbData = data;
  const fs = getFs();
  const path = getPath();

  if (!fs || !path) return;

  const absolutePath = path.resolve(DB_PATH);
  const tempPath = absolutePath + ".tmp";

  try {
    // Atomic write
    fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), "utf-8");
    fs.renameSync(tempPath, absolutePath);
  } catch (error) {
    console.error("Error saving database file:", error);
  }
}

function createEmptySchema(): DbSchema {
  return {
    users: [],
    products: [],
    variants: [],
    images: [],
    collections: [],
    orders: [],
    customers: [],
    contentBlocks: [],
    blogPosts: [],
    subscribers: [],
    auditLogs: [],
  };
}

// Simple base64 encoder for password "hashes"
function simpleHash(text: string): string {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(text).toString("base64");
  }
  return btoa(text);
}

function createSeededSchema(): DbSchema {
  const now = new Date().toISOString();
  
  const initialUsers: User[] = [
    {
      id: "usr-admin",
      email: "admin@alucha.com",
      passwordHash: simpleHash("admin123"),
      role: "admin",
      name: "Mariel Alucha",
      createdAt: now,
    },
    {
      id: "usr-staff",
      email: "staff@alucha.com",
      passwordHash: simpleHash("staff123"),
      role: "staff",
      name: "Levan Dolidze",
      createdAt: now,
    }
  ];

  // Seed default products mapping existing ones
  const initialProducts: Product[] = [
    {
      id: "aurelia-signet",
      name: {
        ka: "აურელიას ბეჭედი-ბეჭდური",
        en: "Aurelia Signet Ring",
        ru: "Кольцо-печатка Aurelia",
      },
      category: "Rings",
      price: 420,
      image: "/assets/product-1.jpg",
      material: {
        ka: "18-კარატიანი გადამუშავებული ოქრო ვერსალი",
        en: "18k recycled gold vermeil",
        ru: "18-каратное позолоченное переработанное серебро (вермей)",
      },
      story: {
        ka: "რომაული ბეჭდებით შთაგონებული, აურელიას ბეჭედი ხელით სრულდება, რათა ატაროს ისტორია, რომელიც მხოლოდ მისმა მფლობელმა იცის.",
        en: "Inspired by Roman seals, the Aurelia signet is hand-finished to carry a story only its wearer knows.",
        ru: "Вдохновленное римскими печатями, кольцо Aurelia доработано вручную, чтобы нести историю, известную только его владельцу.",
      },
      status: "active",
      sku: "AL-AUR-RG-18K",
      tracksInventory: true,
      tags: ["rings", "featured", "gold"],
      isFeatured: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "soleil-pendant",
      name: {
        ka: "სოლეილის ალმასის გულსაკიდი",
        en: "Soleil Diamond Pendant",
        ru: "Подвеска с бриллиантом Soleil",
      },
      category: "Necklaces",
      price: 560,
      image: "/assets/product-2.jpg",
      material: {
        ka: "14-კარატიანი სუფთა ოქრო, კონფლიქტის გარეშე მოპოვებული ალმასი",
        en: "14k solid gold, conflict-free diamond",
        ru: "14-каратное цельное золото, бесконфликтный бриллиант",
      },
      story: {
        ka: "ერთი მანათობელი წერტილი — გულთან ახლოს შესანახი მომენტებისთვის.",
        en: "A single luminous point — for the moments worth keeping close to the heart.",
        ru: "Единственная светящаяся точка — для моментов, которые стоит хранить у самого сердца.",
      },
      status: "active",
      sku: "AL-SOL-NC-14K",
      tracksInventory: true,
      tags: ["necklaces", "diamonds", "gold"],
      isFeatured: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "lumen-hoops",
      name: {
        ka: "ლუმენის პატარა რგოლები",
        en: "Lumen Petite Hoops",
        ru: "Маленькие серьги-кольца Lumen",
      },
      category: "Earrings",
      price: 285,
      image: "/assets/product-3.jpg",
      material: {
        ka: "18-კარატიანი გადამუშავებული ოქრო ვერსალი",
        en: "18k recycled gold vermeil",
        ru: "18-каратное позолоченное переработанное серебро (вермей)",
      },
      story: {
        ka: "უმსუბუქო, გაპრიალებული, უსასრულოდ სატარებელი. რგოლი, დაყვანილი მის არსებით ფორმამდე.",
        en: "Weightless, polished, endlessly wearable. The hoop, refined to its essential gesture.",
        ru: "Невесомые, отполированные, бесконечно удобные. Серьги-кольца, доведенные до своей сути.",
      },
      status: "active",
      sku: "AL-LUM-ER-18K",
      tracksInventory: true,
      tags: ["earrings", "classics"],
      isFeatured: false,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "marée-bangle",
      name: {
        ka: "მარეს მარგალიტის სამაჯური",
        en: "Marée Pearl Bangle",
        ru: "Браслет с жемчугом Marée",
      },
      category: "Bracelets",
      price: 340,
      image: "/assets/product-4.jpg",
      material: {
        ka: "14-კარატიანი ოქროთი დაფარული, მტკნარი წყლის მარგალიტი",
        en: "14k gold-filled, freshwater pearl",
        ru: "14-каратное напыление золота, пресноводный жемчуг",
      },
      story: {
        ka: "ერთი მარგალიტი მიჰყვება ოქროს ნაზ ტალღას — მშვიდი, მანათობელი, მარადიული.",
        en: "A single pearl drifts along a fine gold tide — quiet, luminous, lasting.",
        ru: "Одинокая жемчужина дрейфует по тонкой золотой волне — тихая, светящаяся, стойкая.",
      },
      status: "active",
      sku: "AL-MAR-BR-PEARL",
      tracksInventory: true,
      tags: ["bracelets", "pearls"],
      isFeatured: true,
      createdAt: now,
      updatedAt: now,
    }
  ];

  // Seed default product variants (Sizes XS, S, M, L)
  const initialVariants: ProductVariant[] = [];
  initialProducts.forEach((p) => {
    ["XS", "S", "M", "L"].forEach((size, idx) => {
      initialVariants.push({
        id: `var-${p.id}-${size.toLowerCase()}`,
        productId: p.id,
        name: `Size ${size}`,
        price: p.price,
        sku: `${p.sku}-${size}`,
        inventoryQuantity: 10 + (idx * 5), // Seed inventory quantities 10, 15, 20, 25
        createdAt: now,
        updatedAt: now,
      });
    });
  });

  // Seed default product images
  const initialImages: ProductImage[] = initialProducts.map((p, idx) => ({
    id: `img-${p.id}-1`,
    productId: p.id,
    url: p.image,
    altText: p.name.en,
    sortOrder: 1,
    createdAt: now,
  }));

  // Seed default collections
  const initialCollections: Collection[] = [
    {
      id: "rings",
      name: { ka: "ბეჭდები", en: "Rings", ru: "Кольца" },
      description: {
        ka: "რჩეული ბეჭდები ალუჩას არქივიდან. თითოეული ნამუშევარი ხელით არის დასრულებული ჩვენს ატელიეში.",
        en: "A curated edit of rings from the Alucha archive. Each piece hand-finished in our atelier.",
        ru: "Кураторская подборка колец из архива Алюша. Каждое изделие доработано вручную в нашем ателье.",
      },
      slug: "rings",
      isFeatured: true,
      productIds: ["aurelia-signet"],
      createdAt: now,
    },
    {
      id: "necklaces",
      name: { ka: "ყელსაბამები", en: "Necklaces", ru: "Ожерелья" },
      description: {
        ka: "რჩეული ყელსაბამები ალუჩას არქივიდან. თითოეული ნამუშევარი ხელით არის დასრულებული ჩვენს ატელიეში.",
        en: "A curated edit of necklaces from the Alucha archive. Each piece hand-finished in our atelier.",
        ru: "Кураторская подборка ожерелий из архива Алюша. Каждое изделие доработано вручную в нашем ателье.",
      },
      slug: "necklaces",
      isFeatured: true,
      productIds: ["soleil-pendant"],
      createdAt: now,
    },
    {
      id: "earrings",
      name: { ka: "საყურეები", en: "Earrings", ru: "Серьги" },
      description: {
        ka: "რჩეული საყურეები ალუჩას არქივიდან. თითოეული ნამუშევარი ხელით არის დასრულებული ჩვენს ატელიეში.",
        en: "A curated edit of earrings from the Alucha archive. Each piece hand-finished in our atelier.",
        ru: "Кураторская подборка серег из архива Алюша. Каждое изделие доработано вручную в нашем ателье.",
      },
      slug: "earrings",
      isFeatured: true,
      productIds: ["lumen-hoops"],
      createdAt: now,
    },
    {
      id: "bracelets",
      name: { ka: "სამაჯურები", en: "Bracelets", ru: "Браслеты" },
      description: {
        ka: "რჩეული სამაჯურები ალუჩას არქივიდან. თითოეული ნამუშევარი ხელით არის დასრულებული ჩვენს ატელიეში.",
        en: "A curated edit of bracelets from the Alucha archive. Each piece hand-finished in our atelier.",
        ru: "Кураторская подборка браслетов из архива Алюша. Каждое изделие доработано вручную в нашем ателье.",
      },
      slug: "bracelets",
      isFeatured: true,
      productIds: ["marée-bangle"],
      createdAt: now,
    }
  ];

  // Seed mock customers
  const initialCustomers: Customer[] = [
    {
      id: "cust-1",
      email: "elena@example.com",
      firstName: "Elena",
      lastName: "Rossi",
      phone: "+39 333 1234567",
      acceptsMarketing: true,
      lifetimeValue: 420,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "cust-2",
      email: "camille@example.com",
      firstName: "Camille",
      lastName: "Dupont",
      phone: "+33 6 12345678",
      acceptsMarketing: true,
      lifetimeValue: 1120, // 2 Soleil Pendants
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "cust-3",
      email: "sofia@example.com",
      firstName: "Sofía",
      lastName: "Mendoza",
      phone: "+1 212 555 0199",
      acceptsMarketing: false,
      lifetimeValue: 0,
      createdAt: now,
      updatedAt: now,
    }
  ];

  // Seed mock orders
  const initialOrders: Order[] = [
    {
      id: "ord-1001",
      customerId: "cust-1",
      status: "delivered",
      paymentStatus: "paid",
      shippingAddress: {
        firstName: "Elena",
        lastName: "Rossi",
        company: "",
        address1: "Via Montenapoleone 8",
        city: "Milan",
        state: "MI",
        postalCode: "20121",
        country: "Italy",
        phone: "+39 333 1234567",
      },
      billingAddress: {
        firstName: "Elena",
        lastName: "Rossi",
        company: "",
        address1: "Via Montenapoleone 8",
        city: "Milan",
        state: "MI",
        postalCode: "20121",
        country: "Italy",
        phone: "+39 333 1234567",
      },
      shippingMethod: "Express International",
      trackingNumber: "DHL123456789",
      trackingUrl: "https://www.dhl.com/track",
      totalAmount: 420,
      taxAmount: 70,
      shippingAmount: 0,
      notes: "Please include gift wrapping.",
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
      updatedAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
      items: [
        {
          id: "item-1",
          orderId: "ord-1001",
          productId: "aurelia-signet",
          variantId: "var-aurelia-signet-s",
          name: "Aurelia Signet Ring (Size S)",
          quantity: 1,
          price: 420,
        }
      ]
    },
    {
      id: "ord-1002",
      customerId: "cust-2",
      status: "processing",
      paymentStatus: "paid",
      shippingAddress: {
        firstName: "Camille",
        lastName: "Dupont",
        company: "Atelier Dupont",
        address1: "42 Rue Saint-Honoré",
        city: "Paris",
        state: "IDF",
        postalCode: "75001",
        country: "France",
        phone: "+33 6 12345678",
      },
      billingAddress: {
        firstName: "Camille",
        lastName: "Dupont",
        company: "Atelier Dupont",
        address1: "42 Rue Saint-Honoré",
        city: "Paris",
        state: "IDF",
        postalCode: "75001",
        country: "France",
        phone: "+33 6 12345678",
      },
      shippingMethod: "Standard Atelier Courier",
      totalAmount: 1120,
      taxAmount: 186,
      shippingAmount: 0,
      notes: "Signature required on delivery.",
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      items: [
        {
          id: "item-2",
          orderId: "ord-1002",
          productId: "soleil-pendant",
          variantId: "var-soleil-pendant-m",
          name: "Soleil Diamond Pendant (Size M)",
          quantity: 2,
          price: 560,
        }
      ]
    }
  ];

  // Seed default Content blocks for CMS
  const initialContentBlocks: ContentBlock[] = [
    {
      id: "home_hero",
      sectionKey: "home_hero",
      data: {
        eyebrow: {
          ka: "გაზაფხულის კოლექცია · 2026",
          en: "The Spring Edit · 2026",
          ru: "Весенняя коллекция · 2026",
        },
        title_1: {
          ka: "სამკაული",
          en: "Jewelry",
          ru: "Украшения",
        },
        title_2: {
          ka: "მნიშვნელობით.",
          en: "With Meaning.",
          ru: "со смыслом.",
        },
        description: {
          ka: "შექმნილია იმისთვის, რომ აღნიშნოს ისტორიები, მოგონებები და მომენტები, რომლებიც სამუდამოდ გრძელდება — ხელით, მცირე რაოდენობით, გადამუშავებული ოქროსგან.",
          en: "Crafted to celebrate stories, memories, and moments that last forever — by hand, in small numbers, from recycled gold.",
          ru: "Создано для того, чтобы праздновать истории, воспоминания и моменты, которые длятся вечно — вручную, небольшими тиражами, из переработанного золота.",
        }
      },
      updatedAt: now,
    },
    {
      id: "marquee_notices",
      sectionKey: "marquee_notices",
      data: {
        items: [
          {
            ka: "უფასო საერთაშორისო მიწოდება 250$-ზე მეტ შენაძენზე",
            en: "Complimentary worldwide shipping over $250",
            ru: "Бесплатная международная доставка от $250",
          },
          {
            ka: "ხელოსნობის უვადო გარანტია",
            en: "Lifetime craftsmanship guarantee",
            ru: "Пожизненная гарантия на работу",
          },
          {
            ka: "დამზადებულია მცირე პარტიებად",
            en: "Made in small batches",
            ru: "Сделано небольшими партиями",
          },
          {
            ka: "გადამუშავებული ოქრო · ეთიკურად მოპოვებული ქვები",
            en: "Recycled gold · ethically sourced stones",
            ru: "Переработанное золото · этичные камни",
          }
        ]
      },
      updatedAt: now,
    }
  ];

  // Seed mock Blog Posts
  const initialBlogPosts: BlogPost[] = [
    {
      id: "post-1",
      title: {
        ka: "ოქრომჭედლობის ხელოვნება: ძველი და ახალი",
        en: "The Art of Goldsmithing: Old and New",
        ru: "Искусство ювелирного дела: старое и новое",
      },
      slug: "art-of-goldsmithing",
      excerpt: {
        ka: "გაეცანით ჩვენი პარიზის ატელიეს საიდუმლოებებს და იმას, თუ როგორ ვაცოცხლებთ ძველ ტექნიკებს.",
        en: "Take a journey inside our Paris atelier and discover how we keep ancient lost-wax casting alive.",
        ru: "Загляните в нашу парижскую мастерскую и узнайте, как мы сохраняем старинные традиции литья.",
      },
      content: {
        en: "Goldsmithing is a dance between precision and emotion, a discipline that has connected human hands across millennia. At Alucha Studios, we view our workbench as a repository of this history. We practice lost-wax casting (cire perdue), an ancient method where a model is meticulously carved from wax, encased in a mold, and replaced by molten gold.\n\nThis slower cadence allows us to craft rings with a level of character that modern machinery simply cannot duplicate. Every file stroke, every polish leaves a microscopic signature, turning a piece of metal into a vessel of memory. The art of the goldsmith is not just to shape the gold, but to shape the quiet connection between the object and its keeper.",
        ka: "ოქრომჭედლობა არის ზუსტი გათვლებისა და ემოციების ჰარმონია, დისციპლინა, რომელიც ათასწლეულების მანძილზე აკავშირებს ადამიანის ხელებს. ალუჩა სტუდიოში ჩვენს სახელოსნოს ამ ისტორიის საცავად მივიჩნევთ. ჩვენ ვიყენებთ ცვილის დაკარგვის ტექნოლოგიას, უძველეს მეთოდს, სადაც მოდელი სათუთად იკვეთება ცვილისგან, თავსდება ყალიბში და შემდეგ იცვლება გამდნარი ოქროთი.\n\nეს ნელი ტემპი საშუალებას გვაძლევს შევქმნათ ბეჭდები ისეთი ხასიათით, რომლის გამეორებაც თანამედროვე დანადგარებს უბრალოდ არ შეუძლიათ. ხელოსნის ხელოვნება არა მხოლოდ ოქროს ფორმირებაა, არამედ იმ ფარული კავშირის შექმნაა, რომელიც სამკაულსა და მის მფლობელს შორის იბადება.",
        ru: "Ювелирное искусство — это танец между точностью и эмоцией, дисциплина, объединяющая человеческие руки на протяжении тысячелетий. В Alucha Studios мы рассматриваем наш верстак как хранилище этой истории. Мы практикуем литье по выплавляемым моделям — древний метод, при котором модель тщательно вырезается из воска, помещается в форму и заменяется расплавленным золотом.\n\nЭтот более медленный ритм позволяет нам создавать кольца с таким характером, который современные машины просто не могут воспроизвести. Искусство ювелира — это не просто придание формы золоту, это создание невидимой связи между объектом и его владельцем."
      },
      coverImage: "/assets/craft.jpg",
      status: "published",
      authorId: "usr-admin",
      publishedAt: now,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "post-2",
      title: {
        en: "The Poetry of Recycled Gold",
        ka: "გადამუშავებული ოქროს პოეზია",
        ru: "Поэзия переработанного золота",
      },
      slug: "poetry-of-recycled-gold",
      excerpt: {
        en: "Why we choose to work exclusively with 18k recycled gold vermeil and traceable gemstones.",
        ka: "რატომ ვმუშაობთ მხოლოდ 18კ გადამუშავებულ ოქროსა და მიკვლევად ძვირფას ქვებზე.",
        ru: "Почему мы выбираем работу исключительно с 18-каратным переработанным золотом и отслеживаемыми камнями.",
      },
      content: {
        en: "To wear a piece of jewelry is to wear a fragment of the earth. We believe that fragment should not carry the burden of ecological destruction. This is why we choose to work exclusively with 18k recycled gold. Gold is a miraculous substance; it can be melted, refined, and recast indefinitely without losing its purity or strength.\n\nBy sourcing gold that is already in circulation, we bypass the heavy environmental footprint of mining. We treat our materials with a deep reverence, recognizing that the beauty of a modern heirloom should reside not just in its appearance, but in its history. From studio floor sweepings to antique coins, every grain of our gold is reborn as a clean canvas for your story.",
        ka: "სამკაულის ტარება ნიშნავს დედამიწის ფრაგმენტის ტარებას. ჩვენ გვჯერა, რომ ეს ფრაგმენტი არ უნდა ატარებდეს ეკოლოგიური განადგურების ტვირთს. სწორედ ამიტომ ვირჩევთ მუშაობას ექსკლუზიურად 18კ გადამუშავებულ ოქროზე. ოქრო საოცარი ნივთიერებაა; მისი დნობა, გაწმენდა და ხელახალი ფორმირება შესაძლებელია უსასრულოდ, სიძლიერისა და სისუფთავის დაკარგვის გარეშე.\n\nუკვე ბრუნვაში არსებული ოქროს გამოყენებით ჩვენ თავიდან ვიცილებთ მოპოვებით გამოწვეულ ეკოლოგიურ ზიანს. ჩვენს მასალებს დიდი პატივისცემით ვეპყრობით, რადგან თანამედროვე საგვარეულო ნივთის სილამაზე არა მხოლოდ მის იერში, არამედ მის წარმომავლობაში უნდა იყოს.",
        ru: "Носить украшение — значит носить фрагмент земли. Мы верим, что этот фрагмент не должен нести бремя экологического разрушения. Вот почему мы работаем исключительно с 18-каратным переработанным золотом. Золото — удивительное вещество; его можно плавить, очищать и отливать заново бесконечно без потери чистоты или прочности.\n\nИспользуя золото, которое уже находится в обращении, мы избегаем тяжелого экологического следа добычи. Мы относимся к нашим материалам с глубоким почтением, понимая, что красота современной реликвии должна заключаться не только в ее внешнем виде, но и в ее истории."
      },
      coverImage: "/assets/story.jpg",
      status: "published",
      authorId: "usr-admin",
      publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "post-3",
      title: {
        en: "A Guide to Modern Heirloom Care",
        ka: "თანამედროვე საგვარეულო ნივთების მოვლის გზამკვლევი",
        ru: "Руководство по уходу за современными реликвиями",
      },
      slug: "modern-heirloom-care",
      excerpt: {
        en: "Preserve the luster of your fine jewelry for generations with our conscious care notes.",
        ka: "შეინარჩუნეთ თქვენი სამკაულების ბზინვარება თაობებისთვის ჩვენი მოვლის რჩევებით.",
        ru: "Сохраните блеск ваших украшений на поколения вперед с нашими советами по осознанному уходу.",
      },
      content: {
        en: "Fine jewelry is resilient, yet it is also a quiet chronicle of your daily life. Over time, it gathers dust, natural oils from the skin, and elements from the atmosphere. To ensure your heirlooms carry their luster for generations, simple and conscious habits are key.\n\nAvoid wearing your jewelry during heavy exercise, swimming in chlorinated pools, or applying perfumes and lotions directly onto the pieces. Clean your gold and gemstones gently with warm, soapy water and a soft-bristled brush, then dry them with a soft lint-free cloth. When not worn, keep your pieces stored separately in their original soft pouches or a lined jewelry box to prevent scratching. Treat your jewelry with care, and it will remain a bright companion for a lifetime.",
        ka: "ძვირფასი სამკაულები გამძლეა, მაგრამ ისინი ასევე თქვენი ყოველდღიური ცხოვრების ჩუმ მემატიანეს წარმოადგენენ. დროთა განმავლობაში მათზე გროვდება მტვერი, კანის ბუნებრივი ცხიმები და ჰაერის ნაწილაკები. იმისათვის, რომ თქვენმა საგვარეულო ნივთებმა თაობები გაძლონ, რამდენიმე მარტივი ჩვევაა საჭირო.\n\nმოერიდეთ სამკაულების ტარებას ვარჯიშისას, ქლორირებულ აუზში ბანაობისას, ან პარფიუმერიის პირდაპირ შესხურებას. გაწმინდეთ თბილი საპნიანი წყლით და რბილი ჯაგრისით, შემდეგ კი გაამშრალეთ რბილი ტილოთი. როდესაც არ ატარებთ, შეინახეთ ცალკეულ რბილ პარკებში ნაკაწრების თავიდან ასაცილებლად.",
        ru: "Изысканные украшения долговечны, но они также являются тихой хроникой вашей повседневной жизни. Со временем на них скапливается пыль, кожные масла и атмосферные частицы. Чтобы ваши реликвии сохраняли свой блеск для будущих поколений, важны простые и осознанные привычки.\n\nИзбегайте ношения украшений во время тренировок, купания в хлорированном бассейне или нанесения духов непосредственно на изделия. Очищайте золото и камни теплой мыльной водой и мягкой щеткой, затем насухо протирайте мягкой тканью. Храните изделия отдельно в их оригинальных мешочках, чтобы предотвратить появление царапин."
      },
      coverImage: "/assets/craft.jpg",
      status: "published",
      authorId: "usr-admin",
      publishedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: now,
      updatedAt: now,
    }
  ];

  return {
    users: initialUsers,
    products: initialProducts,
    variants: initialVariants,
    images: initialImages,
    collections: initialCollections,
    orders: initialOrders,
    customers: initialCustomers,
    contentBlocks: initialContentBlocks,
    blogPosts: initialBlogPosts,
    subscribers: [],
    auditLogs: [
      {
        id: "log-1",
        userId: "system",
        userName: "System Seeder",
        action: "INITIALIZE_DATABASE",
        entity: "Database",
        entityId: "all",
        details: "Database created and default store configuration seeded.",
        createdAt: now,
      }
    ]
  };
}

// --- Active CRUD Database Operations ---

export const db = {
  // Read database state
  getRaw(): DbSchema {
    return loadDatabase();
  },

  // Save database state
  saveRaw(data: DbSchema) {
    saveDatabase(data);
  },

  // Audit Logger
  log(userId: string, userName: string, action: string, entity: string, entityId: string, details: string) {
    const data = loadDatabase();
    const logItem: AuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      userId,
      userName,
      action,
      entity,
      entityId,
      details,
      createdAt: new Date().toISOString(),
    };
    data.auditLogs.unshift(logItem); // Add to beginning
    // Keep logs size reasonable
    if (data.auditLogs.length > 500) {
      data.auditLogs = data.auditLogs.slice(0, 500);
    }
    saveDatabase(data);
  },

  // --- Users ---
  getUsers(): User[] {
    return loadDatabase().users;
  },
  getUserByEmail(email: string): User | undefined {
    return this.getUsers().find((u) => u.email.toLowerCase() === email.toLowerCase());
  },
  verifyPassword(user: User, plain: string): boolean {
    return user.passwordHash === simpleHash(plain);
  },

  // --- Products ---
  getProducts(): Product[] {
    return loadDatabase().products.filter((p) => p.status !== "archived");
  },
  getProductById(id: string): Product | undefined {
    return this.getProducts().find((p) => p.id === id);
  },
  createProduct(userId: string, userName: string, product: Omit<Product, "createdAt" | "updatedAt">): Product {
    const data = loadDatabase();
    const newProduct: Product = {
      ...product,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    data.products.push(newProduct);
    saveDatabase(data);
    this.log(userId, userName, "CREATE_PRODUCT", "Product", newProduct.id, `Product "${newProduct.name.en}" created.`);
    return newProduct;
  },
  updateProduct(userId: string, userName: string, id: string, product: Partial<Omit<Product, "id" | "createdAt" | "updatedAt">>): Product | undefined {
    const data = loadDatabase();
    const idx = data.products.findIndex((p) => p.id === id);
    if (idx === -1) return undefined;
    
    const updated: Product = {
      ...data.products[idx],
      ...product,
      updatedAt: new Date().toISOString(),
    };
    data.products[idx] = updated;
    saveDatabase(data);
    this.log(userId, userName, "UPDATE_PRODUCT", "Product", id, `Product "${updated.name.en}" updated.`);
    return updated;
  },
  archiveProduct(userId: string, userName: string, id: string): boolean {
    const product = this.getProductById(id);
    if (!product) return false;
    this.updateProduct(userId, userName, id, { status: "archived" });
    this.log(userId, userName, "ARCHIVE_PRODUCT", "Product", id, `Product "${product.name.en}" archived.`);
    return true;
  },

  // --- Variants ---
  getVariantsByProductId(productId: string): ProductVariant[] {
    return loadDatabase().variants.filter((v) => v.productId === productId);
  },
  updateVariantInventory(variantId: string, quantityChange: number): boolean {
    const data = loadDatabase();
    const idx = data.variants.findIndex((v) => v.id === variantId);
    if (idx === -1) return false;

    const variant = data.variants[idx];
    variant.inventoryQuantity = Math.max(0, variant.inventoryQuantity + quantityChange);
    variant.updatedAt = new Date().toISOString();
    saveDatabase(data);
    return true;
  },
  setVariants(userId: string, userName: string, productId: string, variants: ProductVariant[]) {
    const data = loadDatabase();
    // Remove old variants for product
    data.variants = data.variants.filter((v) => v.productId !== productId);
    // Add new ones
    data.variants.push(...variants);
    saveDatabase(data);
    this.log(userId, userName, "SYNC_VARIANTS", "Product", productId, `Variants synchronized for product ${productId}.`);
  },

  // --- Collections ---
  getCollections(): Collection[] {
    return loadDatabase().collections;
  },
  getCollectionById(id: string): Collection | undefined {
    return this.getCollections().find((c) => c.id === id);
  },
  createCollection(userId: string, userName: string, collection: Collection): Collection {
    const data = loadDatabase();
    data.collections.push(collection);
    saveDatabase(data);
    this.log(userId, userName, "CREATE_COLLECTION", "Collection", collection.id, `Collection "${collection.name.en}" created.`);
    return collection;
  },
  updateCollection(userId: string, userName: string, id: string, fields: Partial<Omit<Collection, "id" | "createdAt">>): Collection | undefined {
    const data = loadDatabase();
    const idx = data.collections.findIndex((c) => c.id === id);
    if (idx === -1) return undefined;

    const updated = {
      ...data.collections[idx],
      ...fields,
    };
    data.collections[idx] = updated;
    saveDatabase(data);
    this.log(userId, userName, "UPDATE_COLLECTION", "Collection", id, `Collection "${updated.name.en}" updated.`);
    return updated;
  },

  // --- Orders ---
  getOrders(): Order[] {
    return loadDatabase().orders;
  },
  getOrderById(id: string): Order | undefined {
    return this.getOrders().find((o) => o.id === id);
  },
  createOrder(order: Omit<Order, "id" | "createdAt" | "updatedAt">): Order {
    const data = loadDatabase();
    
    // Generate order ID
    const nextNum = 1000 + data.orders.length + 1;
    const newOrder: Order = {
      ...order,
      id: `ord-${nextNum}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Deduct variant inventories
    newOrder.items.forEach((item) => {
      const vIdx = data.variants.findIndex((v) => v.id === item.variantId);
      if (vIdx !== -1) {
        data.variants[vIdx].inventoryQuantity = Math.max(0, data.variants[vIdx].inventoryQuantity - item.quantity);
        data.variants[vIdx].updatedAt = new Date().toISOString();
      }
    });

    // Handle customer linking & LTV update
    let customer = data.customers.find((c) => c.email.toLowerCase() === order.customerId.toLowerCase());
    if (!customer) {
      // Create customer profile automatically
      customer = {
        id: `cust-${Date.now()}`,
        email: order.customerId,
        firstName: order.shippingAddress.firstName,
        lastName: order.shippingAddress.lastName,
        phone: order.shippingAddress.phone,
        acceptsMarketing: false,
        lifetimeValue: newOrder.totalAmount,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      data.customers.push(customer);
    } else {
      customer.lifetimeValue += newOrder.totalAmount;
      customer.updatedAt = new Date().toISOString();
      // Update indices
      const cIdx = data.customers.findIndex((c) => c.id === customer!.id);
      if (cIdx !== -1) data.customers[cIdx] = customer;
    }

    newOrder.customerId = customer.id; // Map customerId correctly to profile ID
    data.orders.unshift(newOrder); // Add new order to start
    saveDatabase(data);

    this.log("checkout", "Customer Checkout", "CREATE_ORDER", "Order", newOrder.id, `Order for $${newOrder.totalAmount} created by customer ${customer.email}.`);
    return newOrder;
  },
  updateOrder(userId: string, userName: string, id: string, fields: Partial<Omit<Order, "id" | "createdAt" | "updatedAt">>): Order | undefined {
    const data = loadDatabase();
    const idx = data.orders.findIndex((o) => o.id === id);
    if (idx === -1) return undefined;

    const original = data.orders[idx];
    const updated: Order = {
      ...original,
      ...fields,
      updatedAt: new Date().toISOString(),
    };

    // Handle inventory restitution if cancelled or refunded
    if (fields.status === "cancelled" && original.status !== "cancelled") {
      updated.items.forEach((item) => {
        const vIdx = data.variants.findIndex((v) => v.id === item.variantId);
        if (vIdx !== -1) {
          data.variants[vIdx].inventoryQuantity += item.quantity;
          data.variants[vIdx].updatedAt = new Date().toISOString();
        }
      });
    }

    data.orders[idx] = updated;
    saveDatabase(data);
    this.log(userId, userName, "UPDATE_ORDER", "Order", id, `Order status updated to ${updated.status}.`);
    return updated;
  },

  // --- Customers ---
  getCustomers(): Customer[] {
    return loadDatabase().customers;
  },
  getCustomerById(id: string): Customer | undefined {
    return this.getCustomers().find((c) => c.id === id);
  },

  // --- CMS ContentBlocks ---
  getContentBlocks(): ContentBlock[] {
    return loadDatabase().contentBlocks;
  },
  getContentBlockByKey(key: string): ContentBlock | undefined {
    return this.getContentBlocks().find((b) => b.sectionKey === key);
  },
  saveContentBlock(userId: string, userName: string, key: string, data: any): ContentBlock {
    const dbDataList = loadDatabase();
    let idx = dbDataList.contentBlocks.findIndex((b) => b.sectionKey === key);
    
    const block: ContentBlock = {
      id: idx !== -1 ? dbDataList.contentBlocks[idx].id : `cms-${key}`,
      sectionKey: key,
      data,
      updatedAt: new Date().toISOString(),
    };

    if (idx !== -1) {
      dbDataList.contentBlocks[idx] = block;
    } else {
      dbDataList.contentBlocks.push(block);
    }
    
    saveDatabase(dbDataList);
    this.log(userId, userName, "SAVE_CONTENT_BLOCK", "ContentBlock", block.id, `CMS block "${key}" modified.`);
    return block;
  },

  // --- Newsletter Subscribers ---
  getSubscribers(): NewsletterSubscriber[] {
    return loadDatabase().subscribers;
  },
  subscribeEmail(email: string): boolean {
    const data = loadDatabase();
    const existing = data.subscribers.find((s) => s.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      if (existing.status === "unsubscribed") {
        existing.status = "subscribed";
        saveDatabase(data);
        return true;
      }
      return false; // Already subscribed
    }

    data.subscribers.push({
      id: `sub-${Date.now()}`,
      email: email.toLowerCase(),
      status: "subscribed",
      createdAt: new Date().toISOString(),
    });
    saveDatabase(data);
    return true;
  },

  // --- Blog Posts ---
  getBlogPosts(): BlogPost[] {
    return loadDatabase().blogPosts.filter((p) => p.status === "published");
  },
  getBlogPostBySlug(slug: string): BlogPost | undefined {
    return loadDatabase().blogPosts.find((p) => p.slug === slug);
  },

  // --- Audit Logs ---
  getAuditLogs(): AuditLog[] {
    return loadDatabase().auditLogs;
  }
};
