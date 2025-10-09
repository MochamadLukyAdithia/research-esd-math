import User from '@/Layouts/UserLayout';
import SDGs from '@/Components/home/SDGS';
import Persuate from '@/Components/home/Persuate';
import Gallery from '@/Components/home/Gallery';
import STEM from '@/Components/home/STEM';
import Hero from '@/Components/home/Hero';
import FeatureSection from '@/Components/home/Feature';

export default function Welcome() {
  return (
    <User>
        <Hero/>
        <FeatureSection/>
        <STEM/>
        <SDGs/>
        <Persuate/>
        <Gallery/>
    </User>
  );
}
