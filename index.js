document.addEventListener("DOMContentLoaded", () => {
    const apiUrl = "https://api.quotable.io/random";
    const unsplashUrl = "https://source.unsplash.com/1920x1080/?quote";

    const quoteText = document.getElementById("quoteText");
    const author = document.getElementById("author");
    const likeButton = document.getElementById("likeButton");
    const likeCountSpan = document.getElementById("likeCount");
    const commentInput = document.getElementById("commentInput");
    const addCommentButton = document.getElementById("addCommentButton");
    const commentsList = document.getElementById("commentsList");
    const getQuoteButton = document.getElementById("getQuoteButton");
    const prevQuoteButton = document.getElementById("prevQuoteButton");

    const quoteContainer = document.getElementById("quoteContainer");
    const quoteImage = document.createElement("img");
    quoteImage.id = "quoteImage";
    quoteImage.alt = "Quote Image";
    quoteContainer.appendChild(quoteImage);

    // Initialize quotes data from localStorage or set an empty array if it doesn't exist
    let quotes = JSON.parse(localStorage.getItem("quotes")) || [];
    let currentQuoteIndex = -1;

    likeButton.addEventListener("click", () => {
        if (currentQuoteIndex >= 0) {
            quotes[currentQuoteIndex].likeCount++;
            likeCountSpan.textContent = quotes[currentQuoteIndex].likeCount;

            // Save the updated quotes data to localStorage
            localStorage.setItem("quotes", JSON.stringify(quotes));
        }
    });

    addCommentButton.addEventListener("click", () => {
        const comment = commentInput.value;
        if (comment.trim() !== "" && currentQuoteIndex >= 0) {
            quotes[currentQuoteIndex].comments.push(comment);
            const listItem = document.createElement("li");
            listItem.textContent = comment;
            commentsList.appendChild(listItem);
            commentInput.value = "";

            // Save the updated quotes data to localStorage
            localStorage.setItem("quotes", JSON.stringify(quotes));
        }
    });

    getQuoteButton.addEventListener("click", () => {
        fetchRandomQuote();
    });

    prevQuoteButton.addEventListener("click", () => {
        if (currentQuoteIndex > 0) {
            currentQuoteIndex--;
            displayQuote(currentQuoteIndex);
        } else {
            alert("No previous quotes available.");
        }
    });

    function fetchRandomQuote() {
        fetch(apiUrl)
            .then((response) => response.json())
            .then((data) => {
                const { content, author: quoteAuthor } = data;
                quoteText.textContent = content;
                author.textContent = `- ${quoteAuthor}`;

                fetch(unsplashUrl)
                    .then((response) => {
                        quoteImage.src = response.url;
                    })
                    .catch((error) => {
                        console.error("Error fetching image:", error);
                    });

                currentQuoteIndex = quotes.length;
                quotes.push({ content, likeCount: 0, comments: [] });
                likeCountSpan.textContent = quotes[currentQuoteIndex].likeCount;
                commentsList.innerHTML = "";

                // Save the updated quotes data to localStorage
                localStorage.setItem("quotes", JSON.stringify(quotes));
            })
            .catch((error) => {
                console.error("Error fetching quote:", error);
            });
    }

    function displayQuote(index) {
        if (index >= 0 && index < quotes.length) {
            quoteText.textContent = quotes[index].content;
            likeCountSpan.textContent = quotes[index].likeCount;
            commentsList.innerHTML = "";
            quotes[index].comments.forEach((comment) => {
                const listItem = document.createElement("li");
                listItem.textContent = comment;
                commentsList.appendChild(listItem);
            });
        }
    }

    fetchRandomQuote();
});