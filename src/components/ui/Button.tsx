'use client'

import { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline'
}

export function Button({ variant = 'primary', className, ...props }: ButtonProps) {
  const base = 'px-6 py-3 rounded-full font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
  const styles: Record<string, string> = {
    primary: 'bg-burgundy text-white hover:bg-burgundy-dark',
    secondary: 'bg-mustard text-white hover:bg-mustard-dark',
    outline: 'border border-burgundy text-burgundy hover:bg-burgundy hover:text-white',
  }
  return <button className={cn(base, styles[variant], className)} {...props} />
}
