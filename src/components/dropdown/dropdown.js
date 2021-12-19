import './_dropdown.scss'

document.querySelectorAll(".dropdown").forEach(wrapper => {

  const decrementBtns = wrapper.querySelectorAll(".dropdown__decrement-button"),
        incrementBtns = wrapper.querySelectorAll(".dropdown__increment-button"),
        dropdownBtn = wrapper.querySelector(".dropdown__button"),
        dropdownList = wrapper.querySelector(".dropdown__list"),
        quantityBlocks = wrapper.querySelectorAll(".dropdown__count"),
        applyBtn = wrapper.querySelector(".dropdown__apply"),
        clearBtn = wrapper.querySelector(".dropdown__clear");
  
  const type = wrapper.getAttribute("data-type")
  const placeholder = dropdownBtn.getAttribute("data-placeholder")
  
  dropdownBtn.addEventListener('click', () => {
    dropdownList.classList.toggle("dropdown__list_visible")

  })
  if(applyBtn) {
    applyBtn.addEventListener('click', () => {
      dropdownList.classList.remove("dropdown__list_visible")
    })
  }
  
  function isClearBtnHidden(value) {
    if(clearBtn) {
      return value>0 && !clearBtn.classList.contains("dropdown__clear_visible")
    }  
  }
  function getValuesArray() {
    return Array.from(quantityBlocks, block => +block.innerHTML)
  }
  function shouldClearBtnHidden(value) {
    if(clearBtn) {
      return value === 0  && getValuesArray().every(num => num === 0)
    }
  }
  function toggleDisabledAttr(item) {
    const count = +item.parentElement.querySelector(".dropdown__count").innerHTML
    const shouldBtnDisabled = count === 0 && item.classList.contains("dropdown__decrement-button");
    if(shouldBtnDisabled) {
      item.setAttribute("disabled","")
    } else if (item.classList.contains("dropdown__decrement-button")) {
      item.removeAttribute("disabled");
    } else {
      item.parentElement.querySelector(".dropdown__decrement-button").removeAttribute("disabled")
    }
  }
  function setQuantityBlockValue(item,num) {
    const quantityBlock = item.parentElement.querySelector(".dropdown__count");
    const currentValue = +quantityBlock.innerHTML;
    const newValue = currentValue + num;
    quantityBlock.innerHTML = newValue;
    return newValue
  }
  function handleCounterBtnClick(item, num) {
    const newValue = setQuantityBlockValue(item, num)
    toggleDisabledAttr(item);
    if(isClearBtnHidden(newValue)) {
      clearBtn.classList.add("dropdown__clear_visible")
    }
    if(shouldClearBtnHidden(newValue)) {
      clearBtn.classList.remove("dropdown__clear_visible")
    }
  }
  function calcAmount(properties=[]) {
    const itemsAmountArray = properties.map(prop => +wrapper.querySelector(`[data-property = ${prop}]`).innerHTML);
    return itemsAmountArray.reduce((prev,current) => prev + current)
  }
  function declOfNum(n, text_forms) {  
    n = Math.abs(n) % 100; 
    var n1 = n % 10;
    if (n > 10 && n < 20) { return `${n} ${text_forms[2]}`; }
    if (n1 > 1 && n1 < 5) { return `${n} ${text_forms[1]}`; }
    if (n1 == 1) { return `${n} ${text_forms[0]}`; }
    return `${n} ${text_forms[2]}`;
  }
  function createDropdownBtnText(data) {
    const selectedData = data.map(array =>  declOfNum(array[0], array[1]))
    const filteredSelectedData = selectedData.filter(str => !str.startsWith(0))
    const dropdownBtnText = filteredSelectedData.join(",")
    return dropdownBtnText
  }
  function setDropdownBtnText() {
    let dropdownBtnText
    let total1
    let total2
    switch(type) {
      case "guests" :
        total1 = calcAmount(["взрослые", "дети"])
        total2 = calcAmount(["младенцы"])
        dropdownBtnText = createDropdownBtnText([[total1, ['гость', 'гостя', 'гостей']], [total2, ['младенец', 'младенца', 'младенцев']]])
        break
      case "rooms" :
        total1 = calcAmount(["спальни"])
        total2 = calcAmount(["кровати"])
        dropdownBtnText = createDropdownBtnText([[total1, ['спальня', 'спальни', 'спален']], [total2, ['кровать', 'кровати', 'кроватей']]])
        break  
    }
    const totalAmountZero = total1 === 0 && total2 === 0
    dropdownBtn.innerHTML = totalAmountZero ? placeholder : dropdownBtnText
  }
  decrementBtns.forEach(btn => btn.addEventListener('click', () => {
    handleCounterBtnClick(btn, -1)
    setDropdownBtnText()
  }))

  incrementBtns.forEach(btn => btn.addEventListener('click', () => {
    handleCounterBtnClick(btn, 1)
    setDropdownBtnText()
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
    if(e.target !== dropdownBtn) {
      dropdownList.classList.remove("dropdown__list_visible")
    }
  })

  function setDefaultCount(attrValue, amount) {
    quantityBlocks.forEach(block => {
      const attr = block.getAttribute("data-property")
      if(attr === attrValue) {
        block.innerHTML = amount
      }
    })
  }

  function init() {
    setDefaultCount("спальни", 2)
    setDefaultCount("кровати", 2)
    setDropdownBtnText()
    decrementBtns.forEach(btn => toggleDisabledAttr(btn))
  }
  init();
})

