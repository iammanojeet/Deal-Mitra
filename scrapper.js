import express from "express";
import axios from "axios";
import * as cheerio from "cheerio";
import puppeteer from "puppeteer";
import cors from "cors";

const app = express();
app.use(cors());
const port = 3001;

async function scrapeAmazon(url) {
  let browser;
  try {
    console.log("Fetching Amazon page with Axios...");
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      },
    });
    const $ = cheerio.load(data);

    const products = [];
    $(".s-result-item").each((i, el) => {
      const name = $(el).find("h2 span").text().trim() || "N/A";
      const priceText =
        $(el)
          .find(".a-price-whole")
          .text()
          .replace(/[^\d.]/g, "") || "0.0";
      const price = parseFloat(priceText);
      const rating =
        $(el)
          .find(".a-icon-alt")
          .text()
          .match(/\d+\.\d+/)?.[0] || "0.0";
      const reviews =
        $(el)
          .find(".a-size-small .a-link-normal")
          .text()
          .replace(/[^\d]/g, "") || "0";
      const imageUrl = $(el).find("img.s-image").attr("src") || "N/A";
      const productUrl = $(el).find("a.a-link-normal").attr("href")
        ? `https://www.amazon.in${$(el).find("a.a-link-normal").attr("href")}`
        : "N/A";

      if (name !== "N/A" && price !== 0 && imageUrl !== "N/A") {
        products.push({
          name,
          price,
          rating: parseFloat(rating),
          reviews: parseInt(reviews),
          image_url: imageUrl,
          product_url: productUrl,
        });
      }
    });

    if (products.length === 0) {
      browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();
      await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
      );
      await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });

      const dynamicProducts = await page.evaluate(() => {
        const items = Array.from(document.querySelectorAll(".s-result-item"));
        return items
          .map((item) => {
            try {
              const name =
                item.querySelector("h2 span")?.textContent.trim() || "N/A";
              const priceText =
                item.querySelector(".a-price-whole")?.textContent;
              const price = priceText
                ? parseFloat(priceText.replace(/[^\d.]/g, ""))
                : 0.0;
              const ratingText = item
                .querySelector(".a-icon-alt")
                ?.textContent.match(/\d+\.\d+/)?.[0];
              const rating = ratingText ? parseFloat(ratingText) : 0.0;
              const reviewsText = item
                .querySelector(".a-size-small .a-link-normal")
                ?.textContent.replace(/[^\d]/g, "");
              const reviews = reviewsText ? parseInt(reviewsText) : 0;
              const imageUrl = item.querySelector("img.s-image")?.src || "N/A";
              const productUrl = item.querySelector("a.a-link-normal")?.href
                ? `https://www.amazon.in${
                    item.querySelector("a.a-link-normal")?.href
                  }`
                : "N/A";

              return {
                name,
                price,
                rating,
                reviews,
                image_url: imageUrl,
                product_url: productUrl,
              };
            } catch (e) {
              console.error("Error parsing product:", e);
              return null;
            }
          })
          .filter(
            (item) =>
              item !== null &&
              item.name !== "N/A" &&
              item.price !== 0 &&
              item.image_url !== "N/A"
          );
      });

      return dynamicProducts.length > 0 ? dynamicProducts : products;
    }

    return products;
  } catch (e) {
    console.error("Amazon scraping error:", e);
    return [];
  } finally {
    if (browser) await browser.close();
  }
}

