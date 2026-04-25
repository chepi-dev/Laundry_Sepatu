type FormFieldProps = {
  id: string
  label: string
  type?: 'text' | 'email' | 'password' | 'tel'
  placeholder: string
  autoComplete?: string
  as?: 'input' | 'textarea'
  readOnly?: boolean
  value?: string
  onChange?: (value: string) => void
}

export function FormField({
  id,
  label,
  type = 'text',
  placeholder,
  autoComplete,
  as = 'input',
  readOnly = false,
  value,
  onChange,
}: FormFieldProps) {
  return (
    <label className="form-field" htmlFor={id}>
      <span>{label}</span>
      {as === 'textarea' ? (
        <textarea
          id={id}
          name={id}
          placeholder={placeholder}
          rows={4}
          readOnly={readOnly}
          value={value}
          onChange={(event) => onChange?.(event.target.value)}
        />
      ) : (
        <input
          id={id}
          name={id}
          type={type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          readOnly={readOnly}
          value={value}
          onChange={(event) => onChange?.(event.target.value)}
        />
      )}
    </label>
  )
}
