import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FeatureCardProps { 
  icon: React.ReactNode; title: string; description: string 
}

export default function FeatureCard({ icon, title, description }: Readonly<FeatureCardProps>) {
  return (
      <Card className="group border border-gray-700 bg-gray-800 shadow-md transition-all duration-300 hover:border-indigo-400 hover:shadow-lg">
          <CardHeader className="flex flex-row items-center gap-3">
              {icon}
              <CardTitle className="text-lg text-white">{title}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-400 transition-all duration-300 group-hover:text-gray-200">{description}</CardContent>
      </Card>
  );
}