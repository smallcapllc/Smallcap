import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { pageSocial } from "@/lib/site";

const description =
  "How Small Cap Consulting helps legacy small businesses with operations and AI automation.";

export const metadata = pageSocial("Philosophy", description, { path: "/philosophy" });

export default function Philosophy() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow pt-40 pb-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-20 animate-fade">
            <h1 className="text-5xl md:text-7xl font-outfit font-bold text-white mb-8 tracking-tighter">
              The Small Cap Consulting <span className="text-primary italic">approach.</span>
            </h1>
            <p className="text-xl text-text-dim max-w-3xl leading-relaxed">
              We help legacy small businesses with operations and AI automation. The work starts from how the company already runs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-32">
            <div className="glass p-10 rounded-2xl relative overflow-hidden group hover:border-primary/30 transition-all duration-500">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-10 group-hover:bg-primary/10 transition-colors"></div>
              <div className="text-primary font-mono text-xs tracking-[0.3em] mb-6 uppercase block font-bold">
                Pillar I
              </div>
              <h3 className="text-2xl font-bold text-white mb-6">Operations</h3>
              <p className="text-text-dim leading-relaxed text-sm">
                We look at how work moves: who does it, which tools are involved, and which steps happen again and again.
              </p>
            </div>
            <div className="glass p-10 rounded-2xl relative overflow-hidden group hover:border-primary/30 transition-all duration-500">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-10 group-hover:bg-primary/10 transition-colors"></div>
              <div className="text-primary font-mono text-xs tracking-[0.3em] mb-6 uppercase block font-bold">
                Pillar II
              </div>
              <h3 className="text-2xl font-bold text-white mb-6">AI automation</h3>
              <p className="text-text-dim leading-relaxed text-sm">
                When a task is repetitive and well understood, we help automate it.
              </p>
            </div>
            <div className="glass p-10 rounded-2xl relative overflow-hidden group hover:border-primary/30 transition-all duration-500">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-10 group-hover:bg-primary/10 transition-colors"></div>
              <div className="text-primary font-mono text-xs tracking-[0.3em] mb-6 uppercase block font-bold">
                Pillar III
              </div>
              <h3 className="text-2xl font-bold text-white mb-6">Legacy businesses</h3>
              <p className="text-text-dim leading-relaxed text-sm">
                The companies we have in mind are established and owner-operated, with a way of working that is already in place.
              </p>
            </div>
          </div>

          <div className="bg-secondary rounded-3xl p-12 md:p-20 border border-white/5 relative overflow-hidden">
            <div className="relative z-10 text-center max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-outfit font-bold text-white mb-8">
                Talk with <span className="text-gradient">Small Cap Consulting.</span>
              </h2>
              <p className="text-text-dim mb-12 text-lg">
                If you run a legacy small business and want to talk about operations or AI automation, get in touch.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link href="#contact" className="btn-premium">
                  Get in Touch
                </Link>
                <Link href="/blog" className="btn-outline">
                  Read the Journal
                </Link>
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
