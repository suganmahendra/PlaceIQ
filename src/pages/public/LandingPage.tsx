import { PremiumHeroSection } from '../../components/landing/PremiumHeroSection';
import { ExclusiveFocusSection } from '../../components/landing/ExclusiveFocusSection';
import { TwoPillarsSection } from '../../components/landing/TwoPillarsSection';
import { AIIntelligenceSection } from '../../components/landing/AIIntelligenceSection';
import { PlacementReadinessSection } from '../../components/landing/PlacementReadinessSection';
import { FinalCTASection } from '../../components/landing/FinalCTASection';

export function LandingPage() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Premium Hero Section with Neural Background */}
            <PremiumHeroSection />

            {/* AI & DS Exclusive Focus */}
            <ExclusiveFocusSection />

            {/* Two Core Pillars: Coding + Courses */}
            <TwoPillarsSection />

            {/* AI-Powered Intelligence Features */}
            <AIIntelligenceSection />

            {/* Placement Readiness & Job Matching */}
            <PlacementReadinessSection />

            {/* Final CTA */}
            <FinalCTASection />
        </div>
    );
}
