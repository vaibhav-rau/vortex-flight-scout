// scripts/content-scout.js
(function collectFlights() {
  console.log("VORTEX // Initializing mathematical raw element grid analysis...");
  const deals = [];
  const items = document.querySelectorAll('li, [role="listitem"]');

  items.forEach(item => {
    try {
      const text = item.innerText;
      
      if (text && text.includes('$')) {
        const lines = text.split('\n');
        
        if (lines.length >= 2) {
          const destination = lines[0].trim();
          const priceStr = lines.find(line => line.includes('$'))?.trim() || "N/A";
          const dates = lines.find(line => line.match(/\d/))?.trim() || "Flexible Dates";

          if (destination.length < 35 && !destination.includes('Flights') && !destination.includes('Explore') && !destination.includes('Travel')) {
            
            // Raw string sanitization -> pure numerical sorting values
            const rawNumericPrice = parseInt(priceStr.replace(/[^0-9]/g, ''), 10);
            
            if (!isNaN(rawNumericPrice)) {
              deals.push({ 
                destination, 
                dates, 
                price: priceStr,
                numericPrice: rawNumericPrice
              });
            }
          }
        }
      }
    } catch (e) {
      // Catch abstract element gaps
    }
  });

  // EXPLICIT MATH SORTING: Bypasses Google's sorting completely
  const absoluteCheapestSort = deals.sort((a, b) => a.numericPrice - b.numericPrice);

  const uniqueDeals = [];
  const seenDestinations = new Set();
  
  for (const deal of absoluteCheapestSort) {
    if (!seenDestinations.has(deal.destination)) {
      seenDestinations.add(deal.destination);
      uniqueDeals.push(deal);
    }
  }

  chrome.runtime.sendMessage({
    action: "displayDeals",
    data: uniqueDeals.slice(0, 12)
  });
})();