import img01 from "./assets/images/creamy_root_01_1779683013420.png";
import img02 from "./assets/images/mocha_volpony_02_1779683028537.png";
import img03 from "./assets/images/iced_power_03_1779683047427.png";
import img04 from "./assets/images/sweet_temptation_04_1779683061577.png";
import img05 from "./assets/images/choco_ice_premium_05_1779683074415.png";
import img06 from "./assets/images/chocomax_creamy_06_1779683094498.png";
import img07 from "./assets/images/peanut_coffee_07_1779683110014.png";
import img08 from "./assets/images/vanilla_cream_08_1779683124011.png";
import img09 from "./assets/images/coconut_choco_09_1779683139085.png";
import heroImg from "./assets/images/volpony_hero_1779475744046.png";

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
    image: img01,
    category: "quente"
  },
  {
    id: 2,
    numberStr: "02",
    name: "Mocha Volpony",
    description: "Café cremoso com chocolate e leite. Equilibrado e marcante.",
    price: 6.00,
    volume: "120 ml",
    image: img02,
    category: "quente"
  },
  {
    id: 3,
    numberStr: "03",
    name: "Gelado Power",
    description: "Café gelado cremoso, refrescante e perfeito para qualquer hora.",
    price: 7.00,
    volume: "120 ml",
    image: img03,
    category: "gelado"
  },
  {
    id: 4,
    numberStr: "04",
    name: "Doce Tentação",
    description: "Café cremoso com leite condensado. Doce na medida certa.",
    price: 7.00,
    volume: "120 ml",
    image: img04,
    category: "quente"
  },
  {
    id: 5,
    numberStr: "05",
    name: "Choco Ice Premium",
    description: "Café, chocolate e gelo. Uma experiência gelada e intensa.",
    price: 8.00,
    volume: "120 ml",
    image: img05,
    category: "gelado"
  },
  {
    id: 6,
    numberStr: "06",
    name: "ChocoMax Cremoso",
    description: "Café cremoso com achocolatado. Simples e irresistível.",
    price: 6.00,
    volume: "120 ml",
    image: img06,
    category: "quente"
  },
  {
    id: 7,
    numberStr: "07",
    name: "Café AmendoPower",
    description: "Café cremoso com paçoca. Sabor marcante e bem brasileiro.",
    price: 8.00,
    volume: "120 ml",
    image: img07,
    category: "especial"
  },
  {
    id: 8,
    numberStr: "08",
    name: "Café Vanilla Cream",
    description: "Café cremoso com baunilha. Suave, aromático e sofisticado.",
    price: 7.00,
    volume: "120 ml",
    image: img08,
    category: "especial"
  },
  {
    id: 9,
    numberStr: "09",
    name: "CocoChoco Café",
    description: "Café cremoso com chocolate e leite de coco. Tropical e delicioso.",
    price: 10.00,
    volume: "120 ml",
    image: img09,
    category: "especial"
  }
];

export const HERO_IMAGE = heroImg;

export interface CartItem {
  product: Product;
  quantity: number;
}
