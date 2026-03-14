import fs from 'fs';

// React emoji reactions
const emojiReactions = ['😊', '❤️', '😍', '😂', '😢'];

const getRandomEmoji = () => {
    return emojiReactions[Math.floor(Math.random() * emojiReactions.length)];
};

// Text rewriting in different styles
const rewriteText = (text, style) => {
    switch (style) {
        case 'uppercase':
            return text.toUpperCase();
        case 'lowercase':
            return text.toLowerCase();
        case 'italic':
            return `*${text}*`; // Example of markdown italic
        // Add more styles here
        default:
            return text;
    }
};

// Random romantic responses
const romanticResponses = [
    'You light up my world!',
    'You are my high point of every day!',
    'Together forever!',
    'You make my heart race!',
    'You are the missing piece of my puzzle!'
];

const getRandomRomanticResponse = () => {
    return romanticResponses[Math.floor(Math.random() * romanticResponses.length)];
};

// Combo mode
const comboMode = (text) => {
    const emoji = getRandomEmoji();
    const romanticResponse = getRandomRomanticResponse();
    const rewrittenText = rewriteText(text, 'uppercase'); // Example of using uppercase style
    return `${rewrittenText} ${emoji} ${romanticResponse}`;
};

export {getRandomEmoji, rewriteText, getRandomRomanticResponse, comboMode};