import Navbar from '../components/layouts/Navbar';
import Footer from '../components/layouts/Footer';
import Hero from './home/Hero';
import Stats from './home/Stats';
import Features from './home/Features';
import HowItWorks from './home/HowItWorks';
import Sectors from './home/Sectors';
import ForEmployers from './home/ForEmployers';
import CTA from './home/CTA';

const Landing = () => {
  return (
    <div className='min-h-screen bg-bg'>
      {/* Hero */}
      <Hero />

      {/* Stats */}
      <Stats />

      {/* Features */}
      <Features />

      {/* How It Works */}
      <HowItWorks />

      {/* Sectors */}
      <Sectors />

      {/* For Employers */}
      <ForEmployers />

      {/* CTA */}
      <CTA />
    </div>
  );
};

export default Landing;
