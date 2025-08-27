import { Plane, MapPin, Calendar, Users } from "lucide-react";
import { GeocodeDemo } from "@/components/geocode-demo";
import { AirportSearchDemo } from "@/components/airport-search-demo";
import { FlightSearchDemo } from "@/components/flight-search-demo";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Plane className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">TravelAPI</span>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">
              Features
            </a>
            <a href="#about" className="text-gray-600 hover:text-blue-600 transition-colors">
              About
            </a>
            <a href="#contact" className="text-gray-600 hover:text-blue-600 transition-colors">
              Contact
            </a>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Discover the World with
            <span className="text-blue-600 block">TravelAPI</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Your comprehensive travel companion. Find destinations, plan trips, and explore the world with our powerful API.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Get Started
            </button>
            <button className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
              View Documentation
            </button>
          </div>
        </div>

        {/* Features Section */}
        <section id="features" className="mt-24">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose TravelAPI?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<MapPin className="h-8 w-8" />}
              title="Global Destinations"
              description="Access comprehensive data about destinations worldwide, from popular cities to hidden gems."
            />
            <FeatureCard
              icon={<Calendar className="h-8 w-8" />}
              title="Smart Planning"
              description="Plan your trips with intelligent recommendations based on your preferences and travel history."
            />
            <FeatureCard
              icon={<Users className="h-8 w-8" />}
              title="Community Driven"
              description="Connect with fellow travelers and share experiences through our community features."
            />
          </div>
        </section>

        {/* API Demo Section */}
        <section className="mt-24">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Спробуйте наш API
          </h2>
          <GeocodeDemo />
        </section>

        {/* Airport Search Demo Section */}
        <section className="mt-24">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Пошук аеропортів
          </h2>
          <AirportSearchDemo />
        </section>

        {/* Flight Search Demo Section */}
        <section className="mt-24">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Пошук авіаквитків
          </h2>
          <FlightSearchDemo />
        </section>

        {/* Stats Section */}
        <section className="mt-24 bg-white rounded-2xl p-8 shadow-sm">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <StatCard number="1000+" label="Destinations" />
            <StatCard number="50K+" label="Happy Travelers" />
            <StatCard number="99.9%" label="Uptime" />
            <StatCard number="24/7" label="Support" />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-24">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Plane className="h-6 w-6 text-blue-400" />
                <span className="text-xl font-bold">TravelAPI</span>
              </div>
              <p className="text-gray-400">
                Making travel planning easier and more enjoyable for everyone.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 TravelAPI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <div className="text-blue-600 mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

interface StatCardProps {
  number: string;
  label: string;
}

function StatCard({ number, label }: StatCardProps) {
  return (
    <div>
      <div className="text-3xl font-bold text-blue-600 mb-2">{number}</div>
      <div className="text-gray-600">{label}</div>
    </div>
  );
}
