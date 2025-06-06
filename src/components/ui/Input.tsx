interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  wrapperClassName?: string; // For additional styling on the label-input group
}
const Input: React.FC<InputProps> = ({
  label,
  id,
  wrapperClassName = "",
  ...props
}) => (
  <div className={` ${wrapperClassName}`}>
    <label
      htmlFor={id}
      className="block text-primary font-bold mb-1"
    >
      {label}
    </label>
    <input
      id={id}
      className="w-full px-4 py-3 border rounded-md focus:ring-2 text-white  focus:border-transparent outline-none transition-colors"
      {...props}
    />
  </div>
);
export default Input;
