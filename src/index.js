import cheerio from 'cheerio';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import urlParser from 'url';

const visited = {};
const URL = "http://stevescooking.blogspot.com/";

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

    const imageUrls = $('img').map((i, link) => 
        link.attribs.src
    ).get();

    imageUrls.forEach((imageUrl) => {
        fetch(getValidLink(imageUrl)).then((response) => {
            const filename = path.basename(imageUrl);
            const dest = fs.createWriteStream(`images/${filename}`);
            response.body.pipe(dest);
        })
    })

    const { host } = urlParser.parse(url);
    
    links.filter((link) => link.includes(host)).forEach((link) => {
        fetchHTML({
            url: getValidLink(link)
        })
    })
}

fetchHTML({
    url: URL
})