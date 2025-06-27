main();


function main() {
getTime();
fetchData(97, 78);

}

// Fetchs data for hourly and daily weather from weather api
async function fetchData(X, Y) {
    try {
	 var hourly_API = await fetch("https://api.weather.gov/gridpoints/LSX/" + X + "," + Y + "/forecast/hourly");
        var daily_API = await fetch("https://api.weather.gov/gridpoints/LSX/" + X + "," + Y + "/forecast");

        if(!(hourly_API.ok && daily_API.ok)) {throw new Error("Could not fetch response's");}
	
       var hourly = await hourly_API.json();
	var daily = await daily_API.json();

	if(X == 97 && Y == 78)
	{document.getElementById('location').innerHTML = "Edwardsville, Illinois"; const container = document.getElementById('scrollmenu');
	 container.textContent = '';}
	

	getWeather(daily, hourly);
    }
    catch(error) {console.error(error);}
}

// get weather temperature and icons from API
function getWeather(d_data, h_data) {
    var temp = document.getElementById("temp");
    temp.innerHTML = d_data.properties.periods[0].temperature + d_data.properties.periods[0].temperatureUnit;
    
    var a = document.getElementById('main_img'); 

    scrollmenu(d_data, h_data);
    a.src = determineIcon(d_data, 0);
}


// Giant ineffiecent function that determines the weather icon given a code from the weather api
function determineIcon(d_data, t) {
    var name = d_data.properties.periods[t].name;
    var iconlink = d_data.properties.periods[t].icon;

    var iconN = iconlink.slice(35, 42);
    console.log(iconN, iconlink); 


    var code_arr = ["night/f", "day/skc", "day/sct", "day/few", "day/hot", "day/bkn",
			       "day/ovc", "day/rai", "night/s", "night/b", "day/tsr", "night/t", "night/b", "night/o", "night/r"];

    var icon_arr = ["img/clear_night.png", "img/Sunny.png", "img/cloudy_weather.png", "img/rainy.png",
		           "img/cloudy_night.png", "img/thunderstorm.png", "img/nThunder.png", "img/rain_night.png"];
 

    if(iconN == code_arr[0]) {
	if(t==0){determineBackground("night");}
	return icon_arr[0];
    }

    else if((iconN == code_arr[1]) || (iconN == code_arr[3]) || (iconN == code_arr[4])) {
	if(t==0){determineBackground("day");} 
	return icon_arr[1];
    }

    else if((iconN == code_arr[2]) || (iconN == "day/bkn") || (iconN == "day/ovc")) {
	if(t==0){determineBackground("cloud");} 
	return icon_arr[2];}

    else if(iconN == "day/rai") {
	if(t == 0){determineBackground("cloud");}
	return icon_arr[3];
    } 

    else if((iconN == "night/s") || (iconN == "night/b")) {
	if(t == 0){determineBackground("night");} 
	return icon_arr[4];
    }

    else if(iconN == "day/tsr") {
	return icon_arr[5];
    }

    else if(iconN == "night/t") {
	return icon_arr[6];
    }

    else if((iconN == "night/b") || (iconN == "night/o")) {
	if(t==0){determineBackground("night");} 
	return "img/day_windy.png";
    }

    else if(iconN == "night/r") {
	if(t==0){determineBackground("night");} 
	return "img/rain_night.png";
    }
}

// get location (lat, lon) from string search
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

// Update the location of the weather through given lat and lon
async function UpdateLocation(lat, lon) {
const gridpoints = "https://api.weather.gov/points/" + lat + "," + lon;
    try {
	const response = await fetch(gridpoints)
        if(!response.ok) {throw new Error("Could not catch error");} 
        const griddata = await response.json();

        const Xcoord = griddata.properties.gridX;
        const Ycoord = griddata.properties.gridY;

       //console.log(griddata);
	fetchData(Xcoord, Ycoord);
    }
    catch(error){console.error(error);}
}


// get the links and json files for the subreddits
async function getlinks(passed) {    
    var name = document.getElementById("redsearch").value;
    if(passed == "news") {var url = ["https://old.reddit.com/r/news/hot.json","https://old.reddit.com/r/worldnews/hot.json" ];}
    else if(passed == "Code") {var url = ["https://old.reddit.com/r/Programming/hot.json", "https://old.reddit.com/r/Emacs/hot.json"]}
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

// append the reddit news stories to the menu 
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


function scrollmenu(d_data, h_data){
    for(var t = 1; t < 10; t++){
    var temp = d_data.properties.periods[t].temperature + d_data.properties.periods[t].temperatureUnit;
    const p = document.createElement("p");  p.innerHTML = temp;
    var img = document.createElement("img");
    var divName = "childDiv" + t;
    const childDiv = document.createElement("div"); childDiv.style.id = (divName);
	
    img.src = determineIcon(d_data, t);
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

// determines the background image based on the weather code given
function determineBackground(code) {
    day = "linear-gradient(224deg, #EBFF00FF 0.5%, #EBFF00FF 1%, #71C4FFFF 40%)";
    night = "linear-gradient(224deg, #663399 1%, #663399 1%, #006db0 80%)";
    cloud = "linear-gradient(224deg, #ffffff 2%, #ffffff 5%, #99ccff 40%)"; 

    if(code == "day") {document.body.style.backgroundImage = day;}
    else if(code == "night") {document.body.style.backgroundImage = night;}
    else if(code == "cloud") {document.body.style.backgroundImage = cloud;}
}


// gets time to display on top right corner
function getTime() {
    var times = document.getElementById("TIME");

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = mm + '/' + dd + '/' + yyyy;

    times.innerText = today; 
}

