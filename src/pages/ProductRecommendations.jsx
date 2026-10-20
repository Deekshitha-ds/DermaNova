
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  HiOutlineSparkles,
  HiOutlineHeart,
  HiOutlineShoppingBag,
  HiOutlineArrowRight,
  HiOutlineExternalLink,
  HiOutlineBookmark,
  HiOutlineCheckCircle,
  HiOutlineArrowNarrowLeft,
  HiOutlineShieldCheck,
  HiOutlineStar,
} from "react-icons/hi";
import { FaYoutube } from "react-icons/fa";

import { getScanRecommendations } from "../api/skinAnalysis";
import {
  getSavedProducts,
  saveProduct,
  deleteSavedProduct,
} from "../api/savedProducts";
import SerumLoader from "../components/SerumLoader";

/* -------------------------------------------------------
   HELPERS
------------------------------------------------------- */

const normalizeProducts = (value) => {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value.flatMap((item) => {
      if (Array.isArray(item)) return normalizeProducts(item);
      return item ? [item] : [];
    });
  }

  if (typeof value === "object") {
    if (Array.isArray(value.products)) return value.products;
    if (Array.isArray(value.recommendations)) {
      return value.recommendations;
    }
    if (Array.isArray(value.items)) return value.items;
    if (value.product && typeof value.product === "object") {
      return [value.product];
    }

    if (value.name || value.product_name || value.product_name === "") {
      return [value];
    }
  }

  return [];
};

const getProductKey = (product) => {
  const identifier =
    product?.product_key ??
    product?.id ??
    product?.product_id ??
    product?.name ??
    product?.product_name ??
    "unknown-product";

  return String(identifier).trim().toLowerCase();
};

const formatPrice = (price) => {
  if (price === null || price === undefined || price === "") {
    return "Price unavailable";
  }

  if (typeof price === "string") {
    const cleaned = price.trim();

    if (!cleaned) return "Price unavailable";
    if (/[₹$€£]/.test(cleaned)) return cleaned;

    const numeric = Number(cleaned.replace(/,/g, ""));
    if (!Number.isFinite(numeric)) return cleaned;

    return `₹${numeric.toLocaleString("en-IN")}`;
  }

  const numeric = Number(price);

  if (!Number.isFinite(numeric)) return "Price unavailable";

  return `₹${numeric.toLocaleString("en-IN")}`;
};

const getProductName = (product) =>
  product?.product_name || product?.name || "Recommended skincare product";

const getProductImage = (product) =>
  product?.image_url || product?.image || product?.thumbnail || "";

const getProductLink = (product) =>
  product?.purchase_link || product?.product_url || product?.link || "";
const getHowToUseLink = (product) => {
  const name = getProductName(product);
  const brand = product?.brand || "";

  const searchText =
    `${brand} ${name} how to use official tutorial`.trim();

  return `https://www.youtube.com/results?search_query=${encodeURIComponent(
    searchText
  )}`;
};

const getProductRating = (product) => {
  const rating = Number(product?.rating);

  return Number.isFinite(rating) && rating > 0 && rating <= 5
    ? rating
    : null;
};

const getStoreName = (product) =>
  product?.store || product?.merchant || product?.source || "";

const getCategory = (product, fallback) =>
  product?.category || product?.product_category || fallback;

const isSafeUrl = (url) => {
  if (typeof url !== "string" || !url.trim()) return false;

  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
};

/* -------------------------------------------------------
   SMALL REUSABLE COMPONENTS
------------------------------------------------------- */

