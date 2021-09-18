import cheerio from 'cheerio';
import fetch from 'node-fetch';

const visited = {};
const URL = "https://www.amazon.in";

const getValidLink = (link) => {
    if(link.includes('http'))
        return link;
    if (link.startsWith('/'))
        return `${URL}${link}`;
    return `${URL}/${link}`;
}

const fetchHTML = async ({ url }) => {
    if(visited[url]) return;
    
    visited[url] = true;

    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);
    
    const links = $('a').map((i, link) => 
        link.attribs.href
    ).get();
    
    links.forEach((link) => {
        fetchHTML({
            url: getValidLink(link)
        })
    })
    console.log(links);
}

fetchHTML({
    url: URL
})