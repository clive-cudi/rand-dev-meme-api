const { db } = require('../config');
const { supabase } = require('../supabase.config');
const BASE_PATH = 'pictures';
const { Blob } = require('node:buffer')

const getRandomMeme = async (req, res) => {
    try {
        // const memes = (await supabase.storage.from('memes').list('pictures')).data ?? [];
        const memes = await db.getData('/memes');

        const randomIndex = getRandomInt(memes.length);

        const signed = (await supabase.storage.from('memes').createSignedUrl(`${BASE_PATH}/${memes[randomIndex].name}`, 60)).data?.signedUrl ?? "_";

        return res.status(200).json({success: true, payload: {url: signed, ...memes[randomIndex]}});
    } catch(err) {
        console.log(err);
        return res.status(400).send({
            success: false,
        })
    }
}

const getRandomMemeURL = async (req, res) => {
    try {
        /**
         * @type {"url" | "object"}
         */
        const mode = req.query?.mode ?? "url"
        // const memes = (await supabase.storage.from('memes').list('pictures')).data ?? [];
        const memes = await db.getData('/memes');

        const randomIndex = getRandomInt(memes.length);
        
        const filePath = `${BASE_PATH}/${memes[randomIndex].name}`;

        // const signed = (await supabase.storage.from('memes').createSignedUrl(filePath, 60)).data?.signedUrl ?? "_";
        switch (mode) {
            case 'object':
                const {data, error} = (await supabase.storage.from('memes').download(filePath));

                if (error) {
                    throw error;
                }
                
                const objectStream = require('stream').Readable.from(Buffer.from(await data.arrayBuffer()));

                res.setHeader('Content-Disposition', `inline; filename="${filePath}"`);
                res.setHeader('Content-Type', data.type);

                // disabling cache
                res.header('Pragma', 'no-cache');
                res.header('Expires', '0');
                res.header('Cache-Control', 'no-cache, no-store, must-revalidate');

                return objectStream.pipe(res);
            case 'url':
                const signed = (await supabase.storage.from('memes').createSignedUrl(filePath, 60)).data?.signedUrl ?? "_";
                return res.status(200).send(signed);
        }
    } catch(err) {
        console.log(err);
        return res.status(400).send(String(err));
    }
}

const syncMemes = async (req, res) => {
    try {
        // get all memes
        const memes = (await supabase.storage.from('memes').list('pictures'))?.data ?? [];

        await db.push('/memes', memes);

        return res ? res.status(200).json({success: true, message: "successfully synced local db"}) : memes;
    } catch(err) {
        console.log(err);
        return res ? res.status(400).send({
            success: false,
            message: "Failed to sync local DB"
        }) : [];
    }
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}


module.exports = {
    getRandomMeme,
    getRandomMemeURL,
    syncMemes
}