// popup/popup.js
let allScrapedDeals = [];
let currentTab = 'roundTrip'; 
let globalOrigin = 'ATL';

document.getElementById('startAutomation').addEventListener('click', () => { startScan(); });
document.getElementById('tabRoundTrip').addEventListener('click', () => { switchTab('roundTrip'); });
document.getElementById('tabDirect').addEventListener('click', () => { switchTab('direct'); });

function switchTab(tabName) {
  if (currentTab === tabName) return;
  currentTab = tabName;
  document.getElementById('tabRoundTrip').classList.toggle('active', tabName === 'roundTrip');
  document.getElementById('tabDirect').classList.toggle('active', tabName === 'direct');
  startScan(); 
}

async function startScan() {
  const statusDiv = document.getElementById('statusUpdate');
  globalOrigin = document.getElementById('originCity').value.trim().toUpperCase();

  if (globalOrigin.length !== 3) {
    statusDiv.innerText = "CRITICAL: Input valid 3-letter IATA terminal.";
    return;
  }

  statusDiv.innerText = `Injecting Vortex router routing strings...`;
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  let targetURL = `https://www.google.com/travel/explore?q=Flights+from+${globalOrigin}+to+Anywhere`;
  if (currentTab === 'direct') {
    targetURL += `_oneway`; 
  }

  await chrome.tabs.update(tab.id, { url: targetURL });

  setTimeout(() => {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['scripts/content-scout.js']
    });
  }, 4500);
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "displayDeals") {
    allScrapedDeals = request.data;
    renderDealsTable();
  }
});

function renderDealsTable() {
  const table = document.getElementById('dealsTable');
  const tbody = document.getElementById('dealsBody');
  const statusDiv = document.getElementById('statusUpdate');
  
  tbody.innerHTML = "";
  
  if (allScrapedDeals.length === 0) {
    statusDiv.innerText = "Zero data components captured. Cycle retry parameters.";
    table.style.display = "none";
    return;
  }

  allScrapedDeals.forEach(deal => {
    const row = document.createElement('tr');
    row.className = "deal-row";
    
    // THE EXACT CORRECT LINK FORMAT:
    // Matches your sample query string logic: /travel/flights?q=flights+from+ORIGIN+to+DESTINATION
    let baseQuery = `flights+from+${globalOrigin}+to+${encodeURIComponent(deal.destination).replace(/%20/g, '+')}`;
    
    if (currentTab === 'direct') {
      baseQuery += `+one+way`;
    }
    
    const flightSearchURL = `https://www.google.com/travel/flights?q=${baseQuery}`;

    row.innerHTML = `
      <td><a class="deal-link" href="${flightSearchURL}" target="_blank">${deal.destination}</a></td>
      <td style="color: #8b949e;">${deal.dates}</td>
      <td class="price">${deal.price}</td>
    `;
    
    row.addEventListener('click', (e) => {
      if (e.target.tagName !== 'A') {
        window.open(flightSearchURL, '_blank');
      }
    });

    tbody.appendChild(row);
  });

  table.style.display = "table";
  statusDiv.innerText = `SCAN COMPLETE // ${allScrapedDeals.length} DEALS VERIFIED`;
}