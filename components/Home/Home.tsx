import React from "react";
import Hero from "./Hero";
import HeroImage from "./HeroImage";
import Feature from "./Feature";
import DocsShowcase from "./DocsShowcase";
import CallToAction from "./CallToAction";

export default function Home() {
  return (
    <div>
      <Hero />
      <HeroImage />
      {/* <LogoTicker /> */}
      <Feature />
      <DocsShowcase />
      {/* <Testimonials /> */}
      <CallToAction />
    </div>
  );
}
