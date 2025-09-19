import { ParamProps } from "@/lib/types";
import { Textarea } from "@/components/ui/textarea";

export default function TextareaParam({
  param,
  value,
  updateNodeParamValue,
  disabled,
}: ParamProps) {
  return (
    <Textarea
      value={value || ""}
      placeholder={param.helperText || "Enter code..."}
      onChange={(e) => updateNodeParamValue(e.target.value)}
      disabled={disabled}
      className="min-h-[120px] font-mono text-sm"
      rows={6}
    />
  );
}