async function scrapeFlipkart(url) {
  let browser;
  try {
    console.log("Fetching Flipkart page with Axios...");
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      },
    });
    const $ = cheerio.load(data);

    const products = [];
    $(".cPHDOP.col-12-12,._1sdMkc.LFEi7Z,.slAVV4").each((i, el) => {
      const name = $(el).find(".KzDlHZ,.WKTcLC,.wjcEIp").text().trim() || "N/A";
      const priceText =
        $(el)
          .find(".Nx9bqj._4b5DiR,.Nx9bqj")
          .text()
          .replace(/[^\d.]/g, "") || "0.0";
      const price = parseFloat(priceText) || 0.0;
      const rating =
        $(el)
          .find(".XQDdHH")
          .text()
          .match(/\d+\.\d+/)?.[0] || "0.0";
      const reviews = $(el).find(".Wphh3N").text().match(/\d+/)?.[0] || "0";
      const imageUrl = $(el).find(".DByuf4,._53J4C-").attr("src") || "N/A";
      const productUrl = $(el).find("a.CGtC98,a.wjcEIp").attr("href")
        ? `https://www.flipkart.com${$(el)
            .find("a.CGtC98,a.wjcEIp")
            .attr("href")}`
        : "N/A";

      if (
        name !== "N/A" &&
        price !== 0 &&
        price <= 1000000 &&
        imageUrl !== "N/A"
      ) {
        products.push({
          name,
          price,
          rating: parseFloat(rating),
          reviews: parseInt(reviews),
          image_url: imageUrl,
          product_url: productUrl,
        });
      }
    });

    if (products.length === 0) {
      console.log(
        "No products found with Cheerio, falling back to Puppeteer..."
      );
      browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
        timeout: 60000,
      });
      const page = await browser.newPage();
      await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
      );
      await page.setViewport({ width: 1280, height: 800 });

      console.log(`Navigating to ${url}...`);
      await page.goto(url);

      await page
        .$$(".cPHDOP.col-12-12,._1sdMkc.LFEi7Z,.slAVV4")
        .catch((e) =>
          console.log("Parent container selector not found:", e.message)
        );
      await autoScroll(page);

      await page.screenshot({ path: "flipkart-debug.png", fullPage: true });

      const dynamicProducts = await page.evaluate(() => {
        const items = Array.from(document.querySelectorAll(".slAVV4"));
        console.log(`Found ${items.length} product containers`);
        return items
          .map((item) => {
            try {
              const name =
                item
                  .querySelector(".KzDlHZ,.WKTcLC,.wjcEIp")
                  ?.textContent.trim() || "N/A";
              const priceText =
                item
                  .querySelector(".Nx9bqj")
                  ?.textContent.replace(/[^\d.]/g, "") || "0.0";
              const price = parseFloat(priceText) || 0.0;
              const ratingText =
                item
                  .querySelector(".XQDdHH")
                  ?.textContent.match(/\d+\.\d+/)?.[0] || "0.0";
              const rating = parseFloat(ratingText) || 0.0;
              const reviewsText =
                item.querySelector(".Wphh3N")?.textContent.match(/\d+/)?.[0] ||
                "0";
              const reviews = reviewsText ? parseInt(reviewsText) : 0;
              const imageUrl =
                item.querySelector(".DByuf4,._53J4C-")?.src || "N/A";
              const productUrl = item.querySelector("a.CGtC98,a.wjcEIp")?.href
                ? `https://www.flipkart.com${
                    item.querySelector("a.CGtC98,a.wjcEIp")?.href
                  }`
                : "N/A";

              return {
                name,
                price,
                rating,
                reviews,
                image_url: imageUrl,
                product_url: productUrl,
              };
            } catch (e) {
              console.error("Error parsing Flipkart product:", e);
              return null;
            }
          })
          .filter(
            (item) =>
              item !== null &&
              item.name !== "N/A" &&
              item.price !== 0 &&
              item.price <= 1000000 &&
              item.image_url !== "N/A"
          );
      });

      console.log(`Puppeteer found ${dynamicProducts.length} products`);
      return dynamicProducts.length > 0 ? dynamicProducts : products;
    }

    return products;
  } catch (e) {
    console.error("Flipkart scraping error:", e);
    return [];
  } finally {
    if (browser) {
      console.log("Closing Puppeteer browser...");
      await browser.close();
    }
  }
}

