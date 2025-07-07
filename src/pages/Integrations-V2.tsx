import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Globe, 
  Zap, 
  CheckCircle, 
  AlertCircle, 
  Settings,
  ExternalLink,
  Puzzle,
  Link
} from "lucide-react";
import Layout from "@/components/layout/Layout";

interface Integration {
  name: string;
  description: string;
  status: 'active' | 'pending' | 'inactive';
  link: string;
  icon: any;
}

const integrations: Integration[] = [
  {
    name: "Google Analytics",
    description: "Track and analyze website traffic with Google Analytics.",
    status: "active",
    link: "https://analytics.google.com",
    icon: Globe,
  },
  {
    name: "Zapier",
    description: "Automate workflows and connect apps with Zapier.",
    status: "active",
    link: "https://zapier.com",
    icon: Zap,
  },
  {
    name: "HubSpot",
    description: "Manage marketing, sales, and customer service with HubSpot.",
    status: "pending",
    link: "https://hubspot.com",
    icon: CheckCircle,
  },
  {
    name: "Salesforce",
    description: "Manage customer relationships with Salesforce.",
    status: "inactive",
    link: "https://salesforce.com",
    icon: AlertCircle,
  },
  {
    name: "Settings",
    description: "Manage customer relationships with Salesforce.",
    status: "inactive",
    link: "https://salesforce.com",
    icon: Settings,
  },
  {
    name: "Puzzle",
    description: "Manage customer relationships with Salesforce.",
    status: "inactive",
    link: "https://salesforce.com",
    icon: Puzzle,
  },
  {
    name: "Link",
    description: "Manage customer relationships with Salesforce.",
    status: "inactive",
    link: "https://salesforce.com",
    icon: Link,
  },
];

export default function Integrations() {
  return (
    <Layout>
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Integrações
          </h1>
          <p className="text-gray-600">
            Conecte suas ferramentas favoritas para otimizar seu fluxo de
            trabalho
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {integrations.map((integration, index) => (
            <Card key={index} className="glass">
              <CardHeader className="space-y-1">
                <div className="flex items-center space-x-3">
                  <integration.icon className="h-5 w-5 text-gray-500" />
                  <CardTitle className="text-lg font-semibold">
                    {integration.name}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-gray-500">
                  {integration.description}
                </p>
                <div className="flex items-center justify-between">
                  <Badge
                    variant="secondary"
                    className={
                      integration.status === "active"
                        ? "bg-green-500 text-white"
                        : integration.status === "pending"
                        ? "bg-yellow-500 text-gray-900"
                        : "bg-red-500 text-white"
                    }
                  >
                    {integration.status}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                  >
                    <a href={integration.link} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2">
                      <span>Ver mais</span>
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Separator className="my-8" />

        <div className="text-center text-gray-500">
          <p>
            Mais integrações em breve!{" "}
            <Settings className="inline-block h-4 w-4 ml-1 align-middle" />
          </p>
        </div>
      </div>
    </Layout>
  );
}