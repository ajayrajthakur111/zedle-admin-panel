interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}
const Checkbox: React.FC<CheckboxProps> = ({ label, id, ...props }) => (
  <div className="flex items-center ">
    <input
      id={id}
      type="checkbox"
      className="h-5 w-5 accent-primary border-border rounded focus:ring-primary checked:bg-primary"
      {...props}
    />
    <label htmlFor={id} className="ml-2 block text-sm text-text-secondary">
      {label}
    </label>
  </div>
);
export default Checkbox;