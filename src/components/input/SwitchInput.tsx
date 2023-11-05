import { Label } from "../ui/label";
import { Switch } from "../ui/switch";

type SwitchProps = {
  id: string;
  label: string;
  defaultChecked?: boolean;
  onChange?: (value: boolean) => void;
};

export function SwitchInput({
  id,
  label,
  defaultChecked,
  onChange,
}: SwitchProps) {
  return (
    <div className="mt-2 flex items-center space-x-2">
      <Switch
        id={id}
        defaultChecked={defaultChecked}
        onCheckedChange={(value) => onChange && onChange(value)}
      />
      <Label htmlFor={id}>{label}</Label>
    </div>
  );
}
