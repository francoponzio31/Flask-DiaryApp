const categoryModal = document.querySelector(".category-modal-container");
const categoryModalFrame = document.querySelector(".category-modal-frame");
const categoryForm = document.querySelector(".category-form");
const categoryModalTitle = document.querySelector(".category-modal-title");
const categoryModalName = categoryForm.querySelector("#category-modal-name");
const categoryModalColor = categoryForm.querySelector("#category-color-picker");
const cancelBtn = categoryForm.querySelector(".cancel-btn");
const confirmBtn = categoryForm.querySelector(".confirm-btn");
const newCategoryBtn = document.querySelector(".new-category");
let selectedCategoryId = null;
let mode = null;

window.addEventListener("DOMContentLoaded", async () => {
    const userCategories = await (await fetch("/api/userCategories")).json();
    renderCategories(userCategories);
    const categories = await (await fetch("/api/categories")).json();
    renderCategoriesFilter(categories);
});


function renderCategories(categories){
    
    const categoriesContainer = document.querySelector(".categories-container");
    categoriesContainer.innerHTML = "";
    
    categories.forEach(category => {

        const categoryContainer = document.createElement("div");
        categoryContainer.classList = "category-container";

        categoryContainer.innerHTML = `
        <article class="category container" style="border-left-color:${category.color}">
            <h3 class="category-name"> ${category.name} </h3>
        </article>

        <div class="btns-container dropdown">
            <div class="card-btn container selectable">
                <svg alt="Opciones" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" ><path d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 12c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path></svg>
            </div>
            <ul class="dropdown-content container">
                <li class="edit-option selectable">Editar</li>
                <li class="dlt-option selectable">Borrar</li>
            </ul>
        </div>`;

        const btnsContainer = categoryContainer.querySelector(".btns-container");
        const editBtn = categoryContainer.querySelector(".edit-option");
        const dltBtn = categoryContainer.querySelector(".dlt-option");
        const dropdownContent = btnsContainer.querySelector(".dropdown-content");
        
        btnsContainer.addEventListener("click", ()=>{
            dropdownContent.classList.toggle("dropdown-content--show");
            const categoriesItem = document.querySelector(".categories-item");
            categoriesItem.style.overflow = "visible";
        })
        document.addEventListener("click", (event)=>{
            if (!btnsContainer.contains(event.target)){
                dropdownContent.classList.remove("dropdown-content--show");
            }
        })

        editBtn.addEventListener("click", ()=>{
            categoryModalTitle.innerText = "Editar Categoría";
            categoryModalName.value = `${category.name}`;
            categoryModalColor.value = `${category.color}`;
            mode = "editing";
            selectedCategoryId = category._id;
            categoryModal.classList.add("show");
        })
        
        dltBtn.addEventListener("click", async ()=>{
            selectedCategoryId = category._id;
            dltModal.classList.add("show");
            
            dltModalDltlBtn.addEventListener("click", async () =>{
                await fetch(`/api/category/${selectedCategoryId}`, {method: "DELETE" });
                dltModal.classList.remove("show");
                
                const userCategories = await (await fetch("/api/userCategories")).json();
                renderCategories(userCategories); 
                const categories = await (await fetch("/api/categories")).json();
                renderCategoriesFilter(categories);
                const stories = await getStoriesData();
                await renderStories(stories);
                selectedCategoryId = null;
            });
            
        })

        categoriesContainer.append(categoryContainer);



    });    
    
    updateSidebarItemsHeight()

    
}

function renderCategoriesFilter(categories){
    const categoriesFilter = document.querySelector(".categories-checkboxes");
    categoriesFilter.innerHTML = "";

    categories.forEach(category => {
        const categoryOption = document.createElement("div");
        categoryOption.classList = "category-checkbox"
        categoryOption.innerHTML = `
           <label> 
           <div class="filter-category-color category-color" style="background-color:${category.color};"></div>
           ${category.name} 
           <input type='checkbox' value=${category._id} name=categories>  
           </label>`
  
        categoriesFilter.append(categoryOption);
    });

    updateSidebarItemsHeight()
}

function updateSidebarItemsHeight(){
    items = document.querySelectorAll(".sidebar-item-content--show");
    items.forEach((item)=>{
        item.style.height = `${item.scrollHeight}px`;
    })
}

newCategoryBtn.addEventListener("click", () =>{
    categoryModalTitle.innerText = "Nueva Categoría";
    categoryModalName.value = null;
    categoryModalColor.value = "#000000";
    mode = "creating";
    categoryModal.classList.add("show");
});


//? CATEGORY MODAL ---------------------------------------------
categoryModal.addEventListener("click",(event)=>{
    if(!categoryModalFrame.contains(event.target)){
      categoryModal.classList.remove("show");
      selectedCategoryId = null;
      mode = null;
   }
});

cancelBtn.addEventListener("click", (event) =>{
    event.preventDefault()
    categoryModal.classList.remove("show");
    selectedCategoryId = null;
    mode = null;
});
confirmBtn.addEventListener("click", async (event) =>{
    // Submit del form para crear la story:
    
    
    if (categoryModalName.value != "") {
        event.preventDefault()
        
        const categoryForm = {
            "name":categoryModalName.value,
            "color":categoryModalColor.value,
        }
        
        if (mode == "creating"){
            const payload = new URLSearchParams(categoryForm);
            await fetch("/api/categories",{
                method:"POST",
                body: payload
            });
            categoryModal.classList.remove("show");
            const userCategories = await (await fetch("/api/userCategories")).json();
            renderCategories(userCategories); 
            const categories = await (await fetch("/api/categories")).json();
            renderCategoriesFilter(categories);
        }
        
        else if (mode == "editing"){
            await fetch(`/api/category/${selectedCategoryId}`,{
                method:"PUT",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(categoryForm)
            });
            selectedCategoryId = null;
            categoryModal.classList.remove("show");
            const userCategories = await (await fetch("/api/userCategories")).json();
            renderCategories(userCategories);
            const categories = await (await fetch("/api/categories")).json();
            renderCategoriesFilter(categories);
            const stories = await getStoriesData();
            await renderStories(stories);
        }
    }
});
