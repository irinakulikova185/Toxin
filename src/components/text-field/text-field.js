import './text-field.scss';
import Cleave from 'cleave.js';


const cleaveDate = new Cleave('.text-field__input_masked', {
  date: true,
  delimiter: '.',
  datePattern: ['d', 'm', 'Y']
})