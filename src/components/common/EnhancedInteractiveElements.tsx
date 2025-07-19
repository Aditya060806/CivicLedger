import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ExternalLink, Info, Zap, Users, FileText, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GlassCard } from '@/components/common/GlassCard';
import { cn } from '@/lib/utils';

interface AccordionItem {
  id: string;
  title: string;
  content: string;
  badge?: string;
  icon?: React.ComponentType<any>;
}

interface EnhancedAccordionProps {
  items: AccordionItem[];
  className?: string;
}

export const EnhancedAccordion: React.FC<EnhancedAccordionProps> = ({ items, className }) => {
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <div className={cn("space-y-3", className)}>
      {items.map((item) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="border border-border rounded-lg overflow-hidden bg-background/50 backdrop-blur-sm"
        >
          <button
            onClick={() => toggleItem(item.id)}
            className="w-full p-4 text-left hover:bg-muted/50 transition-colors enhanced-focus flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              {item.icon && (
                <item.icon className="w-5 h-5 text-civic-blue group-hover:text-civic-green transition-colors" />
              )}
              <span className="font-medium">{item.title}</span>
              {item.badge && (
                <Badge variant="secondary" className="text-xs">
                  {item.badge}
                </Badge>
              )}
            </div>
            <motion.div
              animate={{ rotate: openItems.includes(item.id) ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </motion.div>
          </button>
          
          <AnimatePresence>
            {openItems.includes(item.id) && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="p-4 pt-0 text-muted-foreground border-t border-border/50">
                  {item.content}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
};

interface FloatingActionButtonProps {
  icon: React.ComponentType<any>;
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  icon: Icon,
  label,
  onClick,
  variant = 'primary',
  size = 'md',
  className
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const variantClasses = {
    primary: 'bg-civic-blue hover:bg-civic-blue-dark text-white',
    secondary: 'bg-civic-green hover:bg-civic-green-dark text-white',
    success: 'bg-civic-success hover:bg-civic-success/90 text-white',
    warning: 'bg-civic-warning hover:bg-civic-warning/90 text-white'
  };

  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-14 h-14',
    lg: 'w-16 h-16'
  };

  return (
    <motion.button
      onClick={onClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={cn(
        "fixed bottom-6 right-6 rounded-full shadow-fab z-50 flex items-center justify-center transition-all duration-300 enhanced-focus",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      whileHover={{ scale: 1.1, y: -2 }}
      whileTap={{ scale: 0.95 }}
      animate={{
        boxShadow: isHovered 
          ? "0 8px 30px rgba(0,0,0,0.3)" 
          : "0 4px 20px rgba(0,0,0,0.2)"
      }}
    >
      <Icon className={cn(
        "transition-transform duration-200",
        size === 'sm' && "w-5 h-5",
        size === 'md' && "w-6 h-6", 
        size === 'lg' && "w-7 h-7"
      )} />
      
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, x: 10, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 10, scale: 0.8 }}
            className="absolute right-full mr-3 bg-foreground text-background px-3 py-1 rounded-md text-sm font-medium whitespace-nowrap"
          >
            {label}
            <div className="absolute top-1/2 -right-1 transform -translate-y-1/2 w-2 h-2 bg-foreground rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

interface InteractiveCardProps {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  action?: {
    label: string;
    onClick: () => void;
  };
  status?: 'active' | 'pending' | 'completed' | 'warning';
  metrics?: { label: string; value: string }[];
  className?: string;
}

export const InteractiveCard: React.FC<InteractiveCardProps> = ({
  title,
  description,
  icon: Icon,
  action,
  status,
  metrics,
  className
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const statusConfig = {
    active: { color: 'civic-blue', bg: 'civic-blue/10', label: 'Active' },
    pending: { color: 'civic-warning', bg: 'civic-warning/10', label: 'Pending' },
    completed: { color: 'civic-success', bg: 'civic-success/10', label: 'Completed' },
    warning: { color: 'civic-error', bg: 'civic-error/10', label: 'Attention Required' }
  };

  return (
    <motion.div
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={cn(className)}
    >
      <GlassCard className="p-6 h-full enhanced-card group cursor-pointer">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-civic-blue/10 group-hover:bg-civic-blue/20 transition-colors">
              <Icon className="w-5 h-5 text-civic-blue" />
            </div>
            {status && (
              <Badge 
                className={cn(
                  "text-xs",
                  `bg-${statusConfig[status].bg} text-${statusConfig[status].color}`
                )}
              >
                {statusConfig[status].label}
              </Badge>
            )}
          </div>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <ExternalLink className="w-4 h-4 text-muted-foreground" />
            </motion.div>
          )}
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold text-foreground group-hover:text-civic-blue transition-colors">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {description}
          </p>
          
          {metrics && (
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border/50">
              {metrics.map((metric, index) => (
                <div key={index} className="text-center">
                  <div className="text-lg font-bold text-foreground number-counter">
                    {metric.value}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {metric.label}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {action && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
              transition={{ delay: 0.1 }}
              className="pt-3"
            >
              <Button
                size="sm"
                onClick={action.onClick}
                className="w-full h-8 text-xs"
              >
                {action.label}
              </Button>
            </motion.div>
          )}
        </div>
      </GlassCard>
    </motion.div>
  );
};

// Example usage data
export const sampleAccordionItems: AccordionItem[] = [
  {
    id: '1',
    title: 'Smart Contract Execution',
    content: 'Automated policy execution through blockchain smart contracts ensures transparency and eliminates human intervention in fund disbursement.',
    badge: 'Core Feature',
    icon: Zap
  },
  {
    id: '2',
    title: 'Citizen Participation',
    content: 'Direct citizen involvement in governance through transparent tracking, complaint filing, and participatory decision-making processes.',
    badge: 'Democracy',
    icon: Users
  },
  {
    id: '3',
    title: 'Policy Transparency',
    content: 'Every government policy is converted into readable smart contracts with real-time execution tracking and public audit trails.',
    badge: 'Transparency',
    icon: FileText
  },
  {
    id: '4',
    title: 'Performance Metrics',
    content: 'Real-time analytics and performance tracking ensure continuous improvement and accountability in governance processes.',
    badge: 'Analytics',
    icon: Target
  }
];