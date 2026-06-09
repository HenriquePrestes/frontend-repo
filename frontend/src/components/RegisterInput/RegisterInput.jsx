import { useState } from "react";

const OpenEye = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="#8B8B8B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="#8B8B8B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ClosedEye = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9.9 4.24002C10.5883 4.0789 11.2931 3.99836 12 4.00003C19 4.00003 23 12 23 12C22.393 13.1356 21.6691 14.2048 20.84 15.19M14.12 14.12C13.8454 14.4148 13.5141 14.6512 13.1462 14.8151C12.7782 14.9791 12.3809 15.0673 11.9781 15.0744C11.5753 15.0815 11.1752 15.0074 10.8016 14.8565C10.4281 14.7056 10.0887 14.4811 9.80385 14.1962C9.51897 13.9113 9.29439 13.572 9.14351 13.1984C8.99262 12.8249 8.91853 12.4247 8.92563 12.0219C8.93274 11.6191 9.02091 11.2219 9.18488 10.8539C9.34884 10.4859 9.58525 10.1547 9.88 9.88003M17.94 17.94C16.2306 19.243 14.1491 19.9649 12 20C5 20 1 12 1 12C2.24389 9.68192 3.96914 7.65663 6.06 6.06003L17.94 17.94Z" stroke="#8B8B8B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M1 1L23 23" stroke="#8B8B8B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function RegisterInput({
  label,
  type,
  name,
  placeholder,
  register,
  errors,
  mask, // 'cpf', 'phone', 'zipcode' ou undefined
  setValue,
  isPassword = false,
  disabled,
  containerClassName = "mb-3",
  labelClassName = "block mb-1 text-gray-700 font-semibold",
  inputClassName = "w-full h-12 border border-primary rounded-lg px-4 text-lg outline-none",
  errorClassName = "text-red-500 text-sm mt-1",
}) {
  const [showPassword, setShowPassword] = useState(false);
  const hasError = !!errors[name];
  const errorClasses = "border-2 border-red-400";

  const togglePassword = () => setShowPassword(prev => !prev);

  const handleChange = (e) => {
    if (!mask || !setValue) return;
    let val = e.target.value.replace(/\D/g, "");

    if (mask === "cpf") {
      val = val.substring(0, 11);
      if (val.length > 9) val = val.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, "$1.$2.$3-$4");
      else if (val.length > 6) val = val.replace(/(\d{3})(\d{3})(\d{1,3})/, "$1.$2.$3");
      else if (val.length > 3) val = val.replace(/(\d{3})(\d{1,3})/, "$1.$2");
    }

//  if (mask === "phone") {
//    val = val.substring(0, 11);
//    if (val.length > 6) val = val.replace(/(\d{2})(\d{5})(\d{1,4})/, "($1) $2-$3");
//    else if (val.length > 2) val = val.replace(/(\d{2})(\d{1,5})/, "($1) $2");
//  }

//  if (mask === "zipcode") {
//    val = val.substring(0, 8);
//    if (val.length > 5) val = val.replace(/(\d{5})(\d{1,3})/, "$1-$2");
//  }

    setValue(name, val);
  };

  return (
    <div className={containerClassName}>
      <label className={labelClassName} htmlFor={name}>
        {label}
      </label>

      <div className="relative w-full">
        <input
          {...register(name)}
          type={isPassword ? (showPassword ? "text" : "password") : type}
          id={name}
          name={name}
          placeholder={placeholder}
          disabled={disabled}
          onChange={mask ? handleChange : undefined}
          className={`${inputClassName} ${hasError ? errorClasses : ""}`}
          autoComplete={isPassword ? "new-password" : undefined}
        />

        {isPassword && (
          <button
            type="button"
            onClick={togglePassword}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
            aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
          >
            {showPassword ? <OpenEye /> : <ClosedEye />}
          </button>
        )}
      </div>

      {hasError && <p className={errorClassName}>{errors[name]?.message}</p>}
    </div>
  );
}
