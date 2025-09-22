"use client";

import { createCredential } from "@/actions/credentials";
import CustomDialogHeader from "@/components/CustomDialogHeader";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  createCredentialSchema,
  createCredentialSchemaType,
} from "@/schema/credential";
import { credentialTemplates, CredentialType } from "@/lib/credential-templates";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Layers2Icon, Loader2 } from "lucide-react";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

function CreateCredentialDialog({ triggeredText }: { triggeredText?: string }) {
  const [open, setOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<CredentialType>("CUSTOM");

  const form = useForm<createCredentialSchemaType>({
    resolver: zodResolver(createCredentialSchema),
    defaultValues: {
      type: "CUSTOM",
      credentials: {},
    },
  });
  const { mutate, isPending } = useMutation({
    mutationFn: createCredential,
    onSuccess: () => {
      toast.success("Credential created", { id: "create-credential" });
      setOpen(false);
    },
    onError: (error: any) => {
      toast.error("Failed to create credential", { id: "create-credential" });
    },
  });

  const onSubmit = useCallback(
    (values: createCredentialSchemaType) => {
      toast.loading("Creating credential...", { id: "create-credential" });
      mutate(values);
    },
    [mutate]
  );

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        form.reset();
        setOpen(open);
      }}
    >
      <DialogTrigger asChild>
        <Button>{triggeredText ?? "Create credential"}</Button>
      </DialogTrigger>
      <DialogContent className="px-0 max-h-[90vh] overflow-y-auto">
        <CustomDialogHeader icon={Layers2Icon} title="Create Credential" />
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          <Form {...form}>
            <form
              className="space-y-8 w-full"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex gap-1 items-center">
                      Name <p className="text-xs text-primary">(required)</p>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="My Gmail Account" />
                    </FormControl>
                    <FormDescription>
                      Enter a unique and descriptive name for this credential
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Type</FormLabel>
                    <Select onValueChange={(value: CredentialType) => {
                      field.onChange(value);
                      setSelectedType(value);
                      form.setValue("credentials", {});
                    }} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select service type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(credentialTemplates).map(([key, template]) => (
                          <SelectItem key={key} value={key}>
                            {template.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Choose the service this credential is for
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {credentialTemplates[selectedType]?.instructions && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">Setup Instructions:</h4>
                  <ol className="text-sm text-blue-800 space-y-1">
                    {credentialTemplates[selectedType].instructions.map((instruction, index) => (
                      <li key={index} className="flex gap-2">
                        <span className="font-semibold">{index + 1}.</span>
                        <span>{instruction}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
              
              {credentialTemplates[selectedType]?.fields.map((fieldTemplate) => (
                <FormField
                  key={fieldTemplate.key}
                  control={form.control}
                  name={`credentials.${fieldTemplate.key}` as any}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {fieldTemplate.label}
                        {fieldTemplate.required !== false && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                      </FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type={fieldTemplate.type}
                          placeholder={fieldTemplate.placeholder}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}

              <Button type="submit" className="w-full" disabled={isPending}>
                {!isPending ? "Proceed" : <Loader2 className="animate-spin" />}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CreateCredentialDialog;
