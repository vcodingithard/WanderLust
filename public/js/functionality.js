(() => {
    'use strict'
    const forms = document.querySelectorAll('.needs-validation')
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated') 
      }, false)
    })
  })()

  let btn =document.querySelector("#navbtn");
  let nav=document.querySelector("nav");
  let navlinks=document.querySelector(".navlinks");
  let login=document.querySelector(".login")
  btn.addEventListener("click",()=>{
    try{
    if (nav.style.height =="fit-content") {
      nav.style.height = "3.5rem";  
      nav.classList.remove("col");
      navlinks.classList.remove("col");
      navlinks.classList.remove("display");
      login.classList.remove("col");
      login.classList.remove("display");
      
  } else {
      nav.style.height="fit-content";
      nav.classList.add("col");
      navlinks.classList.add("col");
      navlinks.classList.add("display");
      login.classList.add("col");
      login.classList.add("display");
      
  }}catch(err){
    console.log(err);
  }
  })
