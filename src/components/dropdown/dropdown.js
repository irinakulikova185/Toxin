import './_dropdown.scss'

document.querySelectorAll(".dropdown").forEach(dropdownWrapper => {

  const decrementBtns = dropdownWrapper.querySelectorAll(".dropdown__decrement-button"),
        incrementBtns = dropdownWrapper.querySelectorAll(".dropdown__increment-button"),
        dropdownBtn = dropdownWrapper.querySelector(".dropdown__button"),
        dropdownList = dropdownWrapper.querySelector(".dropdown__list"),
        quantityBlocks = dropdownWrapper.querySelectorAll(".dropdown__amount"),
        dropdownListItem = dropdownWrapper.querySelectorAll(".dropdown__item"),
        applyBtn = dropdownWrapper.querySelector(".dropdown__apply"),
        clearBtn = dropdownWrapper.querySelector(".dropdown__clear");



dropdownBtn.addEventListener('click', () => {
  dropdownList.classList.toggle("dropdown__list_visible")
})

applyBtn.addEventListener('click', () => {
  const valuesArray = Array.from( quantityBlocks, item => +item.innerHTML);
  const total = valuesArray.reduce((prev,current) => prev + current);
  let unit
  if(total === 1) {
    unit = "гость"
  } else if ( total >= 2  && total <= 4) {
    unit = "гостя"
  } else {
    unit = "гостей"
  }
  dropdownBtn.innerHTML = `${total} ${unit}`
  
})

decrementBtns.forEach(btn => btn.addEventListener('click', () => {
  changeQuantity(btn, -1)
}))

incrementBtns.forEach(btn => btn.addEventListener('click', () => {
  changeQuantity(btn, 1)
}))

function changeQuantity(item, value) {
  const quantityBlock = item.parentElement.querySelector(".dropdown__amount");
  const currentQuantity = +quantityBlock.innerHTML;
  let newQuantity = currentQuantity + value;
  if(newQuantity >= 0) {
    quantityBlock.innerHTML = newQuantity;
  }
}

dropdownList.addEventListener('click', (e) => {
  e.stopPropagation()
})

document.addEventListener('click', (e) => {
  console.log(e.target)
  if(e.target !== dropdownBtn) {
    dropdownList.classList.remove("dropdown__list_visible")
  }
})
})

