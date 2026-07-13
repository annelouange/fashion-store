import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowRight,
  BadgeCheck,
  Crown,
  Gem,
  Headphones,
  MapPin,
  Menu,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Truck,
  X,
} from "lucide-react";
import "./styles.css";

const products = [
  { id: 1, title: "Sculpted Satin Blazer", category: "Clothes", price: 68000, size: "S-XL", image: "/assets/editorial/tailoring.jpg", badge: "Tailored" },
  { id: 2, title: "Cerulean Editorial Set", category: "Clothes", price: 72000, size: "S-XL", image: "/assets/editorial/clothes-editorial.jpg", badge: "Trending" },
  { id: 3, title: "Cream Top Handle Bag", category: "Bags", price: 54000, size: "One size", image: "/assets/editorial/handbag-cream.jpg", badge: "Sculptural" },
  { id: 4, title: "Soft Structure Shoulder Bag", category: "Bags", price: 59000, size: "One size", image: "/assets/editorial/bag-style.jpg", badge: "New" },
  { id: 5, title: "Gold Layered Necklace", category: "Jewelry", price: 32000, size: "Adjustable", image: "/assets/editorial/gold-jewelry.jpg", badge: "Gold" },
  { id: 6, title: "Minimal Ring Stack", category: "Jewelry", price: 28000, size: "6-9", image: "/assets/editorial/rings.jpg", badge: "Stacked" },
  { id: 7, title: "Boutique Accessory Edit", category: "Accessories", price: 46000, size: "Curated", image: "/assets/editorial/accessories.jpg", badge: "Edit" },
  { id: 8, title: "Kizigenza Store Curation", category: "Featured", price: 84000, size: "Premium", image: "/assets/editorial/boutique.jpg", badge: "Premium" },
];

const categories = ["All", "Clothes", "Bags", "Jewelry", "Accessories", "Featured"];
const money = new Intl.NumberFormat("en-RW");

function App() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    const term = query.trim().toLowerCase();
    return products.filter((product) => {
      const byCategory = activeCategory === "All" || product.category === activeCategory;
      const byText = `${product.title} ${product.category} ${product.badge}`.toLowerCase().includes(term);
      return byCategory && byText;
    });
  }, [activeCategory, query]);

  const total = cart.reduce((sum, item) => sum + item.price, 0);
  const orderText = cart.length
    ? `Hello Kizigenza Fashion, I want to order:\n${cart.map((item) => `- ${item.title} (${formatPrice(item.price)})`).join("\n")}\nTotal: ${formatPrice(total)}`
    : "Hello Kizigenza Fashion, I want to ask about your premium store.";
  const orderUrl = `https://wa.me/250700000000?text=${encodeURIComponent(orderText)}`;

  function openCategory(category) {
    setActiveCategory(category);
    document.querySelector("#shop")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <>
      <Header cartCount={cart.length} setCartOpen={setCartOpen} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      {menuOpen && <MobileMenu setMenuOpen={setMenuOpen} />}
      <main>
        <Hero />
        <Collections openCategory={openCategory} />
        <Featured addToCart={(product) => setCart((items) => [...items, product])} />
        <Shop
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          query={query}
          setQuery={setQuery}
          products={filteredProducts}
          addToCart={(product) => setCart((items) => [...items, product])}
        />
        <Service />
        <Contact orderUrl={orderUrl} />
      </main>
      <Footer />
      <CartDrawer open={cartOpen} setOpen={setCartOpen} cart={cart} setCart={setCart} total={total} orderUrl={orderUrl} />
    </>
  );
}

