
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
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

  return (
    <main className="haircare-page">
      <div className="haircare-orb haircare-orb-one" />
      <div className="haircare-orb haircare-orb-two" />

      <div className="haircare-shell">
        <motion.section
          className="haircare-hero"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: EASE }}
        >
          <div className="haircare-eyebrow">
            <HiOutlineSparkles />
            <span>DERMANOVA AI · HAIR INTELLIGENCE</span>
          </div>

          <h1 className="haircare-title">
            Your hair,
            <span> understood.</span>
          </h1>

          <p className="haircare-subtitle">
            Discover a hair-care routine tailored to your hair type,
            scalp condition and personal concerns.
          </p>

          <div className="haircare-trust-row">
            <span>
              <HiOutlineCheckCircle />
              Personalised routine
            </span>
            <span>
              <HiOutlineBeaker />
              Targeted product categories
            </span>
            <span>
              <HiOutlineHeart />
              Made for your needs
            </span>
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
                  YOUR HAIR PROFILE
                </span>
                <h2>Let's get to know your hair</h2>
                <p>
                  A few simple answers help us personalise your routine.
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

            {step === 1 ? (
              <div className="haircare-fields">
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
                  <div className="haircare-field" key={question.field}>
                    <div className="haircare-field-heading">
                      <h3>{question.title}</h3>
                      <p>{question.description}</p>
                    </div>

                    <div className="haircare-options">
                      {OPTIONS[question.field].map((option) => (
                        <button
                          type="button"
                          key={option}
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
                          {option}
                          {profile[question.field] === option && (
                            <HiOutlineCheckCircle />
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
              </div>
            ) : (
              <div className="haircare-fields">
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

                <div className="haircare-profile-preview">
                  <div className="haircare-profile-preview-icon">
                    <HiOutlineSparkles />
                  </div>

                  <div>
                    <h4>Your profile is taking shape</h4>
                    <p>
                      {profile.hair_type} · {profile.hair_length} hair ·{" "}
                      {profile.scalp_condition} scalp
                    </p>
                    <span>
                      {profile.hair_concerns.length} concern
                      {profile.hair_concerns.length === 1 ? "" : "s"} selected
                    </span>
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
              </div>
            )}
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
                  YOUR PERSONAL HAIR PLAN
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
                    <p>A practical plan based on your selected concerns.</p>
                  </div>
                </div>

                <div className="haircare-routine-list">
                  {routine.map((item, index) => (
                    <motion.article
                      className="haircare-routine-item"
                      key={`${item.step || "step"}-${index}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.35,
                        delay: index * 0.06,
                      }}
                    >
                      <div className="haircare-routine-number">
                        {String(index + 1).padStart(2, "0")}
                      </div>

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

              {products.length > 0 ? (
                <div className="haircare-live-product-grid">
                  {products.map((product, index) => {
                    const productKey = getHairProductKey(product);
                    const saved = isHairProductSaved(product);
                    const busy = savingKey === productKey;

                    const image =
                      product.image || product.image_url || "";

                    const purchaseLink =
                      product.purchase_link || product.url || "";

                    return (
                      <motion.article
                        className="haircare-live-product"
                        key={`${productKey}-${index}`}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.35,
                          delay: index * 0.05,
                        }}
                      >
                        <div className="haircare-live-product-image">
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
                            {busy ? (
                              <HiOutlineRefresh className="haircare-spinning" />
                            ) : saved ? (
                              <HiOutlineCheckCircle />
                            ) : (
                              <HiOutlineBookmark />
                            )}

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
    </main>
  );
}