function SectionHeading({ eyebrow, title, description, icon }) {
  const Icon = icon || HiOutlineSparkles;

  return (
    <div className="mb-6 flex items-start gap-3">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/80 bg-gradient-to-br from-violet-100 via-fuchsia-50 to-pink-100 text-violet-600 shadow-sm">
        <Icon className="h-6 w-6" />
      </div>

      <div className="min-w-0">
        <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.23em] text-fuchsia-600 sm:text-[11px]">
          {eyebrow}
        </p>

        <h2 className="dn-serif text-2xl font-semibold leading-tight text-violet-950 sm:text-3xl">
          {title}
        </h2>

        {description && (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-violet-900/60">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

function ProductCard({
  product,
  category,
  analysisId,
  saved,
  saving,
  onToggleSave,
}) {
  const name = getProductName(product);
  const image = getProductImage(product);
  const link = getProductLink(product);
  const howToUseLink = getHowToUseLink(product);
  const rating = getProductRating(product);
  const store = getStoreName(product);
  const price = formatPrice(product?.price ?? product?.displayed_price);
  const key = getProductKey(product);

  const [imageFailed, setImageFailed] = useState(false);

  return (
    <article className="dn-product-card group relative flex h-full flex-col overflow-hidden rounded-[26px] border border-white/80 bg-white/75 shadow-[0_12px_35px_-22px_rgba(109,40,217,0.28)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-fuchsia-200 hover:shadow-[0_24px_48px_-24px_rgba(147,51,234,0.36)]">
      {/* Image area */}
      <div className="relative m-3 mb-0 overflow-hidden rounded-[21px] border border-violet-100/70 bg-gradient-to-br from-violet-50 via-fuchsia-50/70 to-pink-50">
        <div className="absolute left-3 top-3 z-10 flex items-center gap-1.5 rounded-full border border-white/90 bg-white/85 px-3 py-1.5 text-[10px] font-semibold text-violet-700 shadow-sm backdrop-blur-md">
          <HiOutlineSparkles className="h-3.5 w-3.5 text-fuchsia-500" />
          AI matched
        </div>

        <button
          type="button"
          onClick={() => onToggleSave(product, category, key)}
          disabled={saving}
          aria-label={saved ? "Remove saved product" : "Save product"}
          title={saved ? "Remove from saved products" : "Save product"}
          className={`absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-200 ${
            saved
              ? "border-fuchsia-200 bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-md"
              : "border-white/90 bg-white/90 text-violet-600 shadow-sm hover:border-fuchsia-200 hover:bg-fuchsia-50"
          } ${saving ? "cursor-wait opacity-60" : ""}`}
        >
          {saved ? (
            <HiOutlineHeart className="h-5 w-5" />
          ) : (
            <HiOutlineBookmark className="h-[18px] w-[18px]" />
          )}
        </button>

        <div className="flex h-[205px] items-center justify-center p-5 sm:h-[220px]">
          {image && !imageFailed ? (
            <img
              src={image}
              alt={name}
              loading="lazy"
              onError={() => setImageFailed(true)}
              className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.05]"
            />
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 text-violet-400">
              <div className="flex h-20 w-20 items-center justify-center rounded-[25px] border border-white bg-white/75 shadow-sm">
                <HiOutlineShoppingBag className="h-9 w-9" />
              </div>
              <span className="text-xs font-medium text-violet-500/70">
                Product preview unavailable
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Product details */}
      <div className="flex flex-1 flex-col p-5 pt-4">
        {product?.brand && (
          <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-fuchsia-600">
            {product.brand}
          </p>
        )}

        <h3 className="line-clamp-2 min-h-[48px] text-[15px] font-semibold leading-6 text-violet-950">
          {name}
        </h3>

        <div className="mt-2 flex min-h-5 flex-wrap items-center gap-x-3 gap-y-1">
          {rating !== null && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-violet-800">
              <HiOutlineStar className="h-4 w-4 fill-amber-300 text-amber-500" />
              {rating.toFixed(1)}
            </span>
          )}

          {store && (
            <span className="max-w-full truncate text-xs text-violet-900/50">
              {store}
            </span>
          )}
        </div>

        {product?.description && (
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-violet-900/60">
            {product.description}
          </p>
        )}

        <div className="mt-auto pt-5">
          <div className="mb-4 flex items-end justify-between gap-2">
            <div>
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-violet-900/45">
                Product price
              </p>
              <p className="text-xl font-bold tracking-tight text-violet-950">
                {price}
              </p>
            </div>

            {saved && (
              <span className="mb-1 inline-flex items-center gap-1 text-[11px] font-semibold text-fuchsia-600">
                <HiOutlineCheckCircle className="h-4 w-4" />
                Saved
              </span>
            )}
          </div>

          {isSafeUrl(link) ? (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="group/buy flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-400 px-4 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_-10px_rgba(147,51,234,0.8)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_25px_-10px_rgba(147,51,234,0.7)] focus:outline-none focus:ring-2 focus:ring-fuchsia-300 focus:ring-offset-2"
            >
              View product
              <HiOutlineExternalLink className="h-4 w-4 transition-transform group-hover/buy:translate-x-0.5" />
            </a>
          ) : (
            <div className="flex w-full items-center justify-center gap-2 rounded-2xl border border-violet-100 bg-violet-50/80 px-4 py-3 text-sm font-medium text-violet-400">
              Purchase link unavailable
            </div>
          )}
          
          <a
            href={howToUseLink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Find a YouTube tutorial for how to use ${name}`}
            className="mt-2.5 flex w-full items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-white px-4 py-3 text-sm font-semibold text-rose-600 transition hover:border-rose-300 hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-200 focus:ring-offset-2"
          >
            <FaYoutube className="h-5 w-5" />
            How to Use
            <HiOutlineExternalLink className="h-4 w-4" />
          </a>

          <button
            type="button"
            onClick={() => onToggleSave(product, category, key)}
            disabled={saving}
            className="mt-2.5 flex w-full items-center justify-center gap-2 rounded-2xl border border-violet-200/80 bg-white/70 px-4 py-2.5 text-xs font-semibold text-violet-700 transition hover:border-fuchsia-200 hover:bg-fuchsia-50/80 disabled:cursor-wait disabled:opacity-60"
          >
            {saving
              ? "Updating saved products..."
              : saved
                ? "Remove from saved"
                : "Save to my collection"}
          </button>
        </div>
      </div>
    </article>
  );
}

function ProductSection({
  eyebrow,
  title,
  description,
  icon,
  products,
  category,
  analysisId,
  savedKeys,
  savingKey,
  onToggleSave,
}) {
  const normalized = normalizeProducts(products);

  if (normalized.length === 0) return null;

  return (
    <section className="mb-12">
      <SectionHeading
        eyebrow={eyebrow}
        title={title}
        description={description}
        icon={icon}
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {normalized.map((product, index) => {
          const key = getProductKey(product);

          return (
            <ProductCard
              key={`${key}-${index}`}
              product={product}
              category={category}
              analysisId={analysisId}
              saved={savedKeys.has(key)}
              saving={savingKey === key}
              onToggleSave={onToggleSave}
            />
          );
        })}
      </div>
    </section>
  );
}

/* -------------------------------------------------------
   MAIN PAGE
------------------------------------------------------- */

export default function ProductRecommendations() {
  const navigate = useNavigate();
  const { analysisId } = useParams();

  const [recommendations, setRecommendations] = useState(null);
  const [savedProducts, setSavedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saveError, setSaveError] = useState("");
  const [savingKey, setSavingKey] = useState("");

  useEffect(() => {
    let active = true;

    const loadPage = async () => {
      setLoading(true);
      setError("");

      try {
        if (!analysisId) {
          throw new Error(
            "Scan ID is missing. Please open recommendations from your scan results."
          );
        }

        const [recommendationResponse, savedResponse] =
          await Promise.all([
            getScanRecommendations(analysisId),
            getSavedProducts().catch(() => null),
          ]);

        if (!active) return;

        const recommendationData =
          recommendationResponse?.data ?? recommendationResponse;

        setRecommendations(recommendationData);

        setSavedProducts(
          savedResponse?.data?.products ??
            savedResponse?.products ??
            []
        );
      } catch (err) {
        if (!active) return;

        setError(
          err?.response?.data?.detail ||
            err?.response?.data?.message ||
            err?.message ||
            "We couldn't load your product recommendations. Please try again."
        );
      } finally {
        if (active) setLoading(false);
      }
    };

    loadPage();

    return () => {
      active = false;
    };
  }, [analysisId]);

  const savedKeys = useMemo(() => {
    return new Set(
      savedProducts.map((item) =>
        getProductKey({
          ...item,
          name: item?.product_name || item?.name,
        })
      )
    );
  }, [savedProducts]);

  const sections = useMemo(
    () => [
      {
        id: "recommended",
        eyebrow: "PERSONALIZED FOR YOU",
        title: "Your skin's essentials",
        description:
          "Products selected from your analysis to help you build a routine that suits your skin.",
        icon: HiOutlineSparkles,
        category: "skincare",
        products: normalizeProducts(
          recommendations?.major_recommendation
        ),
      },
      {
        id: "morning",
        eyebrow: "YOUR AM RITUAL",
        title: "Morning routine",
        description:
          "Start your day with a considered routine designed around your skincare needs.",
        icon: HiOutlineSparkles,
        category: "morning routine",
        products: normalizeProducts(recommendations?.morning_routine),
      },
      {
        id: "evening",
        eyebrow: "YOUR PM RITUAL",
        title: "Evening routine",
        description:
          "Wind down with your personalized evening skincare selections.",
        icon: HiOutlineHeart,
        category: "evening routine",
        products: normalizeProducts(recommendations?.evening_routine),
      },
    ],
    [recommendations]
  );

  const totalProducts = sections.reduce(
    (total, section) => total + section.products.length,
    0
  );

  const handleToggleSave = async (product, category, key) => {
    setSaveError("");
    setSavingKey(key);

    try {
      const existing = savedProducts.find(
        (item) => getProductKey(item) === key
      );

      if (existing) {
        const savedId = existing.id ?? existing.saved_product_id;

        if (savedId === null || savedId === undefined) {
          throw new Error(
            "This saved product has no ID, so it cannot be removed."
          );
        }

        await deleteSavedProduct(savedId);

        setSavedProducts((current) =>
          current.filter((item) => getProductKey(item) !== key)
        );
      } else {
        const payload = {
          product_key: key,
          product_name: getProductName(product),
          brand: product?.brand || "",
          category: getCategory(product, category),
          price: product?.price ?? product?.displayed_price ?? null,
          image_url: getProductImage(product),
          rating: product?.rating ?? null,
          description: product?.description || "",
          store: getStoreName(product),
          purchase_link: getProductLink(product),
          analysis_id: analysisId,
        };

        const response = await saveProduct(payload);
        const savedItem = response?.data?.product;

        setSavedProducts((current) => [
          ...current,
          savedItem || {
            ...payload,
            id: `local-${key}`,
          },
        ]);
      }
    } catch (err) {
      setSaveError(
        err?.response?.data?.detail ||
          err?.response?.data?.message ||
          err?.message ||
          "We couldn't update your saved products. Please try again."
      );
    } finally {
      setSavingKey("");
    }
  };

  const retryLoading = () => {
    window.location.reload();
  };

  return (
    <main className="dn-recommendations relative min-h-screen overflow-hidden bg-gradient-to-br from-violet-50 via-fuchsia-50/60 to-purple-100/70 px-4 pb-16 pt-6 text-violet-950 sm:px-6 sm:pt-8 lg:px-10">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&display=swap');

        .dn-recommendations {
          isolation: isolate;
        }

        .dn-recommendations .dn-serif {
          font-family: 'Fraunces', Georgia, serif;
        }

        .dn-recommendations .dn-grad-text {
          background: linear-gradient(100deg, #c026d3, #ec4899, #a78bfa, #ec4899, #c026d3);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .dn-recommendations .dn-glass {
          border: 1px solid rgba(255,255,255,.82);
          background: rgba(255,255,255,.70);
          box-shadow: 0 30px 60px -30px rgba(124,58,237,.28), inset 0 1px 0 rgba(255,255,255,.95);
          backdrop-filter: blur(22px);
          -webkit-backdrop-filter: blur(22px);
        }

        .dn-recommendations .dn-orb {
          position: absolute;
          border-radius: 9999px;
          filter: blur(55px);
          pointer-events: none;
          z-index: -1;
        }

        @keyframes dn-soft-pulse {
          0%, 100% { opacity: .48; transform: scale(1); }
          50% { opacity: .75; transform: scale(1.06); }
        }

        .dn-recommendations .dn-pulse {
          animation: dn-soft-pulse 3s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .dn-recommendations *,
          .dn-recommendations *::before,
          .dn-recommendations *::after {
            animation-duration: .01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: .01ms !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>

      {/* Soft ambient background */}
      <div className="dn-orb dn-pulse left-[-100px] top-[100px] h-64 w-64 bg-violet-300/45" />
      <div className="dn-orb right-[-100px] top-[300px] h-72 w-72 bg-fuchsia-200/55" />
      <div className="dn-orb bottom-[100px] left-[30%] h-64 w-64 bg-purple-200/50" />

      <div className="relative mx-auto max-w-[1400px]">
        {/* Top navigation */}
        <div className="mb-8 flex items-center justify-between gap-3">
          <button
            type="button"
           onClick={() => navigate("/scan/skin")}
            className="inline-flex items-center gap-2 rounded-full border border-white/90 bg-white/65 px-4 py-2.5 text-sm font-semibold text-violet-800 shadow-sm backdrop-blur-xl transition hover:border-violet-200 hover:bg-white"
          >
            <HiOutlineArrowNarrowLeft className="h-4 w-4" />
            Back to scan
          </button>

          <div className="flex items-center gap-2 rounded-full border border-white/80 bg-white/65 px-3 py-2 text-xs font-semibold text-violet-700 shadow-sm backdrop-blur-xl sm:px-4">
            <HiOutlineShieldCheck className="h-4 w-4 text-fuchsia-500" />
            Your personal skincare space
          </div>
        </div>

        {/* Hero */}
        <section className="dn-glass relative mb-10 overflow-hidden rounded-[30px] p-6 sm:rounded-[38px] sm:p-10 lg:p-12">
          <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-fuchsia-200/35 blur-3xl" />
          <div className="absolute bottom-[-80px] right-[25%] h-52 w-52 rounded-full bg-violet-200/35 blur-3xl" />

          <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_auto] lg:gap-12">
            <div className="max-w-3xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-fuchsia-100 bg-white/75 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-fuchsia-700 shadow-sm sm:text-xs">
                <HiOutlineSparkles className="h-4 w-4" />
                DermaNova AI · Smart recommendations
              </div>

              <h1 className="dn-serif text-4xl font-semibold leading-[1.12] tracking-tight text-violet-950 sm:text-5xl lg:text-6xl">
                Your skin,
                <br />
                <span className="dn-grad-text">your ritual.</span>
              </h1>

              <p className="mt-5 max-w-xl text-sm leading-7 text-violet-900/65 sm:text-base">
                Discover products chosen around your skin analysis and
                explore a personalized routine that feels right for you.
                Thoughtful skincare starts with understanding your skin.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href="#recommended"
                  onClick={(event) => {
                    event.preventDefault();
                    document
                      .getElementById("recommended")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-400 px-5 py-3.5 text-sm font-semibold text-white shadow-[0_10px_25px_-12px_rgba(147,51,234,0.8)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-12px_rgba(147,51,234,0.8)]"
                >
                  Explore my products
                  <HiOutlineArrowRight className="h-4 w-4" />
                </a>

                <button
                  type="button"
                  onClick={() => navigate("/saved-products")}
                  className="inline-flex items-center gap-2 rounded-2xl border border-violet-200/80 bg-white/70 px-5 py-3.5 text-sm font-semibold text-violet-800 transition hover:border-fuchsia-200 hover:bg-white"
                >
                  <HiOutlineHeart className="h-4 w-4 text-fuchsia-500" />
                  My collection
                </button>
              </div>
            </div>

            {/* Decorative hero card */}
            <div className="relative mx-auto w-full max-w-[270px] lg:mr-2">
              <div className="absolute inset-3 rounded-[35px] bg-gradient-to-br from-violet-300/50 via-fuchsia-200/50 to-pink-200/50 blur-2xl" />

              <div className="relative rounded-[30px] border border-white/90 bg-white/60 p-5 shadow-[0_20px_50px_-28px_rgba(124,58,237,.45)] backdrop-blur-xl">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-100 to-fuchsia-100 text-violet-600">
                    <HiOutlineSparkles className="h-5 w-5" />
                  </div>
                  <span className="rounded-full border border-fuchsia-100 bg-fuchsia-50/80 px-3 py-1.5 text-[10px] font-semibold text-fuchsia-700">
                    Your skin edit
                  </span>
                </div>

                <div className="flex aspect-square items-center justify-center rounded-[25px] bg-gradient-to-br from-violet-100 via-fuchsia-50 to-pink-100">
                  <div className="relative flex h-36 w-36 items-center justify-center rounded-full border border-white/90 bg-white/45 shadow-inner">
                    <div className="absolute inset-3 rounded-full border border-violet-200/70" />
                    <div className="absolute inset-6 rounded-full border border-fuchsia-200/70" />
                    <HiOutlineSparkles className="h-14 w-14 text-fuchsia-500" />
                    <span className="absolute right-5 top-4 h-2.5 w-2.5 rounded-full bg-fuchsia-400 shadow-[0_0_0_5px_rgba(232,121,249,.15)]" />
                    <span className="absolute bottom-5 left-5 h-2 w-2 rounded-full bg-violet-400" />
                  </div>
                </div>

                <div className="mt-4">
                  <p className="dn-serif text-xl font-semibold text-violet-950">
                    Made for your skin
                  </p>
                  <p className="mt-1 text-xs leading-5 text-violet-900/55">
                    Personalized picks. Thoughtful routines.
                  </p>
                </div>

                <div className="mt-4 flex items-center gap-2 rounded-2xl border border-white bg-white/75 p-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                    <HiOutlineCheckCircle className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-violet-900">
                      Analysis-based selection
                    </p>
                    <p className="mt-0.5 text-[10px] text-violet-900/50">
                      A routine made more personal
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        {!loading && !error && (
          <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="dn-glass flex items-center gap-4 rounded-[25px] p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
                <HiOutlineShoppingBag className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-violet-950">
                  {totalProducts}
                </p>
                <p className="mt-0.5 text-xs text-violet-900/55">
                  Product selections
                </p>
              </div>
            </div>

            <div className="dn-glass flex items-center gap-4 rounded-[25px] p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-fuchsia-100 text-fuchsia-600">
                <HiOutlineSparkles className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-violet-950">
                  {sections.filter((section) => section.products.length > 0).length}
                </p>
                <p className="mt-0.5 text-xs text-violet-900/55">
                  Routine collections
                </p>
              </div>
            </div>

            <div className="dn-glass flex items-center gap-4 rounded-[25px] p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-100 text-pink-600">
                <HiOutlineHeart className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-violet-950">
                  {savedProducts.length}
                </p>
                <p className="mt-0.5 text-xs text-violet-900/55">
                  Saved favourites
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <section className="dn-glass flex min-h-[350px] flex-col items-center justify-center rounded-[30px] px-6 py-12 text-center">
            
           <SerumLoader />

            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.23em] text-fuchsia-600">
              A little skincare magic
            </p>

            <h2 className="dn-serif text-2xl font-semibold text-violet-950 sm:text-3xl">
              Curating your routine
            </h2>

            <p className="mt-3 max-w-md text-sm leading-6 text-violet-900/60">
              We're gathering your personalized product selections. This
              should only take a moment.
            </p>

            <div className="mt-6 h-1.5 w-44 overflow-hidden rounded-full bg-violet-100">
              <div className="h-full w-1/2 animate-pulse rounded-full bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400" />
            </div>
          </section>
        )}

        {/* Main error */}
        {!loading && error && (
          <section className="dn-glass rounded-[30px] px-6 py-12 text-center sm:px-10">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-100 to-fuchsia-100 text-violet-600">
              <HiOutlineSparkles className="h-8 w-8" />
            </div>

            <h2 className="dn-serif text-2xl font-semibold text-violet-950">
              We couldn't load your recommendations
            </h2>

            <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-violet-900/60">
              {error}
            </p>

            <button
              type="button"
              onClick={retryLoading}
              className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-400 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-200/70 transition hover:-translate-y-0.5"
            >
              Try again
              <HiOutlineArrowRight className="h-4 w-4" />
            </button>
          </section>
        )}

        {/* Recommendation sections */}
        {!loading && !error && (
          <>
            {saveError && (
              <div
                role="alert"
                className="mb-6 flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50/90 p-4 text-sm text-rose-700"
              >
                <span className="font-bold">!</span>
                <p>{saveError}</p>
                <button
                  type="button"
                  onClick={() => setSaveError("")}
                  className="ml-auto shrink-0 font-semibold underline"
                >
                  Dismiss
                </button>
              </div>
            )}

            {sections.map((section) => (
              <div id={section.id} key={section.id}>
                <ProductSection
                  eyebrow={section.eyebrow}
                  title={section.title}
                  description={section.description}
                  icon={section.icon}
                  products={section.products}
                  category={section.category}
                  analysisId={analysisId}
                  savedKeys={savedKeys}
                  savingKey={savingKey}
                  onToggleSave={handleToggleSave}
                />
              </div>
            ))}

            {totalProducts === 0 && (
              <section className="dn-glass rounded-[30px] px-6 py-12 text-center sm:px-10">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-100 to-fuchsia-100 text-violet-600">
                  <HiOutlineShoppingBag className="h-8 w-8" />
                </div>

                <h2 className="dn-serif text-2xl font-semibold text-violet-950">
                  Your product edit is still taking shape
                </h2>

                <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-violet-900/60">
                  No product recommendations are available for this scan
                  yet. Return to your scan results and try opening the
                  recommendations again.
                </p>

                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-400 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-200/70 transition hover:-translate-y-0.5"
                >
                  Return to scan results
                  <HiOutlineArrowRight className="h-4 w-4" />
                </button>
              </section>
            )}

            {/* Footer note */}
            <div className="mt-12 rounded-[25px] border border-white/80 bg-white/50 px-5 py-6 text-center backdrop-blur-xl sm:px-8">
              <div className="mb-2 flex items-center justify-center gap-2 text-violet-700">
                <HiOutlineShieldCheck className="h-5 w-5 text-fuchsia-500" />
                <p className="text-sm font-semibold">
                  Thoughtful choices, informed skincare
                </p>
              </div>

              <p className="mx-auto max-w-2xl text-xs leading-6 text-violet-900/55">
                Recommendations are for general skincare guidance and are
                not a medical diagnosis. Check product ingredients and
                patch-test new products. Consult a dermatologist for
                persistent or concerning skin conditions.
              </p>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
