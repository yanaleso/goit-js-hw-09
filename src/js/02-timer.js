import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const refs = {
    input: document.querySelector('#datetime-picker'),
    startBtn: document.querySelector('[data-start]'),
    days: document.querySelector('[data-days]'),
    hours: document.querySelector('[data-hours]'),
    minutes: document.querySelector('[data-minutes]'),
    seconds: document.querySelector('[data-seconds]')
}

let selectedDate = Date.now();
const isDisabled = true;
let intervalId = null;
const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (Date.now() > selectedDates[0]) {
        Notify.failure("Please choose a date in the future");
    } else { 
        refs.startBtn.disabled = !isDisabled;
        return selectedDate = selectedDates[0];
    }
  },
};

refs.startBtn.disabled = isDisabled;
refs.startBtn.addEventListener('click', onStartBtnClick);

const fp = flatpickr(refs.input, options);

function onStartBtnClick() {
     intervalId = setInterval(() => {
        const deltaTime = selectedDate - Date.now();
        const convertedTime = convertMs(selectedDate - Date.now());
        
        formatTimerValue(convertedTime);
        refs.startBtn.disabled = isDisabled;
        fp.destroy();
        refs.input.disabled = isDisabled;
        if (deltaTime < 1000) {
            stopTimer();
        }
    }, 1000)
}

function formatTimerValue({ days, hours, minutes, seconds }) {
    addLeadingZero(days);
    addLeadingZero(hours);
    addLeadingZero(minutes);
    addLeadingZero(seconds);
    updateClockface(days, hours, minutes, seconds);
}

function updateClockface(days, hours, minutes, seconds) {
    refs.days.textContent = days;
    refs.hours.textContent = hours;
    refs.minutes.textContent = minutes;
    refs.seconds.textContent = seconds;
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function stopTimer() {
    clearInterval(intervalId);
}