async function scrapeZepto(url) {
  let browser;
  try {
    console.log("Fetching Zepto page with Axios...");
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      },
    });
    const $ = cheerio.load(data);

    const products = [];
    $("a.relative.z-0.my-3.rounded-t-xl.rounded-b-md.group").each((i, el) => {
      const name =
        $(el)
          .find("h5.font-subtitle.text-lg.tracking-wider.line-clamp-2")
          .text()
          .trim() || "N/A";
      const priceText =
        $(el)
          .find("h4.font-heading.text-lg.tracking-wide.line-clamp-1")
          .text()
          .replace(/[^\d.]/g, "") || "0.0";
      const price = parseFloat(priceText) || 0.0;
      const rating =
        $(el)
          .find(".rating, .star-rating")
          .text()
          .match(/\d+\.\d+/)?.[0] || "N/A";
      const reviews =
        $(el).find(".reviews, .review-count").text().match(/\d+/)?.[0] || "N/A";
      const imageUrl =
        $(el)
          .find(
            "img.relative.overflow-hidden.rounded-lg.relative.aspect-square.w-full.bg-white.transition-all.ease-in-out"
          )
          .attr("src") || "N/A";
      const rawHref = $(el).attr("href") || "";
      const productUrl = rawHref.startsWith("http")
        ? rawHref
        : `https://www.zeptonow.com${rawHref}`;

      if (
        name !== "N/A" &&
        price !== 0 &&
        price <= 10000 &&
        imageUrl !== "N/A"
      ) {
        products.push({
          name,
          price,
          rating: parseFloat(rating),
          reviews: parseInt(reviews),
          image_url: imageUrl,
          product_url: productUrl,
        });
      }
    });

    if (products.length === 0) {
      console.log(
        "No products found with Cheerio, falling back to Puppeteer..."
      );
      browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
        timeout: 60000,
      });
      const page = await browser.newPage();
      await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
      );
      await page.setViewport({ width: 1280, height: 800 });

      console.log(`Navigating to ${url}...`);
      await page.goto(url);

      await page
        .$$("a.relative.z-0.my-3.rounded-t-xl.rounded-b-md.group")
        .catch((e) =>
          console.log("Parent container selector not found:", e.message)
        );
      await autoScroll(page);

      await page.screenshot({ path: "zepto-debug.png", fullPage: true });

      const dynamicProducts = await page.evaluate(() => {
        const items = Array.from(
          document.querySelectorAll(
            "a.relative.z-0.my-3.rounded-t-xl.rounded-b-md.group"
          )
        );
        console.log(`Found ${items.length} product containers`);
        return items
          .slice(0, 10)
          .map((item) => {
            try {
              const name =
                item
                  .querySelector(
                    "h5.font-subtitle.text-lg.tracking-wider.line-clamp-2"
                  )
                  ?.textContent.trim() || "N/A";
              const priceText =
                item
                  .querySelector(
                    "h4.font-heading.text-lg.tracking-wide.line-clamp-1"
                  )
                  ?.textContent.replace(/[^\d.]/g, "") || "0.0";
              const price = parseFloat(priceText) || 0.0;
              const ratingText =
                item
                  .querySelector(".rating, .star-rating")
                  ?.textContent.match(/\d+\.\d+/)?.[0] || "N/A";
              const rating = parseFloat(ratingText) || "N/A";
              const reviewsText =
                item
                  .querySelector(".reviews, .review-count")
                  ?.textContent.match(/\d+/)?.[0] || "N/A";
              const reviews = reviewsText ? parseInt(reviewsText) : 0;
              const imageUrl =
                item.querySelector(
                  "img.relative.overflow-hidden.rounded-lg.relative.aspect-square.w-full.bg-white.transition-all.ease-in-out"
                )?.src || "N/A";
              const href = item.href || "";
              const productUrl = href.startsWith("http")
                ? href
                : `https://www.zeptonow.com${href}`;

              return {
                name,
                price,
                rating,
                reviews,
                image_url: imageUrl,
                product_url: productUrl,
              };
            } catch (e) {
              console.error("Error parsing Zepto product:", e);
              return null;
            }
          })
          .filter(
            (item) =>
              item !== null &&
              item.name !== "N/A" &&
              item.price !== 0 &&
              item.price <= 10000 &&
              item.image_url !== "N/A"
          );
      });

      console.log(`Puppeteer found ${dynamicProducts.length} products`);
      return dynamicProducts.length > 0 ? dynamicProducts : products;
    }

    return products;
  } catch (e) {
    console.error("Zepto scraping error:", e);
    return [];
  } finally {
    if (browser) {
      console.log("Closing Puppeteer browser...");
      await browser.close();
    }
  }
}

