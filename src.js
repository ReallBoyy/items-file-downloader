const axios = require('axios');
const fs = require('fs');
const path = require('path');
const config = require("./config.json");

const url = config.url;

const fetch = async (id, paths) => {
    try {
        const response = await axios.get(url + paths);
        const c = 'cache/';
        const dirpath = path.dirname(paths);
        fs.mkdirSync(c+dirpath, { recursive: true });
        fs.writeFileSync(`${c}${paths}`, response.data, 'utf-8');
        console.log(`ItemID ${id}: status=200 [${url}${paths}]`);
        //console.log(response);
    } catch (error) {
        console.log(`ItemID ${id}: status=404 [${url}${paths}]`);
    }
}

async function ItemDownloads(id, paths) {
    const p = paths;
    const c = 'cache/'
    if (p.includes('GameData/')) {
        try {
            const response = await axios.get(url + paths);
            const dirs = path.dirname(paths);
            fs.mkdirSync(c + dirs, { recursive: true });
            fs.writeFileSync(c + dirs, response.data);
            console.log(`ItemID: ${id}: status=200 [${url}${paths}]`);
        } catch (error) {
            console.log(`ItemID: ${id}: status=404 [${url}${paths}]`);
        }
    }
    else if (p.includes('audio/') || p.includes('game/') || p.includes('interface/') || p.includes('nipon/')) {
        try {
            const response = await axios.get(url + paths, { responseType: 'arraybuffer' });
            const dirpath = path.dirname(paths);
            fs.mkdirSync(c + dirpath, { recursive: true });
            fs.writeFileSync(c+paths, response.data);
            console.log(`ItemID ${id}: status=200 [${url}${paths}]`);//console.log("Success download file, The program is still running do not close the program...");

        } catch (error) {
            console.log(`ItemID ${id}: status=404 [${url}${paths}]`);
        }
    }
   else {
        try {
            const response = await axios.get(`${url}game/${paths}`, { responseType: 'arraybuffer' });
            const dirpath = 'cache/game';
            fs.mkdirSync(dirpath, { recursive: true });
            fs.writeFileSync('cache/game/'+paths, response.data);
            console.log(`ItemID ${id}: status=200 [${url}game/${paths}]`);//console.log("Success download file, The program is still running do not close the program...");
        } catch (error) { console.log(`ItemID ${id}: status=404 [${url}game/${paths}]`); }
    }
}

const RunProgram = async () => {
    try {
        if (!fs.existsSync('items.json')) return console.log("items.json is not detected or it doesn't exists\nplease put your decoded items.dat to items.json in this folder");
        const data = fs.readFileSync('items.json', 'utf-8');
        const data2 = JSON.parse(data);
        const item = data2.items;
        console.log(`Success Load items.json\nitem size: ${item.length}\nitem data version: ${data2.version}\nProcessing...\n`);
       
        for (let i = 0; i < item.length; i++) {
            const file1 = item[i].texture;
            if (file1 !== "") await ItemDownloads(i, `${file1}`);
            if (item[i].extra_file !== "") {
                const file2 = item[i].extra_file;
                if (file2 !== "") await ItemDownloads(i, `${file2}`);
            }
            if (item[i].str_version_16 !== "") { 
                const file3 = item[i].str_version_16;
                await fetch(i, `GameData/ItemRenderers/${file3}`);
            }
        }
    } catch (error) { console.error(error); }
}

RunProgram();
//onsole.log("All file in items.json downloaded!");