
import { useEffect, useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  HiOutlineSparkles,
  HiOutlineArrowRight,
  HiOutlineRefresh,
  HiOutlineHeart,
  HiOutlineCheckCircle,
  HiOutlineBeaker,
  HiOutlineShoppingBag,
  HiOutlineExternalLink,
  HiOutlineBookmark,
} from "react-icons/hi";

import heroModel from "./hairCare-model.jpg";
import client from "../api/client";
import {
  getSavedProducts,
  saveProduct,
  deleteSavedProduct,
} from "../api/savedProducts";

import "./hairCare.css";

const INITIAL_PROFILE = {
  hair_type: "Wavy",
  hair_length: "Medium",
  hair_texture: "Medium",
  scalp_condition: "Oily",
  hair_concerns: ["Frizz"],
};

const OPTIONS = {
  hair_type: ["Straight", "Wavy", "Curly", "Coily"],
  hair_length: ["Short", "Medium", "Long"],
  hair_texture: ["Fine", "Medium", "Thick"],
  scalp_condition: ["Oily", "Dry", "Normal", "Combination", "Unsure"],
};

const CONCERNS = [
  "Hair fall",
  "Dandruff",
  "Frizz",
  "Dryness",
  "Breakage",
  "Oily scalp",
  "Dullness",
];

const EASE = [0.22, 1, 0.36, 1];

const AMP = { Straight: 0, Wavy: 20, Curly: 34, Coily: 48 };
const SORTS = [
  ["recommended", "Recommended"],
  ["price-asc", "Price: low to high"],
  ["price-desc", "Price: high to low"],
  ["rating", "Top rated"],
];

// One smooth S-curve strand; every pattern has the same segment count so it can morph.
function strand(amp, x = 60) {
  let d = `M${x} 8`;
  for (let i = 0; i < 6; i++) {
    const y = 8 + i * 30;
    d += ` C${x + amp} ${y + 10} ${x - amp} ${y + 20} ${x} ${y + 30}`;
  }
  return d;
}

function setVars(e, vars) {
  Object.entries(vars).forEach(([k, v]) => e.currentTarget.style.setProperty(k, v));
}
function spot(e) {
  const r = e.currentTarget.getBoundingClientRect();
  setVars(e, { "--mx": `${e.clientX - r.left}px`, "--my": `${e.clientY - r.top}px` });
}
function tilt(e) {
  const r = e.currentTarget.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width - 0.5;
  const y = (e.clientY - r.top) / r.height - 0.5;
  setVars(e, { "--tx": `${(x * 16).toFixed(1)}deg`, "--ty": `${(-y * 16).toFixed(1)}deg` });
}
function untilt(e) {
  setVars(e, { "--tx": "0deg", "--ty": "0deg" });
}
function drift(e) {
  setVars(e, {
    "--px": (e.clientX / window.innerWidth - 0.5).toFixed(3),
    "--py": (e.clientY / window.innerHeight - 0.5).toFixed(3),
  });
}

// Sidebar model photo in an arched frame.
function LiveModel() {
  return (
    <div className="hl-model">
      <div className="hl-frame">
        <img src={heroModel} alt="" />
        <span className="hl-sheen" />
      </div>
    </div>
  );
}

