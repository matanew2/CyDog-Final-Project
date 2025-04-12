"use client"

import { MainLayout } from "@/components/layouts/main-layout"
import { HeroSection } from "@/components/sections/hero-section"
import { FeatureSection } from "@/components/sections/feature-section"
import { CTASection } from "@/components/sections/cta-section"

export function HomePage() {
  return (
    <MainLayout>
      <HeroSection />
      <FeatureSection />
      <CTASection />
    </MainLayout>
  )
}
