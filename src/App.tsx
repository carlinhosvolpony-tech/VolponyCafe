import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { 
  Coffee, 
  ShoppingBag, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowRight, 
  CreditCard, 
  ChevronRight, 
  X, 
  Sparkles, 
  Check, 
  Clipboard, 
  Send, 
  MapPin, 
  Search, 
  Phone, 
  Clock,  
  Share2,
  Lock,
  Wallet,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { PRODUCTS, HERO_IMAGE, Product, CartItem } from "./data";

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'quente' | 'gelado' | 'especial'>('all');
  const [search, setSearch] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [step, setStep] = useState<'browse' | 'checkout' | 'success'>('browse');

  // Checkout Form States
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState<'local' | 'takeaway' | 'delivery'>('local');
  const [tableNumber, setTableNumber] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'cash'>('pix');
  const [needsChange, setNeedsChange] = useState<boolean>(false);
  const [changeValue, setChangeValue] = useState("");
  
  // Card states
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardError, setCardError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Order success info
  const [orderId, setOrderId] = useState("");
  const [orderTotal, setOrderTotal] = useState(0);
  const [orderItemsList, setOrderItemsList] = useState<CartItem[]>([]);
  
  // PIX simulated payment status
  const [pixPaid, setPixPaid] = useState(false);
  const [pixTimeLeft, setPixTimeLeft] = useState(180); // 3 minutes counter
  const [copiedPix, setCopiedPix] = useState(false);
  const [copiedKeyPhone, setCopiedKeyPhone] = useState(false);
  const [copiedKeyEmail, setCopiedKeyEmail] = useState(false);

  // Filter products by search & type
  const filteredProducts = PRODUCTS.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase()) || 
                          product.description.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' ? true : product.category === filter;
    return matchesSearch && matchesFilter;
  });

  const cartTotal = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  const totalItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

  // Reset PIX countdown when step shifts
  useEffect(() => {
    let timer: any;
    if (step === 'checkout' && paymentMethod === 'pix' && !pixPaid) {
      setPixTimeLeft(180);
      setPixPaid(false);
      timer = setInterval(() => {
        setPixTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, paymentMethod, pixPaid]);

  // Simulate payment confirmation after copy or 15s wait
  useEffect(() => {
    let confirmTimer: any;
    if (step === 'checkout' && paymentMethod === 'pix' && !pixPaid) {
      confirmTimer = setTimeout(() => {
        setPixPaid(true);
      }, 12000); // confirmo automático em 12s para experiência incrível
    }
    return () => clearTimeout(confirmTimer);
  }, [step, paymentMethod, pixPaid]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const idx = prev.findIndex(item => item.product.id === product.id);
      if (idx > -1) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + 1 };
        return next;
      }
      return [...prev, { product, quantity: 1 }];
    });
    // Visual bounce effects or toast would trigger here
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => {
      const idx = prev.findIndex(item => item.product.id === productId);
      if (idx > -1) {
        const next = [...prev];
        if (next[idx].quantity <= 1) {
          return next.filter(item => item.product.id !== productId);
        } else {
          next[idx] = { ...next[idx], quantity: next[idx].quantity - 1 };
          return next;
        }
      }
      return prev;
    });
  };

  const deleteFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const handleCardNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    const formatted = value.match(/.{1,4}/g)?.join(" ") || value;
    setCardNumber(formatted.slice(0, 19));
  };

  const handleCardExpiry = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 2) {
      value = value.slice(0, 2) + "/" + value.slice(2, 4);
    }
    setCardExpiry(value.slice(0, 5));
  };

  const handleCardCvv = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    setCardCvv(value.slice(0, 3));
  };

  const copyPixCode = () => {
    const code = "00020101021226930014br.gov.bcb.pix2571pix.volponycafe.com.br/qr/pay-9bdbeb54-2695-4c1e-ac4d-3daa0eab46625204000053039865405" + cartTotal.toFixed(2) + "5802BR5916Volpony Cafe Ltda6009Sao Luis62070503***6304ECE3";
    navigator.clipboard.writeText(code);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 2500);

    // Simulate instant pay on copy
    setTimeout(() => {
      setPixPaid(true);
    }, 2500);
  };

  const copyKeyPhone = () => {
    navigator.clipboard.writeText("98984595785");
    setCopiedKeyPhone(true);
    setTimeout(() => setCopiedKeyPhone(false), 2500);
    // Simulate instant pay on copy
    setTimeout(() => {
      setPixPaid(true);
    }, 2500);
  };

  const copyKeyEmail = () => {
    navigator.clipboard.writeText("carlinhosvolpony@gmail.com");
    setCopiedKeyEmail(true);
    setTimeout(() => setCopiedKeyEmail(false), 2500);
    // Simulate instant pay on copy
    setTimeout(() => {
      setPixPaid(true);
    }, 2500);
  };

  const submitOrder = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setCardError("Por favor, preencha todos os dados de contato.");
      return;
    }
    
    if (deliveryMethod === 'delivery' && !address.trim()) {
      setCardError("Por favor, informe o endereço de entrega.");
      return;
    }
    if (deliveryMethod === 'local' && !tableNumber.trim()) {
      setCardError("Por favor, informe o número da mesa.");
      return;
    }

    if (paymentMethod === 'cash') {
      if (needsChange) {
        const numericChange = parseFloat(changeValue.replace(",", "."));
        if (!changeValue.trim() || isNaN(numericChange) || numericChange < cartTotal) {
          setCardError(`O valor para troco deve ser maior ou igual ao total de R$ ${cartTotal.toFixed(2)}.`);
          return;
        }
      }
      setCardError("");
      setIsProcessing(true);

      // Simulate network request/preparation confirmation
      setTimeout(() => {
        setIsProcessing(false);
        const randomId = "VLP-" + Math.floor(100000 + Math.random() * 900000);
        setOrderId(randomId);
        setOrderTotal(cartTotal);
        setOrderItemsList([...cart]);
        setStep('success');
        setCart([]);
      }, 1500);
    } else {
      // For PIX, click confirms simulation if already marked as paid, otherwise wait
      if (!pixPaid) {
        setCardError("Gere o código PIX acima e realize o pagamento para continuar.");
        return;
      }
      setCardError("");
      const randomId = "VLP-" + Math.floor(100000 + Math.random() * 900000);
      setOrderId(randomId);
      setOrderTotal(cartTotal);
      setOrderItemsList([...cart]);
      setStep('success');
      setCart([]);
    }
  };

  // Pre-generate WhatsApp message
  const getWhatsAppLink = () => {
    const formattedPhone = "5598984595785"; // (98) 98459-5785
    let message = `*☕ VOLPONY CAFÉ - PEDIDO CONFIRMADO!*\n`;
    message += `*Pedido:* ${orderId}\n`;
    message += `*Cliente:* ${name}\n`;
    message += `*WhatsApp:* ${phone}\n`;
    message += `*Método:* ${
      deliveryMethod === 'local' ? `Mesa #${tableNumber}` : 
      deliveryMethod === 'takeaway' ? 'Retirada no Balcão' : 'Entrega em Casa'
    }\n`;
    if (deliveryMethod === 'delivery') {
      message += `*Endereço:* ${address}\n`;
    }
    message += `*Pagamento:* ${paymentMethod === 'pix' ? 'PIX' : 'Dinheiro no ato da entrega/consumo'}\n`;
    if (paymentMethod === 'cash') {
      message += needsChange 
        ? `*Precisa de troco para:* R$ ${parseFloat(changeValue.replace(",", ".")).toFixed(2)} (Troco de R$ ${(parseFloat(changeValue.replace(",", ".")) - cartTotal).toFixed(2)})\n`
        : `*Precisa de troco:* Não, dinheiro trocado.\n`;
    }
    message += `\n*ITENS:* \n`;
    orderItemsList.forEach(item => {
      message += `- ${item.quantity}x ${item.product.name} (120 ml/cada) - R$ ${(item.product.price * item.quantity).toFixed(2)}\n`;
    });
    message += `\n*TOTAL: R$ ${orderTotal.toFixed(2)}*\n\n`;
    message += `Obrigado pela preferência! Aguardando a preparação do meu café especial. ✨`;

    return `https://api.whatsapp.com/send?phone=${formattedPhone}&text=${encodeURIComponent(message)}`;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="min-h-screen marble-bg text-amber-50 selection:bg-gold-500 selection:text-black">
      
      {/* Dynamic Header */}
      <nav id="navbar" className="sticky top-0 z-40 bg-zinc-950/90 border-b border-gold-900/40 backdrop-blur-md px-4 py-3 md:px-8 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 border border-gold-500/30 rounded-full bg-gradient-to-br from-neutral-900 to-black">
            <Coffee className="h-6 w-6 text-gold-400" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-serif font-bold tracking-wider text-amber-100 uppercase">
              Volpony <span className="text-gold-400">Café</span>
            </h1>
            <p className="hidden md:block text-[9px] font-mono tracking-widest text-gold-500 uppercase">
              Cafés Especiais • Cremosos • Inesquecíveis
            </p>
          </div>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-zinc-850 bg-neutral-900/40 text-[11px] text-zinc-300 hover:border-gold-500/20 transition-all duration-300">
            <MapPin className="h-3.5 w-3.5 text-gold-500" />
            <span className="font-sans">Rua do Castelo, nº 17, Centro, Arari - MA</span>
          </div>
          <div className="md:hidden flex items-center p-2 rounded-full border border-zinc-800 bg-neutral-950 text-gold-500 cursor-help" title="Rua do Castelo, nº 17, Centro, Arari - MA">
            <MapPin className="h-4 w-4" />
          </div>
          <button 
            id="cart-toggle-btn"
            onClick={() => setIsCartOpen(true)}
            className="relative px-4 py-2 border border-gold-500/40 rounded-full flex items-center gap-2 bg-gradient-to-r from-gold-600/10 to-gold-600/20 hover:from-gold-600/20 hover:to-gold-600/40 text-gold-200 transition-all duration-300 active:scale-95 cursor-pointer shadow-lg shadow-gold-950/20"
          >
            <ShoppingBag className="h-4 w-4 text-gold-400" />
            <span className="text-xs font-semibold font-mono">{totalItemsCount}</span>
            <span className="hidden sm:inline text-xs font-mono">
              - R$ {cartTotal.toFixed(2)}
            </span>
            {totalItemsCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-gold-500"></span>
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* Hero Header */}
      <header id="hero" className="relative h-[280px] md:h-[420px] w-full overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-black/60 z-10" />
        <img 
          src={HERO_IMAGE} 
          alt="Banner de Volpony Café" 
          className="absolute inset-0 w-full h-full object-cover scale-105 filter brightness-110 contrast-105"
          referrerPolicy="no-referrer"
        />
        <div className="relative z-20 text-center max-w-2xl px-4 flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center"
          >
            {/* Visual Frame badge */}
            <div className="flex items-center gap-2 px-3 py-1 border border-gold-500/40 rounded-full bg-black/80 mb-4 animate-pulse">
              <Sparkles className="h-3 w-3 text-gold-400" />
              <span className="text-[10px] font-mono tracking-widest text-gold-300 uppercase">Cafés Premium de 120 ml</span>
              <Sparkles className="h-3 w-3 text-gold-400" />
            </div>

            <h2 className="text-3xl md:text-6xl font-serif font-extrabold tracking-widest text-amber-50 uppercase drop-shadow-xl select-none">
              CARDÁPIO <span className="text-gold-400 block sm:inline font-normal">DIGITAL</span>
            </h2>

            <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-gold-500 to-transparent my-3 md:my-4" />

            <p className="text-zinc-300 text-xs md:text-base font-light tracking-wide max-w-lg">
              Feito com ingredientes selecionados para proporcionar momentos inesquecíveis. Faça seu pedido online e pague com praticidade.
            </p>
          </motion.div>
        </div>
      </header>

      {/* Main Browse System */}
      <main className="max-w-7xl mx-auto px-4 py-8 md:py-16">
        
        {step === 'browse' ? (
          <div>
            {/* Custom Filters Menu and Search Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-zinc-900">
              
              {/* Category buttons */}
              <div id="filter-wrapper" className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                {[
                  { id: 'all', label: 'Tudo' },
                  { id: 'quente', label: 'Cremosos / Quentes' },
                  { id: 'gelado', label: 'Gelados Refrescantes' },
                  { id: 'especial', label: 'Especiais' }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setFilter(cat.id as any)}
                    className={`px-4 py-2 rounded-full border text-xs font-semibold tracking-wider transition-all duration-300 whitespace-nowrap cursor-pointer hover:border-gold-400 ${
                      filter === cat.id 
                        ? 'bg-gold-500 text-neutral-950 border-gold-400 shadow-md shadow-gold-500/15'
                        : 'bg-zinc-950 text-zinc-400 border-zinc-800'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Elegant Search Bar */}
              <div className="relative w-full md:w-80">
                <input 
                  type="text"
                  placeholder="Pesquisar no cardápio..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-full px-4 py-2 pl-10 text-xs focus:ring-1 focus:ring-gold-500 focus:outline-none text-amber-50"
                />
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-500" />
                {search && (
                  <button 
                    onClick={() => setSearch("")} 
                    className="absolute right-3 top-2.5 hover:text-white text-zinc-500"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>

            </div>

            {/* Coffee Catalog Grid */}
            {filteredProducts.length === 0 ? (
              <div className="py-20 text-center flex flex-col items-center justify-center">
                <Coffee className="h-12 w-12 text-zinc-700 mb-3" />
                <p className="text-zinc-500 text-sm">Nenhum café especial encontrado para sua busca.</p>
                <button 
                  onClick={() => { setSearch(""); setFilter('all'); }} 
                  className="mt-4 text-xs text-gold-400 hover:underline hover:text-gold-300"
                >
                  Limpar filtros
                </button>
              </div>
            ) : (
              <div id="coffee-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {filteredProducts.map((coffee) => (
                  <motion.div
                    key={coffee.id}
                    id={`coffee-card-${coffee.id}`}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="group relative bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden hover:border-gold-600/30 transition-all duration-500 flex flex-col shadow-xl shadow-black/40"
                  >
                    {/* Top index decoration */}
                    <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 px-2 py-1 rounded-md bg-zinc-950/80 border border-gold-900/30">
                      <span className="font-serif font-bold text-[10px] text-gold-400">{coffee.numberStr}</span>
                    </div>

                    <div className="absolute top-3 right-3 z-20 px-2 py-0.5 rounded-full bg-gold-600/90 text-zinc-950 text-[10px] font-bold font-mono tracking-wider">
                      {coffee.volume}
                    </div>

                    {/* Image display */}
                    <div className="relative aspect-square overflow-hidden bg-neutral-900">
                      <img 
                        src={coffee.image} 
                        alt={coffee.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 filter brightness-95"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-90" />
                    </div>

                    {/* Description & info panel */}
                    <div className="p-5 flex-1 flex flex-col justify-between relative mt-[-24px] bg-zinc-950 rounded-t-xl">
                      <div>
                        {/* Title & price */}
                        <div className="flex justify-between items-start gap-2 mb-2">
                          <h3 className="font-serif font-bold text-lg md:text-xl text-amber-100 group-hover:text-gold-300 transition-colors duration-300 leading-snug">
                            {coffee.name}
                          </h3>
                          <div className="text-right">
                            <span className="text-gold-400 font-bold font-mono text-lg block">
                              R$ {coffee.price.toFixed(2)}
                            </span>
                          </div>
                        </div>

                        <p className="text-zinc-400 text-xs leading-relaxed font-light mb-4 min-h-[40px]">
                          {coffee.description}
                        </p>
                      </div>

                      <div className="w-full pt-3 border-t border-zinc-900/60 flex items-center justify-between gap-3">
                        <span className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider">
                          {coffee.category === 'quente' ? '☕ Quente/Cremoso' : coffee.category === 'gelado' ? '❄️ Gelado' : '✨ Especialidade'}
                        </span>
                        
                        <button
                          onClick={() => addToCart(coffee)}
                          className="px-4 py-1.5 bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-zinc-950 text-xs font-bold rounded-lg transition-all duration-300 hover:translate-y-[-1px] cursor-pointer"
                        >
                          Comprar
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Premium details block */}
            <div className="mt-20 p-8 border border-gold-900/20 bg-gradient-to-br from-zinc-950 to-neutral-900/60 rounded-3xl text-center max-w-4xl mx-auto backdrop-blur-sm">
              <div className="flex justify-center mb-3">
                <span className="p-2 border border-gold-500/20 bg-black/40 rounded-full text-gold-400">
                  <Sparkles className="h-6 w-6" />
                </span>
              </div>
              <h4 className="font-serif font-bold text-2xl tracking-wider text-amber-100 mb-2 uppercase">PREMIUM QUALITY</h4>
              <p className="text-zinc-400 text-sm italic font-light max-w-lg mx-auto">
                "Nossos cafés contêm exatamente doses perfeitas de 120ml de puro creme e sabor expressivo. Feito com amor e paixão para tornar seus dias especiais."
              </p>
              <div className="mt-6 flex flex-col sm:flex-row justify-center items-center gap-6 text-xs text-zinc-500 font-mono">
                <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-gold-500" /> Preparo rápido</span>
                <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-gold-500" /> Atendimento Exclusivo</span>
                <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 text-gold-500" /> (98) 98459-5785</span>
              </div>
            </div>
          </div>
        ) : step === 'checkout' ? (
          
          /* Checkout Step */
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-5xl mx-auto"
          >
            {/* Form column */}
            <div className="lg:col-span-7 bg-zinc-950 border border-zinc-900 p-6 rounded-2xl">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-zinc-900">
                <button 
                  onClick={() => setStep('browse')}
                  className="text-gold-400 text-xs hover:underline flex items-center gap-1 cursor-pointer"
                >
                  &larr; Voltar
                </button>
                <span className="text-zinc-600">|</span>
                <h3 className="font-serif text-xl font-bold text-amber-100">Finalizar Compra</h3>
              </div>

              <form onSubmit={submitOrder} className="space-y-6 text-sm">
                
                {/* Contact data */}
                <div className="space-y-4">
                  <h4 className="font-serif font-bold text-base text-gold-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-400 inline-block"></span>
                    1. Dados de Contato
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-zinc-400 text-xs mb-1.5 font-mono">Nome Completo</label>
                      <input 
                        type="text" 
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ex: Carlos Volpony"
                        className="w-full bg-neutral-900 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-amber-50 focus:outline-none focus:border-gold-500"
                      />
                    </div>
                    <div>
                      <label className="block text-zinc-400 text-xs mb-1.5 font-mono">WhatsApp com DD</label>
                      <input 
                        type="tel" 
                        inputMode="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Ex: (98) 98459-5785"
                        className="w-full bg-neutral-900 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-amber-50 focus:outline-none focus:border-gold-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Delivery Method Choice */}
                <div className="space-y-4 pt-4 border-t border-zinc-900/55">
                  <h4 className="font-serif font-bold text-base text-gold-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-400 inline-block"></span>
                    2. Como deseja seu café?
                  </h4>
                  
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'local', label: 'Consumir na Mesa' },
                      { id: 'takeaway', label: 'Retirada no Balcão' },
                      { id: 'delivery', label: 'Receber em Casa' }
                    ].map((entry) => (
                      <button
                        key={entry.id}
                        type="button"
                        onClick={() => setDeliveryMethod(entry.id as any)}
                        className={`p-3 rounded-xl border text-xs font-semibold text-center flex flex-col items-center justify-center gap-1 transition-all duration-300 cursor-pointer ${
                          deliveryMethod === entry.id
                            ? 'border-gold-500 bg-gold-600/10 text-gold-200'
                            : 'border-zinc-800 bg-neutral-900 text-zinc-400'
                        }`}
                      >
                        <span className="font-medium text-xs text-center">{entry.label}</span>
                      </button>
                    ))}
                  </div>

                  {deliveryMethod === 'local' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                      <label className="block text-zinc-400 text-xs mb-1.5 font-mono">Número da sua Mesa</label>
                      <input 
                        type="number" 
                        inputMode="numeric"
                        required
                        value={tableNumber}
                        onChange={(e) => setTableNumber(e.target.value)}
                        placeholder="Ex: 5"
                        className="w-32 bg-neutral-900 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-amber-50 focus:outline-none focus:border-gold-500"
                      />
                    </motion.div>
                  )}

                  {deliveryMethod === 'delivery' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-3">
                      <div>
                        <label className="block text-zinc-400 text-xs mb-1.5 font-mono">Endereço de Entrega Completo</label>
                        <input 
                          type="text" 
                          required
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="Rua, Número, Bairro, Cidade - Uf"
                          className="w-full bg-neutral-900 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-amber-50 focus:outline-none focus:border-gold-500"
                        />
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Secure Checkout / Payment options */}
                <div className="space-y-4 pt-4 border-t border-zinc-900/55">
                  <h4 className="font-serif font-bold text-base text-gold-400 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold-400 inline-block"></span>
                      3. Forma de Pagamento
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-zinc-500 font-mono">
                      <Lock className="h-3 w-3 text-gold-500" /> Checkout seguro
                    </span>
                  </h4>

                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => { setPaymentMethod('pix'); setCardError(""); }}
                      className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all duration-300 cursor-pointer ${
                        paymentMethod === 'pix'
                          ? 'border-gold-400 bg-gold-500/5 text-gold-200'
                          : 'border-zinc-800 bg-neutral-900 text-zinc-500'
                      }`}
                    >
                      <Wallet className="h-5 w-5 text-gold-400" />
                      <div className="text-center">
                        <span className="block font-bold text-xs text-amber-100">PIX Instantâneo</span>
                        <span className="text-[10px] text-zinc-400">Chaves ou QR Code</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => { setPaymentMethod('cash'); setCardError(""); }}
                      className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all duration-300 cursor-pointer ${
                        paymentMethod === 'cash'
                          ? 'border-gold-400 bg-gold-500/5 text-gold-200'
                          : 'border-zinc-800 bg-neutral-900 text-zinc-500'
                      }`}
                    >
                      <CreditCard className="h-5 w-5 text-gold-400" />
                      <div className="text-center">
                        <span className="block font-bold text-xs text-amber-100 font-serif">Dinheiro Físico</span>
                        <span className="text-[10px] text-zinc-400">Pague no recebimento</span>
                      </div>
                    </button>
                  </div>

                  {paymentMethod === 'pix' && (
                    <motion.div 
                      key="pix-container"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="bg-neutral-900 border border-zinc-800/80 p-5 rounded-xl space-y-4 text-center flex flex-col items-center"
                    >
                      <div className="p-3 bg-white rounded-xl shadow-xl w-40 h-40 flex items-center justify-center">
                        {/* Static visual representation of QR code with Volpony branding */}
                        <div className="aspect-square w-32 relative bg-zinc-100 p-1 rounded-sm flex flex-col items-center justify-center border-2 border-zinc-950">
                          <div className="grid grid-cols-5 gap-1.5 w-full h-full opacity-90">
                            {[...Array(25)].map((_, i) => (
                              <div 
                                key={i} 
                                className={`rounded-sm ${
                                  (i % 3 === 0 || i % 7 === 0 || i % 4 === 1 || i < 5 || i > 20 || i % 5 === 0) 
                                    ? 'bg-zinc-950' 
                                    : 'bg-transparent'
                                }`}
                              />
                            ))}
                          </div>
                          {/* Centered Coffee logo in QR */}
                          <div className="absolute inset-0 m-auto w-8 h-8 rounded-full border border-gold-600 bg-zinc-950 flex items-center justify-center shadow-lg">
                            <Coffee className="h-4 w-4 text-gold-400 animate-pulse" />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1.5 max-w-sm">
                        <span className="inline-block text-[10px] font-mono tracking-widest text-gold-400 uppercase bg-gold-400/10 px-2.5 py-0.5 rounded-full">
                          Código válido por: {formatTime(pixTimeLeft)}
                        </span>
                        
                        {pixPaid ? (
                          <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold justify-center py-1">
                            <Check className="h-4 w-4 animate-bounce" /> Pagamento confirmado pelo Banco Central!
                          </div>
                        ) : (
                          <div className="text-zinc-400 text-[11px] font-light leading-snug">
                            Escaneie o código QR acima, copie a linha Pix "Copia e Cola" abaixo, ou use uma de nossas <strong>Chaves PIX oficiais</strong>:
                          </div>
                        )}
                      </div>

                      {/* Chaves PIX Oficiais Box */}
                      <div className="w-full max-w-sm space-y-2 border-y border-zinc-800/60 py-3">
                        <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 block text-left">Chaves PIX Oficiais do Volpony Café</span>
                        
                        {/* Celular */}
                        <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-black/40 border border-zinc-800/40 text-xs text-left">
                          <div>
                            <span className="text-[9px] text-zinc-500 font-mono uppercase block">Celular (WhatsApp)</span>
                            <span className="font-mono font-medium text-amber-100">(98) 98459-5785</span>
                          </div>
                          <button
                            type="button"
                            onClick={copyKeyPhone}
                            className="px-2.5 py-1 text-[10px] font-semibold border border-gold-500/30 rounded bg-gold-600/5 hover:bg-gold-600/15 text-gold-300 hover:text-white transition-all cursor-pointer"
                          >
                            {copiedKeyPhone ? 'Copiado!' : 'Copiar'}
                          </button>
                        </div>

                        {/* E-mail */}
                        <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-black/40 border border-zinc-800/40 text-xs text-left">
                          <div>
                            <span className="text-[9px] text-zinc-500 font-mono uppercase block">E-mail</span>
                            <span className="font-mono font-medium text-amber-100">carlinhosvolpony@gmail.com</span>
                          </div>
                          <button
                            type="button"
                            onClick={copyKeyEmail}
                            className="px-2.5 py-1 text-[10px] font-semibold border border-gold-500/30 rounded bg-gold-600/5 hover:bg-gold-600/15 text-gold-300 hover:text-white transition-all cursor-pointer"
                          >
                            {copiedKeyEmail ? 'Copiado!' : 'Copiar'}
                          </button>
                        </div>
                      </div>

                      <div className="w-full max-w-sm text-left">
                        <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 block mb-1">PIX Copia e Cola</span>
                      </div>

                      <div className="flex w-full items-center gap-2 max-w-sm">
                        <input 
                          type="text" 
                          readOnly 
                          value={"00020101021226930014br.gov.bcb.pix2571pix.volponycafe.com.br/qr/pay-9bdbeb54-2695-4c1e-ac4d-3daa0eab46625204000053039865405" + cartTotal.toFixed(2) + "5802BR5916Volpony Cafe Ltda6009Sao Luis62070503***6304ECE3"}
                          className="flex-1 bg-black text-[10px] font-mono text-zinc-400 py-2 px-3 border border-zinc-800 rounded-lg text-ellipsis overflow-hidden" 
                        />
                        <button 
                          type="button"
                          onClick={copyPixCode}
                          className="px-3.5 py-4 border border-gold-500 bg-gold-600/10 hover:bg-gold-600/20 text-gold-300 hover:text-white text-xs font-semibold rounded-lg flex items-center gap-1 cursor-pointer transition-all duration-300 whitespace-nowrap"
                        >
                          {copiedPix ? <Check className="h-3.5 w-3.5" /> : <Clipboard className="h-3.5 w-3.5" />}
                          {copiedPix ? 'Copiado!' : 'Copiar Código'}
                        </button>
                      </div>
                    </motion.div>
                  )}

                   {paymentMethod === 'cash' && (
                    <motion.div 
                      key="cash-container"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="bg-neutral-900 border border-zinc-800/60 p-5 rounded-xl space-y-4 text-left"
                    >
                      <div className="flex items-center gap-2 pb-1 border-b border-zinc-800/40">
                        <Wallet className="h-4 w-4 text-gold-400" />
                        <span className="text-xs font-serif font-bold text-amber-100 uppercase tracking-wide">Configurar Pagamento em Dinheiro</span>
                      </div>

                      <p className="text-zinc-400 text-xs leading-relaxed">
                        Você precisará de troco para o pagamento na mesa ou no ato da entrega?
                      </p>

                      <div className="flex flex-col gap-2.5">
                        <label className="flex items-center gap-2.5 text-xs text-zinc-300 cursor-pointer select-none">
                          <input 
                            type="radio" 
                            name="needsChange" 
                            checked={!needsChange} 
                            onChange={() => { setNeedsChange(false); setChangeValue(""); }}
                            className="text-gold-500 focus:ring-gold-500 bg-zinc-950 border-zinc-800"
                          />
                          Não preciso, vou pagar com valor trocado (R$ {cartTotal.toFixed(2)})
                        </label>
                        <label className="flex items-center gap-2.5 text-xs text-zinc-300 cursor-pointer select-none">
                          <input 
                            type="radio" 
                            name="needsChange" 
                            checked={needsChange} 
                            onChange={() => setNeedsChange(true)}
                            className="text-gold-500 focus:ring-gold-500 bg-zinc-950 border-zinc-800"
                          />
                          Sim, vou precisar de troco
                        </label>
                      </div>

                      {needsChange && (
                        <motion.div 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="pt-2 space-y-2"
                        >
                          <label className="block text-zinc-400 text-xs font-mono">Troco para qual valor?</label>
                          <div className="relative max-w-[200px]">
                            <span className="absolute left-3 top-2.5 text-zinc-500 text-xs font-semibold font-mono">R$</span>
                            <input 
                              type="text"
                              inputMode="decimal"
                              value={changeValue}
                              onChange={(e) => setChangeValue(e.target.value.replace(/[^0-9,.]/g, ""))}
                              placeholder="Ex: 50,00"
                              className="w-full bg-black border border-zinc-805 rounded-lg pl-9 pr-3 py-2 text-amber-50 focus:outline-none focus:border-gold-500 text-xs font-mono"
                            />
                          </div>
                          {changeValue && !isNaN(parseFloat(changeValue.replace(",", "."))) && parseFloat(changeValue.replace(",", ".")) > cartTotal ? (
                            <span className="text-[10px] text-emerald-400 font-mono block">
                              Seu troco estimado será de R$ {(parseFloat(changeValue.replace(",", ".")) - cartTotal).toFixed(2)}
                            </span>
                          ) : changeValue ? (
                            <span className="text-[10px] text-red-400 font-mono block">
                              Informe um valor maior que R$ {cartTotal.toFixed(2)}
                            </span>
                          ) : null}
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </div>

                {/* Error Banner */}
                {cardError && (
                  <div className="p-3 bg-red-950/40 border border-red-500/20 text-red-400 rounded-lg flex items-center gap-2 text-xs">
                    <AlertCircle className="h-4 w-4" />
                    <span>{cardError}</span>
                  </div>
                )}

                {/* Submit Order Button */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-4 bg-gradient-to-r from-gold-600 to-gold-400 hover:from-gold-500 hover:to-gold-300 disabled:opacity-50 text-neutral-950 font-bold rounded-xl tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer text-sm shadow-xl shadow-gold-950/20"
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <span className="animate-spin h-4 w-4 border-2 border-black border-t-transparent rounded-full" />
                      <span>Processando Pagamento...</span>
                    </div>
                  ) : paymentMethod === 'pix' && !pixPaid ? (
                    <span>Aguardando Pagamento Pix...</span>
                  ) : (
                    <>
                      <span>Confirmar Pedido - R$ {cartTotal.toFixed(2)}</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>

              </form>
            </div>

            {/* Resume products column */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-gold-500/5 to-transparent blur-lg" />
                <h4 className="font-serif text-lg font-bold text-amber-100 mb-4 pb-2 border-b border-zinc-900">
                  Resumo do Pedido ({totalItemsCount} {totalItemsCount === 1 ? 'café' : 'cafés'})
                </h4>

                <div className="divide-y divide-zinc-900 max-h-96 overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div key={item.product.id} className="py-3 flex gap-3">
                      <img 
                        src={item.product.image} 
                        alt={item.product.name} 
                        className="w-12 h-12 rounded-lg object-cover bg-neutral-900"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="block text-xs font-serif font-bold text-amber-50 truncate">
                          {item.product.name}
                        </span>
                        <span className="text-[10px] text-zinc-500 block font-mono uppercase">
                          {item.product.volume} • {item.quantity} {item.quantity === 1 ? 'dose' : 'doses'}
                        </span>
                      </div>
                      <div className="text-right text-xs">
                        <span className="font-mono font-bold text-gold-400 block">
                          R$ {(item.product.price * item.quantity).toFixed(2)}
                        </span>
                        <span className="text-[9px] text-zinc-500 font-mono block">
                          R$ {item.product.price.toFixed(2)}/un
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-zinc-900 text-sm space-y-2">
                  <div className="flex justify-between text-zinc-400 text-xs">
                    <span>Subtotal</span>
                    <span className="font-mono">R$ {cartTotal.toFixed(2)}</span>
                  </div>
                  {deliveryMethod === 'delivery' && (
                    <div className="flex justify-between text-zinc-400 text-xs">
                      <span>Taxa de Entrega</span>
                      <span className="font-mono text-emerald-400">R$ 0,00 (Cortesia)</span>
                    </div>
                  )}
                  <div className="flex justify-between text-amber-50 font-bold text-base pt-1">
                    <span className="font-serif">Total Geral</span>
                    <span className="text-gold-400 font-mono">R$ {cartTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          
          /* Success Page */
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-xl mx-auto text-center bg-zinc-950 border border-zinc-900 p-8 rounded-3xl relative"
          >
            {/* Ambient background glow */}
            <div className="absolute top-0 inset-x-0 w-32 h-32 mx-auto rounded-full bg-gold-400/10 blur-2xl" />

            <div className="flex justify-center mb-6">
              <div className="p-4 bg-gold-500 text-zinc-950 rounded-full inline-block shadow-lg shadow-gold-500/20 ring-4 ring-gold-600/10 scale-105">
                <Check className="h-8 w-8 stroke-[3]" />
              </div>
            </div>

            <span className="text-[10px] uppercase font-mono tracking-widest text-gold-400 bg-gold-400/10 px-3 py-1 rounded-full">
              {paymentMethod === 'pix' ? 'Pagamento Confirmado Online!' : 'Pedido Recebido com Sucesso!'}
            </span>

            <h3 className="font-serif font-extrabold text-2xl md:text-3xl text-amber-100 mt-4 mb-2">
              {paymentMethod === 'pix' ? 'Café Sendo Preparado!' : 'Preparando seu Café Especial!'}
            </h3>
            
            <p className="text-zinc-400 text-xs md:text-sm max-w-sm mx-auto leading-relaxed font-light mb-6">
              Olá, <strong className="text-amber-50">{name}</strong>. seu pedido via <strong className="text-gold-400">{paymentMethod === 'pix' ? 'PIX' : 'Dinheiro físico'}</strong> foi enviado para o nosso caixa. {paymentMethod === 'pix' ? 'O pagamento foi processado pela nossa API.' : needsChange ? `Levaremos seu troco para R$ ${parseFloat(changeValue.replace(",", ".")).toFixed(2)}.` : 'Preparando com todo o carinho.'} Nosso barista foi notificado!
            </p>

            <div className="bg-neutral-900 p-4 rounded-2xl border border-zinc-800 text-xs space-y-2 mb-6">
              <div className="flex justify-between text-zinc-500 font-mono">
                <span>Código do Pedido:</span>
                <span className="text-gold-400 font-bold">{orderId}</span>
              </div>
              <div className="flex justify-between text-zinc-500 font-mono">
                <span>Total Pago:</span>
                <span className="text-amber-50 font-bold">R$ {orderTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-zinc-500 font-mono">
                <span>Opção de Entrega:</span>
                <span className="text-amber-50 font-medium">
                  {deliveryMethod === 'local' ? `Mesa #${tableNumber}` : 
                   deliveryMethod === 'takeaway' ? 'Retirada no Balcão' : 'Entrega em Casa'}
                </span>
              </div>
            </div>

            {/* WhatsApp Integration Action Button */}
            <div className="space-y-4">
              <div className="text-[11px] text-zinc-500">
                Se desejar, envie seu recibo diretamente para o nosso suporte WhatsApp clicando no botão abaixo:
              </div>

              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 bg-[#25D366] hover:bg-[#128C7E] text-zinc-950 hover:text-white font-bold rounded-xl tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer select-none"
              >
                <Send className="h-4.5 w-4.5" />
                <span>Enviar Recibo via WhatsApp</span>
              </a>

              <button
                onClick={() => setStep('browse')}
                className="block text-center w-full py-2.5 text-xs text-gold-400 hover:text-gold-300 underline font-mono tracking-wider cursor-pointer"
              >
                Voltar ao Cardápio Original
              </button>
            </div>
          </motion.div>
        )}

      </main>

      {/* Cart Drawer Panel overlay */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black z-50 cursor-pointer"
            />

            {/* Sidebar Cart Drawer */}
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              id="cart-drawer"
              className="fixed right-0 top-0 h-full w-full max-w-md bg-zinc-950 border-l border-gold-900/40 z-50 p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))] flex flex-col justify-between shadow-2xl"
            >
              <div>
                <div className="flex justify-between items-center pb-4 border-b border-zinc-900">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5 text-gold-400" />
                    <h3 className="font-serif text-lg font-bold text-amber-100">Seu Carrinho</h3>
                  </div>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="p-2 text-zinc-400 hover:text-white rounded-full bg-neutral-900 hover:bg-neutral-800 transition-all cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {cart.length === 0 ? (
                  <div className="py-24 text-center flex flex-col items-center justify-center">
                    <Coffee className="h-10 w-10 text-zinc-700 mb-3" />
                    <p className="text-zinc-500 text-xs font-light">Seu carrinho está vazio.</p>
                    <button 
                      onClick={() => setIsCartOpen(false)}
                      className="mt-4 text-xs text-gold-400 font-semibold hover:underline"
                    >
                      Ver Cafés de 120 ml
                    </button>
                  </div>
                ) : (
                  <div className="mt-6 divide-y divide-zinc-900/80 overflow-y-auto max-h-[60vh] pr-1">
                    {cart.map((item) => (
                      <div key={item.product.id} className="py-4 flex gap-3 items-start justify-between">
                        <img 
                          src={item.product.image} 
                          alt={item.product.name} 
                          className="w-12 h-12 rounded-lg object-cover bg-neutral-900"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1 min-w-0 px-1">
                          <span className="block text-xs font-serif font-bold text-amber-50 truncate">
                            {item.product.name}
                          </span>
                          <span className="text-[10px] text-zinc-500 block font-mono uppercase">
                            {item.product.volume} • R$ {item.product.price.toFixed(2)}/un
                          </span>

                          {/* Incrementor/Decrementor */}
                          <div className="flex items-center gap-2.5 mt-2">
                            <button
                              onClick={() => removeFromCart(item.product.id)}
                              className="w-5 h-5 rounded-full bg-neutral-900 hover:bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center border border-zinc-800 transition-colors cursor-pointer"
                            >
                              <Minus className="h-2.5 w-2.5" />
                            </button>
                            <span className="text-xs font-mono font-bold text-gold-400">{item.quantity}</span>
                            <button
                              onClick={() => addToCart(item.product)}
                              className="w-5 h-5 rounded-full bg-neutral-900 hover:bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center border border-zinc-800 transition-colors cursor-pointer"
                            >
                              <Plus className="h-2.5 w-2.5" />
                            </button>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="font-mono text-xs font-bold text-gold-400 block mb-1">
                            R$ {(item.product.price * item.quantity).toFixed(2)}
                          </span>
                          <button
                            onClick={() => deleteFromCart(item.product.id)}
                            className="p-1 text-zinc-600 hover:text-red-400 transition-colors cursor-pointer"
                            title="Remover café"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div className="pt-4 border-t border-zinc-900 mt-auto space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-zinc-400 font-serif">Valor Total:</span>
                    <span className="text-gold-400 font-mono font-bold text-lg">R$ {cartTotal.toFixed(2)}</span>
                  </div>

                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      setStep('checkout');
                    }}
                    className="w-full py-3.5 bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-zinc-950 font-bold rounded-lg uppercase tracking-wider text-xs transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-gold-950/25"
                  >
                    <span>Finalizar Compra</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Luxury footer */}
      <footer id="footer" className="bg-zinc-950 border-t border-zinc-900 py-12 px-4 md:px-8 text-center text-zinc-500 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-6">
          <div className="flex items-center gap-2">
            <Coffee className="h-5 w-5 text-gold-500/40" />
            <span className="font-serif font-bold text-amber-100 tracking-widest uppercase">VOLPONY CAFÉ</span>
          </div>

          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 font-mono text-[10px] text-zinc-500">
            <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-gold-500/50" /> Rua do Castelo, nº 17, Centro, Arari - MA</span>
            <span className="flex items-center gap-1"><Phone className="h-3 w-3 text-gold-500/50" /> (98) 98459-5785</span>
            <span className="flex items-center gap-1"><Clock className="h-3 w-3 text-gold-500/50" /> Todos os cafés de 120 ml</span>
          </div>

          <div className="w-16 h-[1px] bg-gold-900/30" />

          <div className="space-y-1">
            <p className="text-[10px] tracking-wide text-zinc-600 uppercase">Pequenos momentos, grandes sabores.</p>
            <p className="text-[9px] text-zinc-700">Feito com paixão para você • © 2026 Volpony Café Ltda. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
