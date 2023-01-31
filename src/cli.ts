#!/usr/bin/env node

import ora from "ora";
import { parseDaysOrDefault } from "./utils";
import {
  SessionInfo,
  getMultiSessions,
  DayFailedToLoad,
  DayWithSessions,
  DayResult,
} from "./core";
import chalk from "chalk";

type ConsoleString = string;

function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function getPrinterForQuantity(quantity: number): (s: string) => ConsoleString {
  return quantity >= 12 ? chalk.green : quantity > 5 ? chalk.yellow : chalk.red;
}

function failedDayAsString(result: DayFailedToLoad): ConsoleString {
  return [
    chalk.bold(capitalizeFirstLetter(result.day)),
    chalk.red(result.reason),
  ].join("\n");
}

function sessionsAsString({ time, quantity }: SessionInfo): ConsoleString {
  return getPrinterForQuantity(quantity)(`${time}:\t${quantity} tickets left`);
}

function dayWithSessionsAsString({
  day,
  sessions,
}: DayWithSessions): ConsoleString {
  return [
    chalk.bold(capitalizeFirstLetter(day)),
    sessions.map(sessionsAsString).join("\n"),
  ].join("\n");
}

function dayResultAsString(result: DayResult): ConsoleString {
  return result.kind === "day-failed-load"
    ? failedDayAsString(result)
    : dayWithSessionsAsString(result);
}

async function main() {
  const spinner = ora("Fetching Sessions...");
  spinner.start();
  const rawDays = process.argv.splice(2);
  const results = await getMultiSessions(parseDaysOrDefault(rawDays));
  const output = results.map(dayResultAsString);
  spinner.stop();
  console.log(output.join("\n\n"));
}

main();
