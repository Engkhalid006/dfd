// متغيرات التخزين
const HISTORY_KEY = "watchHistory";
let currentMovie = {
    url: "",
    timestamp: 0
};

// تهيئة الصفحة
document.addEventListener("DOMContentLoaded", function() {
    loadMovieFromURL();
    loadWatchHistory();
    setupTimeTracker();
});

// تحميل الفيلم من الرابط المباشر
function loadMovieFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const movieURL = urlParams.get('url');

    if (movieURL) {
        currentMovie.url = movieURL;
        document.getElementById('movie-frame').src = movieURL;
        restorePlaybackTime(movieURL);
    } else {
        // يمكنك تعيين صفحة افتراضية أو رسالة خطأ
        document.getElementById('movie-frame').src = "about:blank";
    }
}

// تتبع وقت المشاهدة وحفظه
function setupTimeTracker() {
    const iframe = document.getElementById('movie-frame');
    setInterval(() => {
        if (currentMovie.url) {
            // تخزين الوقت الحالي (يمكن استخدام PostMessage للتواصل مع iframe إذا كان ذلك ممكناً)
            currentMovie.timestamp = Date.now();
            saveToHistory(currentMovie);
        }
    }, 5000); // يحفظ كل 5 ثوانٍ
}

// حفظ في سجل المشاهدة
function saveToHistory(movie) {
    let history = JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
    const existingIndex = history.findIndex(item => item.url === movie.url);

    if (existingIndex >= 0) {
        history[existingIndex] = movie;
    } else {
        history.push(movie);
    }

    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    loadWatchHistory();
}

// استعادة وقت المشاهدة السابق
function restorePlaybackTime(movieURL) {
    const history = JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
    const movie = history.find(item => item.url === movieURL);

    if (movie && movie.timestamp) {
        // يمكنك استخدام PostMessage لإرسال الوقت إلى iframe (إذا كان يدعم ذلك)
        console.log("استعادة الوقت: ", movie.timestamp);
    }
}

// تحميل سجل المشاهدة
function loadWatchHistory() {
    const history = JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = "";

    history.forEach(movie => {
        const item = document.createElement('div');
        item.className = 'history-item';
        item.textContent = new URL(movie.url).pathname.split('/').pop() || "فيلم بدون عنوان";
        item.onclick = () => {
            document.getElementById('movie-frame').src = movie.url;
            currentMovie.url = movie.url;
            restorePlaybackTime(movie.url);
        };
        historyList.appendChild(item);
    });
}
