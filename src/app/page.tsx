import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Menu from '@/components/Menu';
import Gallery from '@/components/Gallery';
import Testimonials from '@/components/Testimonials';
import ReservationCTA from '@/components/ReservationCTA';
import LocationHours from '@/components/LocationHours';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <About />
        <Menu />
        <Gallery />
        <Testimonials />
        <ReservationCTA />
        <LocationHours />
      </main>
      <Footer />
    </>
  );
}
