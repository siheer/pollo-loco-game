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
                <h2 class="">Impressum</h2>
                <p class="">This is a sample legal notice for the Pollo Loco game. All rights reserved.</p>
                <button class="btn  back-btn">Zurück</button>
            </div>
        </div>
    `;
}