const sidebarBtns = document.querySelectorAll(".sidebar-btn--click");

sidebarBtns.forEach( btn =>{
    const btnContainer = btn.parentNode;
    const sidebarItemContent = btn.nextElementSibling;
    btn.addEventListener("click", ()=>{
        btn.classList.toggle("rotate-arrow");
        sidebarItemContent.classList.toggle("sidebar-item-content--show");

        if (sidebarItemContent.classList.contains("sidebar-item-content--show")){
            sidebarItemContent.style.height = `${sidebarItemContent.scrollHeight}px`;
        }
        else{
            sidebarItemContent.style.height = "0px";
            btnContainer.style.overflow = "hidden";
        }
    })
})