//? HEADER TITLE --------------------------------------------

const headerTitle = document.querySelector(".title");
headerTitle.addEventListener("click", () => {
   window.location.replace("/");
});

//? DELETE MODAL --------------------------------------------

const dltModal = document.querySelector(".dlt-modal-container");
const dltModalFrame = document.querySelector(".dlt-modal-frame");
const dltModalDiscardBtn = document.querySelector(".discard-btn");
const dltModalDltlBtn = document.querySelector(".dlt-btn");

dltModal.addEventListener("click",(event)=>{
   if(!dltModalFrame.contains(event.target)){
      dltModal.classList.remove('show');
      selectedStoryId = null;
   }
})

dltModalDiscardBtn.addEventListener("click", () =>{
   dltModal.classList.remove("show");
   selectedStoryId = null;
})


//? FUNCIONES ------------------------------------------------
function getCookie(name) {
   var value = "; " + document.cookie;
   var parts = value.split("; " + name + "=");
   if (parts.length == 2) return parts.pop().split(";").shift();
}