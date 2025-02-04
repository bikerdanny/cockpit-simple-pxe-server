const content = document.getElementById("content");

pxe_servers = [];

//cockpit.file("/home/bikerdanny/git/cockpit-simple-pxe-server/pxe.cfg").read()
cockpit.file("/etc/pxe.cfg").read()
  .then((data, tag) => {
     pxe_servers = data.split("\n");
  })
  .catch(error => {
    console.log("Error reading pxe.cfg");
  });

function update(name, port) {
  http = cockpit.http(port);
  request_init = http.get("/hosts");
  //table = '<table><thead><tr><th>Host</th><th>MAC</th><th>IP</th><th>Status</th><th>Action</th></tr></thead><tbody>';
  request_init.done(function(json_data) {
    data = JSON.parse(json_data);
    table = '<table><thead><tr><th>Host</th><th>MAC</th><th>IP</th><th>Status</th><th>Action</th></tr></thead><tbody>';
    data["hosts"].forEach(function(element) {
      table += '<tr>';
      table += '<td>'+element["host"]+'</td>';
      table += '<td>'+element["mac"]+'</td>';
      table += '<td>'+element["ip"]+'</td>';
      table += '<td>'+element["status"]+'</td>';
      table += '<td><button class="deploy" value="'+element["mac"]+'">Deploy</button></td>';
      table += '</tr>';
    });
    table += '</tbody></table>';
    content.innerHTML += '<h2>'+name+'</h2>';
    content.innerHTML += table;
    content.innerHTML += '<hr>';
    document.querySelectorAll(".deploy").forEach(function(element) {
      element.addEventListener("click", function(event) {
        mac = event.target.value;
        request_deploy = http.get("/deploy/"+mac);
      });
    });
    //return table;
  });
  //return table;
}

function init() {
  content.innerHTML = ""
  //content.innerHTML += update(5000);
  pxe_servers.forEach(function(element, index) {
    pxe_server = element.split(",");
    if (pxe_server.length == 2) {
      console.log(pxe_server);
      //update(pxe_server[0], pxe_server[1]);
      setTimeout(update(pxe_server[0], pxe_server[1]), index*1000);
      //content.innerHTML += update(pxe_server[0], pxe_server[1]);
    }
  });
}

init();
setInterval(init, 10*1000);

cockpit.transport.wait(function() { });

