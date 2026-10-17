// script.js - MalotiTrails Lesotho Tourism Website
// Web Design 1 - Assignment 2
// Features: 1) dark mode  2) dynamic destination cards  3) search  4) filter
//           5) gallery + modal  6) form validation  7) cost calculator  8) localStorage


// ===== 1. DARK / LIGHT MODE (saved with localStorage) =====
var darkBtn = document.getElementById("darkBtn");

// check if the user chose dark mode before
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  darkBtn.textContent = "Light Mode";
}

darkBtn.addEventListener("click", function () {
  document.body.classList.toggle("dark");

  if (document.body.classList.contains("dark")) {
    localStorage.setItem("theme", "dark");
    darkBtn.textContent = "Light Mode";
  } else {
    localStorage.setItem("theme", "light");
    darkBtn.textContent = "Dark Mode";
  }
});


// ===== 2, 3, 4. DESTINATIONS (dynamic cards, search and filter) =====
var destinations = [
  {
    name: "Maletsunyane Falls",
    place: "Semonkong",
    category: "water",
    image: "maletsunyane.jpg",
    text: "A tall waterfall that drops into a rocky green valley near Semonkong."
  },
  {
    name: "Katse Dam",
    place: "Central highlands",
    category: "water",
    image: "katse.jpg",
    text: "A big dam surrounded by mountains with very nice views."
  },
  {
    name: "Sani Pass",
    place: "Eastern highlands",
    category: "mountain",
    image: "sani1.jpg",
    text: "A steep mountain road with amazing views of the high peaks."
  },
  {
    name: "Thaba Bosiu",
    place: "Near Maseru",
    category: "culture",
    image: "thaba.jpg",
    text: "An important mountain in Basotho history. King Moshoeshoe I lived here."
  }
];

var destGrid = document.getElementById("destGrid");
var currentCategory = "all";

function showDestinations() {
  var searchBox = document.getElementById("searchBox");
  var searchText = searchBox.value.toLowerCase();
  var html = "";
  var count = 0;

  for (var i = 0; i < destinations.length; i++) {
    var d = destinations[i];

    // check the category filter
    var categoryOk = (currentCategory === "all" || d.category === currentCategory);

    // check the search text
    var searchOk = (d.name.toLowerCase().includes(searchText) ||
                    d.place.toLowerCase().includes(searchText) ||
                    d.text.toLowerCase().includes(searchText));

    if (categoryOk && searchOk) {
      html += '<div class="col-12 col-md-6 col-lg-3">';
      html += '<article class="card">';
      html += '<img src="' + d.image + '" class="card-img-top" alt="' + d.name + '">';
      html += '<div class="card-body">';
      html += '<h3 class="card-title h5">' + d.name + '</h3>';
      html += '<p class="card-text">' + d.text + '</p>';
      html += '<p><small>Location: ' + d.place + '</small></p>';
      html += '<span class="badge bg-secondary">' + d.category + '</span>';
      html += '</div></article></div>';
      count++;
    }
  }

  destGrid.innerHTML = html;

  // show the alert if nothing was found
  var noResult = document.getElementById("noResult");
  if (count === 0) {
    noResult.classList.remove("d-none");
  } else {
    noResult.classList.add("d-none");
  }
}

if (destGrid) {
  showDestinations();

  document.getElementById("searchBox").addEventListener("keyup", showDestinations);

  var filterButtons = document.querySelectorAll(".filter-area button");
  for (var i = 0; i < filterButtons.length; i++) {
    filterButtons[i].addEventListener("click", function () {
      currentCategory = this.getAttribute("data-cat");

      // change which button looks active
      for (var j = 0; j < filterButtons.length; j++) {
        filterButtons[j].classList.remove("btn-dark");
        filterButtons[j].classList.add("btn-outline-dark");
      }
      this.classList.remove("btn-outline-dark");
      this.classList.add("btn-dark");

      showDestinations();
    });
  }
}


// ===== 5. IMAGE GALLERY WITH MODAL, NEXT AND PREVIOUS =====
var galleryImages = document.querySelectorAll(".gallery-img");
var currentImage = 0;

function showImage(num) {
  // go back to the start / end if we pass the limit
  if (num < 0) {
    num = galleryImages.length - 1;
  }
  if (num >= galleryImages.length) {
    num = 0;
  }
  currentImage = num;

  var img = galleryImages[currentImage];
  document.getElementById("modalImage").src = img.src;
  document.getElementById("modalImage").alt = img.alt;
  document.getElementById("modalCaption").textContent = img.alt;
  document.getElementById("imageCount").textContent = "Photo " + (currentImage + 1) + " of " + galleryImages.length;
}

