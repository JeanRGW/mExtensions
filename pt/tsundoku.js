var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as cheerio from "cheerio";
import lazyParseStatus from "../../utils/lazyParseStatus.js";
const name = "Tsundoku Traduções";
const author = "JeanRGW";
const fileName = "tsundoku.js";
const lang = "pt";
const path = `/extensions/${lang}/${fileName}`;
const homePage = () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch("https://tsundoku.com.br/novels/");
    const html = yield response.text();
    const $ = cheerio.load(html);
    const novels = [];
    $(".listupd > div > div > a").each((i, elm) => {
        const novel = {
            name: $(elm).attr("title"),
            url: $(elm).attr("href"),
            coverUrl: $(elm).find(".limit > img").attr("src"),
        };
        novels.push(novel);
    });
    return novels;
});
const loadNovel = (novelUrl) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch(novelUrl);
    const html = yield response.text();
    const $ = cheerio.load(html);
    const name = $(".entry-title").text();
    const description = $(".div_principal > p:nth-child(1)").text();
    const status = $("div.imptdt:nth-child(1) > i:nth-child(1)").text(); // gonna before return;
    const chapters = [];
    $("#chapterlist > ul:nth-child(1) > li").each((i, el) => {
        const url = $(el).find("div > div > a").attr("href");
        if (typeof url !== "string") {
            throw new Error("Invalid URL type");
        }
        const chapter = {
            name: $(el).attr("data-num") || i.toString(),
            url: url,
        };
        chapters.push(chapter);
    });
    let novel = {
        chapters: chapters,
        description: description,
        name: name,
        status: lazyParseStatus(status),
    };
    return novel;
});
const loadChapter = (chapterUrl) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch(chapterUrl);
    const html = yield response.text();
    const $ = cheerio.load(html);
    return {
        title: $(".entry-title").text(),
        text: $(".div_principal").text(),
    };
});
const extension = {
    author: author,
    fileName: fileName,
    lang: lang,
    name: name,
    version: "1.0",
    url: "https://tsundoku.com.br/",
    homePage: homePage,
    loadChapter: loadChapter,
    loadNovel: loadNovel,
};
export default extension;
