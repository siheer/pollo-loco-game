import KeyboardKeysSVGs from "./keyboard-keys-svg.class.js";

/**
 * Provides static HTML templates for game overlay screens.
 * Contains templates for start, control, and legal screens.
 */
export default class OverlayTemplates {
    constructor() {
        throw new Error('Static class');
    }

    static startScreen = `
        <div class="fc jcac">
            <h1>El Pollo Loco</h1>
            <div class="fc jcac gap1">
                <button class="btn start-btn">Spielen</button>
                <button class="btn controls-btn">Steuerung</button>
                <button class="btn legal-btn">Impressum</button>
            </div>
        </div>
    `;

    static controlScreen = `
        <div class="fc jcac gap1 controls-container">
                <h2>Steuerung</h2>
                <div class="key-explanation fr jcac sb">
                    <span class="key-label">Nach links laufen</span>
                    <div class="key-svg">${KeyboardKeysSVGs.left}</div>
                </div>
                <div class="key-explanation fr jcac sb">
                    <span class="key-label">Nach rechts laufen</span>
                    <div class="key-svg">${KeyboardKeysSVGs.right}</div>
                </div>
                <div class="key-explanation fr jcac sb">
                    <span class="key-label">Springen</span>
                    <div class="key-svg">${KeyboardKeysSVGs.space}</div>
                </div>
                <div class="key-explanation fr jcac sb">
                    <span class="key-label">Flasche werfen</span>
                    <div class="key-svg">${KeyboardKeysSVGs.a}</div>
                </div>
                <div class="key-explanation fr jcac sb">
                    <span class="key-label">Flasche kaufen</span>
                    <div class="key-svg">${KeyboardKeysSVGs.enter}</div>
                </div>
                <div class="key-explanation fr jcac sb">
                    <span class="key-label">Vollbildmodus</span>
                    <div class="key-svg">${KeyboardKeysSVGs.f}</div>
                </div>
                <div class="key-explanation fr jcac sb">
                    <span class="key-label">Start/Pause</span>
                    <div class="key-svg">${KeyboardKeysSVGs.p}</div>
                </div>
                <p>Fahre im Spiel mit der Maus an den unteren Rand, um die Navigation zu öffnen.</p>
                <button class="btn back-btn">Zurück</button>
        </div>
    `;

    static legalScreen = `
        <div class="legal-screen-container fc jcac">
            <div class="legal-screen-content">
                <h2>Impressum</h2>
                <p>
                    Verantwortlich:  [Name]<br>
                    E-Mail: <a href="mailto:[email]">[email]</a>
                </p>
                <p>
                    Bildnachweis: 
                    <a href="https://www.freepik.com/free-vector/desert-forest-landscape-sunset-time-scene-with-many-cactuses_16445168.htm#fromView=image_search_similar&page=2&position=30&uuid=222b09f2-4eec-47b6-afc1-825755a85c87&query=desert" target="_blank">
                        Image by brgfx on Freepik
                    </a>
                </p>
                <p>
                     Music by <a href="https://pixabay.com/users/alba_mac-40740995/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=176807">Alba MacKenna</a> from <a href="https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=176807">Pixabay</a>
                     <br>
                     Sound Effects from Pixabay.
               </p>
                <button class="btn back-btn">Zurück</button>
            </div>
        </div>
    `;
}