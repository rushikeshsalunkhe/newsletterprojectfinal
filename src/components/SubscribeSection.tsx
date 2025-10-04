import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAdmin } from "@/contexts/AdminContext";

const SubscribeSection = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { addSubscriber } = useAdmin();

  // Replace this with your actual Google Form URL
  const GOOGLE_FORM_ACTION_URL = "https://docs.google.com/forms/d/e/1FAIpQLSeCXdu7ZH89IIKNZMsKbRbBCcAZWnNqANTdAfH7dC8dFIi5Lw/viewform";
  // Replace with your form's email field entry ID (e.g., "entry.123456789")
  const EMAIL_FIELD_NAME = "entry.1045781291";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes("@")) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Add to local storage for demo (works immediately)
      addSubscriber(email);

      // Also submit to Google Forms in the background (optional)
      if (GOOGLE_FORM_ACTION_URL !== "https://docs.google.com/forms/d/e/1FAIpQLSeCXdu7ZH89IIKNZMsKbRbBCcAZWnNqANTdAfH7dC8dFIi5Lw/viewform") {
        const formData = new FormData();
        formData.append(EMAIL_FIELD_NAME, email);

        await fetch(GOOGLE_FORM_ACTION_URL, {
          method: "POST",
          mode: "no-cors",
          body: formData,
        });
      }

      toast({
        title: "Successfully Subscribed! 🎉",
        description: "You'll receive daily SQL tips starting tomorrow. Check the admin panel to see your subscription!",
      });

      setEmail("");
    } catch (error) {
      console.error("Subscription error:", error);
      toast({
        title: "Subscription Failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="subscribe" className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto max-w-4xl">
        <Card className="shadow-2xl border-primary/20">
          <CardHeader className="text-center space-y-4">
            <CardTitle className="text-3xl md:text-4xl font-bold">
              Subscribe to Daily SQL Tips
            </CardTitle>
            <CardDescription className="text-lg">
              Get expertly curated content delivered to your inbox every morning. Unsubscribe anytime.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 text-base"
                    disabled={isLoading}
                  />
                </div>
                <Button 
                  type="submit" 
                  size="lg" 
                  className="h-12 px-8"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    "Subscribing..."
                  ) : (
                    <>
                      <Mail className="mr-2 h-5 w-5" />
                      Subscribe
                    </>
                  )}
                </Button>
              </div>
            </form>

            {/* Benefits list */}
            <div className="mt-8 grid md:grid-cols-3 gap-4">
              {[
                "Daily SQL tips & tricks",
                "DBA best practices",
                "Interview preparation",
              ].map((benefit, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>

            {/* Privacy note */}
            <p className="mt-6 text-center text-xs text-muted-foreground">
              We respect your privacy. Unsubscribe at any time. No spam, ever.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default SubscribeSection;
