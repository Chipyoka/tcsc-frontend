import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    id: 1,
    question: "What are disinfectants and how should they be used?",
    answer:
      "Disinfectants are chemical solutions designed to eliminate harmful microorganisms on surfaces. Always clean visible dirt first, then apply disinfectant evenly and let it sit for the recommended contact time before wiping.",
  },
  {
    id: 2,
    question: "How often should I use floor cleaners?",
    answer:
      "For most commercial or home environments, floors should be cleaned daily or as needed using pH-neutral floor cleaners to prevent damage and maintain shine.",
  },
  {
    id: 3,
    question: "What’s the best way to clean washroom surfaces?",
    answer:
      "Use specialized washroom cleaners with descaling properties to remove limescale, soap scum, and bacteria. Apply, let it sit briefly, and rinse thoroughly for hygiene and freshness.",
  },
  {
    id: 4,
    question: "Are sanitizers different from disinfectants?",
    answer:
      "Yes. Sanitizers reduce bacteria on surfaces to safe levels, while disinfectants kill a wider range of pathogens. Use sanitizers for food-contact areas and disinfectants for general cleaning.",
  },
  {
    id: 5,
    question: "Can handwash cleaners dry out my hands?",
    answer:
      "Some can, especially those with strong antibacterial ingredients. Choose moisturizing or pH-balanced handwash cleaners for frequent use to protect skin health.",
  },
  {
    id: 6,
    question: "How do I maintain cleaning cloths for long-term use?",
    answer:
      "Wash cleaning cloths separately from other laundry using hot water and mild detergent. Avoid fabric softeners as they can reduce absorbency.",
  },
];

const FAQSection = () => {
  const [activeId, setActiveId] = useState(null);

  const toggleFAQ = (id) => {
    setActiveId(activeId === id ? null : id);
  };

  return (
    <section className="py-16 px-6 md:px-12">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-semibold text-center mb-10 text-[var(--color-primary)]">
          FAQs
        </h2>

        <div className="space-y-4">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className="bg-gray-50 border border-gray-100 rounded-lg overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => toggleFAQ(faq.id)}
                className="w-full flex justify-between items-center px-6 py-4 text-left font-medium text-lg text-gray-600"
              >
                {faq.question}
                <ChevronDown
                  className={`w-6 h-6 transition-transform duration-300 ${
                    activeId === faq.id ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>

              <div
                className={`px-6 transition-all duration-500 ease-in-out ${
                  activeId === faq.id
                    ? "max-h-40 opacity-100 py-2"
                    : "max-h-0 opacity-0 py-0"
                } overflow-hidden`}
              >
                <p className="text-gray-500 my-2">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