async function scrapeInstamart(url) {
  let browser;
  try {
    console.log("Fetching Instamart page with Axios...");
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      },
    });
    const $ = cheerio.load(data);

    const products = [];
    $(".XjYJe._2_few").each((i, el) => {
      const name = $(el).find(".sc-aXZVg.kyEzVU._1sPB0").text().trim() || "N/A";
      const priceText =
        $(el)
          .find(".sc-aXZVg.jLtxeJ._1bWTz")
          .text()
          .replace(/[^\d.]/g, "") || "0.0";
      const price = parseFloat(priceText) || 0.0;
      const rating =
        $(el)
          .find(".rating, .star-rating")
          .text()
          .match(/\d+\.\d+/)?.[0] || "0.0";
      const reviews =
        $(el).find(".reviews, .review-count").text().match(/\d+/)?.[0] || "0";
      const imageUrl =
        $(el).find(".sc-dcJsrY.ibghhT._1NxA5").attr("src") || "N/A";
      const productUrl = $(el).find("a").attr("href")
        ? `https://www.swiggy.com${$(el).find("a").attr("href")}`
        : "N/A";

      if (
        name !== "N/A" &&
        price !== 0 &&
        price <= 10000 &&
        imageUrl !== "N/A"
      ) {
        products.push({
          name,
          price,
          rating: parseFloat(rating),
          reviews: parseInt(reviews),
          image_url: imageUrl,
          product_url: productUrl,
        });
      }
    });

    if (products.length === 0) {
      console.log(
        "No products found with Cheerio, falling back to Puppeteer..."
      );
      browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
        timeout: 60000,
      });
      const page = await browser.newPage();
      await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
      );
      await page.setViewport({ width: 1280, height: 800 });

      console.log(`Navigating to ${url}...`);
      await page.goto(url);

      await page
        .$$(".XjYJe._2_few")
        .catch((e) =>
          console.log("Parent container selector not found:", e.message)
        );
      await autoScroll(page);

      await page.screenshot({ path: "instamart-debug.png", fullPage: true });

      const dynamicProducts = await page.evaluate(() => {
        const items = Array.from(document.querySelectorAll(".XjYJe._2_few"));
        console.log(`Found ${items.length} product containers`);
        return items
          .slice(0, 10)
          .map((item) => {
            try {
              const name =
                item
                  .querySelector(".sc-aXZVg.kyEzVU._1sPB0")
                  ?.textContent.trim() || "N/A";
              const priceText =
                item
                  .querySelector(".sc-aXZVg.jLtxeJ._1bWTz")
                  ?.textContent.replace(/[^\d.]/g, "") || "0.0";
              const price = parseFloat(priceText) || 0.0;
              const ratingText =
                item
                  .querySelector(".rating, .star-rating")
                  ?.textContent.match(/\d+\.\d+/)?.[0] || "0.0";
              const rating = parseFloat(ratingText) || 0.0;
              const reviewsText =
                item
                  .querySelector(".reviews, .review-count")
                  ?.textContent.match(/\d+/)?.[0] || "0";
              const reviews = reviewsText ? parseInt(reviewsText) : 0;
              const imageUrl =
                item.querySelector(".sc-dcJsrY.ibghhT._1NxA5")?.src || "N/A";
              const productUrl = item.querySelector("a")?.href
                ? `https://www.swiggy.com${item.querySelector("a")?.href}`
                : "N/A";

              return {
                name,
                price,
                rating,
                reviews,
                image_url: imageUrl,
                product_url: productUrl,
              };
            } catch (e) {
              console.error("Error parsing Instamart product:", e);
              return null;
            }
          })
          .filter(
            (item) =>
              item !== null &&
              item.name !== "N/A" &&
              item.price !== 0 &&
              item.price <= 10000 &&
              item.image_url !== "N/A"
          );
      });

      console.log(`Puppeteer found ${dynamicProducts.length} products`);
      return dynamicProducts.length > 0 ? dynamicProducts : products;
    }

    return products;
  } catch (e) {
    console.error("Instamart scraping error:", e);
    return [];
  } finally {
    if (browser) {
      console.log("Closing Puppeteer browser...");
      await browser.close();
    }
  }
}

