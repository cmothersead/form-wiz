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

export { default as Form } from './SuperForm.svelte';
export { default as Input } from './Input.svelte';
export { default as SuperInput } from './SuperInput.svelte';
export { default as Typeahead } from './Typeahead.svelte';
export { default as LabeledIcon } from './LabeledIcon.svelte';
