import KeyboardKeysSVGs from "./keyboard-keys-svg.class.js";

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
                    Anbieter: El Pollo Loco<br>
                    Verantwortlich: Pepe Mustermann<br>
                    Adresse: Musterstraße 1, 12345 Musterstadt, Deutschland<br>
                    Telefon: +49 123 4567890<br>
                    E-Mail: info@elpolloloco.de
                </p>
                <p>
                    Umsatzsteuer-ID gemäß §27a UStG: DE123456789<br>
                    Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV: Pepe Mustermann
                </p>
                <p>
                    Bildnachweis: 
                    <a href="https://www.freepik.com/free-vector/desert-forest-landscape-sunset-time-scene-with-many-cactuses_16445168.htm#fromView=image_search_similar&page=2&position=30&uuid=222b09f2-4eec-47b6-afc1-825755a85c87&query=desert" target="_blank">
                        Image by brgfx on Freepik
                    </a>
                    <br>
                    Iconsnachweis:
                    <a href="https://www.freepik.com/free-vector/wooden-web-buttons-round-icons-game-interface_25278491.htm#fromView=search&page=3&position=2&uuid=7cede53c-103a-420b-832c-bd2ab4c152ea&query=game+icons+wood">
                        Image by upklyak on Freepik
                    </a>
                </p>
                <button class="btn back-btn">Zurück</button>
            </div>
        </div>
    `;
}