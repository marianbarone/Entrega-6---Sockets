import { Router } from "express";
import yargs from "yargs/yargs";
import os from "os";


const router = Router();

const args = yargs.argv

router.get("/", (req, res) => {

    const info = {
        args: `${process.argv.slice(2)}`,
        platform: process.platform,
        version: process.version,
        rss: process.memoryUsage().rss,
        path: process.argv[0],
        pid: process.pid,
        folder: process.argv[1],
        cpus: os.cpus().length,

    }

    console.log(info);

    res.render("info.ejs", info);
});

export default router;