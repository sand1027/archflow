"use client";

import { Input } from "@/components/ui/input";
import { AppNode, TaskParam, TaskParamType } from "@/lib/types";
import React, { useCallback } from "react";
import StringParam from "./params/StringParam";
import TextareaParam from "./params/TextareaParam";
import { useReactFlow } from "@xyflow/react";
import SelectParam from "./params/SelectParam";
import CredentialsParam from "./params/CredentialsParam";

function NodeParamField({
  param,
  nodeId,
  disabled,
}: {
  param: TaskParam;
  nodeId: string;
  disabled: boolean;
}) {
  const { updateNodeData, getNode } = useReactFlow();
  const node = getNode(nodeId) as AppNode;

  const updateNodeParamValue = useCallback(
    (newValue: string) => {
      updateNodeData(nodeId, {
        inputs: {
          ...node?.data?.inputs,
          [param.name]: newValue,
        },
      });
    },
    [updateNodeData, param.name, node?.data?.inputs, nodeId]
  );

  const value = node?.data?.inputs?.[param.name];

  switch (param.type) {
    case TaskParamType.STRING:
    case TaskParamType.NUMBER:
    case TaskParamType.JSON:
    case TaskParamType.FILE:
      return (
        <StringParam
          param={param}
          value={value}
          updateNodeParamValue={updateNodeParamValue}
          disabled={disabled}
        />
      );
    case TaskParamType.TEXTAREA:
      return (
        <TextareaParam
          param={param}
          value={value}
          updateNodeParamValue={updateNodeParamValue}
          disabled={disabled}
        />
      );
    case TaskParamType.SELECT:
      return (
        <SelectParam
          param={param}
          updateNodeParamValue={updateNodeParamValue}
          value={value}
        />
      );
    case TaskParamType.CREDENTIAL:
      return (
        <CredentialsParam
          param={param}
          updateNodeParamValue={updateNodeParamValue}
          value={value}
        />
      );
    case TaskParamType.BOOLEAN:
      return (
        <SelectParam
          param={{
            ...param,
            options: [
              { label: "True", value: "true" },
              { label: "False", value: "false" }
            ]
          }}
          updateNodeParamValue={updateNodeParamValue}
          value={value}
        />
      );

    default:
      return (
        <div className="w-full">
          <p className="text-xs text-muted-foreground">Not Implemented</p>
        </div>
      );
  }
}

export default NodeParamField;
