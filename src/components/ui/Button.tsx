import * as React from 'react'
import { cn } from '../../lib/utils'

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link'
    size?: 'sm' | 'md' | 'lg' | 'icon'
    isLoading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {
        const styles = {
            primary: 'bg-primary text-white hover:bg-primary-hover shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300',
            secondary: 'bg-secondary text-text-primary hover:bg-secondary-dark/20 shadow-sm hover:shadow-md transition-all',
            outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white transition-colors duration-300',
            ghost: 'hover:bg-primary/10 text-primary hover:text-primary-hover transition-colors',
            link: 'text-primary underline-offset-4 hover:underline p-0 h-auto',
        }

        const sizes = {
            sm: 'h-9 px-4 text-sm',
            md: 'h-11 px-6 py-2 text-base',
            lg: 'h-14 px-8 text-lg',
            icon: 'h-10 w-10 p-2 flex items-center justify-center',
        }

        return (
            <button
                className={cn(
                    'inline-flex items-center justify-center rounded-full font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50 cursor-pointer active:scale-95',
                    styles[variant],
                    sizes[size],
                    className
                )}
                ref={ref}
                {...props}
            >
                {isLoading ? (
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : null}
                {children}
            </button>
        )
    }
)
Button.displayName = 'Button'

export { Button }
