"use server";

import { periodToDateRange } from "@/lib/helper";
import initDB, { WorkflowExecution, ExecutionPhase } from "@/lib/prisma";
import {
  ExecutionPhaseStatus,
  Period,
  WorkflowExecutionStatus,
  WorkflowExecutionType,
} from "@/lib/types";
import { auth } from "@clerk/nextjs/server";
import { eachDayOfInterval, format } from "date-fns";

export async function getPeriods() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthenticated");
  }

  await initDB();
  const executions = await WorkflowExecution.find({ userId }).sort({ startedAt: 1 }).limit(1);

  const currentYear = new Date().getFullYear();
  const minYear = executions.length > 0 && executions[0].startedAt
    ? executions[0].startedAt.getFullYear()
    : currentYear;

  const periods: Period[] = [];

  for (let year = minYear; year <= currentYear; year++) {
    for (let month = 0; month <= 11; month++) {
      periods.push({ year, month });
    }
  }
  return periods;
}

export async function getStatsCardsValue(period: Period) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthenticated");
  }

  const dateRange = periodToDateRange(period);

  await initDB();
  const executions = await WorkflowExecution.find({
    userId,
    startedAt: {
      $gte: dateRange.startDate,
      $lte: dateRange.endDate,
    },
    status: {
      $in: [WorkflowExecutionStatus.COMPLETED, WorkflowExecutionStatus.FAILED],
    },
  });

  const stats = {
    WorkflowExecutions: executions.length,
    creditsConsumed: 0,
    phaseExecutions: 0,
  };

  // Get phases for credit calculation
  const executionIds = executions.map(e => e._id);
  const phases = await ExecutionPhase.find({
    workflowExecutionId: { $in: executionIds },
    creditsConsumed: { $ne: null }
  });

  stats.creditsConsumed = executions.reduce(
    (sum, execution) => sum + (execution.creditsConsumed || 0),
    0
  );
  stats.phaseExecutions = phases.length;

  return stats;
}

export async function getWorkflowExecutionsStats(period: Period) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthenticated");
  }

  const dateRange = periodToDateRange(period);

  await initDB();
  const executions = await WorkflowExecution.find({
    userId,
    startedAt: {
      $gte: dateRange.startDate,
      $lte: dateRange.endDate,
    },
    status: {
      $in: [ExecutionPhaseStatus.COMPLETED, ExecutionPhaseStatus.FAILED],
    },
  });

  const stats: WorkflowExecutionType = eachDayOfInterval({
    start: dateRange.startDate,
    end: dateRange.endDate,
  })
    .map((date) => format(date, "yyyy-MM-dd"))
    .reduce((acc, date) => {
      acc[date] = {
        success: 0,
        failed: 0,
      };
      return acc;
    }, {} as any);

  executions.forEach((execution) => {
    const date = format(execution.startedAt!, "yyyy-MM-dd");

    if (execution.status === WorkflowExecutionStatus.COMPLETED) {
      stats[date].success! += 1;
    }

    if (execution.status === WorkflowExecutionStatus.FAILED) {
      stats[date].failed! += 1;
    }
  });

  const result = Object.entries(stats).map(([date, infos]) => ({
    date,
    ...infos,
  }));

  return result;
}

export async function getCreditsUsageInPeriod(period: Period) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthenticated");
  }

  const dateRange = periodToDateRange(period);

  await initDB();
  const executionsPhases = await WorkflowExecution.find({
    userId,
    startedAt: {
      $gte: dateRange.startDate,
      $lte: dateRange.endDate,
    },
  });

  const stats: WorkflowExecutionType = eachDayOfInterval({
    start: dateRange.startDate,
    end: dateRange.endDate,
  })
    .map((date) => format(date, "yyyy-MM-dd"))
    .reduce((acc, date) => {
      acc[date] = {
        success: 0,
        failed: 0,
      };
      return acc;
    }, {} as any);

  executionsPhases.forEach((phase) => {
    const date = format(phase.startedAt!, "yyyy-MM-dd");

    if (phase.status === ExecutionPhaseStatus.COMPLETED) {
      stats[date].success! += phase.creditsConsumed || 0;
    }

    if (phase.status === ExecutionPhaseStatus.FAILED) {
      stats[date].failed! += phase.creditsConsumed || 0;
    }
  });

  const result = Object.entries(stats).map(([date, infos]) => ({
    date,
    ...infos,
  }));

  return result;
}