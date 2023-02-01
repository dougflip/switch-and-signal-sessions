#!/usr/bin/env node

import ora from "ora";
import { parseDaysOrDefault } from "./utils";
import {
  SessionInfo,
  getMultiSessions,
  DayFailedToLoad,
  DayWithSessions,
  DayResult,
  getSessionUrl,
} from "./core";
import chalk from "chalk";
import { program } from "commander";

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

function sessionsAsString({
  time,
  quantity,
  price,
}: SessionInfo): ConsoleString {
  return getPrinterForQuantity(quantity)(
    `${time}:\t${quantity
      .toString()
      .padStart(2, " ")} tickets remaining at $${price}`
  );
}

function dayWithSessionsAsString({
  day,
  sessions,
}: DayWithSessions): ConsoleString {
  return [
    chalk.bold(capitalizeFirstLetter(day)),
    sessions.map(sessionsAsString).join("\n"),
    chalk.italic(chalk.blue(getSessionUrl(day))),
  ].join("\n");
}

function dayResultAsString(result: DayResult): ConsoleString {
  return result.kind === "day-failed-load"
    ? failedDayAsString(result)
    : dayWithSessionsAsString(result);
}

async function main() {
  program
    .version("1.0.0-beta.6")
    .arguments("[days]")
    .addHelpText(
      "before",
      [
        `Display ${chalk.bold(
          "Switch and Signal"
        )} sessions with remaining ticket count and pricing.`,
        `Without any [days] this will list all days and their sessions: ${chalk.bold(
          "switch-and-signal-sessions"
        )}`,
        `Pass [days] as a space delimited list to see specific days: ${chalk.bold(
          "switch-and-signal-sessions monday friday"
        )}`,
        `Days are matched using "starts with" so this is equivalent to the above: ${chalk.bold(
          "switch-and-signal-sessions m f "
        )}`,
        "",
      ].join("\n")
    )
    .parse();

  const spinner = ora("Fetching Sessions...");
  spinner.start();
  const results = await getMultiSessions(parseDaysOrDefault(program.args));
  const output = results.map(dayResultAsString);
  spinner.stop();
  console.log(output.join("\n\n"));
}

main();
