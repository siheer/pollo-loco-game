const MIN_INTERVAL_IN_MILLISECONDS = 25;
const STANDARD_INTERVAL_IN_MILLISECONDS = 100;
const pauseSVG = `
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 87.72 122.88">
        <path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"
            d="M0,0h35.54v122.88l-35.54,0V0L0,0z M52.18,0h35.54v122.88l-35.54,0V0L52.18,0z" />
    </svg>
`
const playSVG = `
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 87.72 122.88">
        <polygon fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" points="92.2,60.97 0,122.88 0,0 92.2,60.97" />
    </svg>
`
const fullScreenSVG = `
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122.88 122.87">
        <g>
            <path fill="currentColor" stroke="currentColor" stroke-width="8"
                d="M122.88,77.63v41.12c0,2.28-1.85,4.12-4.12,4.12H77.33v-9.62h35.95c0-12.34,0-23.27,0-35.62H122.88L122.88,77.63z M77.39,9.53V0h41.37c2.28,0,4.12,1.85,4.12,4.12v41.18h-9.63V9.53H77.39L77.39,9.53z M9.63,45.24H0V4.12C0,1.85,1.85,0,4.12,0h41v9.64H9.63V45.24L9.63,45.24z M45.07,113.27v9.6H4.12c-2.28,0-4.12-1.85-4.12-4.13V77.57h9.63v35.71H45.07L45.07,113.27z" />
        </g>
    </svg>
`
const exitFullScreenSVG = `
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122.88 122.871">
        <g>
            <path fill="currentColor" stroke="currentColor" stroke-width="3"
                d="M122.88,35.775v9.529H81.515c-2.278,0-4.125-1.847-4.125-4.125V0h9.63v35.775H122.88L122.88,35.775z M35.499,0h9.63v41.118 c0,2.278-1.847,4.125-4.125,4.125H0v-9.644h35.499V0L35.499,0z M0,87.164v-9.598h40.942c2.277,0,4.125,1.846,4.125,4.125v41.18 h-9.633V87.164H0L0,87.164z M77.328,122.871V81.752c0-2.277,1.847-4.125,4.125-4.125h41.427v9.625H86.931 c0,12.338-0.003,23.271-0.003,35.619H77.328L77.328,122.871z" />
        </g>
    </svg>
`