const fs = require('fs');
const path = require('path');
const config = require("./db/config.json");
const { performance } = require('perf_hooks');

const url = config.url;
const headerUsed = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
  'Accept': '*/*',
  'Accept-Encoding': 'gzip, deflate, br',
  'Connection': 'keep-alive'
};

/**
 * @brief Download file from a specific path
 * @param {number|string} id - Reference to the item ID that the texture is currently downloading
 * @param {string} paths - File path included in "texture", "extra_file", or "str_version_16"
 * @returns {Promise<void>} Resolves when the file has been downloaded and saved
 */
const Download = async (id, paths) => {
    try {
        const res = await fetch(url + paths, { headers: headerUsed });
        if (!res.ok) return console.log(`ItemID ${id}: status=${res.status} [${url}${paths}]`)
        // Path to cache dir
        const c = 'cache/';
        const dirpath = path.dirname(paths);
        
        // Buffer files
        const buff = await res.arrayBuffer();
        const buffers = Buffer.from(buff);

        // Create file from buffer response
        fs.mkdirSync(c + dirpath, { recursive: true });
        fs.writeFileSync(c + paths, buffers);
        console.log(`ItemID ${id}: status=200 [${url}${paths}]`);
        
    } catch (error) {
        console.log(`ItemID ${id}: status=404 [${url}${paths}]`);
    }
}

/**
 * @brief Download file from a specific path
 * @param {number|string} id - Reference to the item ID that the texture is currently downloading
 * @param {string} paths - File path included in "texture", "extra_file", or "str_version_16"
 * @returns {Promise<void>} Resolves when the file has been downloaded and saved
 */
const ItemDownloads = async (id, paths) => {
    const p = paths;
    const c = 'cache/'
    if (p.includes('GameData/')) {
        try {
            const res = await fetch(url + paths, { headers: headerUsed });
            if (!res.ok) return console.log(`ItemID ${id}: status=${res.status} [${url}${paths}]`);

            // Buffer files
            const buff = await res.arrayBuffer();
            const buffers = Buffer.from(buff);

            // Create folder if path folder didn't exist
            const dirs = path.dirname(paths);
            fs.mkdirSync(c + dirs, { recursive: true });
            
            fs.writeFileSync(c + dirs, buffers);
            console.log(`ItemID: ${id}: status=200 [${url}${paths}]`);
        } catch (error) {
            console.log(`ItemID: ${id}: status=404 message="UNABLE TO FIND GAMEDATA DIRECTORY" [${url}${paths}]`);
        }
    }
    else if (p.includes('audio/') || p.includes('game/') || p.includes('interface/') || p.includes('nipon/')) {
        try {
            const res = await fetch(url + paths, { headers: headerUsed });
            if (!res.ok) return console.log(`ItemID ${id}: status=${res.status} [${url}${paths}]`);
            const dirpath = path.dirname(paths);
        
            // Buffer files
            const buff = await res.arrayBuffer();
            const buffers = Buffer.from(buff);
            
            fs.mkdirSync(c + dirpath, { recursive: true });
            fs.writeFileSync(c+paths, buffers);
            console.log(`ItemID ${id}: status=200 [${url}${paths}]`);

        } catch (error) {
            console.log(`ItemID ${id}: status=404 [${url}${paths}]`);
        }
    }
   else {
        try {
            const res = await fetch(`${url}game/${paths}`, { headers: headerUsed });
            if (!res.ok) return console.log(`ItemID ${id}: status=${res.status} [${url}${paths}]`);
            const buff = await res.arrayBuffer();

            const dirpath = 'cache/game';
            fs.mkdirSync(dirpath, { recursive: true });

            fs.writeFileSync('cache/game/' + paths, Buffer.from(buff));
            console.log(`ItemID ${id}: status=200 [${url}game/${paths}]`);
        } 
        catch (error) { console.log(`ItemID ${id}: status=404 [${url}game/${paths}]`); }
    }
}

/**
 * @brief Start the program execution
 * @returns {Promise<void>} Resolves when all item downloads and checks are complete
 */
async function RunProgram() {
    try {
        if (!fs.existsSync('items.json')) return console.log("items.json is not detected or it doesn't exists\nplease put your decoded items.dat to items.json in this folder");
        const data2 = JSON.parse(fs.readFileSync('./items.json', 'utf-8'));
        const item = data2.items;
        console.log(`Success Load items.json\nitem size: ${item.length}\nitem data version: ${data2.version}`);
        
        console.log("\nTesting performance");
        const start = performance.now();
        const restest = await fetch("https://github.com/ReallBoyy", { headers: headerUsed });
        await restest.arrayBuffer();
        const end = performance.now();
        console.log(`Connection Speed: ${(end - start).toFixed(2)}ms\n`);

        console.log("Starting. . .");
        
        for (let i = 0; i < item.length; i++) {
            const file1 = item[i].texture;
            if (file1 !== "") await ItemDownloads(i, `${file1}`);
            if (item[i].extra_file !== "") {
                const file2 = item[i].extra_file;
                if (file2 !== "") await ItemDownloads(i, `${file2}`);
            }
            if (item[i].str_version_16 !== "") { 
                const file3 = item[i].str_version_16;
                await Download(i, `GameData/ItemRenderers/${file3}`);
            }
        }
    } catch (error) { console.error(error); }
}

RunProgram();


