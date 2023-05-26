//? FILTER FORM ----------------------------------------------------

const filterForm = document.querySelector(".filters-form");
filterForm.addEventListener("submit", async (event) => {
   event.preventDefault()
   const formData = new FormData(filterForm); 
   const data = {};
   formData.forEach((value, key) => {
      if (key == "categories" && value){
         if (! data.hasOwnProperty("categories")){
            data["categories"] = [];
         }
         data["categories"].push(value);
      }
      else if (value){
         data[key] = value;
      }
   });

   const serchParams = new URLSearchParams(data);
   const url = `/api/stories?${serchParams}`;
   const stories = await getStoriesData(storiesUrl=url);
   await renderStories(stories);
})


const filterClearBtn = document.querySelector(".cancel-btn");
filterClearBtn.addEventListener("click", async() => {
   const stories = await getStoriesData();
   await renderStories(stories);
})