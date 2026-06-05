import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";

export type Product = {
  id: string;
  name: string;
  category: "Rings" | "Necklaces" | "Earrings" | "Bracelets";
  price: number;
  image: string;
  material: string;
  story: string;
};

export const products: Product[] = [
  {
    id: "aurelia-signet",
    name: "Aurelia Signet Ring",
    category: "Rings",
    price: 420,
    image: product1,
    material: "18k recycled gold vermeil",
    story:
      "Inspired by Roman seals, the Aurelia signet is hand-finished to carry a story only its wearer knows.",
  },
  {
    id: "soleil-pendant",
    name: "Soleil Diamond Pendant",
    category: "Necklaces",
    price: 560,
    image: product2,
    material: "14k solid gold, conflict-free diamond",
    story:
      "A single luminous point — for the moments worth keeping close to the heart.",
  },
  {
    id: "lumen-hoops",
    name: "Lumen Petite Hoops",
    category: "Earrings",
    price: 285,
    image: product3,
    material: "18k recycled gold vermeil",
    story:
      "Weightless, polished, endlessly wearable. The hoop, refined to its essential gesture.",
  },
  {
    id: "marée-bangle",
    name: "Marée Pearl Bangle",
    category: "Bracelets",
    price: 340,
    image: product4,
    material: "14k gold-filled, freshwater pearl",
    story:
      "A single pearl drifts along a fine gold tide — quiet, luminous, lasting.",
  },
];

export const getProduct = (id: string) => products.find((p) => p.id === id);
