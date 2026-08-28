import { HeroSlider } from "@/components/sections/hero/HeroSlider";
import { StageStrip } from "@/components/sections/StageStrip";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { Faq } from "@/components/sections/Faq";
import { CommunityTrust } from "@/components/sections/CommunityTrust";

export default function HomePage() {
  return (
    <main id="main">
      <HeroSlider />
      <StageStrip />
      <WhyChooseUs />
      <Faq />
      <CommunityTrust />
    </main>
  );
}
