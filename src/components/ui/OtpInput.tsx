import React, { useRef, useState, useEffect } from 'react';

interface OtpInputProps {
    length?: number;
    value: string;
    onChange: (value: string) => void;
    error?: boolean;
}

export function OtpInput({ length = 6, value, onChange, error }: OtpInputProps) {
    const [otp, setOtp] = useState<string[]>(new Array(length).fill(''));
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        // Sync external value with internal array if it changes externally
        if (value.length <= length) {
            const newOtp = value.split('').concat(Array(length - value.length).fill(''));
            // only update if different to avoid cursor jumps
            if (newOtp.join('') !== otp.join('')) {
                setOtp(newOtp);
            }
        }
    }, [value, length]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const val = e.target.value;
        if (isNaN(Number(val))) return;

        const newOtp = [...otp];
        // Allow only the last char typed to replace the current char
        newOtp[index] = val.substring(val.length - 1);
        setOtp(newOtp);

        const joinedVal = newOtp.join('');
        onChange(joinedVal);

        // Move to next input if current field is filled
        if (val && index < length - 1 && inputRefs.current[index + 1]) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
            // Move to previous input on backspace if current is empty
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').slice(0, length).replace(/\D/g, '');
        if (pastedData) {
            const newOtp = [...otp];
            for (let i = 0; i < pastedData.length; i++) {
                newOtp[i] = pastedData[i];
            }
            setOtp(newOtp);
            onChange(newOtp.join(''));

            // Focus on the next empty input or the last one
            const nextIndex = Math.min(pastedData.length, length - 1);
            inputRefs.current[nextIndex]?.focus();
        }
    };

    return (
        <div className="flex justify-center gap-2 sm:gap-3 my-6">
            {otp.map((data, index) => (
                <input
                    key={index}
                    ref={(el) => { inputRefs.current[index] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={data}
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onPaste={handlePaste}
                    className={`
                        w-10 h-14 sm:w-12 sm:h-16 text-center text-xl sm:text-2xl font-bold rounded-2xl
                        bg-white border-2 transition-all duration-200 outline-none
                        ${error ? 'border-red-400 focus:border-red-500 bg-red-50 text-red-600 shadow-[0_0_15px_rgba(248,113,113,0.3)]' : 'border-gray-300 focus:border-blue-500 focus:bg-white'}
                        ${data && !error ? 'border-blue-500 text-blue-600 shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'text-text-primary'}
                    `}
                />
            ))}
        </div>
    );
}
