const urlQueryString = window.location.search;
const urlParams = new URLSearchParams(urlQueryString);

const pageName = document.querySelector(".page-name-text");
const storyForm = document.querySelector(".story-form-form");
const dateInput = storyForm.querySelector(".story-form-date");
const timeInput = storyForm.querySelector(".story-form-time");
const titleInput = storyForm.querySelector(".story-form-title");
const descriptionInput = storyForm.querySelector(".story-form-description");
const categorySelect = document.querySelector(".story-form-category-select");
const categoryColorCircle = document.querySelector(".story-form-category-color");
const discardBnt = document.querySelector(".cancel-btn");
const saveBnt = document.querySelector(".confirm-btn");

discardBnt.addEventListener("click", event => {
    event.preventDefault();
    window.location.replace("/stories");
});


window.addEventListener("DOMContentLoaded", async () => {
    
    const categories = await (await fetch("/api/categories")).json();
    categories.forEach(category => {
       const categoryOption = document.createElement("option");
       categoryOption.innerText = category.name;
       categoryOption.value = category._id;
       categorySelect.append(categoryOption);
    })


    if (urlParams.get("creating")){
        
        pageName.innerText = "Nueva Historia";
    
        //? Precarga de campos:
        
        const date = new Date();    
        dateInput.valueAsDate = date;
        timeInput.value = formatTime(date);
        
        function formatTime(date){
            
            const getTwoDigits = (value) => value < 10 ? `0${value}` : value;
            const hours = getTwoDigits(date.getHours());
            const mins = getTwoDigits(date.getMinutes());
            return `${hours}:${mins}`; 
        }
        
        const defaultCategory = await (await fetch("/api/category/getDeafault")).json();
        categorySelect.value = defaultCategory._id;
        categoryColorCircle.style.backgroundColor = defaultCategory.color;

        //? Submit del form:
        saveBnt.addEventListener("click", async (event) => {
    
            event.preventDefault();
    
            // Submit del form para crear la story:
            const formData = new FormData(storyForm); 
            const payload = new URLSearchParams(formData);
            console.log(payload)
            await fetch("/api/stories", {
                method:"POST",
                body:payload
            });
    
            // Redirijo a /stories:
            window.location.replace("/stories");
        });
        }
    
    
    else if (urlParams.get("editing")){
        
        pageName.innerText = "Editar Historia";
    
        const storyId = urlParams.get("storyId");
        const storyData = await (await fetch(`/api/story/${storyId}`)).json(); 
        const categoryData = await (await fetch(`/api/category/${storyData.category_id}`)).json(); 
        
        //? Precarga de campos:
        dateInput.value = storyData.date.slice(0,storyData.date.indexOf(","));
        timeInput.value = storyData.time.slice(storyData.date.indexOf(",")+1);
        titleInput.value = storyData.title;
        descriptionInput.value = storyData.description;
        categorySelect.value = categoryData._id;
        categoryColorCircle.style.backgroundColor = categoryData.color;
        
        //? Submit del form:
        saveBnt.addEventListener("click", async (event) => {
    
            event.preventDefault();
    
            // Submit del form para crear la story:
            const newValues = {
                "date":dateInput.value,
                "time":timeInput.value,
                "title":titleInput.value,
                "description":descriptionInput.value,
                "category_id":categorySelect.value
            }
            await fetch(`/api/story/${storyId}`,{
                method:"PUT",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newValues)
            });

            // Redirijo a /stories:
            window.location.replace("/stories");
        });
    }
});    


categorySelect.addEventListener("change", async () => {
    const selectedOption = categorySelect.options[categorySelect.selectedIndex];
    const category = await (await fetch(`/api/category/${selectedOption.value}`)).json();
    categorySelect.value = category._id;
    categoryColorCircle.style.backgroundColor = category.color;
})