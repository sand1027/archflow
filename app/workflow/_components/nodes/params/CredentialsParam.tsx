"use client";
import { ParamProps } from "@/lib/types";
import React, { useId } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useQuery } from "@tanstack/react-query";
import { getUserCredentials } from "@/actions/credentials";

function CredentialsParam({ param, updateNodeParamValue, value }: ParamProps) {
  const id = useId();

  const query = useQuery({
    queryKey: ["credentials-for-user"],
    queryFn: async () => {
      try {
        const result = await getUserCredentials();
        console.log("Credentials loaded:", result);
        return result;
      } catch (error) {
        console.error("Credentials query error:", error);
        throw error;
      }
    },
    retry: 3,
    refetchInterval: 10000,
  });

  console.log("Credentials query state:", {
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error?.message,
    data: query.data,
    dataLength: query.data?.length
  });

  return (
    <div className="flex flex-col gap-1 w-full">
      <Label htmlFor={id} className="text-xs flex">
        {param.name}
        {param.required && <p className="text-red-400 px-2">*</p>}
      </Label>
      <Select
        onValueChange={(value) => updateNodeParamValue(value)}
        value={value}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Credentials</SelectLabel>
            {query.isLoading && (
              <SelectItem value="loading" disabled>
                Loading credentials...
              </SelectItem>
            )}
            {query.error && (
              <SelectItem value="error" disabled>
                Error: {query.error.message}
              </SelectItem>
            )}
            {query.data?.length === 0 && (
              <SelectItem value="empty" disabled>
                No credentials found
              </SelectItem>
            )}
            {query.data?.map((credential) => (
              <SelectItem key={credential.id} value={credential.id}>
                {credential.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}

export default CredentialsParam;
