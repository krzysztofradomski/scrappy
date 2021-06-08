const puppeteer = require("puppeteer");
const fs = require("fs");

// Use whatever you like.
const log = (...args) =>
  console.log("\033[33m\x1b[40mSCRAPPY LOG:\033[0m", ...args);

(async function main() {
  const STATIONS_LIST_URL = "https://airquality.ie/stations";
  const STATION_URL = "https://airquality.ie/station/";
  const data = [];
  let stations = [];

  try {
    // The list should not change to often so it is a wise to 'cache' it.
    fs.readFile("stations.json", (err, data) => {
      if (err) {
        return log(`No stations saved, will scrape ${STATIONS_LIST_URL} for data.`);
      } else {
        stations = JSON.parse(data);
        return log(`Found ${stations.length} stations in a local file.`);
      }
    });

    const browser = await puppeteer.launch();
    const [page] = await browser.pages();

    await page.goto(STATIONS_LIST_URL);
    const scriptWithConfig = await page.evaluate(
      () => [...document.querySelectorAll("script")].pop().outerHTML
    );
    // Last of the scripts on the website has a config object with a list of all IDs of the monitoring stations...
    stations = eval(scriptWithConfig.match(/(?!"monitors":)(\[".+])/gi)[0]);

    if (!Array.isArray(stations)) {
      throw new Error("Problem reading stations from given url!");
    }

    fs.writeFile("stations.json", JSON.stringify(stations), (err, data) => {
      if (err) {
        return log(err);
      } else {
        return log(data);
      }
    });

    // Use the list to generate and access individual station's url
    for (id of stations) {
      log("Accessing stations by id: ", id);
      await page.goto(STATION_URL + id, { waitUntil: "networkidle2" });
      const [name, latestPM2dot5, coords] = await page.evaluate(() => [
        document.querySelector("header h3").textContent,
        document.querySelector("section #breadcrumb + div .col-sm-4:last-of-type div > span").outerText,
        document.querySelector("section #map + div span:last-of-type").outerText,
      ]);

      const entry = { id, name, coords, latestPM2dot5 };

      data.push(entry);
      log("station readout: ", entry);
    }

    // Clean up and save results
    await browser.close();
    fs.writeFile("static/data.json", JSON.stringify(data), (err, data) => {
      if (err) {
        return log(err);
      } else {
        return log("Saved data", data);
      }
    });
  } catch (err) {
    log("Something went really wrong!", err);
  }
})();
