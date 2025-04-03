import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { X } from 'lucide-react';

interface MilestonePopupProps {
  milestone: {
    type: 'referrals' | 'earnings' | 'balance';
    amount: number;
    title: string;
    description: string;
  };
  onClose: () => void;
}

export default function MilestonePopup({ milestone, onClose }: MilestonePopupProps) {
  const [animationState, setAnimationState] = useState<'entering' | 'visible' | 'exiting'>('entering');

  // Apply animations based on milestone type
  const getTypeIcon = () => {
    switch (milestone.type) {
      case 'referrals':
        return '👥';
      case 'earnings':
        return '💰';
      case 'balance':
        return '💵';
      default:
        return '🏆';
    }
  };

  // Get background gradient based on milestone type
  const getGradient = () => {
    switch (milestone.type) {
      case 'referrals':
        return 'bg-gradient-to-br from-blue-600 to-indigo-900';
      case 'earnings':
        return 'bg-gradient-to-br from-yellow-500 to-amber-700';
      case 'balance':
        return 'bg-gradient-to-br from-green-500 to-emerald-800';
      default:
        return 'bg-gradient-to-br from-purple-600 to-indigo-900';
    }
  };

  // Handle animations
  useEffect(() => {
    // First enter animation
    const enterTimer = setTimeout(() => {
      setAnimationState('visible');
    }, 100);

    // Auto close after some time if the user doesn't close it manually
    const autoCloseTimer = setTimeout(() => {
      setAnimationState('exiting');
      
      // Wait for exit animation to complete before actually closing
      setTimeout(onClose, 500);
    }, 6000);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(autoCloseTimer);
    };
  }, [onClose]);

  // Handle manual close with animation
  const handleClose = () => {
    setAnimationState('exiting');
    setTimeout(onClose, 500);
  };

  return (
    <div 
      className={`fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70 transition-opacity duration-300 ${
        animationState === 'entering' ? 'opacity-0' : 
        animationState === 'exiting' ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div 
        className={`relative w-[90%] max-w-md overflow-hidden rounded-xl ${getGradient()} shadow-2xl transition-all duration-500 ${
          animationState === 'entering' ? 'scale-75 opacity-0' : 
          animationState === 'exiting' ? 'scale-75 opacity-0' : 'scale-100 opacity-100'
        }`}
      >
        {/* Close button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute right-2 top-2 text-white/70 hover:text-white hover:bg-white/10 z-10"
          onClick={handleClose}
        >
          <X />
        </Button>
        
        {/* Milestone content */}
        <div className="text-center p-8">
          {/* Giant emoji that animates */}
          <div className="text-8xl mb-4 animate-bounce">{getTypeIcon()}</div>
          
          {/* Milestone details */}
          <h3 className="text-2xl font-bold text-white mb-2">{milestone.title}</h3>
          <p className="text-white/80 mb-6">{milestone.description}</p>
          
          {/* Milestone amount with animation */}
          <div className="text-3xl font-bold text-white mb-6 animate-pulse">
            {milestone.type === 'referrals' ? (
              <span>{milestone.amount} Referrals</span>
            ) : (
              <span>₦{milestone.amount.toLocaleString()}</span>
            )}
          </div>
          
          {/* Action button */}
          <Button 
            className="bg-white text-black hover:bg-white/90 rounded-full px-6 py-2"
            onClick={handleClose}
          >
            Awesome!
          </Button>
          
          {/* Confetti-like particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 30 }).map((_, i) => (
              <div 
                key={i}
                className="absolute rounded-full bg-white/30"
                style={{
                  width: `${Math.random() * 20 + 5}px`,
                  height: `${Math.random() * 20 + 5}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animation: `float-up ${Math.random() * 3 + 2}s linear infinite`,
                  animationDelay: `${Math.random() * 2}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Add some keyframes for the confetti animation */}
      <style>{`
        @keyframes float-up {
          0% {
            transform: translateY(100%) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100%) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}