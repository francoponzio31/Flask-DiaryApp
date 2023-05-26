
//? VARIABLES ------------------------------
let selectedStoryId = null;

//? CARGAR LISTA DE STORIES ----------------

window.addEventListener("DOMContentLoaded", async () => {
   setUserData()
   const stories = await getStoriesData();
   await renderStories(stories);
});

//? NEW STORY BTN --------------------------------------------

const newStoryBtn = document.querySelector(".new-story-btn");
newStoryBtn.addEventListener("click", () => {
   const serchParams = new URLSearchParams({"creating":true});
   const url = `/story_form?${serchParams}`;
   window.location.replace(url);
});

//? LOGOUT BTN --------------------------------------------

const LogoutBtn = document.querySelector(".logout-btn");
LogoutBtn.addEventListener("click", () => {
   window.location.replace("/logout");
});

//? STORY MODAL ---------------------------------------------
const storyModal = document.querySelector(".story-modal-container");
const storyModalFrame = document.querySelector(".story-modal-frame");

storyModal.addEventListener("click",(event)=>{
   if(!storyModalFrame.contains(event.target)){
      storyModal.classList.remove('show');
      selectedStoryId = null;
   }
})

//? FUNCIONES ------------------------------

async function getStoriesData(storiesUrl="/api/stories", categoriesUrl="/api/categories"){
   const stories = await (await fetch(storiesUrl)).json();
   const categories = await (await fetch(categoriesUrl)).json();
   stories.forEach(story=>{
      for (let category of categories){
         if (category._id == story.category_id){
            story.categoryData = category;
            break;
         }
      }
   })
   return stories
}


async function renderStories(stories){

   const storiesSection = document.querySelector(".stories-section");
   const sectionTitle = storiesSection.querySelector(".section-title");
   const storiesContaniner = storiesSection.querySelector(".stories-container");
   storiesContaniner.innerHTML = "";

   if (stories.length != 0){
      
      sectionTitle.innerText = "Tus historias:";

      for (let story of stories) {

         const storyId = story._id;
         const categoryData = story.categoryData;

         const storyContainer = document.createElement("div");
         storyContainer.classList = "story-container";
                    
         // Agrego la clase fav-story:
         if (story.fav){
            storyContainer.classList.add("fav-story");
         }
         
         storyContainer.innerHTML = `
         <article class="story container selectable">
         <div class="story-header">
         <span class="story-datetime"> </span>
         <h3 class="story-title"> </h3>
         </div>
         <div class="story-body"> 
         <p class="story-description"> </p>
         </div>
         </article>
         
         <div class="btns-container">
         <div class="card-btn fav-btn container selectable">
         <svg alt="Agregar a Favoritos" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path d="M21.947 9.179a1.001 1.001 0 0 0-.868-.676l-5.701-.453-2.467-5.461a.998.998 0 0 0-1.822-.001L8.622 8.05l-5.701.453a1 1 0 0 0-.619 1.713l4.213 4.107-1.49 6.452a1 1 0 0 0 1.53 1.057L12 18.202l5.445 3.63a1.001 1.001 0 0 0 1.517-1.106l-1.829-6.4 4.536-4.082c.297-.268.406-.686.278-1.065z"/></svg>
         </div>
         <div class="card-btn edit-btn container selectable">
         <svg alt="Editar Entrada" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" ><path d="M8.707 19.707 18 10.414 13.586 6l-9.293 9.293a1.003 1.003 0 0 0-.263.464L3 21l5.242-1.03c.176-.044.337-.135.465-.263zM21 7.414a2 2 0 0 0 0-2.828L19.414 3a2 2 0 0 0-2.828 0L15 4.586 19.414 9 21 7.414z"/></svg>
         </div>
         <div class="card-btn dlt-btn container selectable">
         <svg alt="Borrar Entrada" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path d="M5 20a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8h2V6h-4V4a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v2H3v2h2zM9 4h6v2H9zM8 8h9v12H7V8z"></path><path d="M9 10h2v8H9zm4 0h2v8h-2z"></path></svg>
         </div>
         </div>`;
         
         const storyCard = storyContainer.querySelector(".story");
         storyCard.style.borderLeftColor = `${categoryData.color}`;
                  
         const date = story.date;
         const time = story.time;
         const [year, month, day] = date.split(",")[0].split("-");
         const [hours, minutes] = time.split(",")[1].split(":");
         const formatedDate = `${day}/${month}/${year}, ${hours}:${minutes}`;
         const storyCardDate = storyContainer.querySelector(".story-datetime");
         const storyCardTitle = storyContainer.querySelector(".story-title");
         const storyCardDescription = storyContainer.querySelector(".story-description");
         storyCardDate.innerText = formatedDate;
         storyCardTitle.innerText = story.title;
         storyCardDescription.innerText = story.description;

         storyCard.addEventListener("click", async ()=>{
            const storyModal = document.querySelector(".story-modal-container");
            const storyModalDatetime = document.querySelector(".story-modal-datetime");
            const storyModalTitle = document.querySelector(".story-modal-title");
            const storyModalDescription = document.querySelector(".story-modal-description");
            const storyModalCategoryColor = document.querySelector(".story-modal-category-color");
            const storyModalCategory = document.querySelector(".story-modal-category");
            const date = story.date;
            const time = story.time;
            const [year, month, day] = date.split(",")[0].split("-");
            const [hours, minutes] = time.split(",")[1].split(":");
            const formatedDate = `${day}/${month}/${year}, ${hours}:${minutes}`;

            storyModalDatetime.innerText = formatedDate;
            storyModalTitle.innerText = story.title;
            storyModalDescription.innerText = story.description;
            storyModalCategoryColor.style.backgroundColor = categoryData.color;
            storyModalCategory.innerText = categoryData.name;
            storyModal.classList.add("show");
         });
         
         const favBtn = storyContainer.querySelector(".fav-btn");
         const editBtn = storyContainer.querySelector(".edit-btn");
         const deleteBtn = storyContainer.querySelector(".dlt-btn");

         favBtn.addEventListener("click", async () => {
            await fetch(`/api/story/${storyId}`,{
               method:"PUT",
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({"fav" : !story.fav})
            });
            const stories = await getStoriesData();
            await renderStories(stories);
         });

         editBtn.addEventListener("click", () => {
            const serchParams = new URLSearchParams({"editing":true, "storyId":storyId});
            const url = `/story_form?${serchParams}`;
            window.location.replace(url);
         });

         deleteBtn.addEventListener("click", () => {
            const dltModal = document.querySelector(".dlt-modal-container");
            dltModal.classList.add("show");
            selectedStoryId = storyId;
            

            dltModalDltlBtn.addEventListener("click", async () =>{
             
               await fetch(`/api/story/${selectedStoryId}`, { method: "DELETE" });
               dltModal.classList.remove("show");
               
               const stories = await getStoriesData();
               await renderStories(stories);
            
               selectedStoryId = null;
            })

         });

         storiesContaniner.append(storyContainer);
   
      };

   }

   else {
      sectionTitle.innerText = "No se han encontrado historias";
   }

}
 

function setUserData(){
   const user_id_span = document.querySelector("#user_id");
   user_id_span.innerText = getCookie("user_id");
   const username_span = document.querySelector("#username");
   username_span.innerText = `${getCookie("name")} ${getCookie("surname")}`;
}