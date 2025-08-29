import { useState, useEffect } from "react";
import { Shield, CheckCircle, XCircle, RefreshCw } from "lucide-react";

type Position = {
  right?: string;
  left?: string;
  top?: string;
  bottom?: string;
  transform?: string;
};

type DragCaptchaProps = {
  onVerify: (verified: boolean) => void;
  resetTrigger?: boolean;
};

const positions: Position[] = [
  { right: '12px', top: '12px' },
  { left: '12px', top: '12px' },
  { left: '12px', bottom: '12px' },
  { right: '12px', bottom: '12px' },
  { left: '50%', top: '12px', transform: 'translateX(-50%)' },
  { left: '50%', bottom: '12px', transform: 'translateX(-50%)' },
  { right: '12px', top: '50%', transform: 'translateY(-50%)' }
];

function DragCaptcha({ onVerify, resetTrigger }: DragCaptchaProps) {
  const [verified, setVerified] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState(false);
  const [targetPosition, setTargetPosition] = useState<Position>(positions[6]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState({ x: 0 });
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    if (resetTrigger) {
      resetCaptcha();
    }
  }, [resetTrigger]);

  const resetCaptcha = () => {
    setVerified(false);
    setFeedback("");
    setError(false);
    setTargetPosition(positions[6]);
    setAttempts(0);
    setDragPosition({ x: 0 });
    onVerify(false);
  };

  const changeTargetPosition = () => {
    const currentIndex = positions.findIndex(pos => 
      pos.right === targetPosition.right && 
      pos.left === targetPosition.left &&
      pos.top === targetPosition.top &&
      pos.bottom === targetPosition.bottom
    );
    
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * positions.length);
    } while (newIndex === currentIndex);
    
    setTargetPosition(positions[newIndex]);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (verified) return;
    setIsDragging(true);
    const rect = e.currentTarget.getBoundingClientRect();
    setDragPosition({
      x: e.clientX - rect.left - 20
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || verified) return;
    const container = e.currentTarget.getBoundingClientRect();
    const newX = Math.min(Math.max(e.clientX - container.left - 20, 0), container.width - 40);
    setDragPosition({ x: newX });
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDragging || verified) return;
    setIsDragging(false);

    const dropZone = document.getElementById('drop-zone');
    if (!dropZone) return;

    const dropRect = dropZone.getBoundingClientRect();
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    if (mouseX >= dropRect.left && mouseX <= dropRect.right && 
        mouseY >= dropRect.top && mouseY <= dropRect.bottom) {
      setVerified(true);
      setFeedback("Verification successful!");
      setError(false);
      onVerify(true);
    } else {
      setError(true);
      setAttempts(prev => prev + 1);
      setFeedback("Wrong! Try again.");
      onVerify(false);
      changeTargetPosition();
      setDragPosition({ x: 0 });
      setTimeout(() => setError(false), 1000);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (verified) return;
    setIsDragging(true);
    const rect = e.currentTarget.getBoundingClientRect();
    const touch = e.touches[0];
    setDragPosition({
      x: touch.clientX - rect.left - 20
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || verified) return;
    e.preventDefault();
    const container = e.currentTarget.getBoundingClientRect();
    const touch = e.touches[0];
    const newX = Math.min(Math.max(touch.clientX - container.left - 20, 0), container.width - 40);
    setDragPosition({ x: newX });
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging || verified) return;
    setIsDragging(false);

    const dropZone = document.getElementById('drop-zone');
    if (!dropZone) return;

    const dropRect = dropZone.getBoundingClientRect();
    const touch = e.changedTouches[0];

    if (touch.clientX >= dropRect.left && touch.clientX <= dropRect.right &&
        touch.clientY >= dropRect.top && touch.clientY <= dropRect.bottom) {
      setVerified(true);
      setFeedback("Verification successful!");
      setError(false);
      onVerify(true);
    } else {
      setError(true);
      setAttempts(prev => prev + 1);
      setFeedback("Wrong! Try again.");
      onVerify(false);
      changeTargetPosition();
      setDragPosition({ x: 0 });
      setTimeout(() => setError(false), 1000);
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Shield className="w-5 h-5 mr-2 text-primary" />
          <span className="text-sm font-semibold text-gray-800">Security Verification</span>
        </div>
        {verified && (
          <CheckCircle className="w-5 h-5 text-primary" />
        )}
      </div>

      <div 
        className={`relative h-20 bg-white border-2 border-dashed rounded-xl mb-4 transition-all duration-300 select-none overflow-hidden ${
          error ? 'border-red-400 bg-red-50 shadow-red-100 animate-pulse' : 
          verified ? 'border-green-400 bg-green-50 shadow-green-100' : 
          isDragging ? 'border-primary bg-blue-50 shadow-blue-100' : 'border-gray-300'
        } ${isDragging ? 'shadow-lg' : 'shadow-sm'}`}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => {
          if (isDragging) {
            setIsDragging(false);
            setDragPosition({ x: 0 });
          }
        }}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {!verified && (
          <div
            className={`absolute w-10 h-10 rounded-lg cursor-grab flex items-center justify-center text-white font-bold 
                        transition-transform duration-300 ease-in-out
                        ${verified ? 'bg-primary' : 'bg-primary'}
                        ${isDragging ? 'cursor-grabbing scale-110 shadow-lg z-20' : 'shadow-md z-10'}`}
            style={{
              left: `${dragPosition.x}px`,
              top: `20px`,
              transform: isDragging ? 'rotate(5deg)' : 'none'
            }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
          >
            {verified ? '✓' : '🔸'}
          </div>
        )}

        <div 
          id="drop-zone"
          className={`absolute w-10 h-10 border-2 border-dashed rounded-lg flex items-center justify-center transition-all duration-500 ${
            verified ? 'border-primary bg-green-200 shadow-green-200' : 
            isDragging ? 'border-primary bg-blue-200 shadow-blue-200 scale-110' : 'border-gray-400 bg-gray-100'
          } ${error ? 'animate-bounce' : ''}`}
          style={{
            right: targetPosition.right,
            left: targetPosition.left,
            top: targetPosition.top,
            bottom: targetPosition.bottom,
            transform: targetPosition.transform || 'none',
          }}
        >
          <span className="text-lg">{verified ? '🎯' : '📍'}</span>
        </div>

        {verified && (
          <div className="absolute inset-0 bg-primary bg-opacity-10 rounded-xl flex items-center justify-center">
            <div className="bg-white rounded-full p-2 shadow-lg">
              <CheckCircle className="w-6 h-6 text-primary" />
            </div>
          </div>
        )}
      </div>

      <div className="text-center space-y-2">
        <p className="text-sm text-gray-600 font-medium">
          {verified ? 'Verification Complete' : 'Drag the shape to the target zone'}
        </p>

        {feedback && (
          <div className={`flex items-center justify-center space-x-2 ${
            verified ? 'text-primary' : 'text-red-600'
          }`}>
            {verified ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
            <p className="text-sm font-semibold">{feedback}</p>
          </div>
        )}

        {attempts > 0 && !verified && (
          <p className="text-xs text-gray-500">
            Attempt {attempts} - Target position changed
          </p>
        )}

        {verified && (
          <button
            type="button"
            onClick={resetCaptcha}
            className="inline-flex items-center space-x-1 text-xs text-primary hover:text-green-700 font-medium transition-colors duration-200"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reset Verification</span>
          </button>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center flex items-center justify-center">
          <Shield className="w-3 h-3 mr-1" />
          Protected by <span className="font-extrabold ml-1">{" "} Nex-Sec</span>
        </p>
      </div>
    </div>
  );
}

export default DragCaptcha;