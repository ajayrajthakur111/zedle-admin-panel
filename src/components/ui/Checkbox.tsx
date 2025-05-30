interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}
const Checkbox: React.FC<CheckboxProps> = ({ label, id, ...props }) => (
  <div className="flex items-center mb-4">
    <input
      id={id}
      type="checkbox"
      className="h-4 w-4 accent-primary border-border rounded focus:ring-primary"
      {...props}
    />
    <label htmlFor={id} className="ml-2 block text-sm text-text-secondary">
      {label}
    </label>
  </div>
);
export default Checkbox;