"use client";

import { useState } from "react";

interface SeoAccordionProps {
  toolName: string;
  description: string;
  features: string[];
  howToSteps: { title: string; description: string }[];
  faq: { question: string; answer: string }[];
  relatedTools: { name: string; path: string }[];
}

export default function SeoAccordion({
  toolName,
  description,
  features,
  howToSteps,
  faq,
  relatedTools,
}: SeoAccordionProps) {
  const [open, setOpen] = useState(false);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="border-t border-border shrink-0">
        <button
          onClick={() => setOpen(!open)}
          className="w-full px-6 py-3 flex items-center justify-between text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
        >
          <span>About {toolName}</span>
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <div
          className={`overflow-hidden transition-all duration-300 ${open ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"}`}
        >
          <div className="px-6 pb-6 pt-2 max-w-4xl">
            <p className="text-muted-foreground text-sm mb-4">{description}</p>

            <h4 className="font-semibold text-sm mb-2">Features</h4>
            <ul className="list-disc list-inside text-muted-foreground text-sm mb-4 space-y-1">
              {features.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>

            <h4 className="font-semibold text-sm mb-2">How to Use</h4>
            <ol className="list-decimal list-inside text-muted-foreground text-sm mb-4 space-y-1">
              {howToSteps.map((s, i) => (
                <li key={i}>
                  <span className="font-medium">{s.title}</span> — {s.description}
                </li>
              ))}
            </ol>

            <h4 className="font-semibold text-sm mb-2">FAQ</h4>
            <div className="space-y-3 mb-4">
              {faq.map((item, i) => (
                <div key={i} className="bg-muted/50 rounded-lg p-3">
                  <p className="font-medium text-sm mb-1">{item.question}</p>
                  <p className="text-xs text-muted-foreground">{item.answer}</p>
                </div>
              ))}
            </div>

            <h4 className="font-semibold text-sm mb-2">Related Tools</h4>
            <div className="flex flex-wrap gap-2">
              {relatedTools.map((tool, i) => (
                <a
                  key={i}
                  href={tool.path}
                  className="px-3 py-1 bg-muted rounded-md text-xs hover:bg-accent transition-colors"
                >
                  {tool.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