function Header({ cartCount, setCartOpen, menuOpen, setMenuOpen }) {
  const links = ["Collections", "Featured", "Shop", "Service", "Contact"];
  return (
    <header className="site-header">
      <a className="brand" href="#top">
        <img src="/assets/kizigenza-logo.svg" alt="Kizigenza Fashion logo" />
        <span>Kizigenza</span>
      </a>
      <nav className="desktop-nav">
        {links.map((link) => <a key={link} href={`#${link.toLowerCase()}`}>{link}</a>)}
      </nav>
      <div className="header-actions">
        <button className="cart-button" type="button" onClick={() => setCartOpen(true)}>
          <ShoppingBag size={18} /> <strong>Cart</strong> <span>{cartCount}</span>
        </button>
        <button className="menu-button" type="button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Open menu">
          <Menu size={22} />
        </button>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-copy">
        <p className="eyebrow">Kizigenza premium store</p>
        <h1>Clean fashion, sculptural bags, golden details.</h1>
        <p>
          Kizigenza Fashion LTD is a polished store for trending clothes,
          elegant handbags, refined jewelry, and fast WhatsApp ordering.
        </p>
        <div className="hero-actions">
          <a className="primary-link" href="#shop">Enter the store <ArrowRight size={18} /></a>
          <a className="secondary-link" href="#collections">Explore collections</a>
        </div>
      </div>
      <div className="hero-gallery">
        <FeatureImage className="main-card" src="/assets/editorial/clothes-editorial.jpg" label="Trending clothes" />
        <FeatureImage src="/assets/editorial/handbag-cream.jpg" label="Sculptural bags" />
        <FeatureImage src="/assets/editorial/gold-jewelry.jpg" label="Jewelry edit" />
      </div>
    </section>
  );
}

function FeatureImage({ src, label, className = "" }) {
  return (
    <article className={`feature-image ${className}`}>
      <img src={src} alt={label} />
      <span>{label}</span>
    </article>
  );
}

