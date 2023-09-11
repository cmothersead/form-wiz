export const InputType = {
  color: 'color',
  date: 'date',
  'datetime-local': 'datetime-local',
  email: 'email',
  file: 'file',
  month: 'month',
  number: 'number',
  password: 'password',
  range: 'range',
  search: 'search',
  tel: 'tel',
  text: 'text',
  time: 'time',
  typeahead: 'typeahead',
  url: 'url'
} as const;

export type Item = { value: any; label: string };

export { default as ChevronIcon } from './ChevronIcon.svelte';
export const test = "Hello World";
