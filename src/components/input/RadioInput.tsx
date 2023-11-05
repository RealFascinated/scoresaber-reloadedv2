import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

type RadioProps = {
  id: string;
  defaultValue: string;
  label?: string;
  items: {
    id: string;
    value: string;
    label?: string;
  }[];
  onChange?: (value: string) => void;
};

export function RadioInput({
  id,
  defaultValue,
  label,
  items,
  onChange,
}: RadioProps) {
  return (
    <div className="mt-2">
      {id && label && <Label htmlFor={id}>{label}</Label>}
      <RadioGroup
        id={id}
        defaultValue={defaultValue}
        className="mt-2"
        onValueChange={(value) => onChange && onChange(value)}
      >
        {items.map((item, index) => {
          return (
            <div key={index} className="flex items-center space-x-2">
              <RadioGroupItem value={item.id} id={item.id}>
                {item.value}
              </RadioGroupItem>
              <Label htmlFor={item.id}>{item.value}</Label>
            </div>
          );
        })}
      </RadioGroup>
    </div>
  );
}
