import { Input as Inputtt } from "../ui/input";
import { Label } from "../ui/label";

type InputProps = {
  label: string;
  id: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
};

export function Input({ label, id, defaultValue, onChange }: InputProps) {
  return (
    <>
      <Label htmlFor={id}>{label}</Label>
      <Inputtt
        id={id}
        defaultValue={defaultValue}
        onChange={(e) => {
          onChange && onChange(e.target.value);
        }}
      />
    </>
  );
}
