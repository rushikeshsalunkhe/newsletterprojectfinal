import { Database, Code2, TrendingUp, BookOpen, Users, Zap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: Database,
    title: "SQL Mastery",
    description: "Master complex queries, optimization techniques, and database design patterns.",
  },
  {
    icon: Code2,
    title: "DBA Best Practices",
    description: "Learn industry-standard practices for database administration and maintenance.",
  },
  {
    icon: TrendingUp,
    title: "Performance Tuning",
    description: "Discover techniques to optimize query performance and database efficiency.",
  },
  {
    icon: BookOpen,
    title: "Interview Prep",
    description: "Get curated interview questions and answers to ace your next database role.",
  },
  {
    icon: Users,
    title: "Community Insights",
    description: "Benefit from collective wisdom of thousands of database professionals.",
  },
  {
    icon: Zap,
    title: "Daily Automation",
    description: "Receive fresh, relevant content automatically curated and delivered daily.",
  },
];

const Features = () => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">
            Everything You Need to Excel
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive coverage of SQL, database administration, and career development.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index}
                className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-primary/10"
              >
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
