//model controller class
class ModelController {
  constructor() {
  }
  calculateValue(item) {
    return Math.round(+item.value / this.calculateDays(item));
  }
  calculateDays(item) {
    return Math.floor((new Date().getTime() - new Date(item.addedDate).getTime()) / (1000 * 60 * 60 * 24));
  }

}

// view class

class ViewController {
  constructor() {
    // domStrings
    this.domStrings = {
      itemTitle: '#item-title',
      addedDate: '#added-date',
      period: '#period',
      passedPeriods: '#passed-periods',
      value: '#value',
      submitButton: '#submit-new-btn',
      entriesList: '.entries',
    }
    // DOM selectors
    this.domSelectors = {
      titleInput: document.querySelector(this.domStrings.itemTitle),
      addedDateInput: document.querySelector(this.domStrings.addedDate),
      periodInput: document.querySelector(this.domStrings.period),
      passedPeriodsInput: document.querySelector(this.domStrings.passedPeriods),
      valueInput: document.querySelector(this.domStrings.value),
      submitBtn: document.querySelector(this.domStrings.submitButton),
      entriesList: document.querySelector(this.domStrings.entriesList),
     }  
  }
    

  //Event handlers


  // list items on page
  listItems(itemList, arrayValue) {
   if (itemList.length > 0) {
      this.domSelectors.entriesList.innerHTML = '';
    }
    itemList.forEach((item, index) => {
      this.domSelectors.entriesList.innerHTML += `<div class="entry-item" id=${item._id}><span>Title: ${item.title} </span><span>Price: ${item.value}</span> <span>Cost per day: ${arrayValue[index]}</span><span class="buttons"><button class="edit-item"><i class="fas fa-pencil-alt"></i></button><a href="/item/${item._id}" class="delete-item"><i class="far fa-trash-alt"></i></a></span></div>`
    })
  }
}

// controller class
class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;
  }

  initializeEventListeners() {
    this.view.domSelectors.entriesList.addEventListener('click', (event) => {
      if(event.target.parentNode.classList.contains('delete-item')) {
        console.log(event.target.parentNode.parentNode.parentNode.parentNode.removeChild(event.target.parentNode.parentNode.parentNode));
      };
    })
  }


  async fetchAllItems() {
    fetch('/data').then(response => response.json()).then(data => {
      if (!data) {
        return console.log('Could not retrieve data');
      }
      const valueArray = data.map((item) => this.model.calculateValue(item));
      this.view.listItems(data, valueArray); // list items to the page
    } )
  }

}

const app = new Controller(new ModelController, new ViewController);
app.initializeEventListeners();
// Event listeners

// Load all items on main page load
window.addEventListener('load', () => {
  app.fetchAllItems();
})

