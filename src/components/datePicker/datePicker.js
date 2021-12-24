
import AirDatepicker from 'air-datepicker';
import 'air-datepicker/air-datepicker.css';
import './_datePicker.scss';

const textFieldswithDP = document.querySelectorAll(".text-field__input_withDP");

let applyBtn = {
  content: 'Применить',
  className: 'air-datepicker-button_apply',
  onClick: (dp) => {
     dp.hide()
  }
}

textFieldswithDP.forEach(item => new AirDatepicker(item, {
      // inline: true,
      navTitles: {
        days: 'MMMM yyyy'
      },
      selectedDates: [new Date()],
      buttons: ['clear', applyBtn]
    }).show())

