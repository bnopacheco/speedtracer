function isRecordDump() {
  return (document.documentElement.getAttribute("isDump") == "true");
}

function sendData(port, dataContainer) {
  var allData = dataContainer.innerHTML;
  for (var start = 0, end = allData.indexOf('\n', 0);
       end != -1; end = allData.indexOf('\n', start)) {
    var recordStr = allData.slice(start, end);
    // Make sure the recordStr is not simply all whitespace.
    if (!/^\s*$/.test(recordStr)) {
      port.postMessage({
        record : recordStr
      });
    }
    start = end + 1;
  }
  var info = document.getElementById("info");
  info.innerHTML = "(loading... complete!)";
}

function loadData() {
  var dataContainer = document.getElementById("traceData");
  if (dataContainer) {
    var portName = 
      (dataContainer.getAttribute("isRaw") == "true") ? "RAW_DATA_LOAD" : "DATA_LOAD";
    var port = chrome.extension.connect( {
      name : portName
    });
    // We send the data when the monitor is ready for it.
    port.onMessage.addListener(function(msg) {
      if (msg.ready) {
        sendData(port, dataContainer);
      }
    });
  }
}

function injectLoadUi() {
  // The logo image src is not valid when not served from extensions process.
  // We use a data url to show it in this context.
  var logoSrc = "data:image/png;base64,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";
  var logo = document.getElementById("logo");
  if (logo) {
    logo.src = logoSrc;
  }
  // Put a button in there that asks if they want to view us.
  var info = document.getElementById("info");
  info.innerHTML = "";
  if (info) {
    var viewButton = document.createElement("input");
    viewButton.type = "button";
    viewButton.value = "Open Monitor!";
    viewButton.style["cursor"] = "pointer";
    viewButton.addEventListener("click", function(evt){
        info.innerHTML = "(loading...)";
        loadData();
    }, false);
    info.appendChild(viewButton);
  }
}

if (window == top && isRecordDump()) {
  injectLoadUi();
}