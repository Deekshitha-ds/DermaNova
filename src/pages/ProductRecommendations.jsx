
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getScanRecommendations } from "../api/skinAnalysis";

const SAVED_PRODUCTS_KEY = "dermanova_saved_products";

function getProductKey(product) {
  return product.id != null
    ? `id-${product.id}`
    : `name-${(product.name || "product").toLowerCase().trim()}`;
}

function getSavedProducts() {
  try {
    return JSON.parse(localStorage.getItem(SAVED_PRODUCTS_KEY) || "[]");
  } catch {
    return [];
  }
}

function normalizeProducts(value) {
  if (!value) return [];
  return Array.isArray(value) ? value.filter(Boolean) : [value];
}

function ProductCard({ product, analysisId, savedKeys, onToggleSave }) {
  const key = getProductKey(product);
  const isSaved = savedKeys.includes(key);

  const youtubeUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
    `${product.name || "skincare product"} how to use`
  )}`;

  const purchaseUrl =
    typeof product.purchase_link === "string" &&
    /^https?:\/\//i.test(product.purchase_link)
      ? product.purchase_link
      : null;

  return (
    <article className="overflow-hidden rounded-3xl border border-purple-100 bg-white/90 p-5 shadow-sm transition hover:shadow-md">
      {product.image_url ? (
        <img
          src={product.image_url}
          alt={product.name || "Recommended skincare product"}
          className="h-52 w-full rounded-2xl bg-white object-contain"
          loading="lazy"
        />
      ) : (
        <div className="flex h-52 items-center justify-center rounded-2xl bg-purple-50 text-sm text-gray-500">
          No product image available
        </div>
      )}

      <h3 className="mt-4 text-lg font-semibold text-gray-900">
        {product.name || "Skincare product"}
      </h3>

      {product.brand && (
        <p className="mt-1 text-sm text-gray-500">{product.brand}</p>
      )}

      {product.price != null && (
        <p className="mt-3 text-xl font-bold text-purple-700">
          ₹{product.price}
        </p>
      )}

      {product.store && (
        <p className="mt-1 text-sm text-gray-600">
          Store: {product.store}
        </p>
      )}

      {product.rating != null && (
        <p className="mt-1 text-sm text-gray-600">
          Rating: {product.rating}
        </p>
      )}

      {product.description && (
        <p className="mt-3 text-sm leading-6 text-gray-600">
          {product.description}
        </p>
      )}

      <div className="mt-5 flex flex-col gap-3">
        {purchaseUrl ? (
          <a
            href={purchaseUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl bg-purple-600 px-4 py-3 text-center font-semibold text-white transition hover:bg-purple-700"
          >
            View Product
          </a>
        ) : (
          <p className="rounded-xl bg-gray-100 px-4 py-3 text-center text-sm text-gray-500">
            Purchase link unavailable
          </p>
        )}

        <a
          href={youtubeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-xl border border-purple-200 px-4 py-3 text-center font-semibold text-purple-700 transition hover:bg-purple-50"
        >
          ▶ Watch How to Use
        </a>

        <button
          type="button"
          onClick={() => onToggleSave(product, analysisId)}
          className={`rounded-xl border px-4 py-3 text-center font-semibold transition ${
            isSaved
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-gray-200 text-gray-700 hover:bg-gray-50"
          }`}
        >
          {isSaved ? "✓ Saved · Remove" : "♡ Save Product"}
        </button>
      </div>
    </article>
  );
}

function ProductSection({
  title,
  subtitle,
  products,
  analysisId,
  savedKeys,
  onToggleSave,
}) {
  return (
    <section className="mt-12">
      <div className="mb-5">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <p className="mt-2 text-sm text-gray-600">{subtitle}</p>
      </div>

      {products.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-purple-200 bg-white/70 p-6 text-sm text-gray-600">
          No products were returned for this section. Check that your backend
          recommendation response contains this routine.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product, index) => (
            <ProductCard
              key={`${getProductKey(product)}-${index}`}
              product={product}
              analysisId={analysisId}
              savedKeys={savedKeys}
              onToggleSave={onToggleSave}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default function ProductRecommendations() {
  const { analysisId } = useParams();

  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savedKeys, setSavedKeys] = useState(() =>
    getSavedProducts().map(getProductKey)
  );

  useEffect(() => {
    let cancelled = false;

    async function loadRecommendations() {
      try {
        setLoading(true);
        setError("");

        const response = await getScanRecommendations(analysisId);

        if (!cancelled) {
          setRecommendations(response.data);
        }
      } catch (err) {
        console.error("Recommendations error:", err);

        if (!cancelled) {
          setError(
            err.response?.data?.detail ||
              "Unable to load recommendations. Please try again."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    if (analysisId) {
      loadRecommendations();
    } else {
      setError("Scan ID is missing.");
      setLoading(false);
    }

    return () => {
      cancelled = true;
    };
  }, [analysisId]);

  function handleToggleSave(product, scanId) {
    const current = getSavedProducts();
    const key = getProductKey(product);
    const alreadySaved = current.some(
      (item) => getProductKey(item) === key
    );

    let updated;

    if (alreadySaved) {
      updated = current.filter((item) => getProductKey(item) !== key);
    } else {
      updated = [
        ...current,
        {
          ...product,
          analysis_id: scanId,
          saved_at: new Date().toISOString(),
        },
      ];
    }

    try {
      localStorage.setItem(SAVED_PRODUCTS_KEY, JSON.stringify(updated));
      setSavedKeys(updated.map(getProductKey));
    } catch (err) {
      console.error("Unable to save product:", err);
      alert("Unable to save this product in your browser.");
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <p className="text-lg font-medium">
          Finding suitable skincare products...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-8 text-center">
        <h1 className="text-2xl font-bold">
          Recommendations unavailable
        </h1>
        <p className="mt-3 text-red-600">{error}</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-5 rounded-xl border px-5 py-3"
        >
          Try Again
        </button>
      </div>
    );
  }

  const bestProducts = normalizeProducts(
    recommendations?.major_recommendation
  );
  const morningProducts = normalizeProducts(
    recommendations?.morning_routine
  );
  const nightProducts = normalizeProducts(
    recommendations?.evening_routine
  );

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-50/70 to-white px-5 py-10 md:px-10">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-semibold tracking-widest text-purple-600">
          DERMANOVA AI
        </p>

        <h1 className="mt-3 text-3xl font-bold text-gray-900 md:text-4xl">
          Your Personalized Skincare Plan
        </h1>

        <p className="mt-3 text-gray-600">
          Recommendations based on your skin scan.
        </p>

        <ProductSection
          title="⭐ Best Recommendations"
          subtitle="Products selected by your recommendation engine."
          products={bestProducts}
          analysisId={analysisId}
          savedKeys={savedKeys}
          onToggleSave={handleToggleSave}
        />

        <ProductSection
          title="☀️ Morning Routine"
          subtitle="Follow the recommended morning steps in order."
          products={morningProducts}
          analysisId={analysisId}
          savedKeys={savedKeys}
          onToggleSave={handleToggleSave}
        />

        <ProductSection
          title="🌙 Night Routine"
          subtitle="Your recommended evening skincare products."
          products={nightProducts}
          analysisId={analysisId}
          savedKeys={savedKeys}
          onToggleSave={handleToggleSave}
        />

        <p className="mt-10 text-xs leading-5 text-gray-500">
          Product recommendations are informational and are not a medical
          diagnosis. Introduce new skincare products cautiously and follow
          the product label. Seek professional advice for persistent or
          severe skin concerns.
        </p>
      </div>
    </main>
  );
}
