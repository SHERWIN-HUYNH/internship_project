import React from 'react'

import { Input } from './ui/input'
import { Button } from './ui/button'
import { EyeIcon, EyeOffIcon } from 'lucide-react'

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  showPassword?: boolean
}
const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  // eslint-disable-next-line react/prop-types
  ({ className, value, onChange, ...field }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)

    // eslint-disable-next-line react/prop-types
    const disabled = value === '' || value === undefined || field.disabled

    return (
      <div className="relative w-full  bg-white border border-dark-500 rounded-md">
        <Input
          type={showPassword ? 'text' : 'password'}
          className={`hide-password-toggle pr-10 ${className}`}
          ref={ref}
          value={value}
          onChange={onChange}
          {...field}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
          onClick={() => setShowPassword((prev) => !prev)}
          disabled={disabled}
        >
          {showPassword && !disabled ? (
            <EyeIcon className="h-4 w-4" aria-hidden="true" />
          ) : (
            <EyeOffIcon className="h-4 w-4" aria-hidden="true" />
          )}
          <span className="sr-only">
            {showPassword ? 'Hide password' : 'Show password'}
          </span>
        </Button>

        {/* Ẩn chức năng bật tắt mật khẩu mặc định của trình duyệt */}
        <style>{`
          .hide-password-toggle::-ms-reveal,
          .hide-password-toggle::-ms-clear {
            visibility: hidden;
            pointer-events: none;
            display: none;
          }
        `}</style>
      </div>
    )
  },
)

PasswordInput.displayName = 'PasswordInput'

export { PasswordInput }
