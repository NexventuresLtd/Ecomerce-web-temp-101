export interface CaptchaProps {
    onVerify: (success: boolean) => void;
    theme?: 'light' | 'dark';
    className?: string;
}