async function scrapeBigBasket(url) {
  let browser;
  try {
    console.log("Fetching BigBasket page with Axios...");
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      },
    });
    const $ = cheerio.load(data);

    const products = [];
    $(".PaginateItems___StyledLi-sc-1yrbjdr-0.dDBqny").each((i, el) => {
      const name =
        $(el)
          .find(
            ".block.m-0.line-clamp-2.font-regular.text-base.leading-sm.text-darkOnyx-800"
          )
          .text()
          .trim() || "N/A";
      const priceText =
        $(el)
          .find(
            ".Label-sc-15v1nk5-0.Pricing___StyledLabel-sc-pldi2d-1.gJxZPQ.AypOi"
          )
          .text()
          .replace(/[^\d.]/g, "") || "0.0";
      const price = parseFloat(priceText) || 0.0;
      const rating =
        $(el)
          .find(
            ".Label-sc-15v1nk5-0.Badges___StyledLabel-sc-1k3p1ug-0.gJxZPQ.kAyiFy.leading-xxs .Label-sc-15v1nk5-0.gJxZPQ"
          )
          .text()
          .match(/\d+\.\d+/)?.[0] || "0.0";
      const reviews =
        $(el)
          .find(
            ".Label-sc-15v1nk5-0.ReviewsAndRatings___StyledLabel-sc-2rprpc-1.gJxZPQ.egHBA-d"
          )
          .text()
          .match(/\d+/)?.[0] || "0";
      const imageUrl =
        $(el)
          .find(".DeckImage___StyledImage-sc-1mdvxwk-3.cSWRCd")
          .attr("src") || "N/A";
      const productUrl = $(el).find("a").attr("href")
        ? `${$(el).find("a").attr("href")}`
        : "N/A";

      if (
        name !== "N/A" &&
        price !== 0 &&
        price <= 10000 &&
        imageUrl !== "N/A"
      ) {
        products.push({
          name,
          price,
          rating: parseFloat(rating),
          reviews: parseInt(reviews),
          image_url: imageUrl,
          product_url: productUrl,
        });
      }
    });

    if (products.length === 0) {
      console.log(
        "No products found with Cheerio, falling back to Puppeteer..."
      );
      browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
        timeout: 60000,
      });
      const page = await browser.newPage();
      await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
      );
      await page.setViewport({ width: 1280, height: 800 });

      console.log(`Navigating to ${url}...`);
      await page.goto(url);

      await page
        .$$(".PaginateItems___StyledLi-sc-1yrbjdr-0.dDBqny")
        .catch((e) =>
          console.log("Parent container selector not found:", e.message)
        );
      await autoScroll(page);

      await page.screenshot({ path: "bigbasket-debug.png", fullPage: true });

      const dynamicProducts = await page.evaluate(() => {
        const items = Array.from(
          document.querySelectorAll(
            ".PaginateItems___StyledLi-sc-1yrbjdr-0.dDBqny"
          )
        );
        console.log(`Found ${items.length} product containers`);
        return items
          .slice(0, 10)
          .map((item) => {
            try {
              const name =
                item
                  .querySelector(
                    ".block.m-0.line-clamp-2.font-regular.text-base.leading-sm.text-darkOnyx-800"
                  )
                  ?.textContent.trim() || "N/A";
              const priceText =
                item
                  .querySelector(
                    ".Label-sc-15v1nk5-0.Pricing___StyledLabel-sc-pldi2d-1.gJxZPQ.AypOi"
                  )
                  ?.textContent.replace(/[^\d.]/g, "") || "0.0";
              const price = parseFloat(priceText) || 0.0;
              const ratingText =
                item
                  .querySelector(
                    ".Label-sc-15v1nk5-0.Badges___StyledLabel-sc-1k3p1ug-0.gJxZPQ.kAyiFy.leading-xxs .Label-sc-15v1nk5-0.gJxZPQ"
                  )
                  ?.textContent.match(/\d+\.\d+/)?.[0] || "0.0";
              const rating = parseFloat(ratingText) || 0.0;
              const reviewsText =
                item
                  .querySelector(
                    ".Label-sc-15v1nk5-0.ReviewsAndRatings___StyledLabel-sc-2rprpc-1.gJxZPQ.egHBA-d"
                  )
                  ?.textContent.match(/\d+/)?.[0] || "0";
              const reviews = reviewsText ? parseInt(reviewsText) : 0;
              const imageUrl =
                item.querySelector(
                  ".DeckImage___StyledImage-sc-1mdvxwk-3.cSWRCd"
                )?.src || "N/A";
              const productUrl = item.querySelector("a")?.href
                ? `${item.querySelector("a")?.href}`
                : "N/A";

              return {
                name,
                price,
                rating,
                reviews,
                image_url: imageUrl,
                product_url: productUrl,
              };
            } catch (e) {
              console.error("Error parsing BigBasket product:", e);
              return null;
            }
          })
          .filter(
            (item) =>
              item !== null &&
              item.name !== "N/A" &&
              item.price !== 0 &&
              item.price <= 10000 &&
              item.image_url !== "N/A"
          );
      });

      console.log(`Puppeteer found ${dynamicProducts.length} products`);
      return dynamicProducts.length > 0 ? dynamicProducts : products;
    }

    return products;
  } catch (e) {
    console.error("BigBasket scraping error:", e);
    return [];
  } finally {
    if (browser) {
      console.log("Closing Puppeteer browser...");
      await browser.close();
    }
  }
}

