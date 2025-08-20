import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { 
  ShieldCheck, 
  Mic, 
  Brain, 
  Smile, 
  Hand, 
  LayoutGrid, 
  Smartphone, 
  RotateCw,
  X,
  Check,
  Volume2
} from 'lucide-react';

type CaptchaMode = "gesture" | "emoji" | "sequence" | "pattern" | "tilt" | "voice" | "ai-task";

interface CaptchaProps {
  mode: CaptchaMode;
  theme?: "light" | "dark";
  onVerify: (success: boolean) => void;
  className?: string;
}

const emojis = {
  animals: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'],
  fruits: ['🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓'],
  vehicles: ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎', '🚓', '🚑'],
  objects: ['✂️', '📌', '📎', '🖇', '📏', '📐', '📕', '📘']
};

const aiTasks = [
  { question: "Which icon cuts paper?", options: ["✂️", "🍎", "🚗"], answer: 0 },
  { question: "Which item is a fruit?", options: ["📘", "🍊", "🚙"], answer: 1 },
  { question: "What would you use to write?", options: ["✏️", "🔪", "🍌"], answer: 0 },
];

const Captcha: React.FC<CaptchaProps> = ({ 
  mode, 
  theme = 'light', 
  onVerify, 
  className = '' 
}) => {
  const [status, setStatus] = useState<'idle' | 'verifying' | 'success' | 'error'>('idle');
  const [step, setStep] = useState<number>(0);
  const [userInput, setUserInput] = useState<any>(null);
  const [challenge, setChallenge] = useState<any>(null);
  const controls = useAnimation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const animationRef = useRef<number>(0);
  
  const isDark = theme === 'dark';
  const bgColor = isDark ? 'bg-gray-900' : 'bg-gray-50';
  const textColor = isDark ? 'text-white' : 'text-gray-900';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-200';
  const buttonBg = isDark ? 'bg-blue-600' : 'bg-blue-500';
  const buttonHover = isDark ? 'hover:bg-blue-700' : 'hover:bg-blue-600';
  const errorColor = isDark ? 'bg-red-900' : 'bg-red-100';
  const successColor = isDark ? 'bg-green-900' : 'bg-green-100';

  // Initialize challenge based on mode
  useEffect(() => {
    resetChallenge();
  }, [mode]);

  const resetChallenge = useCallback(() => {
    setStatus('idle');
    setStep(0);
    setUserInput(null);
    
    switch (mode) {
      case 'gesture':
        setChallenge({
          targetShape: ['circle', 'square', 'triangle'][Math.floor(Math.random() * 3)],
          drawnShape: null
        });
        break;
      
      case 'emoji':
        const category = Object.keys(emojis)[Math.floor(Math.random() * Object.keys(emojis).length)];
        const items = [...emojis[category as keyof typeof emojis]];
        // Insert an odd one out
        const oddIndex = Math.floor(Math.random() * items.length);
        const oddCategory = Object.keys(emojis).filter(c => c !== category)[0];
        items[oddIndex] = emojis[oddCategory as keyof typeof emojis][Math.floor(Math.random() * emojis[oddCategory as keyof typeof emojis].length)];
        setChallenge({
          items,
          oddIndex
        });
        break;
      
      case 'sequence':
        const sequence = Array.from({ length: 4 }, () => Math.floor(Math.random() * 4));
        setChallenge({
          sequence,
          userSequence: []
        });
        break;
      
      case 'pattern':
        setChallenge({
          pattern: Array.from({ length: 9 }, () => false),
          userPattern: []
        });
        break;
      
      case 'tilt':
        setChallenge({
          targetPosition: Math.floor(Math.random() * 5),
          currentPosition: 0
        });
        break;
      
      case 'voice':
        const phrases = [
          "The quick brown fox",
          "Captcha verification",
          "React components rock",
          "TypeScript is awesome"
        ];
        setChallenge({
          phrase: phrases[Math.floor(Math.random() * phrases.length)],
          recording: false
        });
        break;
      
      case 'ai-task':
        setChallenge(aiTasks[Math.floor(Math.random() * aiTasks.length)]);
        break;
    }
  }, [mode]);

  const handleVerify = useCallback(async () => {
    setStatus('verifying');
    
    // Simulate verification delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    let success = false;
    
    switch (mode) {
      case 'gesture':
        success = challenge.drawnShape === challenge.targetShape;
        break;
      
      case 'emoji':
        success = userInput === challenge.oddIndex;
        break;
      
      case 'sequence':
        success = JSON.stringify(userInput) === JSON.stringify(challenge.sequence);
        break;
      
      case 'pattern':
        // Simple pattern check - at least 3 points selected
        success = userInput.length >= 3;
        break;
      
      case 'tilt':
        success = Math.abs(userInput - challenge.targetPosition) <= 1;
        break;
      
      case 'voice':
        // In a real app, we'd analyze the recording
        success = true; // Always true for demo
        break;
      
      case 'ai-task':
        success = userInput === challenge.answer;
        break;
    }
    
    if (success) {
      setStatus('success');
      await controls.start({
        scale: [1, 1.05, 1],
        transition: { duration: 0.5 }
      });
      
      // Confetti effect
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          canvas.width = canvas.offsetWidth;
          canvas.height = canvas.offsetHeight;
          
          const particles: any[] = [];
          for (let i = 0; i < 50; i++) {
            particles.push({
              x: Math.random() * canvas.width,
              y: Math.random() * canvas.height,
              size: Math.random() * 5 + 2,
              color: `hsl(${Math.random() * 360}, 100%, 50%)`,
              speedX: Math.random() * 6 - 3,
              speedY: Math.random() * 6 - 3
            });
          }
          
          const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(particle => {
              ctx.fillStyle = particle.color;
              ctx.beginPath();
              ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
              ctx.fill();
              
              particle.x += particle.speedX;
              particle.y += particle.speedY;
              
              if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
              if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;
            });
            
            animationRef.current = requestAnimationFrame(animate);
          };
          
          animate();
          setTimeout(() => {
            cancelAnimationFrame(animationRef.current);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
          }, 2000);
        }
      }
    } else {
      setStatus('error');
      await controls.start({
        x: [0, -10, 10, -10, 10, 0],
        transition: { duration: 0.5 }
      });
    }
    
    onVerify(success);
    
    if (!success) {
      setTimeout(() => {
        resetChallenge();
      }, 1500);
    }
  }, [mode, challenge, userInput, controls, onVerify, resetChallenge]);

  const renderModeContent = () => {
    switch (mode) {
      case 'gesture':
        return (
          <GestureCaptcha 
            challenge={challenge}
            setChallenge={setChallenge}
            theme={theme}
          />
        );
      
      case 'emoji':
        return (
          <EmojiCaptcha 
            challenge={challenge}
            userInput={userInput}
            setUserInput={setUserInput}
            theme={theme}
          />
        );
      
      case 'sequence':
        return (
          <SequenceCaptcha 
            challenge={challenge}
            step={step}
            setStep={setStep}
            userInput={userInput}
            setUserInput={setUserInput}
            theme={theme}
          />
        );
      
      case 'pattern':
        return (
          <PatternCaptcha 
            challenge={challenge}
            userInput={userInput}
            setUserInput={setUserInput}
            theme={theme}
          />
        );
      
      case 'tilt':
        return (
          <TiltCaptcha 
            challenge={challenge}
            userInput={userInput}
            setUserInput={setUserInput}
            theme={theme}
          />
        );
      
      case 'voice':
        return (
          <VoiceCaptcha 
            challenge={challenge}
            userInput={userInput}
            setUserInput={setUserInput}
            theme={theme}
            audioRef={audioRef}
          />
        );
      
      case 'ai-task':
        return (
          <AITaskCaptcha 
            challenge={challenge}
            userInput={userInput}
            setUserInput={setUserInput}
            theme={theme}
          />
        );
    }
  };

  const getModeIcon = () => {
    switch (mode) {
      case 'gesture': return <Hand className="w-5 h-5" />;
      case 'emoji': return <Smile className="w-5 h-5" />;
      case 'sequence': return <RotateCw className="w-5 h-5" />;
      case 'pattern': return <LayoutGrid className="w-5 h-5" />;
      case 'tilt': return <Smartphone className="w-5 h-5" />;
      case 'voice': return <Mic className="w-5 h-5" />;
      case 'ai-task': return <Brain className="w-5 h-5" />;
    }
  };

  const getModeTitle = () => {
    switch (mode) {
      case 'gesture': return 'Gesture Verification';
      case 'emoji': return 'Emoji Match';
      case 'sequence': return 'Sequence Memory';
      case 'pattern': return 'Pattern Connect';
      case 'tilt': return 'Tilt Challenge';
      case 'voice': return 'Voice Verification';
      case 'ai-task': return 'AI Task';
    }
  };

  return (
    <motion.div
      animate={controls}
      className={`${className} ${bgColor} ${textColor} rounded-lg shadow-lg overflow-hidden border ${borderColor} w-full max-w-md`}
    >
      <canvas 
        ref={canvasRef} 
        className="absolute w-full h-full pointer-events-none"
      />
      
      <div className="p-6 relative">
        <div className="flex items-center gap-3 mb-4">
          {getModeIcon()}
          <h3 className="text-lg font-semibold">{getModeTitle()}</h3>
        </div>
        
        <div className="mb-6">
          {renderModeContent()}
        </div>
        
        <div className="flex justify-between items-center">
          <AnimatePresence>
            {status === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`${errorColor} ${isDark ? 'text-red-200' : 'text-red-800'} px-3 py-1 rounded-md text-sm flex items-center gap-2`}
              >
                <X className="w-4 h-4" />
                Verification failed. Try again.
              </motion.div>
            )}
            
            {status === 'success' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`${successColor} ${isDark ? 'text-green-200' : 'text-green-800'} px-3 py-1 rounded-md text-sm flex items-center gap-2`}
              >
                <Check className="w-4 h-4" />
                Verification successful!
              </motion.div>
            )}
          </AnimatePresence>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleVerify}
            disabled={status === 'verifying' || userInput === null}
            className={`${buttonBg} ${buttonHover} text-white px-4 py-2 rounded-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {status === 'verifying' ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="w-4 h-4"
                >
                  <RotateCw className="w-full h-full" />
                </motion.div>
                Verifying...
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                Verify
              </>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

// Sub-components for each CAPTCHA mode
const GestureCaptcha = ({
  challenge,
  setChallenge,
  theme
}: {
  challenge: { targetShape: string; drawnShape: string | null };
  setChallenge: React.Dispatch<React.SetStateAction<{ targetShape: string; drawnShape: string | null }>>;
  theme: string;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [path, setPath] = useState<{x: number, y: number}[]>([]);
  
  const isDark = theme === 'dark';
  const strokeColor = isDark ? 'white' : 'black';
  const bgColor = isDark ? 'bg-gray-800' : 'bg-white';
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw instructions
    ctx.fillStyle = isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`Draw a ${challenge.targetShape}`, canvas.width / 2, 30);
    
    // Draw path
    if (path.length > 1) {
      ctx.beginPath();
      ctx.moveTo(path[0].x, path[0].y);
      for (let i = 1; i < path.length; i++) {
        ctx.lineTo(path[i].x, path[i].y);
      }
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 3;
      ctx.stroke();
    }
  }, [path, challenge.targetShape, isDark, strokeColor]);
  
  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    
    setPath([{ x, y }]);
  };
  
  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    
    setPath(prev => [...prev, { x, y }]);
  };
  
  const endDrawing = () => {
    setIsDrawing(false);
    
    // Simple shape detection (for demo purposes)
    if (path.length < 10) return;
    
    const minX = Math.min(...path.map(p => p.x));
    const maxX = Math.max(...path.map(p => p.x));
    const minY = Math.min(...path.map(p => p.y));
    const maxY = Math.max(...path.map(p => p.y));
    const width = maxX - minX;
    const height = maxY - minY;
    
    let detectedShape = '';
    
    // Very basic shape detection
    if (Math.abs(width - height) < 20) {
      detectedShape = 'square';
    } else if (path.some(p => {
      const centerX = (minX + maxX) / 2;
      const centerY = (minY + maxY) / 2;
      const dist = Math.sqrt(Math.pow(p.x - centerX, 2) + Math.pow(p.y - centerY, 2));
      return dist > width / 2;
    })) {
      detectedShape = 'circle';
    } else {
      detectedShape = 'triangle';
    }
    
    setChallenge({ ...challenge, drawnShape: detectedShape });
  };
  
  return (
    <div className={`${bgColor} rounded-md p-4`}>
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={endDrawing}
        onMouseLeave={endDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={endDrawing}
        className="w-full h-64 touch-none border rounded-md"
      />
      <div className="mt-2 text-sm opacity-70 text-center">
        Draw a {challenge.targetShape} in the box above
      </div>
    </div>
  );
};

interface EmojiCaptchaProps {
  challenge: { items: string[]; oddIndex: number };
  userInput: number | null;
  setUserInput: React.Dispatch<React.SetStateAction<number | null>>;
  theme: string;
}

const EmojiCaptcha: React.FC<EmojiCaptchaProps> = ({ challenge, userInput, setUserInput, theme }) => {
  const isDark = theme === 'dark';
  const bgColor = isDark ? 'bg-gray-800' : 'bg-white';
  const hoverColor = isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100';
  const selectedColor = isDark ? 'bg-blue-900' : 'bg-blue-100';
  
  return (
    <div className={`${bgColor} rounded-md p-4`}>
      <h4 className="text-center mb-4">Find and select the odd emoji</h4>
      <div className="grid grid-cols-4 gap-3">
        {challenge.items.map((emoji, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setUserInput(index)}
            className={`text-3xl p-3 rounded-md flex items-center justify-center ${hoverColor} ${
              userInput === index ? selectedColor : ''
            }`}
          >
            {emoji}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

interface SequenceCaptchaProps {
  challenge: { sequence: number[]; userSequence: number[] };
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  userInput: number[] | null;
  setUserInput: React.Dispatch<React.SetStateAction<number[] | null>>;
  theme: string;
}

const SequenceCaptcha: React.FC<SequenceCaptchaProps> = ({ challenge, step, setStep, userInput, setUserInput, theme }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const isDark = theme === 'dark';
  const bgColor = isDark ? 'bg-gray-800' : 'bg-white';
  const buttonColor = isDark ? 'bg-gray-700' : 'bg-gray-200';
  const activeColor = isDark ? 'bg-blue-500' : 'bg-blue-400';
  
  useEffect(() => {
    if (step === 0) {
      // Show sequence
      let i = 0;
      const interval = setInterval(() => {
        if (i >= challenge.sequence.length) {
          clearInterval(interval);
          setStep(1);
          return;
        }
        setActiveIndex(challenge.sequence[i]);
        setTimeout(() => {
          setActiveIndex(null);
          i++;
        }, 800);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [step, challenge.sequence, setStep]);
  
  const handleButtonClick = (index: number) => {
    if (step !== 1) return;
    
    const newSequence = [...(userInput || []), index];
    setUserInput(newSequence);
    
    if (newSequence.length === challenge.sequence.length) {
      setStep(2);
    }
  };
  
  return (
    <div className={`${bgColor} rounded-md p-4`}>
      <h4 className="text-center mb-4">
        {step === 0 ? 'Watch the sequence' : 
         step === 1 ? 'Repeat the sequence' : 'Sequence completed'}
      </h4>
      <div className="grid grid-cols-2 gap-4">
        {[0, 1, 2, 3].map(index => (
          <motion.button
            key={index}
            whileHover={{ scale: step === 1 ? 1.05 : 1 }}
            whileTap={{ scale: step === 1 ? 0.95 : 1 }}
            onClick={() => handleButtonClick(index)}
            className={`aspect-square rounded-full ${buttonColor} ${
              activeIndex === index || (step === 1 && userInput?.includes(index)) ? activeColor : ''
            }`}
            disabled={step !== 1}
          />
        ))}
      </div>
    </div>
  );
};

const PatternCaptcha = ({
  challenge,
  userInput,
  setUserInput,
  theme
}: {
  challenge: { pattern: boolean[]; userPattern: number[] };
  userInput: number[];
  setUserInput: React.Dispatch<React.SetStateAction<number[]>>;
  theme: string;
}) => {
  const [path, setPath] = useState<number[]>([]);
  const isDark = theme === 'dark';
  const bgColor = isDark ? 'bg-gray-800' : 'bg-white';
  const dotColor = isDark ? 'bg-gray-600' : 'bg-gray-300';
  const activeColor = isDark ? 'bg-blue-500' : 'bg-blue-400';
  const lineColor = isDark ? 'bg-blue-400' : 'bg-blue-500';
  
  const handleDotClick = (index: number) => {
    if (path.includes(index)) return;
    
    const newPath = [...path, index];
    setPath(newPath);
    setUserInput(newPath);
  };
  
  const resetPattern = () => {
    setPath([]);
    setUserInput([]);
  };
  
  // Calculate line positions between dots
  const getLineStyles = (from: number, to: number) => {
    const fromRow = Math.floor(from / 3);
    const fromCol = from % 3;
    const toRow = Math.floor(to / 3);
    const toCol = to % 3;
    
    // Use px units for left/top/width for compatibility
    const dotSpacing = 48; // px, adjust as needed for your layout
    const offset = 16; // px, adjust as needed for your layout

    const centerX = (index: number) => offset + (index % 3) * dotSpacing;
    const centerY = (index: number) => offset + Math.floor(index / 3) * dotSpacing;

    const angle = Math.atan2(
      (toRow - fromRow) * dotSpacing,
      (toCol - fromCol) * dotSpacing
    ) * 180 / Math.PI;

    const length = Math.sqrt(
      Math.pow((toCol - fromCol) * dotSpacing, 2) + 
      Math.pow((toRow - fromRow) * dotSpacing, 2)
    );

    return {
      position: 'absolute' as const,
      left: `${centerX(from)}px`,
      top: `${centerY(from)}px`,
      width: `${length}px`,
      height: '4px',
      backgroundColor: lineColor,
      transformOrigin: '0 50%',
      transform: `rotate(${angle}deg)`,
      zIndex: 1
    };
  };
  
  return (
    <div className={`${bgColor} rounded-md p-4`}>
      <h4 className="text-center mb-4">Draw your pattern</h4>
      <div className="relative aspect-square w-full max-w-xs mx-auto">
        {/* Lines between dots */}
        {path.length > 1 && path.map((dot, i) => (
          i > 0 && (
            <div key={`line-${i}`} style={getLineStyles(path[i-1], dot)} />
          )
        ))}
        
        {/* Dots grid */}
        <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
          {Array.from({ length: 9 }).map((_, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleDotClick(index)}
              className={`w-8 h-8 rounded-full ${dotColor} ${
                path.includes(index) ? activeColor : ''
              }`}
              style={{
                margin: 'auto'
              }}
            />
          ))}
        </div>
      </div>
      <div className="mt-4 flex justify-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={resetPattern}
          className={`px-3 py-1 rounded-md ${isDark ? 'bg-gray-700' : 'bg-gray-200'} text-sm`}
        >
          Reset Pattern
        </motion.button>
      </div>
    </div>
  );
};

interface TiltCaptchaProps {
  challenge: { targetPosition: number; currentPosition: number };
  userInput: number;
  setUserInput: React.Dispatch<React.SetStateAction<number>>;
  theme: string;
}

const TiltCaptcha: React.FC<TiltCaptchaProps> = ({ challenge, userInput, setUserInput, theme }) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const isDark = theme === 'dark';
  const bgColor = isDark ? 'bg-gray-800' : 'bg-white';
  const ballColor = isDark ? 'bg-blue-400' : 'bg-blue-500';
  const targetColor = isDark ? 'bg-green-500' : 'bg-green-400';
  
  useEffect(() => {
    if (!window.DeviceOrientationEvent) {
      console.warn('Device orientation not supported');
      return;
    }
    
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.beta !== null && e.gamma !== null) {
        setTilt({
          x: Math.min(Math.max(e.gamma || 0, -45), 45),
          y: Math.min(Math.max(e.beta || 0, -45), 45)
        });
        
        // Simple position calculation based on tilt
        const position = Math.floor(((e.gamma || 0) + 45) / 18);
        setUserInput(position);
      }
    };
    
    window.addEventListener('deviceorientation', handleOrientation);
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, [setUserInput]);
  
  return (
    <div className={`${bgColor} rounded-md p-4`}>
      <h4 className="text-center mb-4">Tilt your device to move the ball to the target</h4>
      <div className="relative h-48 w-full bg-gray-700 rounded-lg overflow-hidden">
        {/* Target position */}
        <div 
          className={`absolute bottom-4 w-12 h-12 rounded-full ${targetColor}`}
          style={{
            left: `${16 + challenge.targetPosition * 20}%`,
            transform: 'translateX(-50%)'
          }}
        />
        
        {/* Ball */}
        <motion.div
          className={`absolute bottom-4 w-8 h-8 rounded-full ${ballColor}`}
          style={{
            left: '50%',
            x: tilt.x * 2,
            y: tilt.y * 2
          }}
        />
      </div>
      <div className="mt-4 text-sm text-center opacity-70">
        Tilt your device to move the ball
      </div>
    </div>
  );
};

interface VoiceCaptchaProps {
  challenge: { phrase: string; recording: boolean };
  userInput: any;
  setUserInput: React.Dispatch<React.SetStateAction<any>>;
  theme: string;
  audioRef: React.RefObject<HTMLAudioElement | null>;
}

const VoiceCaptcha: React.FC<VoiceCaptchaProps> = ({ challenge, userInput, setUserInput, theme, audioRef }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [waveform, setWaveform] = useState<number[]>([]);
  const isDark = theme === 'dark';
  const bgColor = isDark ? 'bg-gray-800' : 'bg-white';
  const buttonColor = isDark ? 'bg-red-600' : 'bg-red-500';
  const buttonHover = isDark ? 'hover:bg-red-700' : 'hover:bg-red-600';
  
  const toggleRecording = () => {
    setIsRecording(!isRecording);
    setUserInput(true); // For demo purposes
    
    // Simulate waveform
    if (!isRecording) {
      const interval = setInterval(() => {
        setWaveform(prev => {
          const newWave = [...prev, Math.random() * 40 + 10];
          return newWave.slice(-20);
        });
      }, 100);
      
      setTimeout(() => {
        clearInterval(interval);
        setIsRecording(false);
      }, 3000);
    } else {
      setWaveform([]);
    }
  };
  
  return (
    <div className={`${bgColor} rounded-md p-4`}>
      <h4 className="text-center mb-4">Say the following phrase:</h4>
      <div className="text-xl font-semibold text-center mb-6">
        "{challenge.phrase}"
      </div>
      
      {/* Waveform visualization */}
      <div className="flex items-end justify-center h-24 gap-1 mb-6">
        {waveform.length > 0 ? (
          waveform.map((height, i) => (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              animate={{ height: `${height}%` }}
              transition={{ duration: 0.1 }}
              className={`w-2 ${isDark ? 'bg-blue-400' : 'bg-blue-500'} rounded-t-sm`}
            />
          ))
        ) : (
          <div className="text-sm opacity-50 flex items-center gap-2">
            <Volume2 className="w-4 h-4" />
            Press record and read the phrase above
          </div>
        )}
      </div>
      
      <div className="flex justify-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleRecording}
          className={`${buttonColor} ${buttonHover} text-white px-4 py-2 rounded-full flex items-center gap-2`}
        >
          <Mic className="w-5 h-5" />
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </motion.button>
      </div>
      
      <audio ref={audioRef} />
    </div>
  );
};

interface AITaskCaptchaProps {
  challenge: { question: string; options: string[]; answer: number };
  userInput: number | null;
  setUserInput: React.Dispatch<React.SetStateAction<number | null>>;
  theme: string;
}

const AITaskCaptcha: React.FC<AITaskCaptchaProps> = ({ challenge, userInput, setUserInput, theme }) => {
  const isDark = theme === 'dark';
  const bgColor = isDark ? 'bg-gray-800' : 'bg-white';
  const optionColor = isDark ? 'bg-gray-700' : 'bg-gray-100';
  const optionHover = isDark ? 'hover:bg-gray-600' : 'hover:bg-gray-200';
  const selectedColor = isDark ? 'bg-blue-900' : 'bg-blue-200';
  
  return (
    <div className={`${bgColor} rounded-md p-4`}>
      <h4 className="text-center mb-6">{challenge.question}</h4>
      <div className="grid gap-3">
        {challenge.options.map((option, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setUserInput(index)}
            className={`${optionColor} ${optionHover} ${
              userInput === index ? selectedColor : ''
            } p-3 rounded-md text-lg flex items-center justify-center gap-2`}
          >
            {option}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default Captcha;