function OptionGlyph({ field, option, index }) {
  const p = {
    width: 18,
    height: 18,
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  if (field === "hair_type") {
    return (
      <svg {...p} viewBox="-10 0 140 200" strokeWidth="10">
        <path d={strand(AMP[option] ?? 0)} />
      </svg>
    );
  }
  if (field === "hair_length") {
    return (
      <svg {...p} viewBox="0 0 24 24" strokeWidth="2.2">
        <path d={`M12 3v${[6, 11, 17][index]}`} />
      </svg>
    );
  }
  if (field === "hair_texture") {
    return (
      <svg {...p} viewBox="0 0 24 24">
        {[6, 12, 18].map((x) => (
          <path key={x} d={`M${x} 4v16`} strokeWidth={[1, 2.2, 3.6][index]} />
        ))}
      </svg>
    );
  }
  return (
    <svg {...p} viewBox="0 0 24 24" strokeWidth="1.8">
      {option === "Oily" && (
        <path d="M12 3c4 5 6.5 8 6.5 11a6.5 6.5 0 0 1-13 0C5.5 11 8 8 12 3z" />
      )}
      {option === "Dry" && <circle cx="12" cy="12" r="8" strokeDasharray="2 3.4" />}
      {option === "Normal" && <circle cx="12" cy="12" r="8" />}
      {option === "Combination" && (
        <>
          <circle cx="12" cy="12" r="8" />
          <path d="M12 4a8 8 0 0 0 0 16z" fill="currentColor" fillOpacity=".3" />
        </>
      )}
      {option === "Unsure" && (
        <>
          <circle cx="12" cy="12" r="8" />
          <path d="M9.7 9.8a2.4 2.4 0 1 1 3.4 2.2c-.7.3-1.1.8-1.1 1.6M12 16.6v.1" />
        </>
      )}
    </svg>
  );
}

function formatPrice(price) {
  if (price === null || price === undefined || price === "") {
    return "Price unavailable";
  }

  const value = Number(price);

  if (!Number.isFinite(value)) {
    return "Price unavailable";
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function getHairProductKey(product) {
  if (product.product_key) {
    return String(product.product_key).trim().toLowerCase();
  }

  return `hair-${product.name || product.product_name || "product"}-${
    product.store || "store"
  }`
    .trim()
    .toLowerCase();
}

function getProductName(product) {
  return product.name || product.product_name || "Hair-care product";
}

function getProductStore(product) {
  return product.store || product.merchant || "";
}

function sameHairProduct(saved, product) {
  const productKey = getHairProductKey(product);
  const savedKey = String(saved.product_key || "").trim().toLowerCase();

  if (savedKey && savedKey === productKey) {
    return true;
  }

  const savedName = String(
    saved.product_name || saved.name || ""
  ).trim().toLowerCase();

  const productName = getProductName(product).trim().toLowerCase();

  const savedStore = String(
    saved.store || saved.merchant || ""
  ).trim().toLowerCase();

  const productStore = getProductStore(product).trim().toLowerCase();

  return (
    savedName === productName &&
    savedStore === productStore
  );
}


export default function HairCare() {
  const [profile, setProfile] = useState(INITIAL_PROFILE);
  const [result, setResult] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);

  const [savedItems, setSavedItems] = useState([]);
  const [savingKey, setSavingKey] = useState("");
  const [saveError, setSaveError] = useState("");

  const [done, setDone] = useState([]);
  const [sortBy, setSortBy] = useState("recommended");
  const [catFilter, setCatFilter] = useState("All");
  const [toast, setToast] = useState("");
  const toastTimer = useRef(null);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 26 });

  const heroRef = useRef(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(heroProgress, [0, 1], ["0%", "9%"]);

  function showToast(message) {
    setToast(message);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 2400);
  }

  useEffect(() => () => clearTimeout(toastTimer.current), []);


  // Load products already saved in the shared Saved Products page.
  useEffect(() => {
    let active = true;

    async function loadSavedProducts() {
      try {
        const response = await getSavedProducts();

        const data = response?.data ?? response;
        const products = Array.isArray(data)
          ? data
          : data?.products ?? [];

        if (active) {
          setSavedItems(products);
        }
      } catch (err) {
        console.error("Could not load saved products:", err);

        if (active) {
          setSavedItems([]);
        }
      }
    }

    loadSavedProducts();

    return () => {
      active = false;
    };
  }, []);

  function updateProfile(field, value) {
    setProfile((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function toggleConcern(concern) {
    setProfile((current) => {
      const alreadySelected = current.hair_concerns.includes(concern);

      return {
        ...current,
        hair_concerns: alreadySelected
          ? current.hair_concerns.filter((item) => item !== concern)
          : [...current.hair_concerns, concern],
      };
    });
  }

  async function generateRoutine() {
    setLoading(true);
    setError("");
    setSaveError("");

    try {
      const response = await client.post("/hair/recommendations", {
        ...profile,
        hair_concerns: profile.hair_concerns,
      });

      setResult(response?.data ?? response);
      setDone([]);
      setCatFilter("All");
      setSortBy("recommended");
    } catch (err) {
      console.error("Hair recommendations failed:", err);

      setError(
        err?.response?.data?.detail ||
          err?.response?.data?.message ||
          "We couldn't generate your hair-care recommendations. Please check your backend and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  function resetQuestionnaire() {
    setProfile(INITIAL_PROFILE);
    setDone([]);
    setCatFilter("All");
    setSortBy("recommended");
    setResult(null);
    setError("");
    setSaveError("");
    setStep(1);
  }

  function isHairProductSaved(product) {
    return savedItems.some((item) => sameHairProduct(item, product));
  }

  async function toggleSaveHairProduct(product) {
    const key = getHairProductKey(product);

    if (savingKey) return;

    const wasSaved = isHairProductSaved(product);
    let ok = false;

    setSavingKey(key);
    setSaveError("");

    try {
      const existing = savedItems.find((item) =>
        sameHairProduct(item, product)
      );

      if (existing) {
        const savedId =
          existing.id ??
          existing.saved_product_id;

        if (savedId === null || savedId === undefined) {
          throw new Error(
            "This saved product has no ID, so it cannot be removed yet."
          );
        }

        await deleteSavedProduct(savedId);

        setSavedItems((current) =>
          current.filter(
            (item) =>
              String(item.id ?? item.saved_product_id) !==
              String(savedId)
          )
        );
      } else {
        const payload = {
          product_key: key,
          product_name: getProductName(product),
          brand: product.brand || "",
          category: product.category || "Hair care",
          price:
            product.price === null ||
            product.price === undefined ||
            product.price === ""
              ? null
              : Number(product.price),
          image_url: product.image || product.image_url || null,
          rating: product.rating ?? null,
          description: product.description || "",
          store: getProductStore(product),
          purchase_link:
            product.purchase_link || product.url || "",
        };

        const response = await saveProduct(payload);
        const data = response?.data ?? response;
        const savedProduct =
          data?.product ?? data?.saved_product ?? null;

        if (savedProduct) {
          setSavedItems((current) => {
            const alreadyExists = current.some((item) =>
              sameHairProduct(item, product)
            );

            return alreadyExists
              ? current
              : [...current, savedProduct];
          });
        } else {
          // Refresh from the backend if the API does not return the
          // saved product object.
          const refreshed = await getSavedProducts();
          const refreshedData = refreshed?.data ?? refreshed;
          const refreshedProducts = Array.isArray(refreshedData)
            ? refreshedData
            : refreshedData?.products ?? [];

          setSavedItems(refreshedProducts);
        }
      }
          ok = true;
    } catch (err) {
      console.error("Saving hair-care product failed:", err);

      setSaveError(
        err?.response?.data?.detail ||
          err?.response?.data?.message ||
          err?.message ||
          "Unable to update your saved products. Please try again."
      );
    } finally {
      setSavingKey("");
      if (ok) {
        showToast(
          wasSaved ? "Removed from your saved products" : "Saved to your products"
        );
      }
    }
  }

  const products = Array.isArray(result?.products)
    ? result.products
    : [];

  const routine = Array.isArray(result?.routine)
    ? result.routine
    : [];

  const productCategories = Array.isArray(result?.product_categories)
    ? result.product_categories
    : [];

  const categories = useMemo(
    () => ["All", ...new Set(products.map((p) => p.category || "Hair care"))],
    [products]
  );

  const visibleProducts = useMemo(() => {
    const num = (v) =>
      v === null || v === undefined || v === "" || !Number.isFinite(Number(v))
        ? null
        : Number(v);
    const list =
      catFilter === "All"
        ? [...products]
        : products.filter((p) => (p.category || "Hair care") === catFilter);

    if (sortBy === "price-asc") {
      list.sort((a, b) => (num(a.price) ?? Infinity) - (num(b.price) ?? Infinity));
    } else if (sortBy === "price-desc") {
      list.sort((a, b) => (num(b.price) ?? -1) - (num(a.price) ?? -1));
    } else if (sortBy === "rating") {
      list.sort((a, b) => (num(b.rating) ?? -1) - (num(a.rating) ?? -1));
    }
    return list;
  }, [products, catFilter, sortBy]);

  return (
    <MotionConfig reducedMotion="user">
    <main className="haircare-page" onPointerMove={drift}>
      <motion.div className="haircare-scrollbar" style={{ scaleX }} />
      <div className="haircare-orb haircare-orb-one" />
      <div className="haircare-orb haircare-orb-two" />

      <div className="haircare-shell">
        <motion.section
          ref={heroRef}
          className="haircare-hero"
          onPointerMove={spot}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: EASE }}
        >
          <div className="hh-copy">
            <div className="hh-brand">
              <HiOutlineSparkles />
              <span>DermaNova AI</span>
              <i />
            </div>

            <h1 className="haircare-title" aria-label="Your hair, understood.">
              {["Your", "hair,"].map((word, i) => (
                <motion.i
                  key={word}
                  className="hc-word"
                  aria-hidden="true"
                  initial={{ opacity: 0, y: 34, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.8, ease: EASE, delay: 0.15 + i * 0.09 }}
                >
                  {word}
                </motion.i>
              ))}
              <br />
              <motion.span
                aria-hidden="true"
                initial={{ opacity: 0, y: 34, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.9, ease: EASE, delay: 0.38 }}
              >
                understood.
              </motion.span>
            </h1>

            <p className="haircare-subtitle">
              Discover a hair-care routine tailored to your hair type, scalp
              condition and personal concerns.
            </p>

            <div className="haircare-trust-row">
              <span><HiOutlineCheckCircle />Personalised routine</span>
              <span><HiOutlineBeaker />Targeted product categories</span>
              <span><HiOutlineHeart />Made for your needs</span>
            </div>

            <div className="hh-pill">
              <HiOutlineSparkles />
              Your hair. Our AI care.
            </div>
          </div>

          <div className="hh-stage">
            <motion.div className="hh-art" style={{ y: heroY }}>
              <div className="hh-arch" onPointerMove={tilt} onPointerLeave={untilt}>
                <span className="hh-arch-glow" />
                <div className="hh-arch-frame">
                  <img src={heroModel} alt="Woman with long, glossy wavy hair" />
                  <span className="hh-arch-sheen" />
                </div>
              </div>
            </motion.div>

            <div className="hb-fx" aria-hidden="true">
              <span className="hb-spot" />
              <span className="hb-sweep" />
              {Array.from({ length: 8 }, (_, i) => (
                <i key={i} className="hc-petal" style={{ "--i": i }} />
              ))}
              <span className="hc-bubble hc-bubble-a" />
              <span className="hc-bubble hc-bubble-b" />
              <b className="hb-star" style={{ left: "58%", top: "34%" }} />
              <b className="hb-star hb-star-b" style={{ left: "30%", top: "20%" }} />
              <b className="hb-star hb-star-c" style={{ left: "44%", top: "74%" }} />
              <b className="hb-star hb-star-d" style={{ left: "92%", top: "92%" }} />
            </div>

            <div className="haircare-analysis" onPointerMove={tilt} onPointerLeave={untilt}>
              <div className="haircare-analysis-title">
                <HiOutlineSparkles />
                Your hair profile
              </div>
              {[
                ["Hair type", profile.hair_type],
                ["Texture", profile.hair_texture],
                ["Scalp", profile.scalp_condition],
                ["Concerns", profile.hair_concerns.join(", ") || "None yet"],
              ].map(([label, value], i) => (
                <motion.div
                  key={label}
                  className="haircare-analysis-row"
                  initial={{ opacity: 0, x: 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.55, ease: EASE, delay: 1.1 + i * 0.18 }}
                >
                  <HiOutlineCheckCircle />
                  <span>{label}:</span>
                  <AnimatePresence mode="wait">
                    <motion.b
                      key={value}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.2 }}
                    >
                      {value}
                    </motion.b>
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>

            <div className="hh-card">
              <h4>Radiant hair, confident you</h4>
              <i />
              <HiOutlineSparkles />
            </div>
          </div>
        </motion.section>

        {!result ? (
          <motion.section
            className="haircare-form"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.08 }}
          >
            <div className="haircare-form-heading">
              <div>
                <span className="haircare-section-kicker">
                  Your hair profile
                </span>
                <h2>Let's get to know your hair</h2>
                <p>
                  A thoughtful little consultation is the first step to a routine that feels right.
                </p>
              </div>

              <div className="haircare-step-count">
                <span>0{step}</span>
                <span className="haircare-step-divider">/</span>
                <span>02</span>
              </div>
            </div>

            <div className="haircare-progress-track">
              <motion.div
                className="haircare-progress-fill"
                animate={{ width: step === 1 ? "50%" : "100%" }}
                transition={{ duration: 0.35 }}
              />
            </div>

            <div className="haircare-step-caption">
              <span>{step === 1 ? "The foundations" : "Your hair goals"}</span>
              <span>{step === 1 ? "Tell us about your natural hair." : "Choose what you would like your routine to focus on."}</span>
            </div>

            <div className="haircare-layout">
            <div className="haircare-main">
            <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="step-1"
                className="haircare-fields"
                initial={{ opacity: 0, x: 28 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -28 }}
                transition={{ duration: 0.32, ease: EASE }}
              >
                {[
                  {
                    field: "hair_type",
                    title: "What is your hair type?",
                    description: "Choose your natural hair pattern.",
                  },
                  {
                    field: "hair_length",
                    title: "What is your hair length?",
                    description: "Select the length you have right now.",
                  },
                  {
                    field: "hair_texture",
                    title: "How thick is your hair?",
                    description: "Choose the closest match.",
                  },
                  {
                    field: "scalp_condition",
                    title: "How would you describe your scalp?",
                    description: "Think about how your scalp usually feels.",
                  },
                ].map((question) => (
                  <div
                    className={`haircare-field haircare-field--${question.field}`}
                    key={question.field}
                    data-field={question.field}
                  >
                    <div className="haircare-field-heading">
                      <span className="haircare-question-index">
                        {String(
                          [
                            "hair_type",
                            "hair_length",
                            "hair_texture",
                            "scalp_condition",
                          ].indexOf(question.field) + 1
                        ).padStart(2, "0")}
                      </span>
                      <div>
                        <h3>{question.title}</h3>
                        <p>{question.description}</p>
                      </div>
                    </div>

                    <div className={`haircare-options haircare-options--${question.field}`}>
                      {OPTIONS[question.field].map((option, optionIndex) => (
                        <button
                          type="button"
                          key={option}
                          data-option={option.toLowerCase().replace(/\s+/g, "-")}
                          className={`haircare-option ${
                            profile[question.field] === option
                              ? "is-selected"
                              : ""
                          }`}
                          onClick={() =>
                            updateProfile(question.field, option)
                          }
                          aria-pressed={
                            profile[question.field] === option
                          }
                        >
                          <span className="haircare-option-art" aria-hidden="true">
                            <OptionGlyph field={question.field} option={option} index={optionIndex} />
                          </span>
                          <span className="haircare-option-label">{option}</span>
                          {profile[question.field] === option && (
                            <span className="haircare-option-selected">
                              <HiOutlineCheckCircle />
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="haircare-form-actions">
                  <span className="haircare-helper-text">
                    Step 1 of 2 · Hair basics
                  </span>

                  <button
                    type="button"
                    className="haircare-primary-button"
                    onClick={() => setStep(2)}
                  >
                    Continue
                    <HiOutlineArrowRight />
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="step-2"
                className="haircare-fields"
                initial={{ opacity: 0, x: 28 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -28 }}
                transition={{ duration: 0.32, ease: EASE }}
              >
                <div className="haircare-field">
                  <div className="haircare-field-heading">
                    <h3>What would you like to improve?</h3>
                    <p>
                      Select all the concerns that apply to you.
                    </p>
                  </div>

                  <div className="haircare-concerns">
                    {CONCERNS.map((concern) => {
                      const selected =
                        profile.hair_concerns.includes(concern);

                      return (
                        <button
                          type="button"
                          key={concern}
                          className={`haircare-concern ${
                            selected ? "is-selected" : ""
                          }`}
                          onClick={() => toggleConcern(concern)}
                          aria-pressed={selected}
                        >
                          <span className="haircare-concern-check">
                            {selected && <HiOutlineCheckCircle />}
                          </span>
                          {concern}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {error && (
                  <div className="haircare-error" role="alert">
                    {error}
                  </div>
                )}

                <div className="haircare-form-actions">
                  <button
                    type="button"
                    className="haircare-secondary-button"
                    onClick={() => setStep(1)}
                    disabled={loading}
                  >
                    <HiOutlineArrowRight className="haircare-back-icon" />
                    Back
                  </button>

                  <button
                    type="button"
                    className="haircare-primary-button"
                    onClick={generateRoutine}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <HiOutlineRefresh className="haircare-spinning" />
                        Creating your routine...
                      </>
                    ) : (
                      <>
                        <HiOutlineSparkles />
                        Create my routine
                        <HiOutlineArrowRight />
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
            </AnimatePresence>
            </div>

            <aside className="haircare-live" aria-label="Live profile preview">
              <LiveModel />
              <div className="haircare-live-copy">
                <h4>Your hair profile</h4>
                <p>Your answers appear here as you choose them.</p>
              </div>
              <div className="hl-concerns-title">
                Your concerns <b>{profile.hair_concerns.length}</b>
              </div>
              <div className="haircare-live-tags">
                <AnimatePresence>
                  {profile.hair_concerns.map((concern) => (
                    <motion.span
                      layout
                      key={concern}
                      className="is-concern"
                      initial={{ opacity: 0, scale: 0.7 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.7 }}
                    >
                      {concern}
                    </motion.span>
                  ))}
                </AnimatePresence>
                {profile.hair_concerns.length === 0 && (
                  <span className="hl-empty">None selected yet</span>
                )}
              </div>
            </aside>
            </div>

            <AnimatePresence>
              {loading && (
                <motion.div
                  className="haircare-loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  role="status"
                  aria-live="polite"
                >
                  <span className="haircare-loading-orb" />
                  <p>Putting together your routine...</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.section>
        ) : (
          <motion.section
            className="haircare-results"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <div className="haircare-results-heading">
              <div>
                <div className="haircare-eyebrow">
                  <HiOutlineSparkles />
                  Your personal hair plan
                </div>
                <h2>Your routine, thoughtfully chosen.</h2>
                <p>
                  Recommendations based on the profile you shared.
                </p>
              </div>

              <button
                type="button"
                className="haircare-secondary-button haircare-edit-button"
                onClick={() => {
                  setResult(null);
                  setStep(1);
                  setError("");
                  setSaveError("");
                }}
              >
                Edit my answers
              </button>
            </div>

            <div className="haircare-profile-summary">
              <div className="haircare-summary-heading">
                <span className="haircare-summary-icon">
                  <HiOutlineHeart />
                </span>
                <div>
                  <h3>Your hair profile</h3>
                  <p>Your current preferences</p>
                </div>
              </div>

              <div className="haircare-summary-tags">
                <span>{profile.hair_type} hair</span>
                <span>{profile.hair_length} length</span>
                <span>{profile.hair_texture} texture</span>
                <span>{profile.scalp_condition} scalp</span>
                {profile.hair_concerns.map((concern) => (
                  <span key={concern}>{concern}</span>
                ))}
              </div>
            </div>

            {routine.length > 0 && (
              <section className="haircare-results-section">
                <div className="haircare-section-heading">
                  <div className="haircare-section-icon">
                    <HiOutlineBeaker />
                  </div>
                  <div>
                    <h3>Your personalised routine</h3>
                    <p>
                      Tap a number to tick off each step. {done.length} of{" "}
                      {routine.length} done.
                    </p>
                    <div className="haircare-routine-progress">
                      <motion.span
                        animate={{ scaleX: routine.length ? done.length / routine.length : 0 }}
                        transition={{ duration: 0.5, ease: EASE }}
                      />
                    </div>
                  </div>
                </div>

                <div className="haircare-routine-list">
                  {routine.map((item, index) => (
                    <motion.article
                      className={`haircare-routine-item${done.includes(index) ? " is-done" : ""}`}
                      key={`${item.step || "step"}-${index}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.35,
                        delay: index * 0.06,
                      }}
                    >
                      <button
                        type="button"
                        className="haircare-routine-number"
                        aria-pressed={done.includes(index)}
                        aria-label={`Mark step ${index + 1} as done`}
                        onClick={() =>
                          setDone((c) =>
                            c.includes(index)
                              ? c.filter((i) => i !== index)
                              : [...c, index]
                          )
                        }
                      >
                        {done.includes(index) ? (
                          <HiOutlineCheckCircle />
                        ) : (
                          String(index + 1).padStart(2, "0")
                        )}
                      </button>

                      <div className="haircare-routine-content">
                        <span className="haircare-routine-step">
                          {item.step || `Routine step ${index + 1}`}
                        </span>

                        <p>
                          {item.recommendation ||
                            item.description ||
                            "Follow the recommended hair-care step."}
                        </p>

                        {item.product_category && (
                          <span className="haircare-routine-category">
                            {item.product_category}
                          </span>
                        )}
                      </div>
                    </motion.article>
                  ))}
                </div>
              </section>
            )}

            {productCategories.length > 0 && (
              <section className="haircare-results-section">
                <div className="haircare-section-heading">
                  <div className="haircare-section-icon">
                    <HiOutlineShoppingBag />
                  </div>
                  <div>
                    <h3>Recommended product categories</h3>
                    <p>Types of products that may fit your routine.</p>
                  </div>
                </div>

                <div className="haircare-category-list">
                  {productCategories.map((category, index) => {
                    const label =
                      typeof category === "string"
                        ? category
                        : category.name ||
                          category.category ||
                          category.product_category ||
                          "Hair-care product";

                    return (
                      <span
                        className="haircare-category-chip"
                        key={`${label}-${index}`}
                      >
                        <HiOutlineCheckCircle />
                        {label}
                      </span>
                    );
                  })}
                </div>
              </section>
            )}

            <section className="haircare-results-section haircare-live-products">
              <div className="haircare-section-heading">
                <div className="haircare-section-icon">
                  <HiOutlineShoppingBag />
                </div>
                <div>
                  <h3>Hair-care products</h3>
                  <p>
                    Available offers returned by your product research service.
                  </p>
                </div>
              </div>

              {saveError && (
                <div className="haircare-error" role="alert">
                  {saveError}
                </div>
              )}

              {products.length > 1 && (
                <div className="haircare-toolbar">
                  <div className="haircare-filter-chips" role="group" aria-label="Filter by category">
                    {categories.map((c) => (
                      <button
                        key={c}
                        type="button"
                        className={`haircare-filter${catFilter === c ? " is-active" : ""}`}
                        onClick={() => setCatFilter(c)}
                        aria-pressed={catFilter === c}
                      >
                        {catFilter === c && (
                          <motion.span
                            layoutId="hc-filter-pill"
                            className="haircare-filter-pill"
                            transition={{ type: "spring", stiffness: 420, damping: 32 }}
                          />
                        )}
                        <span>{c}</span>
                      </button>
                    ))}
                  </div>
                  <label className="haircare-sort">
                    Sort by
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                      {SORTS.map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              )}

              {products.length > 0 ? (
                <div className="haircare-live-product-grid">
                  <AnimatePresence mode="popLayout">
                  {visibleProducts.map((product, index) => {
                    const productKey = getHairProductKey(product);
                    const saved = isHairProductSaved(product);
                    const busy = savingKey === productKey;

                    const image =
                      product.image || product.image_url || "";

                    const purchaseLink =
                      product.purchase_link || product.url || "";

                    return (
                      <motion.article
                        layout
                        className="haircare-live-product"
                        key={`${productKey}-${index}`}
                        onPointerMove={spot}
                        initial={{ opacity: 0, y: 18, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.94 }}
                        transition={{
                          duration: 0.45,
                          ease: EASE,
                          delay: Math.min(index, 8) * 0.05,
                        }}
                      >
                        <div
                          className="haircare-live-product-image"
                          onPointerMove={tilt}
                          onPointerLeave={untilt}
                        >
                          {image ? (
                            <img
                              src={image}
                              alt={getProductName(product)}
                              loading="lazy"
                              onError={(event) => {
                                event.currentTarget.style.display = "none";
                              }}
                            />
                          ) : (
                            <div className="haircare-product-image-fallback">
                              <HiOutlineBeaker />
                            </div>
                          )}

                          <span className="haircare-product-type">
                            {product.category || "Hair care"}
                          </span>
                        </div>

                        <div className="haircare-live-product-info">
                          <div className="haircare-live-product-brand">
                            {product.brand || "Hair-care essentials"}
                          </div>

                          <h4>{getProductName(product)}</h4>

                          {product.description && (
                            <p className="haircare-product-description">
                              {product.description}
                            </p>
                          )}

                          <div className="haircare-live-product-meta">
                            <strong>
                              {formatPrice(product.price)}
                            </strong>

                            {product.rating !== null &&
                              product.rating !== undefined &&
                              product.rating !== "" && (
                                <span className="haircare-product-rating">
                                  ★ {product.rating}
                                </span>
                              )}
                          </div>

                          {getProductStore(product) && (
                            <p className="haircare-product-store">
                              Available at {getProductStore(product)}
                            </p>
                          )}

                          {purchaseLink ? (
                            <a
                              className="haircare-shop-link"
                              href={purchaseLink}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <HiOutlineExternalLink />
                              Shop product
                            </a>
                          ) : (
                            <span className="haircare-unavailable-link">
                              Purchase link unavailable
                            </span>
                          )}

                          <button
                            type="button"
                            className={`haircare-save-product ${
                              saved ? "is-saved" : ""
                            }`}
                            onClick={() => toggleSaveHairProduct(product)}
                            disabled={Boolean(savingKey)}
                            aria-pressed={saved}
                          >
                            <motion.span
                              key={`${busy}-${saved}`}
                              className="haircare-save-icon"
                              initial={{ scale: 0.4, rotate: -25 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ type: "spring", stiffness: 520, damping: 15 }}
                            >
                              {busy ? (
                                <HiOutlineRefresh className="haircare-spinning" />
                              ) : saved ? (
                                <HiOutlineCheckCircle />
                              ) : (
                                <HiOutlineBookmark />
                              )}
                            </motion.span>

                            {busy
                              ? "Updating..."
                              : saved
                                ? "Saved · Remove"
                                : "Save product"}
                          </button>
                        </div>
                      </motion.article>
                    );
                  })}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="haircare-empty-products">
                  <div className="haircare-empty-icon">
                    <HiOutlineShoppingBag />
                  </div>
                  <h4>No product offers available yet</h4>
                  <p>
                    Your routine is ready, but the product research service
                    did not return any offers. Try again later.
                  </p>
                </div>
              )}
            </section>

            <div className="haircare-bottom-actions">
              <button
                type="button"
                className="haircare-primary-button"
                onClick={resetQuestionnaire}
              >
                <HiOutlineRefresh />
                Start again
              </button>
            </div>
          </motion.section>
        )}
      </div>
      <AnimatePresence>
        {toast && (
          <motion.div
            className="haircare-toast"
            role="status"
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </main>
    </MotionConfig>
  );
}
