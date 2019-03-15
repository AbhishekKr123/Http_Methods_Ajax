//get elements
const itemList = document.querySelector('.items');
const httpForm = document.getElementById('httpForm');
const itemInput = document.getElementById('itemInput');
const imageInput = document.getElementById('imageInput');
const feedback = document.querySelector('.feedback');
// const items = document.querySelector(".items");
const submtiBtn = document.getElementById('submitBtn');
let editedItemID = 0;

const url = `https://5c89d56c41fb3f001434be50.mockapi.io/articles`;

/* -----------Get Items From API------------------ */
//load items
document.addEventListener('DOMContentLoaded', () => getItemsAPI());

//get items
function getItemsAPI() {
  const ajax = new XMLHttpRequest();
  ajax.open('GET', url, true);

  ajax.onload = function() {
    if (this.status === 200) {
      showItems(this.responseText);
    } else {
      console.log('Something went wrong');
    }
  };
  ajax.onerror = function() {
    console.log('There was an error');
  };

  ajax.send();
}

//show items

function showItems(data) {
  let reData = JSON.parse(data);
  let content = '';
  reData.forEach(element => {
    content += ` <li class="list-group-item d-flex align-items-center justify-content-between flex-wrap item my-2">
    <img src="${
      element.images
    }" id='itemImage' class='itemImage img-thumbnail' alt="">
    <h6 id="itemName" class="text-capitalize itemName">${element.name}</h6>
    <div class="icons">

     <a href='#' class="itemIcon mx-2 edit-icon" data-id='${element.id}'>
      <i class="fas fa-edit"></i>
     </a>
     <a href='#' class="itemIcon mx-2 delete-icon" data-id='${element.id} '>
      <i class="fas fa-trash"></i>
     </a>
    </div>
   </li>`;
  });
  itemList.innerHTML = content;
  getIcons();
}

/*---------------Put Items On API-------------------- */
httpForm.addEventListener('submit', submitItem);

//submit Items
function submitItem(event) {
  event.preventDefault();
  const itemValue = itemInput.value;
  const imageValue = imageInput.value;

  if (itemValue.length === 0 || imageValue.length === 0) {
    showFeedback('please enter valid values');
  } else {
    postItemAPI(imageValue, itemValue);
    imageInput.value = '';
    itemInput.value = '';
  }
}

function postItemAPI(img, itemName) {
  const ajax = new XMLHttpRequest();
  const avatar = `img/${img}.jpeg`;
  const name = itemName;
  ajax.open('POST', url, true);
  ajax.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

  ajax.onload = function() {
    // console.log(this.responseText);
    getItemsAPI();
  };
  ajax.onerror = function() {
    console.log('There was an error');
  };

  ajax.send(`images=${avatar}&name=${name}`);
}

//show Feedback

function showFeedback(text) {
  feedback.classList.add('showItem');
  feedback.innerHTML = `<p>${text}</p>`;
  setTimeout(() => {
    feedback.classList.remove('showItem');
  }, 3000);
}

/*--------------- Delete Icons & Edit Icons From Api--------------*/
//getIcons

function getIcons() {
  const editIcon = document.querySelectorAll('.edit-icon');
  const deleteIcon = document.querySelectorAll('.delete-icon');
  deleteIcon.forEach(icon => {
    const itemId = icon.dataset.id;
    icon.addEventListener('click', function(event) {
      event.preventDefault();
      deleteItemAPI(itemId);
    });
  });

  editIcon.forEach(icon => {
    const itemId = icon.dataset.id;
    icon.addEventListener('click', event => {
      event.preventDefault();
      const parent = event.target.parentElement.parentElement.parentElement;
      const img = parent.querySelector('.itemImage').src;
      const name = parent.querySelector('.itemName').textContent;
      editItemUI(img, name, itemId, parent);
    });
  });
}

//Delete User

function deleteItemAPI(id) {
  const url = `https://5c89d56c41fb3f001434be50.mockapi.io/articles/${id}`;
  const ajax = new XMLHttpRequest();
  ajax.open('DELETE', url, true);

  ajax.onload = function() {
    if (this.status === 200) {
      console.log(this.responseText);
      getItemsAPI(showItems);
    }
  };
  ajax.onerror = function() {
    console.log('There was an error');
  };

  ajax.send();
}

//Edit User

function editItemUI(itemImg, name, itemId, parent) {
  itemList.removeChild(parent);
  const imgIndex = itemImg.indexOf('img/');
  const jpegIndex = itemImg.indexOf('.jpeg');
  const img = itemImg.slice(imgIndex + 4, jpegIndex);
  itemInput.value = name.trim();
  imageInput.value = img;
  editedItemID = itemId;
  submtiBtn.innerHTML = 'Edit item';
  httpForm.removeEventListener('submit', submitItem);
  httpForm.addEventListener('submit', editItemAPI);
}

function editItemAPI() {
  event.preventDefault();
  const id = editedItemID;
  const itemValue = itemInput.value;
  const imageValue = imageInput.value;

  if (itemValue.length === 0 || imageValue.length === 0) {
    showFeedback('please enter valid values');
  } else {
    const img = `img/${imageValue}.jpeg`;
    const name = itemValue;
    const url = `https://5c89d56c41fb3f001434be50.mockapi.io/articles/${id}`;
    const ajax = new XMLHttpRequest();
    ajax.open('PUT', url, true);
    ajax.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    ajax.onload = function() {
      reverseForm();
      getItemsAPI(showItems);
    };
    ajax.onerror = function() {
      console.log('Some Error is there');
    };
    ajax.send(`images=${img}&name=${name}`);
  }
}
function reverseForm() {
  itemInput.value = '';
  imageInput.value = '';
  submtiBtn.innerHTML = 'Add Item';
  httpForm.removeEventListener('submit', editItemAPI);
  httpForm.addEventListener('submit', submitItem);
}
