import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Mail } from 'lucide-react';
import { SiX } from 'react-icons/si';

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-purple-500/10 to-blue-500/10 border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              Get in{' '}
              <span className="bg-gradient-to-r from-primary via-purple-500 to-blue-500 bg-clip-text text-transparent">
                Touch
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Have questions or feedback? We'd love to hear from you. Reach out through any of our channels below.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto space-y-8">
            {/* Email */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <span>Email</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  For general inquiries, support, or partnership opportunities, reach out via email:
                </p>
                <a
                  href="mailto:integralforceicp@gmail.com"
                  className="inline-flex items-center space-x-2 text-primary hover:underline font-medium text-lg"
                >
                  <span>integralforceicp@gmail.com</span>
                </a>
              </CardContent>
            </Card>

            {/* Twitter/X */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <SiX className="h-5 w-5 text-primary" />
                  </div>
                  <span>Social Media</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Follow us on X (Twitter) for updates, announcements, and community engagement:
                </p>
                <div className="space-y-3">
                  <div>
                    <a
                      href="https://x.com/abdulsalamtech"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 px-4 py-2 bg-foreground text-background rounded-full hover:opacity-90 transition-opacity font-medium"
                    >
                      <SiX className="h-4 w-4" />
                      <span>@abdulsalamtech</span>
                    </a>
                  </div>
                  <div>
                    <a
                      href="https://x.com/integralforceic"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 px-4 py-2 bg-foreground text-background rounded-full hover:opacity-90 transition-opacity font-medium"
                    >
                      <SiX className="h-4 w-4" />
                      <span>@integralforceic</span>
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Info */}
            <Card className="bg-gradient-to-br from-primary/5 to-purple-500/5 border-primary/20">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <h3 className="text-xl font-bold">We're Here to Help</h3>
                  <p className="text-muted-foreground max-w-xl mx-auto">
                    Whether you're an event organizer looking to host your next tech conference, or an attendee seeking the perfect event, our team is ready to assist you. Don't hesitate to reach out!
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
