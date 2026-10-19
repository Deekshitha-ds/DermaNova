
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  HiOutlineHeart,
  HiOutlineArrowNarrowLeft,
  HiOutlineExternalLink,
  HiOutlineShoppingBag,
  HiOutlineSparkles,
} from "react-icons/hi";
import { FaYoutube } from "react-icons/fa";

import {
  getSavedProducts,
  deleteSavedProduct,
} from "../api/savedProducts";

export default function SavedProducts() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [removingId, setRemovingId] = useState(null);

  const loadProducts = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getSavedProducts();

      const data =
        response?.data?.products ??
        response?.data ??
        response?.products ??
        [];

      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
          err?.response?.data?.message ||
          "Unable to load your saved products."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const removeProduct = async (product) => {
    const id = product.id ?? product.saved_product_id;

    if (id === null || id === undefined) {
      setError("The saved product ID is missing.");
      return;
    }

    setRemovingId(id);
    setError("");

    try {
      await deleteSavedProduct(id);

      setProducts((current) =>
        current.filter(
          (item) =>
            (item.id ?? item.saved_product_id) !== id
        )
      );
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
          err?.response?.data?.message ||
          "Unable to remove this product."
      );
    } finally {
      setRemovingId(null);
    }
  };

  // Accept only valid HTTP/HTTPS URLs.
  const safeLink = (url) => {
    if (!url || typeof url !== "string") return null;

    try {
      const parsed = new URL(url);

      return ["https:", "http:"].includes(parsed.protocol)
        ? parsed.href
        : null;
    } catch {
      return null;
    }
  };

  // Generate a product-specific YouTube tutorial search.
  const getHowToUseLink = (product, name) => {
    const brand = product.brand || "";
    const searchText =
      `${brand} ${name} how to use official tutorial`.trim();

    return `https://www.youtube.com/results?search_query=${encodeURIComponent(
      searchText
    )}`;
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-violet-50 via-fuchsia-50/60 to-purple-100/70 px-4 py-7 text-violet-950 sm:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Back to dashboard */}
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-white bg-white/70 px-4 py-2.5 text-sm font-semibold text-violet-800 shadow-sm backdrop-blur-xl transition hover:bg-white"
        >
          <HiOutlineArrowNarrowLeft className="h-4 w-4" />
          Back to dashboard
        </button>

        {/* Page header */}
        <header className="mb-9 rounded-[32px] border border-white/80 bg-white/70 p-7 shadow-[0_25px_55px_-30px_rgba(124,58,237,.35)] backdrop-blur-xl sm:p-10">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-100 to-fuchsia-100 text-fuchsia-600">
            <HiOutlineHeart className="h-6 w-6" />
          </div>

          <p className="mb-2 text-xs font-bold uppercase tracking-[.22em] text-fuchsia-600">
            YOUR PERSONAL COLLECTION
          </p>

          <h1 className="text-4xl font-semibold tracking-tight text-violet-950 sm:text-5xl">
            Saved <span className="text-fuchsia-500">for you.</span>
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-7 text-violet-900/60">
            Your favourite skincare finds, all in one place.
            Revisit your products and learn how to use them
            whenever you need them.
          </p>

          {!loading && (
            <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-violet-100 bg-white/80 px-4 py-2 text-sm font-semibold text-violet-700">
              <HiOutlineShoppingBag className="h-4 w-4" />
              {products.length} saved{" "}
              {products.length === 1 ? "product" : "products"}
            </p>
          )}
        </header>

        {/* Error message */}
        {error && (
          <div
            role="alert"
            className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700"
          >
            {error}
            <button
              type="button"
              onClick={loadProducts}
              className="ml-3 font-semibold underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading state */}
        {loading ? (
          <div className="rounded-3xl border border-white/80 bg-white/70 p-12 text-center">
            <HiOutlineSparkles className="mx-auto mb-4 h-9 w-9 animate-pulse text-fuchsia-500" />
            <p className="font-medium text-violet-800">
              Gathering your favourites...
            </p>
          </div>
        ) : products.length === 0 ? (
          /* Empty state */
          <div className="rounded-[30px] border border-white/80 bg-white/65 px-6 py-14 text-center shadow-sm backdrop-blur-xl">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-violet-100 text-violet-500">
              <HiOutlineHeart className="h-8 w-8" />
            </div>

            <h2 className="text-2xl font-semibold text-violet-950">
              Your collection starts here
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-violet-900/60">
              You haven't saved any products yet. Explore your
              personalized recommendations and save the ones you like.
            </p>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="mt-6 rounded-2xl bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-400 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5"
            >
              Explore recommendations
            </button>
          </div>
        ) : (
          /* Saved product cards */
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product, index) => {
              const id = product.id ?? product.saved_product_id;

              const name =
                product.product_name ||
                product.name ||
                "Skincare product";

              const image =
                product.image_url ||
                product.image ||
                product.thumbnail;

              const link = safeLink(
                product.purchase_link ||
                  product.product_url ||
                  product.link ||
                  ""
              );

              const price =
                product.price ?? product.displayed_price;

              const howToUseLink = getHowToUseLink(product, name);

              return (
                <article
                  key={id ?? `${name}-${index}`}
                  className="flex flex-col overflow-hidden rounded-[26px] border border-white/80 bg-white/75 p-3 shadow-[0_15px_35px_-25px_rgba(109,40,217,.4)] backdrop-blur-xl transition hover:-translate-y-1 hover:shadow-xl"
                >
                  {/* Product image */}
                  <div className="flex h-52 items-center justify-center overflow-hidden rounded-[21px] bg-gradient-to-br from-violet-50 via-fuchsia-50 to-pink-100 p-5">
                    {image ? (
                      <img
                        src={image}
                        alt={name}
                        loading="lazy"
                        className="h-full w-full object-contain"
                        onError={(event) => {
                          event.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <HiOutlineShoppingBag className="h-12 w-12 text-violet-300" />
                    )}
                  </div>

                  <div className="flex flex-1 flex-col px-2 pb-2 pt-4">
                    {/* Brand */}
                    {product.brand && (
                      <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-fuchsia-600">
                        {product.brand}
                      </p>
                    )}

                    {/* Product name */}
                    <h2 className="line-clamp-2 min-h-12 text-sm font-semibold leading-6 text-violet-950">
                      {name}
                    </h2>

                    {/* Store */}
                    {product.store && (
                      <p className="mt-2 text-xs text-violet-900/50">
                        {product.store}
                      </p>
                    )}

                    {/* Price */}
                    <p className="mt-4 text-xl font-bold text-violet-950">
                      {price === null ||
                      price === undefined ||
                      price === ""
                        ? "Price unavailable"
                        : typeof price === "number"
                          ? `₹${price.toLocaleString("en-IN")}`
                          : String(price).match(/[₹$€£]/)
                            ? String(price)
                            : `₹${price}`}
                    </p>

                    {/* Product actions */}
                    <div className="mt-auto space-y-2 pt-4">
                      {/* Purchase link */}
                      {link ? (
                        <a
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-400 px-4 py-3 text-sm font-semibold text-white transition hover:shadow-lg hover:shadow-violet-200"
                        >
                          View product
                          <HiOutlineExternalLink className="h-4 w-4" />
                        </a>
                      ) : (
                        <p className="rounded-xl bg-violet-50 p-3 text-center text-xs text-violet-500">
                          Purchase link unavailable
                        </p>
                      )}

                      {/* YouTube how-to-use tutorial */}
                      <a
                        href={howToUseLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Find a YouTube tutorial for how to use ${name}`}
                        className="flex items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-white px-4 py-3 text-sm font-semibold text-rose-600 transition hover:border-rose-300 hover:bg-rose-50"
                      >
                        <FaYoutube className="h-5 w-5" />
                        How to Use
                        <HiOutlineExternalLink className="h-4 w-4" />
                      </a>

                      {/* Remove saved product */}
                      <button
                        type="button"
                        disabled={removingId === id}
                        onClick={() => removeProduct(product)}
                        className="w-full rounded-2xl border border-violet-200 bg-white/70 px-4 py-2.5 text-xs font-semibold text-violet-700 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50"
                      >
                        {removingId === id
                          ? "Removing..."
                          : "Remove from collection"}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
