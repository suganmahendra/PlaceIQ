import * as React from 'react'
import { cn } from '../../lib/utils'
import { Eye, EyeOff } from 'lucide-react'

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
    icon?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, label, error, ...props }, ref) => {
        const generatedId = React.useId()
        const id = props.id || generatedId
        const [showPassword, setShowPassword] = React.useState(false)
        const isPassword = type === 'password'

        const togglePasswordVisibility = () => {
            setShowPassword(!showPassword)
        }

        const inputType = isPassword ? (showPassword ? 'text' : 'password') : type

        return (
            <div className="space-y-2 w-full">
                {label && (
                    <label htmlFor={id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700">
                        {label}
                    </label>
                )}
                <div className="relative">
                    {props.icon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                            {props.icon}
                        </div>
                    )}
                    <input
                        type={inputType}
                        className={cn(
                            "flex h-12 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 transition-all shadow-sm hover:border-gray-300",
                            props.icon && "pl-10",
                            isPassword && "pr-10",
                            error && "border-red-500 focus-visible:ring-red-500",
                            className
                        )}
                        ref={ref}
                        id={id}
                        {...props}
                    />
                    {isPassword && (
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? (
                                <EyeOff className="h-5 w-5" />
                            ) : (
                                <Eye className="h-5 w-5" />
                            )}
                        </button>
                    )}
                </div>
                {error && <p className="text-sm text-red-500 animate-in slide-in-from-top-1">{error}</p>}
            </div>
        )
    }
)
Input.displayName = "Input"

export { Input }