if (galleryImages.length > 0) {
  var photoModal = new bootstrap.Modal(document.getElementById("photoModal"));

  for (var i = 0; i < galleryImages.length; i++) {
    galleryImages[i].addEventListener("click", function () {
      // find which picture was clicked
      for (var k = 0; k < galleryImages.length; k++) {
        if (galleryImages[k] === this) {
          showImage(k);
        }
      }
      photoModal.show();
    });
  }

  document.getElementById("nextBtn").addEventListener("click", function () {
    showImage(currentImage + 1);
  });

  document.getElementById("prevBtn").addEventListener("click", function () {
    showImage(currentImage - 1);
  });
}


// ===== 6. FORM VALIDATION =====
// helper functions to show / remove errors
function showError(input, message) {
  input.classList.add("is-invalid");
  input.classList.remove("is-valid");
  input.nextElementSibling.textContent = message;
}

function showOk(input) {
  input.classList.remove("is-invalid");
  input.classList.add("is-valid");
}

// ----- booking form -----
var bookingForm = document.getElementById("bookingForm");

if (bookingForm) {
  // do not allow dates in the past
  var today = new Date().toISOString().split("T")[0];
  document.getElementById("date").min = today;

  // show a welcome message if the name was saved before (localStorage)
  var savedName = localStorage.getItem("username");
  if (savedName) {
    var welcome = document.getElementById("welcomeMsg");
    welcome.textContent = "Welcome back, " + savedName + "!";
    welcome.classList.remove("d-none");
    document.getElementById("fullName").value = savedName;
  }

  bookingForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var valid = true;

    var fullName = document.getElementById("fullName");
    var email = document.getElementById("email");
    var phone = document.getElementById("phone");
    var destination = document.getElementById("destination");
    var date = document.getElementById("date");
    var people = document.getElementById("people");

    // name
    if (fullName.value.trim().length < 2) {
      showError(fullName, "Please enter your full name (at least 2 letters).");
      valid = false;
    } else {
      showOk(fullName);
    }

    // email
    var emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,}$/;
    if (!emailPattern.test(email.value)) {
      showError(email, "Please enter a valid email address.");
      valid = false;
    } else {
      showOk(email);
    }

    // phone (numbers, spaces and + only)
    var phonePattern = /^[0-9 +]{8,15}$/;
    if (!phonePattern.test(phone.value)) {
      showError(phone, "Enter a valid phone number (8 to 15 digits).");
      valid = false;
    } else {
      showOk(phone);
    }

    // destination
    if (destination.value === "") {
      showError(destination, "Please choose a destination.");
      valid = false;
    } else {
      showOk(destination);
    }

    // date
    if (date.value === "" || date.value < today) {
      showError(date, "Please choose a date from today onwards.");
      valid = false;
    } else {
      showOk(date);
    }

    // number of people
    if (people.value < 1 || people.value > 30) {
      showError(people, "Number of people must be between 1 and 30.");
      valid = false;
    } else {
      showOk(people);
    }

    var successBox = document.getElementById("bookingSuccess");
    if (valid) {
      // save the name using localStorage
      localStorage.setItem("username", fullName.value.trim());
      successBox.classList.remove("d-none");
      successBox.textContent = "Thank you " + fullName.value.trim() + "! Your booking request was received.";
    } else {
      successBox.classList.add("d-none");
    }
  });
}


// ----- contact form -----
var contactForm = document.getElementById("contactForm");

if (contactForm) {
  contactForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var valid = true;

    var cName = document.getElementById("cName");
    var cEmail = document.getElementById("cEmail");
    var cSubject = document.getElementById("cSubject");
    var cMessage = document.getElementById("cMessage");

    if (cName.value.trim() === "") {
      showError(cName, "Name is required.");
      valid = false;
    } else {
      showOk(cName);
    }

    var emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,}$/;
    if (!emailPattern.test(cEmail.value)) {
      showError(cEmail, "Please enter a valid email address.");
      valid = false;
    } else {
      showOk(cEmail);
    }

    if (cSubject.value.trim() === "") {
      showError(cSubject, "Please enter a subject.");
      valid = false;
    } else {
      showOk(cSubject);
    }

    if (cMessage.value.trim().length < 10) {
      showError(cMessage, "Message must be at least 10 characters.");
      valid = false;
    } else {
      showOk(cMessage);
    }

    var successBox = document.getElementById("contactSuccess");
    if (valid) {
      successBox.classList.remove("d-none");
      successBox.textContent = "Your message was sent. We will reply soon!";
      contactForm.reset();
      // remove the green borders after reset
      var boxes = contactForm.querySelectorAll(".is-valid");
      for (var i = 0; i < boxes.length; i++) {
        boxes[i].classList.remove("is-valid");
      }
    } else {
      successBox.classList.add("d-none");
    }
  });
}


// ===== 7. BOOKING COST CALCULATOR =====
function calculateTotal() {
  var price = Number(document.getElementById("tripType").value);
  var people = Number(document.getElementById("people").value);
  var total = price * people;

  document.getElementById("totalCost").textContent = "M" + total;
}

if (document.getElementById("tripType")) {
  calculateTotal();
  document.getElementById("tripType").addEventListener("change", calculateTotal);
  document.getElementById("people").addEventListener("input", calculateTotal);
}
