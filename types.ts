export type ButtonType = 'number' | 'operator' | 'function' | 'scientific';

export interface ButtonConfig {
  id: string;
  label: string;
  type: ButtonType;
  className?: string;
}
