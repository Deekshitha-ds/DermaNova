
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
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_85%_20%,rgba(255,188,220,0.34),transparent_30%),radial-gradient(circle_at_15%_45%,rgba(194,171,255,0.34),transparent_34%),linear-gradient(135deg,#f8f4ff_0%,#eee8ff_48%,#fff4f8_100%)] px-4 py-6 text-[#2c204c] sm:px-8">

      {/* Soft ambient background accents */}
      <div className="pointer-events-none fixed -left-32 top-40 h-72 w-72 rounded-full bg-[#cbb5ff]/15 blur-3xl" />
      <div className="pointer-events-none fixed -right-24 top-24 h-80 w-80 rounded-full bg-[#ffb9dc]/20 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl">

        {/* Back to dashboard */}
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/65 px-4 py-2 text-sm font-semibold text-[#594080] shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-[#d8c7f5] hover:bg-white/90"
        >
          <HiOutlineArrowNarrowLeft className="h-4 w-4" />
          Back to dashboard
        </button>

        {/* Page header */}
        <header className="relative mb-8 overflow-hidden rounded-[28px] border border-white/85 bg-white/60 p-6 shadow-[0_18px_50px_rgba(108,78,148,0.09)] backdrop-blur-[22px] sm:p-8">
          <div className="pointer-events-none absolute -right-12 -top-20 h-52 w-52 rounded-full bg-[#d8c5ff]/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 right-1/4 h-44 w-44 rounded-full bg-[#ffc8e2]/20 blur-3xl" />

          <div className="relative">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-[17px] border border-white/90 bg-gradient-to-br from-[#f0e8ff] to-[#ffe8f3] text-[#9274d5] shadow-sm">
              <HiOutlineHeart className="h-6 w-6" />
            </div>

            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.23em] text-[#9274d5]">
              YOUR PERSONAL COLLECTION
            </p>

            <h1 className="text-3xl font-semibold tracking-tight text-[#2d204b] sm:text-4xl">
              Saved{" "}
              <span className="bg-gradient-to-r from-[#9271e0] to-[#e45fa4] bg-clip-text text-transparent">
                for you.
              </span>
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-[#77718d]">
              Your favourite skincare finds, thoughtfully
              collected in one place. Revisit your products
              and learn how to use them whenever you need.
            </p>

            {!loading && (
              <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#e8def8] bg-white/75 px-3.5 py-2 shadow-sm">
                <HiOutlineShoppingBag className="h-4 w-4 text-[#9274d5]" />
                <span className="text-xs font-semibold text-[#594080]">
                  {products.length} saved{" "}
                  {products.length === 1 ? "product" : "products"}
                </span>
              </div>
            )}
          </div>
        </header>

        {/* Error message */}
        {error && (
          <div
            role="alert"
            className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-rose-200/80 bg-white/80 p-4 text-sm text-rose-700 shadow-sm backdrop-blur-xl"
          >
            <span>{error}</span>

            <button
              type="button"
              onClick={loadProducts}
              className="font-semibold underline underline-offset-2"
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading state */}
        {loading ? (
          <div className="rounded-[26px] border border-white/85 bg-white/60 p-10 text-center shadow-[0_12px_35px_rgba(108,78,148,0.08)] backdrop-blur-[22px]">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-[19px] border border-white bg-gradient-to-br from-[#eee5ff] to-[#ffe7f2]">
              <HiOutlineSparkles className="h-7 w-7 animate-pulse text-[#9274d5]" />
            </div>

            <p className="text-sm font-semibold text-[#39235f]">
              Gathering your favourites...
            </p>

            <p className="mt-1.5 text-xs text-[#81709f]">
              Preparing your personal collection
            </p>
          </div>
        ) : products.length === 0 ? (
          /* Empty state */
          <div className="rounded-[28px] border border-white/85 bg-white/60 px-6 py-12 text-center shadow-[0_18px_50px_rgba(108,78,148,0.08)] backdrop-blur-[22px]">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-[22px] border border-white bg-gradient-to-br from-[#eee5ff] to-[#ffe7f2] text-[#9274d5] shadow-sm">
              <HiOutlineHeart className="h-8 w-8" />
            </div>

            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[#9274d5]">
              YOUR COLLECTION
            </p>

            <h2 className="text-xl font-semibold text-[#2d204b] sm:text-2xl">
              Your collection starts here
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#77718d]">
              You haven't saved any products yet. Explore your
              personalized recommendations and save the products
              that fit your skincare routine.
            </p>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-[16px] bg-gradient-to-br from-[#9271e0] to-[#e45fa4] px-5 py-3 text-sm font-semibold text-white shadow-[0_7px_18px_rgba(190,102,190,0.20)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(190,102,190,0.28)]"
            >
              <HiOutlineSparkles className="h-4 w-4" />
              Explore recommendations
            </button>
          </div>
        ) : (
          /* Compact premium product cards */
          <div className="grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
                  className="group relative flex h-full flex-col overflow-hidden rounded-[24px] border border-white/90 bg-white/65 p-2.5 shadow-[0_10px_30px_rgba(91,65,133,0.07)] backdrop-blur-[18px] transition-all duration-300 hover:-translate-y-1 hover:border-[#d9c7f5] hover:bg-white/80 hover:shadow-[0_18px_40px_rgba(91,65,133,0.12)]"
                >
                  {/* Subtle top highlight */}
                  <div className="pointer-events-none absolute inset-x-8 top-0 z-20 h-px bg-gradient-to-r from-transparent via-white to-transparent" />

                  {/* Compact product image */}
                  <div className="relative flex h-40 items-center justify-center overflow-hidden rounded-[20px] border border-white/90 bg-gradient-to-br from-[#f9f6ff] via-[#f3edff] to-[#fff1f7] p-4">
                    <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-[#e8d9ff]/45 blur-2xl" />
                    <div className="pointer-events-none absolute -bottom-10 -left-6 h-24 w-24 rounded-full bg-[#ffd9e9]/40 blur-2xl" />

                    {image ? (
                      <img
                        src={image}
                        alt={name}
                        loading="lazy"
                        className="relative z-10 h-full w-full object-contain drop-shadow-[0_6px_10px_rgba(70,45,100,0.08)] transition-transform duration-300 group-hover:scale-[1.04]"
                        onError={(event) => {
                          event.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-[20px] border border-white/90 bg-white/65 text-[#b6a0df] shadow-sm">
                        <HiOutlineShoppingBag className="h-7 w-7" />
                      </div>
                    )}

                    {/* Small saved badge */}
                    <div className="absolute left-2.5 top-2.5 z-20 inline-flex items-center gap-1 rounded-full border border-white/90 bg-white/80 px-2 py-1 text-[9px] font-semibold tracking-wide text-[#71569d] shadow-sm backdrop-blur-xl">
                      <HiOutlineHeart className="h-3 w-3 text-[#d875aa]" />
                      SAVED
                    </div>
                  </div>

                  {/* Compact product details */}
                  <div className="flex flex-1 flex-col px-2.5 pb-2 pt-3">

                    {/* Brand */}
                    {product.brand && (
                      <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.16em] text-[#9274d5]">
                        {product.brand}
                      </p>
                    )}

                    {/* Product name */}
                    <h2 className="line-clamp-2 min-h-[42px] text-[13px] font-semibold leading-[1.6] text-[#2d204b]">
                      {name}
                    </h2>

                    {/* Store */}
                    {product.store && (
                      <p className="mt-1.5 truncate text-[10px] text-[#81709f]">
                        {product.store}
                      </p>
                    )}

                    {/* Price */}
                    <div className="mt-2.5 border-t border-[#e9e0f5]/80 pt-2.5">
                      <p className="mb-0.5 text-[9px] font-bold uppercase tracking-[0.14em] text-[#9285aa]">
                        PRICE
                      </p>

                      <p className="text-lg font-bold tracking-tight text-[#39235f]">
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
                    </div>

                    {/* Compact actions */}
                    <div className="mt-auto space-y-2 pt-3">

                      {/* Purchase link */}
                      {link ? (
                        <a
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex min-h-[40px] items-center justify-center gap-1.5 rounded-[14px] bg-gradient-to-br from-[#9271e0] to-[#e45fa4] px-3 py-2.5 text-xs font-semibold text-white shadow-[0_6px_16px_rgba(190,102,190,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_22px_rgba(190,102,190,0.25)] focus:outline-none focus:ring-2 focus:ring-[#cbb8f3] focus:ring-offset-2"
                        >
                          <HiOutlineShoppingBag className="h-3.5 w-3.5" />
                          View product
                          <HiOutlineExternalLink className="h-3.5 w-3.5 opacity-80" />
                        </a>
                      ) : (
                        <div className="flex min-h-[40px] items-center justify-center rounded-[14px] border border-[#e8def8] bg-white/60 px-2 py-2 text-center text-[10px] text-[#81709f]">
                          Purchase link unavailable
                        </div>
                      )}

                      {/* YouTube tutorial */}
                      <a
                        href={howToUseLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Find a YouTube tutorial for how to use ${name}`}
                        className="flex min-h-[38px] items-center justify-center gap-1.5 rounded-[14px] border border-[#e7dcf6] bg-white/65 px-3 py-2 text-xs font-semibold text-[#594080] transition-all duration-300 hover:border-[#d4c1f0] hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#cbb8f3] focus:ring-offset-2"
                      >
                        <FaYoutube className="h-4 w-4 text-[#e45fa4]" />
                        How to Use
                        <HiOutlineExternalLink className="h-3 w-3 text-[#a08bbf]" />
                      </a>

                      {/* Remove saved product */}
                      <button
                        type="button"
                        disabled={removingId === id}
                        onClick={() => removeProduct(product)}
                        className="flex min-h-[32px] w-full items-center justify-center gap-1.5 rounded-[12px] border border-transparent bg-transparent px-3 py-1.5 text-[10px] font-medium text-[#897a9f] transition-all duration-300 hover:border-rose-100 hover:bg-rose-50/80 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {removingId === id ? (
                          <>
                            <HiOutlineSparkles className="h-3.5 w-3.5 animate-pulse" />
                            Removing...
                          </>
                        ) : (
                          <>
                            <HiOutlineHeart className="h-3.5 w-3.5" />
                            Remove from collection
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Collection footer */}
        {!loading && products.length > 0 && (
          <p className="mt-7 text-center text-[11px] font-medium tracking-wide text-[#81709f]">
            Your skincare favourites, thoughtfully collected.
          </p>
        )}
      </div>
    </main>
  );
}
