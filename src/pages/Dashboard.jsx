import { Link } from "react-router-dom";
import GlassCard from "../components/GlassCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { HiOutlineCamera,HiOutlinePhotograph } from "react-icons/hi";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-semibold mb-1">
        Welcome back, {user?.name?.split(" ")[0]}
      </h1>
      <p className="text-ink/60 mb-8">Here's where your routine stands today.</p>

      <div className="grid md:grid-cols-2 gap-6">
        <GlassCard>
          <p className="eyebrow mb-2">Skin</p>
          <p className="text-ink/60 mb-4">No scan yet this week.</p>
          <div className="flex items-center gap-4">

  <Link
    to="/scan/skin"
    className="btn-primary text-sm"
  >
    <HiOutlineCamera />
    Scan my skin
  </Link>

  <Link
    to="/scan/skin?upload=true"
    className="btn-primary text-sm"
    >
    <HiOutlinePhotograph size={20} />
    Upload an image
  </Link>

</div>
        </GlassCard>
        <GlassCard>
          <p className="eyebrow mb-2">Hair</p>
          <p className="text-ink/60 mb-4">No scan yet this week.</p>
          <Link to="/scan/hair" className="btn-primary text-sm">
            <HiOutlineCamera /> Scan my hair
          </Link>
        </GlassCard>
      </div>

      <p className="text-sm text-ink/40 mt-8">
        Progress charts, product recommendations, and the AI assistant plug into this
        dashboard in the next build modules.
      </p>
    </div>
  );
}
