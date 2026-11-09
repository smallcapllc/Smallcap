import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      <Header />

      <main className="flex-grow">
        <section className="relative pt-40 pb-32 px-6 flex flex-col items-center justify-center min-h-[90vh]">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] overflow-hidden pointer-events-none -z-10 opacity-30">
            <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-primary/10 rounded-full blur-[120px]"></div>
            <div className="absolute top-[100px] left-1/2 -translate-x-[200px] w-px h-[600px] bg-gradient-to-b from-transparent via-primary/20 to-transparent"></div>
            <div className="absolute top-[200px] left-1/2 translate-x-[200px] w-px h-[600px] bg-gradient-to-b from-transparent via-primary/20 to-transparent"></div>
          </div>

          <div className="mx-auto max-w-5xl text-center relative z-10 animate-fade">
            <span className="text-[10px] uppercase tracking-[0.4em] text-primary mb-6 block font-bold border border-primary/20 bg-primary/5 px-4 py-1.5 rounded-full inline-block">
              Exclusive Access Only
            </span>
            <h1 className="text-6xl md:text-8xl font-outfit font-bold text-white mb-8 tracking-tighter leading-[0.9]">
              Precision Investing in <br />
              <span className="text-gradient">Small-Cap Markets.</span>
            </h1>
            <p className="text-lg md:text-xl text-text-dim max-w-2xl mx-auto mb-12 leading-relaxed">
              We identify undervalued opportunities where institutional eyes rarely venture. Our bespoke approach ensures high-conviction participation in the future of industry leaders.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button type="button" className="btn-premium">
                View Active Mandates
              </button>
              <Link href="/philosophy" className="btn-outline">
                Our Philosophy
              </Link>
            </div>
          </div>

          <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-12 border-y border-white/5 py-12 w-full max-w-7xl px-6 opacity-60">
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">$450M+</div>
              <div className="text-[10px] uppercase tracking-widest text-text-dim">AUM</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">12%</div>
              <div className="text-[10px] uppercase tracking-widest text-text-dim">Avg. Equity Stake</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">45+</div>
              <div className="text-[10px] uppercase tracking-widest text-text-dim">Global LP&apos;s</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">2008</div>
              <div className="text-[10px] uppercase tracking-widest text-text-dim">Founded</div>
            </div>
          </div>
        </section>

        <section id="opportunities" className="py-32 px-6 bg-secondary relative">
          <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="relative">
              <div className="aspect-[4/5] bg-[#1a1c22] border border-white/5 rounded-2xl p-2 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-60"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 border border-primary/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-700">
                    <div className="w-16 h-16 border border-primary/40 rounded-full flex items-center justify-center">
                      <div className="w-12 h-12 bg-primary rounded-full"></div>
                    </div>
                  </div>
                </div>
                <div className="absolute top-1/2 left-0 w-full h-px bg-white/5 -rotate-12"></div>
                <div className="absolute top-1/2 left-0 w-full h-px bg-white/5 rotate-12"></div>
              </div>
              <div className="absolute -bottom-10 -right-10 glass p-8 rounded-xl max-w-xs gold-glow hidden md:block">
                <h4 className="text-primary font-bold mb-2 uppercase tracking-widest text-xs">Axiom I</h4>
                <p className="text-sm text-white italic">&quot;Alpha lives in the shadows of the unnoticed.&quot;</p>
              </div>
            </div>
            <div>
              <h2 className="text-4xl md:text-5xl font-outfit font-bold text-white mb-8">
                A Higher Standard of <span className="text-primary italic">Diligence.</span>
              </h2>
              <div className="space-y-6">
                <div className="flex gap-6">
                  <div className="h-10 w-10 shrink-0 border border-primary/20 rounded flex items-center justify-center text-primary font-bold">
                    01
                  </div>
                  <div>
                    <h3 className="text-xl text-white mb-2">Micro-Sector Expertise</h3>
                    <p className="text-text-dim leading-relaxed">
                      Narrow focus allows for deeper integration and understanding of target markets, far beyond mathematical modeling.
                    </p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="h-10 w-10 shrink-0 border border-primary/20 rounded flex items-center justify-center text-primary font-bold">
                    02
                  </div>
                  <div>
                    <h3 className="text-xl text-white mb-2">Network of Trust</h3>
                    <p className="text-text-dim leading-relaxed">
                      Our relationships with founders and key stakeholders provide insights that are not available through open-market data.
                    </p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="h-10 w-10 shrink-0 border border-primary/20 rounded flex items-center justify-center text-primary font-bold">
                    03
                  </div>
                  <div>
                    <h3 className="text-xl text-white mb-2">Preservation First</h3>
                    <p className="text-text-dim leading-relaxed">
                      We optimize for asymmetrical upside while maintaining a rigorous floor on capital risk and downside projection.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
