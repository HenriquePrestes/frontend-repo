export default function EmailInput({
  label,
  name,
  placeholder,
  register,
  disabled,
  errors,
  containerClassName,
  labelClassName,
  inputClassName,
  errorClassName,
}) {
  const hasError = !!errors[name];

  const errorClasses = "border-2 border-red-400";

  return (
    <div className={containerClassName}>
      <label className={labelClassName} htmlFor={name}>
        {label}
      </label>

      <input
        className={`${inputClassName} ${hasError ? errorClasses : ""}`}
        type="email"
        id={name}
        name={name}
        placeholder={placeholder}
        disabled={disabled}
        {...register(name)}
      />

      {hasError && <p className={errorClassName}>{errors[name]?.message}</p>}
    </div>
  );
}
