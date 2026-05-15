const fs = require("fs");
const p = "sunnyhill.html";
let h = fs.readFileSync(p, "utf8");

const start = h.indexOf('                </motion.div>\n              </motion.div>\n              <motion.div class="sh-slide" data-slide="1">');
const alt = h.indexOf('                </motion.div>\r\n              </motion.div>\r\n              <motion.div class="sh-slide" data-slide="1">');
const alt2 = h.indexOf("                </div>\n              </motion.div>\n              <motion.div class=\"sh-slide\" data-slide=\"1\">");
let s = start;
if (s === -1) s = alt;
if (s === -1) s = h.indexOf('              <div class="sh-slide" data-slide="1">');

const nextBtn = h.indexOf('<button type="button" class="sh-nav-btn sh-nav-btn--next"', s);
if (s === -1 || nextBtn === -1) {
  console.error("markers", s, nextBtn);
  process.exit(1);
}

const insert = `
                  <article class="sh-card sh-card--featured">
                    <p class="sh-card__label">VIP TICKET</p>
                    <p class="sh-card__price"><span>800</span> EUR</p>
                    <p class="sh-card__access">3 DAY ACCESS · BUNDLE (SUNNY HILL + C4 STAGE)</p>
                    <div class="sh-card__status">
                      <span class="sh-card__ending">ENDING SOON</span>
                      <div class="sh-card__bar sh-card__bar--ending"></div>
                    </div>
                    <p class="sh-card__desc sh-card__desc--bullet">
                      <span class="sh-card__dot" aria-hidden="true"></span>
                      <span>Enjoy priority entry, premium comfort, and exclusive festival benefits.</span>
                    </p>
                    <a href="https://www.sunnyhillfestival.com/" class="sh-card__btn sh-card__btn--primary" target="_blank" rel="noopener noreferrer">BUY TICKET</a>
                  </article>
              </div>
            </div>
          </div>
`;

// Find erroneous close before slide - remove from first erroneous </div> after 400 card
const after400 = h.indexOf("3 DAY ACCESS · C4 STAGE");
const buy400 = h.indexOf("BUY TICKET</a>", after400);
const endArticle400 = h.indexOf("</article>", buy400) + "</article>".length;

// Remove everything from endArticle400 until nextBtn, replace with insert
h = h.slice(0, endArticle400) + insert + "\n          " + h.slice(nextBtn);

fs.writeFileSync(p, h);
console.log("Fixed track, slide1?", h.includes('data-slide="1"'));
