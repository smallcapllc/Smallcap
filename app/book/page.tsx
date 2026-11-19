import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookForm from "@/components/BookForm";
import { buildBookableDays } from "@/lib/slots";
import { pageSocial } from "@/lib/site";

const description =
  "Book a free 15-minute fit call with Tre Robinson. Talk through where paper and manual work is costing the business, and whether a $2,500 Implementation Sprint fits.";

export const metadata = pageSocial("Book a call", description, { path: "/book" });

export const dynamic = "force-dynamic";

const covered = [
  {
    title: "Where the work is costing you",
    body: "Paper, double entry, and follow-up that still runs on memory or a whiteboard.",
  },
  {
    title: "Whether a sprint fits",
    body: "The Implementation Sprint is $2,500. The call is to see if that scope matches the business.",
  },
  {
    title: "Next steps",
    body: "If it fits, Tre will say what the sprint would cover. If it does not, you leave with a clear no.",
  },
];

export default function BookPage() {
  const days = buildBookableDays();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-40 pb-32 px-6">
        <div className="mx-auto grid max-w-7xl items-start gap-16 lg:grid-cols-2">
          <div className="animate-fade">
            <span className="mb-6 inline-block rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.4em] text-primary">
              Fit call
            </span>
            <h1 className="mb-8 font-outfit text-5xl font-bold tracking-tighter text-white md:text-6xl">
              Book a free <span className="text-primary italic">15-minute fit call.</span>
            </h1>
            <p className="mb-10 max-w-xl text-lg leading-relaxed text-text-dim">
              A short call with Tre Robinson. Small Cap Consulting helps owner-run trade and distribution businesses
              replace paper and manual workflows with simple automation.
            </p>
            <ol className="space-y-6">
              {covered.map((item, index) => (
                <li key={item.title} className="flex gap-6">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded border border-primary/20 font-bold text-primary">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <div>
                    <h2 className="mb-2 text-xl text-white">{item.title}</h2>
                    <p className="leading-relaxed text-text-dim">{item.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <BookForm days={days} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
