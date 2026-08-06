/**
 * Fixed, decorative gradient blobs sitting behind every page. This is
 * what makes the glassmorphism panels feel "frosted" rather than just
 * a semi-transparent white box on flat white.
 */
export default function AmbientBackground() {
  return (
    <div aria-hidden="true" className="fixed inset-0 -z-10 overflow-hidden bg-canvas">
      <div className="absolute -top-32 -left-24 w-[32rem] h-[32rem] rounded-full bg-lavender-300/40 blur-3xl" />
      <div className="absolute top-1/3 -right-32 w-[28rem] h-[28rem] rounded-full bg-petal-300/40 blur-3xl" />
      <div className="absolute bottom-[-10rem] left-1/4 w-[26rem] h-[26rem] rounded-full bg-lavender-100/60 blur-3xl" />
    </div>
  );
}
