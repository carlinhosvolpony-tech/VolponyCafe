export interface Product {
  id: number;
  numberStr: string;
  name: string;
  description: string;
  price: number;
  volume: string;
  image: string;
  category: 'quente' | 'gelado' | 'especial';
}

export const PRODUCTS: Product[] = [
  {
    id: 1,
    numberStr: "01",
    name: "Café Cremoso Raiz",
    description: "Café cremoso com leite quente e toque de doçura.",
    price: 5.00,
    volume: "120 ml",
    image: "/src/assets/images/creamy_coffee_1779475808042.png",
    category: "quente"
  },
  {
    id: 2,
    numberStr: "02",
    name: "Mocha Volpony",
    description: "Café cremoso com chocolate e leite. Equilibrado e marcante.",
    price: 6.00,
    volume: "120 ml",
    image: "/src/assets/images/mocha_coffee_1779475780524.png",
    category: "quente"
  },
  {
    id: 3,
    numberStr: "03",
    name: "Gelado Power",
    description: "Café gelado cremoso, refrescante e perfeito para qualquer hora.",
    price: 7.00,
    volume: "120 ml",
    image: "/src/assets/images/iced_coffee_1779475763279.png",
    category: "gelado"
  },
  {
    id: 4,
    numberStr: "04",
    name: "Doce Tentação",
    description: "Café cremoso com leite condensado. Doce na medida certa.",
    price: 7.00,
    volume: "120 ml",
    image: "/src/assets/images/creamy_coffee_1779475808042.png",
    category: "quente"
  },
  {
    id: 5,
    numberStr: "05",
    name: "Choco Ice Premium",
    description: "Café, chocolate e gelo. Uma experiência gelada e intensa.",
    price: 8.00,
    volume: "120 ml",
    image: "/src/assets/images/iced_coffee_1779475763279.png",
    category: "gelado"
  },
  {
    id: 6,
    numberStr: "06",
    name: "ChocoMax Cremoso",
    description: "Café cremoso com achocolatado. Simples e irresistível.",
    price: 6.00,
    volume: "120 ml",
    image: "/src/assets/images/mocha_coffee_1779475780524.png",
    category: "quente"
  },
  {
    id: 7,
    numberStr: "07",
    name: "Café AmendoPower",
    description: "Café cremoso com paçoca. Sabor marcante e bem brasileiro.",
    price: 8.00,
    volume: "120 ml",
    image: "/src/assets/images/creamy_coffee_1779475808042.png",
    category: "especial"
  },
  {
    id: 8,
    numberStr: "08",
    name: "Café Vanilla Cream",
    description: "Café cremoso com baunilha. Suave, aromático e sofisticado.",
    price: 7.00,
    volume: "120 ml",
    image: "/src/assets/images/creamy_coffee_1779475808042.png",
    category: "especial"
  },
  {
    id: 9,
    numberStr: "09",
    name: "CocoChoco Café",
    description: "Café cremoso com chocolate e leite de coco. Tropical e delicioso.",
    price: 10.00,
    volume: "120 ml",
    image: "/src/assets/images/mocha_coffee_1779475780524.png",
    category: "especial"
  }
];

export const HERO_IMAGE = "/src/assets/images/volpony_hero_1779475744046.png";

export interface CartItem {
  product: Product;
  quantity: number;
}
