import { all_words } from "./words.js"

const canvas = document.querySelector("#game");
const ctx = canvas.getContext("2d");

const words = [];
const start = Date.now();
let current_input = "";
let last_word = Date.now();
let word_interval = 1500;
let word_speed = 5;
let max_word_len = 10;

const filtered = all_words.filter(word => word.length <= max_word_len);

let lives = 3;
let score = 0;

function clear_canvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
}

function show_message(text, text2) {
    clear_canvas();
    const textsz = ctx.measureText(text);
    const text2sz = ctx.measureText(text2);
    ctx.font = "32px sans-serif";
    ctx.fillText(text, (canvas.width / 2) - (textsz.width), (canvas.height / 2) - 16);
    ctx.fillText(text2, (canvas.width / 2) - (text2sz.width), (canvas.height / 2) + 16);
}

function create_listeners() {
    document.addEventListener("keydown", ev => {
        const char = ev.key;

        if (char === "Backspace") {
            if (ev.ctrlKey) {
                current_input = "";
            } else {
                current_input = current_input.slice(0, current_input.length - 1);
            }
        } else if (char === " " || char === "Enter") {
            for (let i = 0; i < words.length; i++) {
                if (words[i].word === current_input) {
                    score += words[i].word.length;
                    words.splice(i, 1);
                    break;
                }
            }

            current_input = "";
        } else if (char.length === 1) {
            current_input += char;
        }
    });
}

function draw_words() {
    for (let i = 0; i < words.length; i++) {
        if (words[i].x < 0) {
            lives--;
            words.splice(i, 1);
        }
        
        words[i].x -= word_speed / (words[i].word.length / 2);

        const word = words[i].word;

        if (current_input && word.startsWith(current_input)) {
            const matches = current_input;
            const measure = ctx.measureText(matches);
            ctx.fillStyle = "#00ff00";
            ctx.fillText(matches, words[i].x, words[i].y);
            ctx.fillStyle = "#ffffff";
            ctx.fillText(word.slice(matches.length), words[i].x + measure.width, words[i].y);
        } else {
            ctx.fillText(word, words[i].x, words[i].y);
        }
    }
}

function create_word() {
    words.push({
        x: canvas.width,
        y: (Math.random() * (canvas.height - 75)) + 75,
        word: filtered[Math.floor(Math.random() * filtered.length)]
    });
}

let frame_number = 0;
function frame(i) {
    frame_number++;

    if (lives === 0) {
        show_message("Game over.", "Score: " + score);
        return;
    }

    window.requestAnimationFrame(frame);
    clear_canvas();

    ctx.font = "21px sans-serif";
    ctx.fillText(current_input, 5, canvas.height - 21 / 2);
    ctx.fillText("Lives: " + lives, 5, 21);
    ctx.fillText("Score: " + score, 5, 21 * 2);
    ctx.font = "14px sans-serif";
    
    if (Date.now() > last_word + word_interval) {
        create_word();
        last_word = Date.now();
    }

    word_interval-=0.03;

    draw_words();
}

(async () => {
    create_listeners();

    ctx.strokeStyle = "#ffffff";
    ctx.fillStyle = "#ffffff";

    window.requestAnimationFrame(frame);
})();