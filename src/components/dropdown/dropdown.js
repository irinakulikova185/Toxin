import './_dropdown.scss'

document.querySelectorAll(".dropdown").forEach(dropdownWrapper => {

  const decrementBtns = dropdownWrapper.querySelectorAll(".dropdown__decrement-button"),
        incrementBtns = dropdownWrapper.querySelectorAll(".dropdown__increment-button"),
        dropdownBtn = dropdownWrapper.querySelector(".dropdown__button"),
        dropdownList = dropdownWrapper.querySelector(".dropdown__list"),
        quantityBlocks = dropdownWrapper.querySelectorAll(".dropdown__prop-count"),
        applyBtn = dropdownWrapper.querySelector(".dropdown__apply"),
        clearBtn = dropdownWrapper.querySelector(".dropdown__clear");
  
  dropdownBtn.addEventListener('click', () => {
    dropdownList.classList.toggle("dropdown__list_visible")
  })
  if(applyBtn) {
    applyBtn.addEventListener('click', () => {
      dropdownList.classList.remove("dropdown__list_visible")
    })
  }
  
  function isClearBtnHidden(value) {
    return value>0 && !clearBtn.classList.contains("dropdown__clear_visible")
  }
  function getValuesArray() {
    return Array.from(quantityBlocks, block => +block.innerHTML)
  }
  function shouldClearBtnHidden(value) {
    return value === 0  && getValuesArray().every(num => num === 0)
  }
  function toggleDisabledAttr(item, value) {
    const shouldDecrBtnDisabled = value === 0 && item.classList.contains("dropdown__decrement-button");
    if(shouldDecrBtnDisabled) {
      item.setAttribute("disabled","")
    } else if (item.classList.contains("dropdown__decrement-button")) {
      item.removeAttribute("disabled");
    } else {
      item.parentElement.querySelector(".dropdown__decrement-button").removeAttribute("disabled")
    }
  }
  function setQuantityBlockValue(item,num) {
    const quantityBlock = item.parentElement.querySelector(".dropdown__prop-count");
    const currentValue = +quantityBlock.innerHTML;
    const newValue = currentValue + num;
    quantityBlock.innerHTML = newValue;
    return newValue
  }
  function handleControlBtnClick(item, num) {
    const newValue = setQuantityBlockValue(item, num)
    toggleDisabledAttr(item, newValue);
    if(isClearBtnHidden(newValue)) {
      clearBtn.classList.add("dropdown__clear_visible")
    }
    if(shouldClearBtnHidden(newValue)) {
      clearBtn.classList.remove("dropdown__clear_visible")
    }
  }
  function calcAmount(properties=[]) {
    const itemsAmountArray = properties.map(prop => +dropdownWrapper.querySelector(`[data-property = ${prop}]`).innerHTML);
    return itemsAmountArray.reduce((prev,current) => prev + current)
  }
  function createDropdownBtnText(guestsAmount, babiesAmount) {
    let guests = "гостей"
    if(guestsAmount === 1) {
      guests = "гость"
    } else if ( guestsAmount >= 2  && guestsAmount <= 4) {
      guests = "гостя"
    } 
    let baby = "младенецев"
    if(babiesAmount === 1) {
      baby = "младенец"
    } else if ( babiesAmount >= 2  && babiesAmount <= 4) {
      baby = "младенца"
    } 
    let selectedOptionsText = `${guestsAmount} ${guests}, ${babiesAmount} ${baby}`
    if(guestsAmount === 0) {selectedOptionsText = `${babiesAmount} ${baby}`}
    if(babiesAmount === 0) {selectedOptionsText = `${guestsAmount} ${guests}`}
    return selectedOptionsText
  }
  function setDropdownBtnValue() {
    const totalBabies = calcAmount(["младенцы"])
    const totalGuests = calcAmount(["взрослые", "дети"])
    const selectedOptionsText = createDropdownBtnText(totalGuests, totalBabies)
    const totalAmountZero = totalGuests === 0 && totalBabies === 0
    dropdownBtn.innerHTML = totalAmountZero ? "Сколько гостей" : selectedOptionsText
  }
  decrementBtns.forEach(btn => btn.addEventListener('click', () => {
    handleControlBtnClick(btn, -1)
    setDropdownBtnValue()
  }))

  incrementBtns.forEach(btn => btn.addEventListener('click', () => {
    handleControlBtnClick(btn, 1)
    setDropdownBtnValue()
  }))

  function handleClearBtnClick() {
    quantityBlocks.forEach(block => block.innerHTML = 0)
    dropdownBtn.innerHTML="Сколько гостей"
    clearBtn.classList.remove("dropdown__clear_visible")
    decrementBtns.forEach(btn => btn.setAttribute("disabled", ""))
  }

  if(clearBtn) {
    clearBtn.addEventListener('click', () => {
      handleClearBtnClick()
    })
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

