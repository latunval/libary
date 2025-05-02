const user = JSON.parse(localStorage.getItem("loggedInUser"));
if (!user || user.email !== "valentino@gmail.com" || user.password1 !== "Valentino1") {
  alert("Access denied");
  window.location.href = "./login.html";
}

let users = JSON.parse(localStorage.getItem("users")) || [];
let books = JSON.parse(localStorage.getItem("books")) || [];
let theme = JSON.parse(localStorage.getItem("theme")) || [];


function saveAll() {
  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("books", JSON.stringify(books));
  localStorage.setItem("theme", JSON.stringify(theme));

}

function renderUsers() {
  const userList = document.getElementById("userList");
  userList.innerHTML = "";
  users.forEach((u, index) => {
    const div = document.createElement("div");
    div.className = "col-md-6";
    div.innerHTML = `
      <div class="card p-3 shadow-sm">
        <p><strong>${u.name}</strong> - ${u.email}</p>
        <button onclick="deleteUser(${index})">Delete</button>
      </div>
    `;
    userList.appendChild(div);
  });
}

window.deleteUser = function(index) {
  if (confirm("Are you sure you want to delete this user?")) {
    users.splice(index, 1);
    saveAll();
    renderUsers();
  }
};


function renderBooks() {
  const bookList = document.getElementById("bookList");
  bookList.innerHTML = "";
  books.forEach((book, index) => {
    const div = document.createElement("div");
    div.className = "col-md-6";
    div.innerHTML = `
      <div class="card p-3 shadow-sm">
        <p><strong>${book.title}</strong> by ${book.author[0]} — ${book.genres} 
          ${book.borrowed ? `<span class="text-danger">(Borrowed by ${book.borrowedBy})</span>` : ""}
        </p>
        <button onclick="editUser(${index})">Edit</button>
        <button onclick="deleteBook(${index})">Delete</button>
      </div>
    `;
    bookList.appendChild(div);
  });
}

window.deleteBook = function(index) {
  if (confirm("Are you sure you want to delete this book?")) {
    books.splice(index, 1);
    saveAll();
    renderBooks();
  }
};
window.editUser = function(index) {
  const book = books[index]; // Get the book to edit
  const newTitle = prompt("Edit Title:", book.title);
  const newAuthor = prompt("Edit Author:", book.author[0]);
  const newGenre = prompt("Edit Genre:", book.genres);

  if (newTitle && newAuthor && newGenre) {
    books[index] = {
      ...book,
      title: newTitle.trim(),
      author: [newAuthor.trim()],
      genres: newGenre.trim(),
    };

    saveAll(); // Save updated books to localStorage
    renderBooks(); // Re-render the books in the admin interface
    alert("Book updated successfully!");
  } else {
    alert("Edit canceled or invalid input.");
  }
};
function validateBookInputs(title, author, genre, image) {
  const errors = [];
  if (!title.trim()) errors.push({ field: "bookTitle", message: "Title is required" });
  if (!author.trim()) errors.push({ field: "bookAuthor", message: "Author is required" });
  if (!genre) errors.push({ field: "bookGenre", message: "Genre is required" });
  if (image && !/^https?:\/\/.+/i.test(image)) {
    errors.push({ field: "bookImage", message: "Invalid image URL (must start with http:// or https://)" });
  }
  return errors;
}

function showError(inputId, message) {
  const input = document.getElementById(inputId);
  const errorElement = document.getElementById(`${inputId.replace('book', '').toLowerCase()}Error`);
  input.classList.add("error");
  errorElement.textContent = message;
}

function clearErrors() {
  ["bookTitle", "bookAuthor", "bookGenre", "bookImage"].forEach(id => {
    const input = document.getElementById(id);
    const errorElement = document.getElementById(`${id.replace('book', '').toLowerCase()}Error`);
    if (input && errorElement) {
      input.classList.remove("error");
      errorElement.textContent = "";
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const addBookForm = document.getElementById("addBookForm");
  addBookForm.addEventListener("submit", e => {
    e.preventDefault();
    const title = document.getElementById("bookTitle").value;
    const author = document.getElementById("bookAuthor").value;
    const genre = document.getElementById("bookGenre").value;
    const image = document.getElementById("bookImage").value;

    clearErrors();
    const errors = validateBookInputs(title, author, genre, image);
    if (errors.length > 0) {
      errors.forEach(error => showError(error.field, error.message));
      return;
    }

    books.push({
      title: title.trim(),
      author: [author.trim()],
      genres: genre,
      image: image ? image : "no-cover",
      borrowed: false,
      borrowedBy: null
    });

    saveAll();
    renderBooks();
    alert("Book added successfully");
    addBookForm.reset();
  });

  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("loggedInUser");
   
    if (!confirm("Are You Sure That You Want To Log Out")) {
      return
    } else{
    alert("Logged out successfully");
    window.location.href = "./login.html";
    }
  });

  const userInfo = document.getElementById("userInfo");
  const info = document.getElementById("info");
  info.addEventListener("click", () => {
    userInfo.innerHTML = `<h3>${user.name}</h3><p>${user.email}</p>`;
  });

  renderUsers();
  renderBooks();
});

const body = document.getElementById("body");
// const footer = document.getElementById("footer");
const light = document.getElementById('light');
const dark = document.getElementById('dark');

light.addEventListener('click', function(){
  // alert('hdhgdyu');
  dark.style.display =" block";
  light.style.display =" none"
  body.classList.remove('dark');
footer.classList.remove('dark');
saveAll()
});

dark.addEventListener('click', function(){
  // alert('hdhgdyu');
  dark.style.display =" none";
  light.style.display =" block"
  body.classList.add('dark');
  footer.classList.add('dark');
  saveAll()
})
const dates = document.getElementById("date");
let date = new Date();
date = date.getFullYear();
dates.innerHTML = date;
