import { Card, CardContent } from '../components/ui/card';
import { Users, Target, Zap, Globe } from 'lucide-react';
import { SiX } from 'react-icons/si';

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-purple-500/10 to-blue-500/10 border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              About{' '}
              <span className="bg-gradient-to-r from-primary via-purple-500 to-blue-500 bg-clip-text text-transparent">
                EVENTCHAIN
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Connecting global tech innovators, developers, and enthusiasts through the power of decentralized technology.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold">Our Mission</h2>
              <p className="text-lg text-muted-foreground">
                EVENTCHAIN is dedicated to revolutionizing how technology professionals discover, connect, and engage with events worldwide. Built on the Internet Computer Protocol (ICP), we provide a transparent, decentralized platform that empowers organizers and attendees alike.
              </p>
            </div>

            {/* Values Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Globe className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">Global Reach</h3>
                      <p className="text-muted-foreground">
                        Connect with tech events and communities from around the world, all in one decentralized platform.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Zap className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">Innovation First</h3>
                      <p className="text-muted-foreground">
                        Leveraging blockchain technology to ensure transparency, security, and trust in every transaction.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">Community Driven</h3>
                      <p className="text-muted-foreground">
                        Built by the community, for the community. We empower organizers and attendees to create meaningful connections.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Target className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">Purpose Driven</h3>
                      <p className="text-muted-foreground">
                        Our goal is to make tech events accessible, discoverable, and manageable for everyone.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Developer Section */}
            <Card className="bg-gradient-to-br from-primary/5 to-purple-500/5 border-primary/20">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <h3 className="text-2xl font-bold">Developed by Abdulsalam Amtech</h3>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    EVENTCHAIN is crafted with passion and expertise by Abdulsalam Amtech, a dedicated developer committed to building innovative solutions on the Internet Computer Protocol.
                  </p>
                  <div className="flex justify-center pt-4">
                    <a
                      href="https://x.com/abdulsalamtech"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 px-6 py-3 bg-foreground text-background rounded-full hover:opacity-90 transition-opacity font-medium"
                    >
                      <SiX className="h-5 w-5" />
                      <span>Follow on X (Twitter)</span>
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
