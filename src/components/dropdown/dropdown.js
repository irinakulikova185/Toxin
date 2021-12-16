import './_dropdown.scss'

document.querySelectorAll(".dropdown").forEach(dropdownWrapper => {

  const decrementBtns = dropdownWrapper.querySelectorAll(".dropdown__decrement-button"),
        incrementBtns = dropdownWrapper.querySelectorAll(".dropdown__increment-button"),
        dropdownBtn = dropdownWrapper.querySelector(".dropdown__button"),
        dropdownList = dropdownWrapper.querySelector(".dropdown__list"),
        quantityBlocks = dropdownWrapper.querySelectorAll(".dropdown__amount"),
        applyBtn = dropdownWrapper.querySelector(".dropdown__apply"),
        clearBtn = dropdownWrapper.querySelector(".dropdown__clear");
 
  dropdownBtn.addEventListener('click', () => {
    dropdownList.classList.toggle("dropdown__list_visible")
  })

  function getValuesArray() {
    return Array.from( quantityBlocks, item => +item.innerHTML);
  }

  function handleApplyBtnClick() {
    const total = getValuesArray().reduce((prev,current) => prev + current);
    let unit
    if(total === 1) {
      unit = "гость"
    } else if ( total >= 2  && total <= 4) {
      unit = "гостя"
    } else {
      unit = "гостей"
    }
    dropdownBtn.innerHTML = `${total} ${unit}`
  }
  applyBtn.addEventListener('click', () => {
    handleApplyBtnClick();
  })
  function isClearBtnHidden(value) {
    return value>0 && !clearBtn.classList.contains("dropdown__clear_visible")
  }
  function shouldClearBtnHidden(value) {
    return value === 0  && getValuesArray().every(num => num === 0)
  }
  function handleControlBtnClick(item, num) {
    const quantityBlock = item.parentElement.querySelector(".dropdown__amount");
    const currentValue = +quantityBlock.innerHTML;
    let newValue = currentValue + num;
    if(newValue >= 0) {
      quantityBlock.innerHTML = newValue;
    }
    if(isClearBtnHidden(newValue)) {
      clearBtn.classList.add("dropdown__clear_visible")
    }
    if(shouldClearBtnHidden(newValue)) {
      clearBtn.classList.remove("dropdown__clear_visible")
    }
  }

  decrementBtns.forEach(btn => btn.addEventListener('click', () => {
    handleControlBtnClick(btn, -1)
  }))

  incrementBtns.forEach(btn => btn.addEventListener('click', () => {
    handleControlBtnClick(btn, 1)
  }))

  function handleClearBtnClick() {
    quantityBlocks.forEach(block => block.innerHTML = 0)
    clearBtn.classList.remove("dropdown__clear_visible")
  }

  clearBtn.addEventListener('click', () => {
    handleClearBtnClick()
  })

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

