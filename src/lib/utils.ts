import classNames from 'classnames';

export function cn(...inputs: (string | undefined | null | boolean | Record<string, boolean>)[]) {
  return classNames(...inputs);
}
