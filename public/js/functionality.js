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

let btn = document.querySelector("#navbtn");
let nav = document.querySelector("nav");
let navlinks = document.querySelector(".navlinks");
let login = document.querySelector(".login");
let belowNavbar = document.querySelector(".belowNavbar");
let price = document.querySelector(".switch");
console.log(price);

btn.addEventListener("click", () => {
try {
  if (nav.style.height === "fit-content") {
    // Collapse the navbar
    nav.style.height = "3.5rem";  
    nav.style.padding = "0rem"; 
    nav.classList.remove("col");
    navlinks.classList.remove("col");
    navlinks.classList.remove("display");
    login.classList.remove("col");
    login.classList.remove("display");
    belowNavbar.style.display = "inline";
    price.style.display = "none"; // Hide price when not fit-content
  } else {
    // Expand the navbar
    belowNavbar.style.display = "none";
    nav.style.padding = "1rem"; 
    nav.style.height = "fit-content"; // Set height to fit-content
    nav.classList.add("col");
    navlinks.classList.add("col");
    navlinks.classList.add("display");
    login.classList.add("col");
    login.classList.add("display");
    price.style.display = "inline"; // Show price when fit-content
  }
} catch (err) {
  console.log(err);
}
});
