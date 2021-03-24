
import logger from "./logger";

export const pErr = (err: Error) => {
  if (err) {
    logger.err(err);
  }
};

export const getRandomInt = () => {
  return Math.floor(Math.random() * 1_000_000_000_000);
};

const toCase = (value: string, joinChar: string) =>
  value &&
  value
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    .map((s) => s.toLowerCase())
    .join(joinChar);

export const toSnakeCase = (value: string) => toCase(value, "_");

export const toKebabCase = (value: string) => toCase(value, "-");