// DOM Elements
const videoContainer = document.getElementById("video-container");
const searchBar = document.getElementById("search-bar");

// API Endpoint
const API_URL = "https://api.freeapi.app/api/v1/public/youtube/videos";

// Store videos for filtering
let allVideos = [];

// Fetch videos from the API
async function fetchVideos() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        console.log("API Response:", data); // Log the response for debugging

        // Check if the API response is successful and contains videos
        if (data.success === true && data.data && data.data.data) {
            // Extract the video items from data.data.data
            allVideos = data.data.data.map(item => item.items); // Map to the items object
            displayVideos(allVideos);
        } else {
            throw new Error("No videos found in the API response");
        }
    } catch (error) {
        console.error("Error fetching videos:", error);
        videoContainer.innerHTML = "<p>Failed to load videos. Please try again later.</p>";
    }
}

// Display videos in the grid
function displayVideos(videos) {
    videoContainer.innerHTML = ""; // Clear previous content

    if (videos.length === 0) {
        videoContainer.innerHTML = "<p>No videos found.</p>";
        return;
    }

    videos.forEach(video => {
        const videoCard = document.createElement("div");
        videoCard.classList.add("video-card");

        // Extract video details
        const thumbnail = video.snippet.thumbnails.medium.url;
        const title = video.snippet.title;
        const channel = video.snippet.channelTitle;
        const videoId = video.id;
        const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

        // Create video card HTML
        videoCard.innerHTML = `
            <img src="${thumbnail}" alt="${title}">
            <h3>${title}</h3>
            <p>${channel}</p>
        `;

        // Add click event to open video on YouTube
        videoCard.addEventListener("click", () => {
            window.open(videoUrl, "_blank");
        });

        videoContainer.appendChild(videoCard);
    });
}

// Filter videos based on search input (frontend filtering)
function filterVideos() {
    const searchTerm = searchBar.value.toLowerCase();

    const filteredVideos = allVideos.filter(video => {
        const title = video.snippet.title.toLowerCase();
        const channel = video.snippet.channelTitle.toLowerCase();
        return title.includes(searchTerm) || channel.includes(searchTerm);
    });

    displayVideos(filteredVideos);
}

// Event listener for search bar input
searchBar.addEventListener("input", filterVideos);

// Fetch and display videos on page load
fetchVideos();