import Guest from '@/Layouts/UserLayout';
import Navbar from '@/Components/navbar/Navbar'
import SDGs from '@/Components/home/SDGS';
import Persuate from '@/Components/home/Persuate';
import Gallery from '@/Components/home/Gallery';
import STEM from '@/Components/home/STEM';
import Hero from '@/Components/home/Hero';
import FeatureSection from '@/Components/home/Feature';
import Footer from '@/Components/footer/Footer';

export default function Welcome() {
  return (
    <Guest>
        <Navbar/>
        <Hero/>
        <FeatureSection/>
        <STEM/>
        <SDGs/>
        <Persuate/>
        <Gallery/>
        <Footer/>
    </Guest>
  );
}
