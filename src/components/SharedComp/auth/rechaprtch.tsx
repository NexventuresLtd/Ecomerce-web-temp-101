import React, { useState, useEffect, useCallback } from 'react';
import {
    ShieldCheck,
    RefreshCw,
    X,
    Check,
    RotateCw,
    Brain,
    Grid3x3,
    MousePointer,
    Sparkles,
    Zap,
    Target,
} from 'lucide-react';
import { challenges } from '../../../constants/auth/Capatch';
import type { CaptchaProps } from '../../../types/auth/capthc';

// Types


type CaptchaStatus = 'idle' | 'verifying' | 'success' | 'error';

// CAPTCHA 1: Interactive Pattern CAPTCHA
export const InteractivePatternCaptcha: React.FC<CaptchaProps> = ({
    onVerify,
    theme = 'light',
    className = ''
}) => {
    const [status, setStatus] = useState<CaptchaStatus>('idle');
    const [targetPattern, setTargetPattern] = useState<number[]>([]);
    const [userPattern, setUserPattern] = useState<number[]>([]);
    const [showPattern, setShowPattern] = useState(true);
    const [currentStep, setCurrentStep] = useState(0);

    const isDark = theme === 'dark';
    const bgColor = isDark ? 'bg-gray-900' : 'bg-white';
    const cardBg = isDark ? 'bg-gray-800' : 'bg-gray-50';
    const textColor = isDark ? 'text-white' : 'text-gray-900';
    // const borderColor = isDark ? 'border-gray-700' : 'border-gray-200';
    const buttonBg = isDark ? 'bg-blue-600' : 'bg-blue-500';
    const buttonHover = isDark ? 'hover:bg-blue-700' : 'hover:bg-blue-600';
    const successColor = isDark ? 'bg-emerald-900/20 text-emerald-400' : 'bg-emerald-100 text-emerald-800';
    const errorColor = isDark ? 'bg-red-900/20 text-red-400' : 'bg-red-100 text-red-800';

    // Generate new pattern
    const generatePattern = useCallback(() => {
        const pattern: number[] = [];
        const length = 4 + Math.floor(Math.random() * 2); // 4-5 steps
        const usedNumbers = new Set<number>();

        while (pattern.length < length) {
            const num = Math.floor(Math.random() * 9);
            if (!usedNumbers.has(num)) {
                pattern.push(num);
                usedNumbers.add(num);
            }
        }

        setTargetPattern(pattern);
        setUserPattern([]);
        setShowPattern(true);
        setCurrentStep(0);
        setStatus('idle');
    }, []);

    // Initialize pattern on mount
    useEffect(() => {
        generatePattern();
    }, [generatePattern]);

    // Show pattern sequence
    useEffect(() => {
        if (showPattern && targetPattern.length > 0) {
            const timer = setTimeout(() => {
                if (currentStep < targetPattern.length) {
                    setCurrentStep(currentStep + 1);
                } else {
                    setShowPattern(false);
                    setCurrentStep(0);
                }
            }, 800);

            return () => clearTimeout(timer);
        }
    }, [showPattern, currentStep, targetPattern.length]);

    const handleCellClick = (index: number) => {
        if (showPattern || status !== 'idle') return;

        if (!userPattern.includes(index)) {
            const newPattern = [...userPattern, index];
            setUserPattern(newPattern);
        }
    };

    const handleVerify = async () => {
        if (userPattern.length !== targetPattern.length) return;

        setStatus('verifying');

        // Simulate verification delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        const isCorrect = JSON.stringify(userPattern) === JSON.stringify(targetPattern);
        setStatus(isCorrect ? 'success' : 'error');
        onVerify(isCorrect);

        if (!isCorrect) {
            setTimeout(() => {
                generatePattern();
            }, 2000);
        }
    };

    const resetCaptcha = () => {
        generatePattern();
    };

    const clearPattern = () => {
        if (!showPattern && status === 'idle') {
            setUserPattern([]);
        }
    };

    return (
        <div className={`${className} ${bgColor} ${textColor} rounded-xl w-full max-w-md mx-auto overflow-hidden`}>
            <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${isDark ? 'bg-blue-900/30' : 'bg-blue-100'}`}>
                            <Grid3x3 className="w-5 h-5 text-blue-500" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg">Pattern Memory</h3>
                            <p className="text-sm opacity-70">Remember and repeat the pattern</p>
                        </div>
                    </div>
                    <button
                        onClick={resetCaptcha}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        title="Generate new pattern"
                    >
                        <RefreshCw className="w-5 h-5 opacity-70" />
                    </button>
                </div>

                {/* Status Message */}
                <div className="mb-4 h-8 flex items-center justify-center">
                    {showPattern && (
                        <div className="flex items-center gap-2 text-blue-500">
                            <Sparkles className="w-4 h-4" />
                            <span className="text-sm font-medium">Watch the pattern...</span>
                        </div>
                    )}
                    {!showPattern && status === 'idle' && (
                        <div className="flex items-center gap-2 opacity-70">
                            <MousePointer className="w-4 h-4" />
                            <span className="text-sm">Click cells in the same order</span>
                        </div>
                    )}
                    {status === 'success' && (
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${successColor} flex items-center gap-2`}>
                            <Check className="w-4 h-4" />
                            Pattern verified successfully!
                        </div>
                    )}
                    {status === 'error' && (
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${errorColor} flex items-center gap-2`}>
                            <X className="w-4 h-4" />
                            Incorrect pattern. Try again.
                        </div>
                    )}
                </div>

                {/* Pattern Grid */}
                <div className={`${cardBg} rounded-xl p-4 mb-6`}>
                    <div className="grid grid-cols-3 gap-3">
                        {Array.from({ length: 9 }).map((_, index) => {
                            const isHighlighted = showPattern && targetPattern[currentStep - 1] === index;
                            const isUserSelected = userPattern.includes(index);
                            const userOrder = userPattern.indexOf(index) + 1;

                            return (
                                <button
                                    key={index}
                                    onClick={() => handleCellClick(index)}
                                    disabled={showPattern || status !== 'idle'}
                                    className={`
                    aspect-square rounded-xl transition-all duration-300 relative overflow-hidden
                    ${isHighlighted ?
                                            ' bg-primary text-white' :
                                            isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-slate-200'
                                        }
                    ${isUserSelected ?
                                            'bg-primary text-white' : ''
                                        }
                    ${!showPattern && status === 'idle' ? 'hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20' : ''}
                    disabled:cursor-not-allowed
                  `}
                                >
                                    {/* Ripple effect */}
                                    {isHighlighted && (
                                        <div className="absolute inset-0 bg-blue-400 opacity-60 animate-ping rounded-xl" />
                                    )}

                                    {/* User selection order */}
                                    {isUserSelected && (
                                        <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg">
                                            {userOrder}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between">
                    <button
                        onClick={clearPattern}
                        disabled={showPattern || status !== 'idle' || userPattern.length === 0}
                        className="px-4 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Clear
                    </button>

                    <div className="flex items-center gap-2 text-sm opacity-70">
                        <span>{userPattern.length}</span>
                        <span>/</span>
                        <span>{targetPattern.length}</span>
                    </div>

                    <button
                        onClick={handleVerify}
                        disabled={userPattern.length !== targetPattern.length || status !== 'idle'}
                        className={`
              ${buttonBg} ${buttonHover} text-white px-6 py-2 rounded-lg font-medium
              disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200
              flex items-center gap-2
            `}
                    >
                        {status === 'verifying' ? (
                            <>
                                <RotateCw className="w-4 h-4 animate-spin" />
                                Verifying...
                            </>
                        ) : (
                            <>
                                <ShieldCheck className="w-4 h-4" />
                                Verify
                            </>
                        )}
                    </button>
                </div>
            </div>
            <center className='text-xs'>Powered By <a className='text-red-500 cursor-pointer' target='__blank' href='https://www.nexventures.net'>Nex Sec</a></center>
        </div>
    );
};

// CAPTCHA 2: Smart Logic CAPTCHA
export const SmartLogicCaptcha: React.FC<CaptchaProps> = ({
    onVerify,
    theme = 'light',
    className = ''
}) => {
    const [status, setStatus] = useState<CaptchaStatus>('idle');
    const [currentChallenge, setCurrentChallenge] = useState<any>(null);
    const [userAnswer, setUserAnswer] = useState<number | null>(null);
    const [timeLeft, setTimeLeft] = useState(30);

    const isDark = theme === 'dark';
    const bgColor = isDark ? 'bg-gray-900' : 'bg-white';
    const cardBg = isDark ? 'bg-gray-800' : 'bg-gray-50';
    const textColor = isDark ? 'text-white' : 'text-gray-900';
    const buttonBg = isDark ? 'bg-blue-600' : 'bg-primary text-white';
    const buttonHover = isDark ? 'hover:bg-blue-700' : 'hover:bg-blue-600';
    const successColor = isDark ? 'bg-emerald-900/20 text-emerald-400' : 'bg-emerald-100 text-emerald-800';
    const errorColor = isDark ? 'bg-red-900/20 text-red-400' : 'bg-red-100 text-red-800';


    // Generate new challenge
    const generateChallenge = useCallback(() => {
        const challenge = challenges[Math.floor(Math.random() * challenges.length)];
        setCurrentChallenge(challenge);
        setUserAnswer(null);
        setStatus('idle');
        setTimeLeft(30);
    }, []);

    // Initialize challenge
    useEffect(() => {
        generateChallenge();
    }, [generateChallenge]);

    // Timer countdown
    useEffect(() => {
        if (status === 'idle' && timeLeft > 0) {
            const timer = setTimeout(() => {
                setTimeLeft(timeLeft - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0 && status === 'idle') {
            setStatus('error');
            onVerify(false);
            setTimeout(generateChallenge, 2000);
        }
    }, [timeLeft, status, generateChallenge, onVerify]);

    const handleAnswerSelect = (answerIndex: number) => {
        if (status !== 'idle') return;
        setUserAnswer(answerIndex);
    };

    const handleVerify = async () => {
        if (userAnswer === null || !currentChallenge) return;

        setStatus('verifying');

        await new Promise(resolve => setTimeout(resolve, 1200));

        const isCorrect = userAnswer === currentChallenge.correct;
        setStatus(isCorrect ? 'success' : 'error');
        onVerify(isCorrect);

        if (!isCorrect) {
            setTimeout(generateChallenge, 3000);
        }
    };

    const resetCaptcha = () => {
        generateChallenge();
    };

    if (!currentChallenge) return null;

    return (
        <div className={`${className} ${bgColor} ${textColor} rounded-xl w-full max-w-md mx-auto overflow-hidden`}>
            <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${isDark ? 'bg-purple-900/30' : 'bg-purple-100'}`}>
                            <Brain className="w-5 h-5 text-purple-500" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg">Smart Verification</h3>
                            <p className="text-sm opacity-70">Solve the logic challenge</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className={`px-3 py-1 rounded-full text-sm font-mono ${timeLeft <= 10 ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                            'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                            }`}>
                            {timeLeft}s
                        </div>
                        <button
                            onClick={resetCaptcha}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            title="New challenge"
                        >
                            <RefreshCw className="w-4 h-4 opacity-70" />
                        </button>
                    </div>
                </div>

                {/* Status Message */}
                <div className="mb-4 h-8 flex items-center justify-center">
                    {status === 'idle' && (
                        <div className="flex items-center gap-2 opacity-70">
                            <Target className="w-4 h-4" />
                            <span className="text-sm">Choose the correct answer</span>
                        </div>
                    )}
                    {status === 'success' && (
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${successColor} flex items-center gap-2`}>
                            <Check className="w-4 h-4" />
                            Correct! Challenge solved.
                        </div>
                    )}
                    {status === 'error' && (
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${errorColor} flex items-center gap-2`}>
                            <X className="w-4 h-4" />
                            {timeLeft === 0 ? 'Time expired!' : 'Incorrect answer.'}
                        </div>
                    )}
                </div>

                {/* Challenge Content */}
                <div className={`${cardBg} rounded-xl p-6 mb-6`}>
                    <div className="text-center mb-4">
                        <h4 className="font-medium text-lg mb-2">{currentChallenge.question}</h4>

                        {/* Challenge-specific display */}
                        {currentChallenge.type === 'sequence' && (
                            <div className="flex items-center justify-center gap-2 mb-4 text-xl font-mono">
                                {currentChallenge.sequence.map((item: any, index: number) => (
                                    <span key={index} className={item === '?' ? 'text-blue-500 font-bold' : ''}>
                                        {item}
                                        {index < currentChallenge.sequence.length - 1 &&
                                            <span className="mx-2 opacity-50">,</span>
                                        }
                                    </span>
                                ))}
                            </div>
                        )}

                        {currentChallenge.type === 'pattern' && (
                            <div className="flex items-center justify-center gap-2 mb-4 text-2xl">
                                {currentChallenge.pattern.map((item: any, index: number) => (
                                    <span key={index}>
                                        {item === '?' ?
                                            <span className="text-blue-500 font-bold">?</span> :
                                            item
                                        }
                                    </span>
                                ))}
                            </div>
                        )}

                        {currentChallenge.type === 'math' && (
                            <div className="text-xl font-mono mb-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                                {currentChallenge.equation}
                            </div>
                        )}

                        {currentChallenge.type === 'logic' && (
                            <div className="text-base mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                                "{currentChallenge.statement}"
                            </div>
                        )}

                        {currentChallenge.type === 'spatial' && (
                            <div className="text-2xl mb-4 font-mono whitespace-pre-line bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                                {currentChallenge.visual}
                            </div>
                        )}
                    </div>

                    {/* Answer Options */}
                    <div className="grid grid-cols-2 gap-3">
                        {currentChallenge.options.map((option: any, index: number) => (
                            <button
                                key={index}
                                onClick={() => handleAnswerSelect(index)}
                                disabled={status !== 'idle'}
                                className={`
                  p-4 rounded-lg  transition-all duration-200 text-center font-medium 
                  ${userAnswer === index ?
                                        '  bg-primary text-white' :
                                        `  ${isDark ? 'bg-gray-700' : 'bg-white'} hover:border-blue-300`
                                    }
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Verify Button */}
                <div className="flex justify-center">
                    <button
                        onClick={handleVerify}
                        disabled={userAnswer === null || status !== 'idle'}
                        className={`
              ${buttonBg} ${buttonHover} text-white px-8 py-3 rounded-lg font-medium
              disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200
              flex items-center gap-2 text-lg
            `}
                    >
                        {status === 'verifying' ? (
                            <>
                                <RotateCw className="w-5 h-5 animate-spin" />
                                Analyzing...
                            </>
                        ) : (
                            <>
                                <Zap className="w-5 h-5" />
                                Submit Answer
                            </>
                        )}
                    </button>
                </div>
            </div>
            <center className='text-xs'>Powered By <a className='text-red-500 cursor-pointer' target='__blank' href='https://www.nexventures.net'>Nex Sec</a></center>
        </div>
    );
};

// Demo Component (optional - for demonstration purposes only)
export const CaptchaDemo = () => {
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [results, setResults] = useState<{ pattern: string, logic: string }>({
        pattern: '',
        logic: ''
    });

    const handlePatternVerify = (success: boolean) => {
        setResults(prev => ({
            ...prev,
            pattern: success ? '✅ Pattern CAPTCHA: Verified Successfully!' : '❌ Pattern CAPTCHA: Verification Failed'
        }));
    };

    const handleLogicVerify = (success: boolean) => {
        setResults(prev => ({
            ...prev,
            logic: success ? '✅ Logic CAPTCHA: Verified Successfully!' : '❌ Logic CAPTCHA: Verification Failed'
        }));
    };

    return (
        <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100'
            }`}>
            <div className="container mx-auto px-4 py-8">
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <ShieldCheck className="w-8 h-8 text-blue-500" />
                        <h1 className={`text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            Modern CAPTCHA System
                        </h1>
                    </div>
                    <p className={`text-lg mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        Experience next-generation human verification with interactive challenges
                    </p>

                    {/* Theme Toggle */}
                    <button
                        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                        className={`px-4 py-2 rounded-lg border transition-colors ${theme === 'dark'
                            ? 'border-gray-600 bg-gray-800 text-white hover:bg-gray-700'
                            : 'border-gray-300 bg-white text-gray-900 hover:bg-gray-50'
                            }`}
                    >
                        Switch to {theme === 'light' ? 'Dark' : 'Light'} Theme
                    </button>
                </div>

                {/* Results Display */}
                {(results.pattern || results.logic) && (
                    <div className={`mb-8 p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                        <h3 className={`font-semibold mb-2 ${theme === 'dark' || 'text-gray-900'}`}>
                            Verification Results:
                        </h3>
                        {results.pattern && (
                            <p className={`mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                {results.pattern}
                            </p>
                        )}
                        {results.logic && (
                            <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                {results.logic}
                            </p>
                        )}
                    </div>
                )}

                {/* CAPTCHA Components */}
                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    <div>
                        <h2 className={`text-2xl font-bold mb-4 text-center ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            Interactive Pattern CAPTCHA
                        </h2>
                        <InteractivePatternCaptcha
                            onVerify={handlePatternVerify}
                            theme={theme}
                        />
                    </div>

                    <div>
                        <h2 className={`text-2xl font-bold mb-4 text-center ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            Smart Logic CAPTCHA
                        </h2>
                        <SmartLogicCaptcha
                            onVerify={handleLogicVerify}
                            theme={theme}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};


export default CaptchaDemo;