// Helper function to scroll page for dynamic content
async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 100;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
}

app.get("/scrape-amazon", async (req, res) => {
  const search = req.query.search || "";
  const url = `https://www.amazon.in/s?k=${search.replace(/ /g, "+")}`;
  const products = await scrapeAmazon(url);
  if (products.length > 0) {
    res.json(products);
  } else {
    res.status(500).json({ error: "No data scraped from Amazon" });
  }
});

app.get("/scrape-flipkart", async (req, res) => {
  const search = req.query.search || "";
  const url = `https://www.flipkart.com/search?q=${search.replace(/ /g, "+")}`;
  const products = await scrapeFlipkart(url);
  if (products.length > 0) {
    res.json(products);
  } else {
    res.status(500).json({
      error: "No data scraped from Flipkart",
      details: "Check server logs or flipkart-debug.png for more info",
    });
  }
});

app.get("/scrape-zepto", async (req, res) => {
  const search = req.query.search || "";
  const url = `https://www.zeptonow.com/search?query=${search.replace(
    / /g,
    "+"
  )}`;
  const products = await scrapeZepto(url);
  if (products.length > 0) {
    res.json(products);
  } else {
    res.status(500).json({
      error: "No data scraped from Zepto",
      details: "Check server logs or zepto-debug.png for more info",
    });
  }
});

app.get("/scrape-instamart", async (req, res) => {
  const search = req.query.search || "";
  const url = `https://www.swiggy.com/instamart/search?custom_back=true&query=${search.replace(
    / /g,
    "+"
  )}`;
  const products = await scrapeInstamart(url);
  if (products.length > 0) {
    res.json(products);
  } else {
    res.status(500).json({
      error: "No data scraped from Instamart",
      details: "Check server logs or instamart-debug.png for more info",
    });
  }
});

app.get("/scrape-bigbasket", async (req, res) => {
  const search = req.query.search || "";
  const url = `https://www.bigbasket.com/ps/?q=${search.replace(/ /g, "+")}`;
  const products = await scrapeBigBasket(url);
  if (products.length > 0) {
    res.json(products);
  } else {
    res.status(500).json({
      error: "No data scraped from BigBasket",
      details: "Check server logs or bigbasket-debug.png for more info",
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
