import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Upload, BarChart3, FileSpreadsheet, Users, Shield, Zap, CheckCircle } from "lucide-react";

export default function Landing() {
  const features = [
    {
      icon: Upload,
      title: "Easy File Upload",
      description: "Drag and drop Excel and CSV files for instant processing with secure cloud storage."
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Get detailed insights with automatic data analysis and customizable reports."
    },
    {
      icon: FileSpreadsheet,
      title: "Smart Processing",
      description: "Intelligent data extraction and validation with error detection and correction."
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Share data and reports with your team members with role-based permissions."
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-level encryption and compliance with GDPR, SOC2, and industry standards."
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Process large datasets in seconds with our optimized cloud infrastructure."
    }
  ];

  const benefits = [
    "Process unlimited Excel and CSV files",
    "Generate comprehensive reports in multiple formats",
    "Real-time collaboration with team members", 
    "Advanced data visualization and charts",
    "Automated data validation and cleaning",
    "Export to Excel, PDF, and CSV formats",
    "API access for custom integrations",
    "Priority email and chat support"
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-xl text-foreground" data-testid="text-brand-name">TallySync</h1>
              <p className="text-xs text-muted-foreground" data-testid="text-brand-subtitle">Excel Data Platform</p>
            </div>
          </div>
          <Button 
            onClick={() => window.location.href = "/api/login"}
            data-testid="button-login"
          >
            Sign In with Replit
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-foreground mb-6" data-testid="text-hero-title">
            Transform Your Excel Data Into 
            <span className="text-primary"> Powerful Insights</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto" data-testid="text-hero-description">
            Upload, process, and analyze your spreadsheet data with enterprise-grade tools. 
            Generate beautiful reports and collaborate with your team—all in one platform.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Button 
              size="lg" 
              onClick={() => window.location.href = "/api/login"}
              data-testid="button-get-started"
            >
              Get Started Free
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              data-testid="button-learn-more"
            >
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4" data-testid="text-features-title">
              Everything You Need for Excel Data Management
            </h2>
            <p className="text-lg text-muted-foreground" data-testid="text-features-subtitle">
              Powerful features designed for business users and data professionals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow" data-testid={`card-feature-${index}`}>
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle data-testid={`text-feature-title-${index}`}>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground" data-testid={`text-feature-description-${index}`}>
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4" data-testid="text-benefits-title">
              Why Choose TallySync?
            </h2>
            <p className="text-lg text-muted-foreground" data-testid="text-benefits-subtitle">
              Join thousands of businesses that trust TallySync for their data processing needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-3" data-testid={`benefit-item-${index}`}>
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-foreground" data-testid={`text-benefit-${index}`}>{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-primary/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4" data-testid="text-cta-title">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-muted-foreground mb-8" data-testid="text-cta-description">
            Sign up today and transform how you work with Excel data
          </p>
          <Button 
            size="lg"
            onClick={() => window.location.href = "/api/login"}
            data-testid="button-cta-signup"
          >
            Start Free Trial
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-primary-foreground" />
              </div>
              <div>
                <p className="font-semibold text-foreground" data-testid="text-footer-brand">TallySync</p>
                <p className="text-xs text-muted-foreground" data-testid="text-footer-tagline">Excel Data Platform</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground" data-testid="text-footer-copyright">
              © 2024 TallySync. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}