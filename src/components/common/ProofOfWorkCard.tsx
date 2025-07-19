import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "./GlassCard";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  MapPin, 
  Camera, 
  Star,
  Award,
  Sparkles,
  QrCode,
  CheckCircle
} from "lucide-react";

interface WorkProofData {
  id: string;
  workHours: number;
  imagePreview: string;
  locationTag: string;
  description: string;
  timestamp: string;
  contractorName: string;
  rating: number;
  verified: boolean;
}

interface ProofOfWorkCardProps {
  workData: WorkProofData;
  onSubmit?: () => void;
  isSubmitting?: boolean;
}

export const ProofOfWorkCard = ({ 
  workData, 
  onSubmit, 
  isSubmitting = false 
}: ProofOfWorkCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <motion.div
      className="perspective-1000 w-full max-w-sm mx-auto"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      <motion.div
        className="relative w-full h-80 preserve-3d cursor-pointer"
        animate={{ 
          rotateY: isFlipped ? 180 : 0,
          scale: isHovered ? 1.05 : 1
        }}
        transition={{ 
          duration: 0.6,
          type: "spring",
          stiffness: 100
        }}
      >
        {/* Front of Card */}
        <motion.div
          className="absolute inset-0 backface-hidden"
          style={{ backfaceVisibility: "hidden" }}
        >
          <GlassCard className="h-full relative overflow-hidden">
            {/* NFT-style gradient background */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-civic-green/20 via-civic-blue/20 to-civic-gold/20"
              animate={{
                background: [
                  "linear-gradient(45deg, hsl(var(--civic-green))/0.2, hsl(var(--civic-blue))/0.2)",
                  "linear-gradient(45deg, hsl(var(--civic-blue))/0.2, hsl(var(--civic-gold))/0.2)",
                  "linear-gradient(45deg, hsl(var(--civic-gold))/0.2, hsl(var(--civic-green))/0.2)",
                  "linear-gradient(45deg, hsl(var(--civic-green))/0.2, hsl(var(--civic-blue))/0.2)"
                ]
              }}
              transition={{ duration: 4, repeat: Infinity }}
            />

            {/* Floating Particles */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-civic-gold rounded-full opacity-60"
                  style={{
                    left: `${20 + Math.random() * 60}%`,
                    top: `${20 + Math.random() * 60}%`,
                  }}
                  animate={{
                    y: [0, -10, 0],
                    opacity: [0.3, 1, 0.3],
                    scale: [1, 1.5, 1],
                  }}
                  transition={{
                    duration: 2 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                />
              ))}
            </div>

            <div className="relative z-10 p-6 h-full flex flex-col">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-civic-green">Work Proof NFT</h3>
                  <p className="text-sm text-muted-foreground">#{workData.id}</p>
                </div>
                
                <motion.div
                  className="w-8 h-8 bg-civic-gold/20 rounded-full flex items-center justify-center"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <Award className="w-4 h-4 text-civic-gold" />
                </motion.div>
              </div>

              {/* Image Preview */}
              <motion.div
                className="flex-1 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl mb-4 overflow-hidden relative"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <Camera className="w-12 h-12 text-gray-400" />
                </div>
                <div className="absolute bottom-2 left-2 right-2">
                  <Badge variant="secondary" className="text-xs">
                    Work Progress Image
                  </Badge>
                </div>
              </motion.div>

              {/* Details */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Work Hours:</span>
                  <span className="font-semibold flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {workData.workHours}h
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Location:</span>
                  <span className="font-semibold flex items-center">
                    <MapPin className="w-3 h-3 mr-1" />
                    {workData.locationTag}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Contractor:</span>
                  <div className="flex items-center space-x-1">
                    <span className="font-semibold">{workData.contractorName}</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < Math.floor(workData.rating) 
                              ? 'text-civic-gold fill-current' 
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Verification Badge */}
              {workData.verified && (
                <motion.div
                  className="mt-3 flex items-center justify-center space-x-2 text-civic-green"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                >
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Verified</span>
                </motion.div>
              )}
            </div>

            {/* Holographic Edge Effect */}
            <motion.div
              className="absolute inset-0 rounded-2xl border-2 border-civic-gold/30 pointer-events-none"
              animate={{
                borderColor: [
                  "hsl(var(--civic-gold))/0.3",
                  "hsl(var(--civic-green))/0.3", 
                  "hsl(var(--civic-blue))/0.3",
                  "hsl(var(--civic-gold))/0.3"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </GlassCard>
        </motion.div>

        {/* Back of Card */}
        <motion.div
          className="absolute inset-0 backface-hidden"
          style={{ 
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)"
          }}
        >
          <GlassCard className="h-full relative overflow-hidden">
            <div className="p-6 h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Work Details</h3>
                <QrCode className="w-6 h-6 text-civic-blue" />
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Description:</label>
                  <p className="text-sm mt-1">{workData.description}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Timestamp:</label>
                  <p className="text-sm mt-1">{workData.timestamp}</p>
                </div>

                <div className="bg-gradient-to-r from-civic-green/10 to-civic-blue/10 rounded-lg p-3">
                  <h4 className="font-medium mb-2">Blockchain Hash:</h4>
                  <code className="text-xs font-mono break-all">
                    0x{Math.random().toString(16).substr(2, 40)}
                  </code>
                </div>
              </div>

              {/* Submit Button */}
              {onSubmit && (
                <motion.button
                  className="w-full bg-gradient-civic text-white py-3 rounded-lg font-medium"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSubmit();
                  }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center space-x-2">
                      <motion.div
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      <span>Minting NFT...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <Sparkles className="w-4 h-4" />
                      <span>Submit Work Proof</span>
                    </div>
                  )}
                </motion.button>
              )}
            </div>
          </GlassCard>
        </motion.div>
      </motion.div>

      {/* Submission Animation */}
      <AnimatePresence>
        {isSubmitting && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="text-white text-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-8 h-8 mx-auto mb-2" />
              </motion.div>
              <p className="text-sm">Creating NFT Badge...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};