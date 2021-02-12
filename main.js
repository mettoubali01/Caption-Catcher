var prUrl = "";

function showCaptionOnWindow(caption){

	//remove button
	let span = document.createElement("span");
	let spanContent = document.createTextNode("X");
	span.append(spanContent);
	span.id = 'remove-section'
	span.style.cssText = 'cursor:pointer;'

	let div = document.createElement("div");
	div.style.cssText = "display:flex;justify-content:flex-end;"
	div.append(span);

	//title of the section
	let h1 = document.createElement("h1");
	let title = document.createTextNode("Video Caption");
	h1.append(title);
	h1.style.cssText = 'text-align: center;padding-bottom: 15px;'

	//building the section with the previous elements and with the content caption
	let section = document.createElement("div");
	section.id = "video-caption";
	section.style.cssText='FONT-WEIGHT: 100;padding: 5px;text-align: justify;font-size: medium;border: 2px red solid;margin: 5px;'
	
	let p = document.createElement("p");
	p.appendChild(document.createTextNode(caption));

	section.appendChild(div);
	section.appendChild(h1);
	section.appendChild(p);

	document.getElementById("columns").append(section);

}

//method to get the the html body of the giving url 
function getHtmlBodyByUrl(theUrl){

	if (window.XMLHttpRequest)// code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp=new XMLHttpRequest();
    else// code for IE6, IE5
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    

    xmlhttp.onreadystatechange=function(){
        
       	if (xmlhttp.readyState==4 && xmlhttp.status==200)
           	return xmlhttp.responseText;       	
   	}

    xmlhttp.open("GET", theUrl, false);
    xmlhttp.send();    

    return xmlhttp.response
}

//to remove the secion when the remve btn is clicked
function removeCaptionSection(){
	document.getElementById("remove-section").onclick = function(){
		document.getElementById("video-caption").remove();
	}
};

function cleanTheCaptionsection(){
	let caption_side = document.getElementById("video-caption");
		if (caption_side)
			caption_side.remove();
}


(async function() {
			
	let currentUrl = window.location.href;
			
	let bodyDocOfCurrentWindow = getHtmlBodyByUrl(currentUrl);

	
	let regexp2 = new RegExp(/(?<=captionTracks).*?(timedtext.*?)"/);
	let match = regexp2.exec(bodyDocOfCurrentWindow);
	console.log("match " + match)

	if (!match) {
		var caption_side = document.getElementsByClassName("video-caption")[0];
		if (caption_side)
		caption_side.remove();
		//show message to the client that the caption it desen't exists
		showCaptionOnWindow("Caption not found, try it with another video with captions.");
	}else{
		let string = match[0];
		let captionUrl = string.substr(string.indexOf("https"),string.length) + "&fmt=json3"
		captionUrl = captionUrl.replace(/['"]+/g, '')
		captionUrl = captionUrl.replaceAll("\\u0026", "&");

		const data = await fetch(captionUrl);
		const response = await data.json();

		let caption = "";
		for (var i = 0; i < response.events.length; i++) {
	
			if ("segs" in response.events[i]) {
				for (var j = 0; j < response.events[i].segs.length; j++) {
					caption += response.events[i].segs[j].utf8 + " ";
				}
			}
		}

		//in case we click the bookmarklet caption to get the captions of the current youtube 
		//video it will remove the previous caption section in case the existance.
		cleanTheCaptionsection();

		//show caption on the window
		showCaptionOnWindow(caption);

		//activate the remove button of the section
		removeCaptionSection(caption_side);

	}
})();