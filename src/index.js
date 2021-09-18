import fetch from 'node-fetch';

const fetchHTML = async ({ url }) => {
    const response = await fetch(url);
    const html = await response.text();
    console.log("html: ", html);
}

fetchHTML({
    url: "https://www.simplesite.com/"
})