function Collections({ openCategory }) {
  const cards = [
    { title: "Clothes", category: "Clothes", icon: Crown, image: "/assets/editorial/tailoring.jpg", copy: "Clean tailoring, expressive color, soft structure, and modern silhouettes." },
    { title: "Bags", category: "Bags", icon: ShoppingBag, image: "/assets/editorial/bag-style.jpg", copy: "Sculptural handbags, satin textures, and polished everyday shapes." },
    { title: "Jewelry", category: "Jewelry", icon: Gem, image: "/assets/editorial/rings.jpg", copy: "Gold necklaces, ring stacks, and quiet shine for a refined finish." },
  ];
  return (
    <section className="page-section" id="collections">
      <SectionIntro eyebrow="Collections" title="A calm store with clothes, bags, and jewelry." copy="The layout now feels like a clean fashion boutique: fewer distractions, stronger imagery, and clearer product departments." />
      <div className="collection-grid">
        {cards.map(({ title, category, icon: Icon, image, copy }) => (
          <article className="collection-card" key={title}>
            <img src={image} alt={title} />
            <div>
              <Icon size={24} />
              <h3>{title}</h3>
              <p>{copy}</p>
              <button type="button" onClick={() => openCategory(category)}>Open {title}</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Featured({ addToCart }) {
  return (
    <section className="page-section featured" id="featured">
      <SectionIntro eyebrow="Featured" title="Premium pieces at the front of the store." copy="Editorial presentation, polished product cards, and direct cart actions for the strongest fashion moments." />
      <div className="featured-layout">
        <article className="editorial-card">
          <img src="/assets/editorial/boutique.jpg" alt="Premium featured fashion" />
          <div>
            <p className="eyebrow">Store highlight</p>
            <h3>The Boutique Edit</h3>
            <p>A curated feature area for clothing, bags, jewelry, and accessories.</p>
            <button type="button" onClick={() => addToCart(products[7])}>Add feature</button>
          </div>
        </article>
        <div className="featured-products">
          {products.slice(0, 4).map((product) => <ProductCard key={product.id} product={product} addToCart={addToCart} />)}
        </div>
      </div>
    </section>
  );
}

function Shop({ activeCategory, setActiveCategory, query, setQuery, products, addToCart }) {
  return (
    <section className="page-section shop" id="shop">
      <div className="shop-heading">
        <SectionIntro eyebrow="Shop" title="The complete fashion store." copy="Search clothes, bags, jewelry, and accessories, then add items to cart for WhatsApp ordering." />
        <div className="store-tools">
          <label className="search-box">
            <Search size={18} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search clothes, bags, jewelry..." />
          </label>
          <div className="filters">
            {categories.map((category) => (
              <button key={category} className={category === activeCategory ? "active" : ""} type="button" onClick={() => setActiveCategory(category)}>
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="product-grid">
        {products.map((product) => <ProductCard key={product.id} product={product} addToCart={addToCart} />)}
      </div>
    </section>
  );
}

function ProductCard({ product, addToCart }) {
  const productClass = product.category.toLowerCase();
  return (
    <article className={`product-card ${productClass}`}>
      <div className="product-media">
        <img src={product.image} alt={product.title} loading="lazy" />
        <span>{product.badge}</span>
      </div>
      <div className="product-info">
        <p>{product.category} / {product.size}</p>
        <h3>{product.title}</h3>
        <div className="price-row">
          <strong>{formatPrice(product.price)}</strong>
          <button type="button" onClick={() => addToCart(product)} aria-label={`Add ${product.title}`}>
            <ShoppingBag size={17} />
          </button>
        </div>
      </div>
    </article>
  );
}

function Service() {
  const services = [
    { icon: ShieldCheck, title: "Full rights", copy: "Brand and footer clearly state full rights reserved." },
    { icon: Truck, title: "Delivery ready", copy: "Structured for pickup, delivery, and WhatsApp confirmation." },
    { icon: BadgeCheck, title: "Store clarity", copy: "Customers see departments, prices, visuals, sizes, and cart state." },
    { icon: Headphones, title: "Direct support", copy: "The cart moves straight into a real support conversation." },
  ];
  return (
    <section className="page-section service" id="service">
      <SectionIntro eyebrow="Service" title="Premium service, simple flow." copy="A clean store should feel beautiful and make the customer journey clear." />
      <div className="service-grid">
        {services.map(({ icon: Icon, title, copy }) => (
          <article key={title}>
            <Icon size={28} />
            <h3>{title}</h3>
            <p>{copy}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function Contact({ orderUrl }) {
  return (
    <section className="page-section contact" id="contact">
      <div className="contact-panel">
        <p className="eyebrow">Contact</p>
        <h2>Order directly from the premium store.</h2>
        <p>
          Customers can build a cart and send the order list through WhatsApp.
          Replace the placeholder number when the final business phone is ready.
        </p>
        <div className="contact-actions">
          <a className="primary-link" href={orderUrl} target="_blank" rel="noreferrer">Order on WhatsApp <ArrowRight size={18} /></a>
          <span><MapPin size={18} /> Kigali, Rwanda</span>
        </div>
      </div>
      <div className="contact-image">
        <img src="/assets/editorial/accessories.jpg" alt="Fashion accessories contact visual" />
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer>
      <img src="/assets/kizigenza-logo.svg" alt="" />
      <div>
        <strong>Kizigenza Fashion LTD</strong>
        <p>Premium clothes, bags, and jewelry store. Full rights reserved.</p>
      </div>
      <div className="footer-stars">
        {[1, 2, 3, 4, 5].map((star) => <Star key={star} size={18} fill="currentColor" />)}
      </div>
    </footer>
  );
}

function SectionIntro({ eyebrow, title, copy }) {
  return (
    <div className="section-intro">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      <p>{copy}</p>
    </div>
  );
}

function CartDrawer({ open, setOpen, cart, setCart, total, orderUrl }) {
  return (
    <>
      <aside className={open ? "cart-drawer open" : "cart-drawer"} aria-hidden={!open}>
        <div className="drawer-head">
          <h2>Your cart</h2>
          <button type="button" onClick={() => setOpen(false)} aria-label="Close cart"><X size={22} /></button>
        </div>
        <div className="drawer-items">
          {cart.length === 0 ? <p className="empty-cart">No products yet. Add a store item first.</p> : cart.map((item, index) => (
            <div className="drawer-item" key={`${item.id}-${index}`}>
              <img src={item.image} alt="" />
              <div>
                <strong>{item.title}</strong>
                <span>{formatPrice(item.price)}</span>
              </div>
              <button type="button" onClick={() => setCart((items) => items.filter((_, itemIndex) => itemIndex !== index))}>Remove</button>
            </div>
          ))}
        </div>
        <div className="drawer-total">
          <span>Total</span>
          <strong>{formatPrice(total)}</strong>
        </div>
        <a className="primary-link checkout" href={orderUrl} target="_blank" rel="noreferrer">Checkout on WhatsApp</a>
      </aside>
      {open && <button className="scrim" type="button" onClick={() => setOpen(false)} aria-label="Close cart overlay" />}
    </>
  );
}

function MobileMenu({ setMenuOpen }) {
  return (
    <div className="mobile-menu">
      {["Collections", "Featured", "Shop", "Service", "Contact"].map((link) => (
        <a key={link} href={`#${link.toLowerCase()}`} onClick={() => setMenuOpen(false)}>{link}</a>
      ))}
    </div>
  );
}

function formatPrice(value) {
  return `${money.format(value)} RWF`;
}

createRoot(document.getElementById("root")).render(<App />);
