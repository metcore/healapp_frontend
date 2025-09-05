'use client'

import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import Button from '../button/Button'
import InputNumber from '../input-number/InputNumber'
import LabelInput from '../label-input/LabelInput'
import { RuleConfigMap } from '@/helper/Validation/Validate'
import { validate } from '@/helper/Validation/Validate'

export type CounterButtonProps = {
  name: string
  hint?: string
  label?: string
  value?: number
  step?: number
  min?: number
  max?: number
  onChange?: (v: number) => void
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  variant?: 'solid' | 'outline'
  ariaLabel?: string
  rules?: RuleConfigMap
}

export type CounterButtonRef = {
  validate: () => boolean
  getValue: () => number
  focus: () => void
}

const sizeMap = {
  sm: {
    btn: 'px-2 py-1 text-sm',
    value: 'text-sm px-2',
  },
  md: {
    btn: 'px-3 py-1.5 text-base',
    value: 'text-base px-3',
  },
  lg: {
    btn: 'px-4 py-2 text-lg',
    value: 'text-lg px-4',
  },
}

const CounterButton = forwardRef<CounterButtonRef, CounterButtonProps>(
  (
    {
      label,
      name,
      hint,
      value = 0,
      step = 1,
      min = Number.NEGATIVE_INFINITY,
      max = Number.POSITIVE_INFINITY,
      onChange,
      disabled = false,
      size = 'md',
      variant = 'solid',
      ariaLabel = 'counter',
      rules = {},
    },
    ref
  ) => {
    const [inputValue, setInputValue] = useState<number>(value)
    const inputRef = useRef<HTMLInputElement>(null)
    const [error, setError] = useState<string[]>([])

    useEffect(() => {
      setInputValue(value)
    }, [value])

    useEffect(() => {
      onChange?.(inputValue)
    }, [inputValue])

    function clamp(v: number) {
      return Math.min(max, Math.max(min, v))
    }

    function handleInc() {
      if (disabled) return
      setInputValue((prev) => clamp(prev + step))
    }

    function handleDec() {
      if (disabled) return
      setInputValue((prev) => clamp(prev - step))
    }

    function handleKeyDown(e: React.KeyboardEvent) {

 
      if (disabled) return
      if (e.key === 'ArrowUp' || e.key === 'ArrowRight') {
        e.preventDefault()
        handleInc()
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') {
        e.preventDefault()
        handleDec()
      }
    }

    useImperativeHandle(
      ref,
      () => ({
        validate: () => {
          console.log(inputValue)
          const result = validate(inputValue, rules)
          setError(result)
          // if (result.length > 0) {
          //   inputRef.current?.scrollIntoView({
          //     behavior: 'smooth',
          //     block: 'center',
          //   })
          //   inputRef.current?.focus()
          // }
          return result.length === 0
        },
        getValue: () => inputValue,
        focus: () => inputRef.current?.focus(),
      }),
      [inputValue, rules]
    )

    const handleChangeInput = (e) => {
        const newValue = e.target.value;
        setInputValue(newValue);
        if (rules) {
          const result = validate(newValue, rules);
          setError(result);
        }
      
      setInputValue(clamp(Number(e)))
    }

    const btnBase =
      'inline-flex items-center justify-center rounded-2xl font-semibold transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed'
    const solid = 'bg-primary-600 text-white hover:bg-primary-700'
    const outline =
      'border border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
    const shapeClass = variant === 'solid' ? solid : outline

    return (
      <div className="d-flex flex-column">
        {label && <LabelInput label={label} hint={hint} />}
        {hint && <p className="text-sm mb-0 text-secondary-light">{hint}</p>}

        <div
          className="d-flex flex-wraper items-center gap-2"
          role="group"
          aria-label={ariaLabel}
        >
          <Button
            onClick={handleDec}
            onKeyDown={handleKeyDown}
            aria-label="decrement"
            size="sm"
            disabled={disabled || inputValue <= min}
          >
            -
          </Button>

          <InputNumber
            ref={inputRef}
            format="number"
            size="sm"
            name={name}
            value={inputValue}
            onChange={handleChangeInput }
          />

          <Button
            onClick={handleInc}
            onKeyDown={handleKeyDown}
            aria-label="increment"
            size="sm"
            disabled={disabled || inputValue >= max}
          >
            +
          </Button>
        </div>
        {error && error.length > 0 && (
          <div className="invalid-feedback d-block">
            {error.map((err, idx) => (
              <div key={idx}>{err.error}</div>
            ))}
          </div>
        )}
      </div>
    )
  }
)

CounterButton.displayName = 'CounterButton'

export default CounterButton
