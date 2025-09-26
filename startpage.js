getTime();
fetchData(97, 78);

async function fetchData(X, Y) {
    try {
	const response1 = await fetch("https://api.weather.gov/gridpoints/LSX/" + X + "," + Y + "/forecast/hourly");
        const response2 = await fetch("https://api.weather.gov/gridpoints/LSX/" + X + "," + Y + "/forecast");
        if((!response1.ok) && (!response2.ok)){throw new Error("Could not fetch response's");}
 
        const data1 = await response1.json();
	const data2 = await response2.json();
	
       
	var jsondata1 = data1; 
        var jsondata2 = data2;
//	console.log(jsondata1, jsondata2); 
	getWeather(jsondata1,jsondata2);
    }
    catch(error){console.error(error);}
}


function getWeather(jsondata1, jsondata2) {
        var temp = document.getElementById("temp");
        temp.innerHTML = jsondata1.properties.periods[0].temperature + jsondata1.properties.periods[0].temperatureUnit;
    
         var a = document.getElementById('main_img'); 

        scrollmenu(jsondata1,jsondata2);
        a.src = determineIcon(jsondata1, 0);
}


function determineIcon(jsondata1, t) {
    var name = jsondata1.properties.periods[t].name;
    var iconlink = jsondata1.properties.periods[t].icon;

    var iconN = iconlink.slice(35, 42);
    console.log(iconN, iconlink); 

    if(iconN == "night/f") {if(t==0){determineBackground("night");}return "img/clear_night.png";}
    else if((iconN == "day/skc") || (iconN == "day/few") || (iconN == "day/hot")) {if(t==0){determineBackground("day");} return "img/Sunny.png";}
    else if((iconN == "day/sct") || (iconN == "day/bkn") || (iconN == "day/ovc")) {if(t==0){determineBackground("cloud");} return "img/cloudy_weather.png";}
    else if(iconN == "day/rai") {if(t == 0){determineBackground("cloud");} return "img/rainy.png";} 
    else if((iconN == "night/s") || (iconN == "night/b")) {if(t == 0){determineBackground("night");} return "img/cloudy_night.png";}
    else if(iconN == "day/tsr") {return "img/thunderstorm.png";}
    else if(iconN == "night/t") {return "img/nThunder.png"}
    else if((iconN == "night/b") || (iconN == "night/o")) {if(t==0){determineBackground("night");} return "img/day_windy.png"}
    else if(iconN == "night/r") {if(t==0){determineBackground("night");} return "img/rain_night.png";}
}


async function SearchBox() {
    document.getElementById("scrollmenu").innerHTML = "";
    var search = document.getElementById('link_id').value;

    var query = "https://nominatim.openstreetmap.org/search?q=" + search + "&format=json";

    try {const response = await fetch(query);
         if(!response.ok) {throw new Error("could not fetch geolocation");}
	 const geodata = await response.json();
         console.log(geodata)

	 var lat = geodata[0].lat; var lon = geodata[0].lon; var location = geodata[0].display_name;
	 document.getElementById('location').innerHTML = location;
	 
	} catch(error){console.log(error);}

    UpdateLocation(lat, lon);
}


async function UpdateLocation(lat, lon) {
const gridpoints = "https://api.weather.gov/points/" + lat + "," + lon;
    try {
	const response = await fetch(gridpoints)
        if(!response.ok) {throw new Error("Could not catch error");} 
        const griddata = await response.json();

        const Xcoord = griddata.properties.gridX;
        const Ycoord = griddata.properties.gridY;

//	console.log(griddata);
	fetchData(Xcoord, Ycoord);
    }
    catch(error){console.error(error);}
}


async function getlinks(passed) {    
    var name = document.getElementById("redsearch").value;
    if(passed == "news") {var url = ["https://old.reddit.com/r/news/hot.json","https://old.reddit.com/r/worldnews/hot.json" ];}
    else if(passed == "Code") {var url = ["https://old.reddit.com/r/Emacs/hot.json", "https://old.reddit.com/r/Programming/hot.json"]}
       else {var link = "https://www.reddit.com/r/" + name + "/hot.json"; var url = [link];}

    try {
	for(let i = 0; i < url.length; i++) {
	    const linkres = await fetch(url[i]);
	    if(!linkres.ok) {throw new Error("could not fetch response");}
	    const linkdata = await linkres.json();
	    console.log(linkdata);
	    appendlinks(linkdata);
	}
    }
	catch(error){console.error(error)};
}

function appendlinks(linkdata) {
    const names = document.getElementById("links");
    names.appendChild(document.createElement("br"));

    for(var j = 3; j < 16; j++) {
    var a = document.createElement('a');
    var title = linkdata.data.children[j].data.title;
    var linkText = document.createTextNode(title);
    const subreddit = "r/" + linkdata.data.children[j].data.subreddit;
    const link = "https://www.reddit.com/" + linkdata.data.children[j].data.permalink;

    a.appendChild(linkText);
    a.title = linkdata.data.children[j].data.title;
    a.href = link;
    a.target = "_blank";

    const p = document.getElementById("links");
    p.appendChild(document.createTextNode(subreddit));
    p.appendChild(document.createElement("br"));
    p.appendChild(a);
    p.appendChild(document.createElement("br"));
    p.appendChild(document.createElement("br"));
    }
 }

function reloadbutton() {
const container = document.getElementById('links');
container.textContent = '';
}


function scrollmenu(jsondata1, jsondata2){
    for(var t = 1; t < 10; t++){
    var temp = jsondata1.properties.periods[t].temperature + jsondata1.properties.periods[t].temperatureUnit;
    const p = document.createElement("p");  p.innerHTML = temp;
    var img = document.createElement("img");
    var divName = "childDiv" + t;
    const childDiv = document.createElement("div"); childDiv.style.id = (divName);
	
    img.src = determineIcon(jsondata1, t);
    img.width = "30"; img.height = "30"; 
    const headdiv = document.getElementById('scrollmenu');

	childDiv.appendChild(img);
	childDiv.appendChild(p);
	childDiv.style.float = "left";
	headdiv.appendChild(childDiv);
	headdiv.style.marginTop = "30px";
	headdiv.style.fontSize = "20px";
	headdiv.style.marginLeft = "130px";
	childDiv.style.marginRight = "35px";
    }
}

function determineBackground(code) {
    day = "linear-gradient(224deg, #EBFF00FF 0.5%, #EBFF00FF 1%, #71C4FFFF 40%)";
    night = "linear-gradient(224deg, #663399 1%, #663399 1%, #006db0 80%)";
    cloud = "linear-gradient(224deg, #ffffff 2%, #ffffff 5%, #99ccff 40%)"; 

    if(code == "day") {document.body.style.backgroundImage = day;}
    else if(code == "night") {document.body.style.backgroundImage = night;}
    else if(code == "cloud") {document.body.style.backgroundImage = cloud;}
}


function getTime() {
    var times = document.getElementById("TIME");

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = mm + '/' + dd + '/' + yyyy;

    times.innerText = today; 
}

