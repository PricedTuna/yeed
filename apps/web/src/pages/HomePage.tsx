import { ContentTypeGrid } from "@/features/catalog/ContentTypeGrid";
import { CallToAction } from "@/features/landing/CallToAction";
import { Hero } from "@/features/landing/Hero";
import { HowItWorks } from "@/features/landing/HowItWorks";

/** Landing page for visitors. */
export function HomePage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <ContentTypeGrid />
      <CallToAction />
    </>
  );
}
