import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowRight,
  BadgeCheck,
  Crown,
  Headphones,
  MapPin,
  Menu,
  PackageCheck,
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
  { id: 1, title: "Royal Street Jacket", category: "Collections", price: 48000, size: "S-XL", image: "/assets/showcase/showcase-02.png", badge: "Hero" },
  { id: 2, title: "Modern Hoodie Fit", category: "Shop", price: 42000, size: "S-XL", image: "/assets/showcase/showcase-03.png", badge: "New" },
  { id: 3, title: "International Shirt Drop", category: "Collections", price: 25000, size: "S-XL", image: "/assets/showcase/showcase-04.png", badge: "Shirt" },
  { id: 4, title: "Best Part Tee", category: "Featured", price: 30000, size: "S-XL", image: "/assets/showcase/showcase-05.png", badge: "Best" },
  { id: 5, title: "Premium Testimonial Look", category: "Service", price: 39000, size: "S-XL", image: "/assets/showcase/showcase-06.png", badge: "Trust" },
  { id: 6, title: "Weekend Outfit Set", category: "Shop", price: 47000, size: "S-XL", image: "/assets/showcase/showcase-07.png", badge: "Set" },
  { id: 7, title: "Signature Store Finish", category: "Contact", price: 36000, size: "S-XL", image: "/assets/showcase/showcase-08.png", badge: "Store" },
  { id: 8, title: "Full Kizigenza Moment", category: "Featured", price: 52000, size: "S-XL", image: "/assets/showcase/showcase-01.png", badge: "Premium" },
];

const categories = ["All", "Collections", "Featured", "Shop", "Service", "Contact"];
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
        <img src="/assets/logo.png" alt="Kizigenza Fashion logo" />
        <span>Kizigenza</span>
      </a>
      <nav className="desktop-nav">
        {links.map((link) => <a key={link} href={`#${link.toLowerCase()}`}>{link}</a>)}
      </nav>
      <div className="header-actions">
        <button className="cart-button" type="button" onClick={() => setCartOpen(true)}>
          <ShoppingBag size={18} /> Cart <span>{cartCount}</span>
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
        <p className="eyebrow">Full rights reserved premium store</p>
        <h1>Fashion and shoes with royal energy.</h1>
        <p>
          Kizigenza Fashion LTD is a premium store experience for clothes, shoes,
          collections, service, and fast WhatsApp ordering.
        </p>
        <div className="hero-actions">
          <a className="primary-link" href="#shop">Enter the store <ArrowRight size={18} /></a>
          <a className="secondary-link" href="#collections">Explore collections</a>
        </div>
      </div>
      <div className="hero-gallery">
        <FeatureImage className="main-card" src="/assets/showcase/showcase-02.png" label="Signature collection" />
        <FeatureImage src="/assets/showcase/showcase-05.png" label="Featured pieces" />
        <FeatureImage src="/assets/showcase/showcase-07.png" label="Store outfits" />
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
    { title: "Collections", category: "Collections", icon: Crown, image: "/assets/showcase/showcase-04.png", copy: "Curated fashion moments with premium layout and clear browsing." },
    { title: "Featured", category: "Featured", icon: Sparkles, image: "/assets/showcase/showcase-01.png", copy: "Hero drops placed at the front of the store experience." },
    { title: "Shop", category: "Shop", icon: ShoppingBag, image: "/assets/showcase/showcase-03.png", copy: "Products, prices, sizes, cart, and direct ordering flow." },
  ];
  return (
    <section className="page-section" id="collections">
      <SectionIntro eyebrow="Collections" title="A premium store with real departments." copy="Each page section is built like a boutique department, not a simple shop block." />
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
      <SectionIntro eyebrow="Featured" title="Premium pieces at the front of the store." copy="Large editorial presentation, polished product cards, and direct cart actions." />
      <div className="featured-layout">
        <article className="editorial-card">
          <img src="/assets/showcase/showcase-06.png" alt="Premium featured fashion" />
          <div>
            <p className="eyebrow">Store highlight</p>
            <h3>Modern elegance collection</h3>
            <p>A premium feature area for the store’s strongest fashion visuals.</p>
            <button type="button" onClick={() => addToCart(products[4])}>Add feature</button>
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
        <SectionIntro eyebrow="Shop" title="The complete store." copy="Search, filter, review prices, add to cart, and order directly by WhatsApp." />
        <div className="store-tools">
          <label className="search-box">
            <Search size={18} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search collections, featured, service..." />
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
  return (
    <article className="product-card">
      <div className="product-media">
        <img src={product.image} alt={product.title} loading="lazy" />
        <span>{product.badge}</span>
      </div>
      <div className="product-info">
        <p>{product.category} · {product.size}</p>
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
    { icon: BadgeCheck, title: "Store clarity", copy: "Customers see pages, prices, visuals, sizes, and cart state." },
    { icon: Headphones, title: "Direct support", copy: "The cart moves straight into a real support conversation." },
  ];
  return (
    <section className="page-section service" id="service">
      <SectionIntro eyebrow="Service" title="Premium service, simple flow." copy="A store should feel beautiful and make the customer journey clear." />
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
        <img src="/assets/showcase/showcase-08.png" alt="Store contact visual" />
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer>
      <img src="/assets/logo.png" alt="" />
      <div>
        <strong>Kizigenza Fashion LTD</strong>
        <p>Premium clothes and shoes store. Full rights reserved.</p>
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

