import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import {
  Plus,
  Edit,
  MessageSquare,
  BarChart3,
} from "lucide-react";

export default function QuickActions() {

  const handleQuickAction = (action: string) => {
    toast("Quick Action",{
      description: `${action} functionality will be implemented soon.`,
    });
  };

  const quickActions = [
    {
      title: "Add New User",
      description: "Register a new nanny or family",
      icon: Plus,
      color: "blue",
      action: "Add New User",
    },
    {
      title: "Create Blog Post",
      description: "Publish new content for families",
      icon: Edit,
      color: "green",
      action: "Create Blog Post",
    },
    {
      title: "Manage Community",
      description: "Moderate discussions and topics",
      icon: MessageSquare,
      color: "purple",
      action: "Manage Community",
    },
    {
      title: "View Reports",
      description: "Access detailed analytics",
      icon: BarChart3,
      color: "yellow",
      action: "View Reports",
    },
  ];

  const colorClasses = {
    blue: "bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900 dark:bg-opacity-20 dark:text-blue-400 dark:hover:bg-blue-900 dark:hover:bg-opacity-30",
    green: "bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-900 dark:bg-opacity-20 dark:text-green-400 dark:hover:bg-green-900 dark:hover:bg-opacity-30",
    purple: "bg-purple-100 text-purple-600 hover:bg-purple-200 dark:bg-purple-900 dark:bg-opacity-20 dark:text-purple-400 dark:hover:bg-purple-900 dark:hover:bg-opacity-30",
    yellow: "bg-yellow-100 text-yellow-600 hover:bg-yellow-200 dark:bg-yellow-900 dark:bg-opacity-20 dark:text-yellow-400 dark:hover:bg-yellow-900 dark:hover:bg-opacity-30",
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {quickActions.map((action, index) => (
        <Card
          key={index}
          className="quick-action-card"
          onClick={() => handleQuickAction(action.action)}
        >
          <CardContent className="p-6">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-colors ${colorClasses[action.color as keyof typeof colorClasses]}`}>
              <action.icon className="w-6 h-6" />
            </div>
            <h4 className="font-semibold text-foreground mb-2">{action.title}</h4>
            <p className="text-sm text-muted-foreground">{action.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
