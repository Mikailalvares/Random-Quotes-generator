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
    const quoteImage = document.getElementById("quoteImage");

    const quoteContainer = document.getElementById("quoteContainer");

    // Initialize quotes data from localStorage or set an empty array if it doesn't exist
    let quotes = JSON.parse(localStorage.getItem("quotes")) || [];
    let currentQuoteIndex = -1;

    // Function to fetch a random quote
    function fetchRandomQuote() {
        fetch(apiUrl)
            .then((response) => response.json())
            .then((data) => {
                const { content, author: quoteAuthor } = data;
                quoteText.textContent = content;
                author.textContent = `- ${quoteAuthor}`;

                // Fetch a random image for the quote
                fetch(unsplashUrl)
                    .then((response) => {
                        quoteImage.style.backgroundImage = `url(${response.url})`;
                    })
                    .catch((error) => {
                        console.error("Error fetching image:", error);
                    });

                // Update the current quote index and save it to localStorage
                currentQuoteIndex = quotes.length;
                quotes.push({ content, likeCount: 0, comments: [] });
                likeCountSpan.textContent = quotes[currentQuoteIndex].likeCount;
                commentsList.innerHTML = "";

                // Save the updated quotes data to localStorage
                localStorage.setItem("quotes", JSON.stringify(quotes));
            })
            .catch((error) => {
                console.error("Error fetching quote:", error);
                // You can display an error message to the user here
            });
    }

    // Function to handle liking a quote
    function handleLike() {
        if (currentQuoteIndex >= 0) {
            quotes[currentQuoteIndex].likeCount++;
            likeCountSpan.textContent = quotes[currentQuoteIndex].likeCount;

            // Save the updated quotes data to localStorage
            localStorage.setItem("quotes", JSON.stringify(quotes));
        }
    }

    // Function to handle adding a comment
    function handleComment() {
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
    }

    // Event listeners
    likeButton.addEventListener("click", handleLike);
    addCommentButton.addEventListener("click", handleComment);
    getQuoteButton.addEventListener("click", fetchRandomQuote);
    prevQuoteButton.addEventListener("click", () => {
        if (currentQuoteIndex > 0) {
            currentQuoteIndex--;
            displayQuote(currentQuoteIndex);
        } else {
            alert("No previous quotes available.");
        }
    });

    // Fetch a random quote when the page loads
    fetchRandomQuote();
});
