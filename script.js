let books = JSON.parse(localStorage.getItem("books")) || [];

function saveToLocalStorage() {
  localStorage.setItem("books", JSON.stringify(books));
  console.log("Books saved to localStorage:", books);
}

function generateGenres() {
  const genres = [
    "Thriller",
    "Action",
    "Comedy",
    "Fiction",
    "Non-fiction",
    "Horror",
    "Drama",
    "Novel",
    "Narrative",
    "Mystery",
  ];
  return genres[Math.floor(Math.random() * genres.length)];
}

async function getBook() {
  // Only fetch if no books exist in local storage
  // if (books.length > 0) {
  //   console.log("Books already exist, skipping API fetch:", books);
  //   return;
  // }

  try {
    const response = await fetch("https://openlibrary.org/search.json?q=book");
    const data = await response.json();
    const docs = data.docs.slice(0, 20);

    books = docs.map(element => ({
      title: element.title || "Untitled",
      author: element.author_name || ["Unknown Author"],
      image: element.cover_i ? `https://covers.openlibrary.org/b/id/${element.cover_i}-M.jpg` : "no-cover",
      genres: generateGenres(),
      borrowed: false,
      borrowedBy: null,
    }));

    saveToLocalStorage();
    console.log("Fetched books from API:", books);
  } catch (error) {
    console.log("Failed to fetch books:", error);
    alert("Failed to load books. Please try again later.");
  }
}

function getDatas(filter = "", genre = "") {
  const home = document.querySelector(".home");
  const bookBorrowDisplay = document.querySelector(".bookRow");

  home.innerHTML = "";
  bookBorrowDisplay.style.display = "none";

  const currentUser = JSON.parse(localStorage.getItem("loggedInUser"));

  const filteredBooks = books.filter(book => {
    const matchesText = book.title.toLowerCase().includes(filter.toLowerCase()) ||
      book.genres.toLowerCase().includes(filter.toLowerCase());
    const matchesGenre = genre === "" || book.genres === genre;
    return matchesText && matchesGenre;
  });

  console.log("Filtered books:", filteredBooks);

  if (filteredBooks.length === 0) {
    home.innerHTML = "<p>No books found matching your search.</p>";
    return;
  }

  filteredBooks.forEach(book => {
    const shelf = document.createElement("div");
    shelf.classList.add("shelf");

    const statusText = book.borrowed
      ? (book.borrowedBy === currentUser?.email ? "Borrowed by you" : "Not Available")
      : "Available";

    const imageSrc = book.image && book.image !== "no-cover" ? book.image : "https://via.placeholder.com/150";

    shelf.innerHTML = `
      <img src="${imageSrc}" alt="${book.title}" onerror="this.src='https://via.placeholder.com/150'">
      <h3>${book.title}</h3>
      <h5>${book.author[0]}</h5>
      <p>${book.genres}</p>
      <p class="status">${statusText}</p>
      <button class="available" style="display: ${book.borrowed ? "none" : "inline-block"}">Borrow</button>
      <button class="borrow" style="display: ${book.borrowed ? "inline-block" : "none"}">Return</button>
    `;

    home.appendChild(shelf);

    const availableBtn = shelf.querySelector(".available");
    const returnBtn = shelf.querySelector(".borrow");

    availableBtn.addEventListener("click", () => {
      if (!currentUser) return alert("Please log in to borrow books");

      book.borrowed = true;
      book.borrowedBy = currentUser.email;
      saveToLocalStorage();
      getDatas(filter, genre);
      alert(`You borrowed: ${book.title}`);
    });

    returnBtn.addEventListener("click", () => {
      if (!currentUser || book.borrowedBy !== currentUser.email) {
        return alert("You can only return books you borrowed.");
      }

      book.borrowed = false;
      book.borrowedBy = null;
      saveToLocalStorage();
      getDatas(filter, genre);
      alert(`You returned: ${book.title}`);
    });
  });
}

const myBook = document.getElementById('myBook');
myBook.addEventListener('click', function () {
  const currentUser = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!currentUser) return alert("Please log in first");

  const borrowedBooks = books.filter(book => book.borrowedBy === currentUser.email);

  const bookRow = document.getElementById('bookRow');
  const home = document.querySelector(".home");
  home.innerHTML = "";
  bookRow.innerHTML = "";
  document.querySelector('.bookRow').style.display = "block";

  console.log("Borrowed books:", borrowedBooks);

  if (borrowedBooks.length === 0) return alert("You haven't borrowed any books.");

  borrowedBooks.forEach(book => {
    const bookShelf = document.createElement('section');
    const statusText = "Borrowed by you";
    
    const imageSrc = book.image && book.image !== "no-cover" ? book.image : "https://via.placeholder.com/150";

    bookShelf.classList.add('shelf');
    bookShelf.innerHTML = `
      <img src="${imageSrc}" alt="${book.title}" onerror="this.src='https://via.placeholder.com/150'">
      <h3>${book.title}</h3>
      <h5>${book.author[0]}</h5>
      <p>${book.genres}</p>
      <p class="status">${statusText}</p>
      <button class="return-book">Return Book</button>
    `;
    
    bookRow.appendChild(bookShelf);

    const returnBtn = bookShelf.querySelector(".return-book");
    returnBtn.addEventListener("click", () => {
      book.borrowed = false;
      book.borrowedBy = null;
      saveToLocalStorage();
      alert(`You returned: ${book.title}`);
      myBook.click();
    });
  });
});

window.addEventListener("DOMContentLoaded", async () => {
  await getBook();
  console.log("Initial books loaded:", books);

  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  const loginLink = document.getElementById("loginLink");
  const logoutBtn = document.getElementById("logoutBtn");
  const userInfo = document.getElementById("userInfo");
  const info = document.getElementById("info");

  if (user) {
    loginLink.style.display = "none";
    logoutBtn.style.display = "inline-block";
    info.addEventListener("click", () => {
      userInfo.innerHTML = `<h3>${user.name}</h3><p>${user.email}</p>`;
    });
  } else {
    loginLink.style.display = "inline-block";
    logoutBtn.style.display = "none";
  }

  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("loggedInUser");
     if (!confirm("Are You Sure That You Want To Log Out")) {
      return
    } else{
    alert("Logged out successfully");
    window.location.href = "./login.html";
    }
  });

  const bookDisplay = document.getElementById("books");
  bookDisplay.addEventListener("click", () => getDatas());

  const searchBtn = document.getElementById("searchBtn");
  const searchInput = document.getElementById("searchInput");
  const genreFilter = document.getElementById("genreFilter");

  searchBtn.addEventListener("click", () => getDatas(searchInput.value, genreFilter.value));
  searchInput.addEventListener("input", () => getDatas(searchInput.value, genreFilter.value));
  genreFilter.addEventListener("change", () => getDatas(searchInput.value, genreFilter.value));
});

const body = document.getElementById("body");
const light = document.getElementById('light');
const dark = document.getElementById('dark');

light.addEventListener('click', function(){
  // alert('hdhgdyu');
  dark.style.display =" block";
  light.style.display =" none"
  body.classList.remove('dark');
  theme.push(body)
});

dark.addEventListener('click', function(){
  // alert('hdhgdyu');
  dark.style.display =" none";
  light.style.display =" block"
  body.classList.add('dark');
  theme.push(body)
})

const dates = document.getElementById("date");
let date = new Date();
date = date.getFullYear();
dates.innerHTML = date;