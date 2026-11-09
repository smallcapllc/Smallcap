import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Philosophy() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow pt-40 pb-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-20 animate-fade">
            <h1 className="text-5xl md:text-7xl font-outfit font-bold text-white mb-8 tracking-tighter">
              The SmallCap <span className="text-primary italic">Axioms.</span>
            </h1>
            <p className="text-xl text-text-dim max-w-3xl leading-relaxed">
              Our investment philosophy is built on three immutable pillars: asymmetric insight, disciplined friction, and long-term stewardships.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-32">
            <div className="glass p-10 rounded-2xl relative overflow-hidden group hover:border-primary/30 transition-all duration-500">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-10 group-hover:bg-primary/10 transition-colors"></div>
              <div className="text-primary font-mono text-xs tracking-[0.3em] mb-6 uppercase block font-bold">
                Pillar I
              </div>
              <h3 className="text-2xl font-bold text-white mb-6">Asymmetric Insight</h3>
              <p className="text-text-dim leading-relaxed text-sm">
                We look for markets where the spread between perceived risk and actual risk is widest. This usually occurs in niche sectors overlooked by multi-strategy funds.
              </p>
            </div>
            <div className="glass p-10 rounded-2xl relative overflow-hidden group hover:border-primary/30 transition-all duration-500">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-10 group-hover:bg-primary/10 transition-colors"></div>
              <div className="text-primary font-mono text-xs tracking-[0.3em] mb-6 uppercase block font-bold">
                Pillar II
              </div>
              <h3 className="text-2xl font-bold text-white mb-6">Disciplined Friction</h3>
              <p className="text-text-dim leading-relaxed text-sm">
                We introduce intentional friction in our decision-making process to eliminate emotional bias. Every investment requires a 90-day deep-dive before capital commitment.
              </p>
            </div>
            <div className="glass p-10 rounded-2xl relative overflow-hidden group hover:border-primary/30 transition-all duration-500">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-10 group-hover:bg-primary/10 transition-colors"></div>
              <div className="text-primary font-mono text-xs tracking-[0.3em] mb-6 uppercase block font-bold">
                Pillar III
              </div>
              <h3 className="text-2xl font-bold text-white mb-6">Active Stewardship</h3>
              <p className="text-text-dim leading-relaxed text-sm">
                We are not passive observers. We secure board seats or advisory roles to ensure that our portfolio companies are following a path of sustainable excellence.
              </p>
            </div>
          </div>

          <div className="bg-secondary rounded-3xl p-12 md:p-20 border border-white/5 relative overflow-hidden">
            <div className="relative z-10 text-center max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-outfit font-bold text-white mb-8">
                Ready to explore our <span className="text-gradient">Active Mandates?</span>
              </h2>
              <p className="text-text-dim mb-12 text-lg">
                Qualified Institutional Buyers and Accredited Investors may request access to our current private offerings and performance disclosures.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <button type="button" className="btn-premium">
                  Register Interest
                </button>
                <button type="button" className="btn-outline">
                  Download Profile (PDF)
                </button>
              </div>
            </div>
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-primary/5 rounded-full blur-[80px]"></div>
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/5 rounded-full blur-[80px]"></div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
