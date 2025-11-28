import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Search, Calendar, Users, Shield, Zap, Globe } from 'lucide-react';

export default function ServicesPage() {
  const services = [
    {
      icon: Search,
      title: 'Event Discovery',
      description: 'Browse and search through a comprehensive catalog of technology events worldwide. Filter by category, location, date, and price to find the perfect event for you.',
      features: [
        'Advanced search and filtering',
        'Category-based organization',
        'Location and date filtering',
        'Free and paid event options'
      ]
    },
    {
      icon: Calendar,
      title: 'Event Management',
      description: 'Powerful tools for event organizers to create, manage, and promote their events. Track registrations, manage capacity, and engage with attendees.',
      features: [
        'Easy event creation and editing',
        'Real-time registration tracking',
        'Capacity management',
        'Publish/unpublish controls'
      ]
    },
    {
      icon: Users,
      title: 'Registration Management',
      description: 'Streamlined registration process for attendees with comprehensive management tools for organizers. Export data and track attendance effortlessly.',
      features: [
        'Simple registration forms',
        'Attendee data management',
        'CSV and JSON export',
        'Payment tracking for paid events'
      ]
    },
    {
      icon: Shield,
      title: 'ICP Blockchain-Backed Transparency',
      description: 'Built on the Internet Computer Protocol, ensuring every transaction and registration is transparent, secure, and verifiable on the blockchain.',
      features: [
        'Decentralized data storage',
        'Transparent payment processing',
        'Immutable event records',
        'Secure authentication via Internet Identity'
      ]
    },
    {
      icon: Zap,
      title: 'ICP Token Payments',
      description: 'Seamless integration with ICP tokens for paid events. Secure, fast, and transparent payment processing for event registrations.',
      features: [
        'Native ICP token support',
        'Instant payment verification',
        'Low transaction fees',
        'Secure payment flow'
      ]
    },
    {
      icon: Globe,
      title: 'Decentralized Hosting',
      description: 'Hosted entirely on the Internet Computer, providing unparalleled reliability, security, and censorship resistance without traditional cloud infrastructure.',
      features: [
        '100% on-chain hosting',
        'No single point of failure',
        'Global accessibility',
        'Censorship-resistant platform'
      ]
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-purple-500/10 to-blue-500/10 border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              Our{' '}
              <span className="bg-gradient-to-r from-primary via-purple-500 to-blue-500 bg-clip-text text-transparent">
                Services
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive event management and discovery platform powered by the Internet Computer Protocol.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto space-y-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <Card key={index} className="overflow-hidden">
                  <CardHeader className="bg-gradient-to-br from-primary/5 to-purple-500/5">
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-2xl mb-2">{service.title}</CardTitle>
                        <p className="text-muted-foreground">{service.description}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <h4 className="font-semibold mb-3">Key Features:</h4>
                    <ul className="grid sm:grid-cols-2 gap-3">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Technology Highlight */}
          <div className="max-w-4xl mx-auto mt-16">
            <Card className="bg-gradient-to-br from-primary/10 via-purple-500/10 to-blue-500/10 border-primary/20">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <h3 className="text-2xl font-bold">Built on the Internet Computer</h3>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    EVENTCHAIN leverages the power of the Internet Computer Protocol to provide a truly decentralized, secure, and scalable event management platform. Experience the future of web applications with blockchain-backed transparency and reliability.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
