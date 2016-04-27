
// 1. Variable Initialization
var macro, proxy, linkedinEmail, linkedinPassword, linkedinSearch, fileName, numberOfResultsPerPage, numberOfPagesToVisit, i, j;

macro = '';

proxy = '';

linkedinEmail = 'test@test.com';

linkedinPassword = 'password';

linkedinSearch = 'https://www.linkedin.com/vsearch/p?orig=TRNV&rsid=4725815331453143220683&keywords=mandataire+judiciaire&trk=vsrp_people_sel&trkInfo=VSRPsearchId%3A4725815331453143220683%2CVSRPcmpt%3Atrans_nav'

fileName = 'test.csv';

messageContent = 'Hello';

numberOfResultsPerPage = 10;

numberOfPagesToVisit = 3;

// 2. Macro Initialization

macro += 'CODE:' + '\n';
macro += 'SET !TIMEOUT_STEP 2' + '\n';
macro += 'SET !TIMEOUT_TAG 2' + '\n';
macro += 'SET !TIMEOUT_PAGE 45' + '\n';
macro += 'SET !ERRORIGNORE YES' + '\n';
macro += 'SET !EXTRACT_TEST_POPUP NO' + '\n';


// 3. Clear cookie, cache and set a proxy

macro += "CLEAR" + "\n";
if (proxy !== "") {
  macro += "PROXY ADDRESS=" + proxy + "\n";
}


// 4. LinkedIn Sign In

macro += 'TAB T=1' + '\n';
macro += 'TAB CLOSEALLOTHERS' + '\n';
macro += 'WAIT SECONDS=1' + '\n';
macro += 'URL GOTO=https://www.linkedin.com/' + '\n';
macro += 'EVENT TYPE=CLICK SELECTOR="#login-email" BUTTON=0' + '\n';
macro += 'EVENTS TYPE=KEYPRESS SELECTOR="#login-email" CHARS=' + linkedinEmail + '\n';
macro += 'WAIT SECONDS=2' + '\n';
macro += 'EVENT TYPE=MOUSEDOWN SELECTOR="#login-password" BUTTON=0' + '\n';
macro += 'EVENTS TYPE=KEYPRESS SELECTOR="#login-password" CHARS=' + linkedinPassword + '\n';
macro += 'WAIT SECONDS=2' + '\n';
macro += 'EVENT TYPE=CLICK SELECTOR="#pagekey-uno-reg-guest-home>DIV>DIV>FORM>INPUT:nth-of-type(6)" BUTTON=0' + '\n';
macro += 'WAIT SECONDS=2' + '\n';


// 5. Search for people to visit

macro += 'URL GOTO=' + linkedinSearch + '\n';
macro += 'TAG POS=1 TYPE=A ATTR=TXT:Filter' + '\n';
macro += 'WAIT SECONDS=2' + '\n';


// 6. Auto-visit, save and close profiles

for (i = 2; i <= numberOfPagesToVisit; i++) {

    for (j = 1; j <= numberOfResultsPerPage + 1; j++) {
        macro += 'EVENT TYPE=CLICK SELECTOR="#results>LI:nth-of-type(' + j + ')>DIV>H3>A" BUTTON=0 MODIFIERS="meta"' + '\n';
        macro += 'WAIT SECONDS=2' + '\n';
    }

    macro += 'TAB T=2' + '\n';

    for (j = 1; j <= numberOfResultsPerPage; j++) {

        // Save profile into csv file fileName
        macro += 'SET !EXTRACTADD {{!URLCURRENT}}' + '\n';
        macro += 'TAG POS=1 TYPE=SPAN ATTR=CLASS:fn EXTRACT=TXT' + '\n';
        macro += 'TAG POS=1 TYPE=DIV ATTR=ID:headline EXTRACT=TXT' + '\n';
        macro += 'SAVEAS TYPE=EXTRACT FOLDER=* FILE=' + fileName + '\n';

        // Add profile
        macro += 'TAG POS=1 TYPE=BUTTON ATTR=TXT:More<SP>options' + '\n';
        macro += 'TAG POS=1 TYPE=A ATTR=TXT:Connect' + '\n';
        macro += 'TAG POS=1 TYPE=INPUT:RADIO FORM=ID:iwe-form ATTR=ID:IF-reason-iweReconnect' + '\n';
        macro += 'TAG POS=1 TYPE=TEXTAREA FORM=ID:iwe-form ATTR=ID:greeting-iweReconnect CONTENT=' + messageContent + '\n';
        macro += 'TAG POS=1 TYPE=BUTTON ATTR=ID:send-invite-button' + '\n';


        macro += 'TAB CLOSE' + '\n';
    }

    macro += 'WAIT SECONDS=20' + '\n';
    macro += 'TAG POS=1 TYPE=A ATTR=TXT:' + i + '\n';
}


// 7. Run de Macro

iimDisplay("iMacro is now running.");

iimPlay(macro);
