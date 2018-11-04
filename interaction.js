console.log("script exec");
var jsonsettings;
function UpdateSettingsFromServer()
{
	var response=httpGet("settings.json");
	jsonsettings=JSON.parse(response);
}


function httpGet(url)
{
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open( "GET", url, false ); // false for synchronous request
	xmlHttp.send( null );
	return xmlHttp.responseText;
}


function getTitle()
{
	UpdateSettingsFromServer();
	var title=Object.keys(jsonsettings)[0];
	
	
	
	var para = document.createElement("h1");
	var node = document.createTextNode(title);
	para.appendChild(node);
	var element = document.getElementById("titlediv");
	element.appendChild(para);
}
function makeSlideParameters(elem){
	var slidecontainerdiv=document.createElement("span");
	slidecontainerdiv.display="block";
	slidecontainerdiv.whitespace="nowrap";
	slidecontainerdiv.classList.add("slidecontainer");
	var input=document.createElement("input");
	input.min=elem["min"];
	input.max=elem["max"];
	input.type="range";
	input.value=elem["value"];
	input.classList.add("slider");
	input.id=elem["name"]+"slider";
	if ("step" in elem){
		input.step=elem["step"];
	}
	//TODO connect change of input to the main input box
	input.oninput=function(){
		var maininput=document.getElementById(elem["name"]+"maininput");
// 		console.log(document.getElementById(elem["name"]+"maininput"));
// 		console.log(input.value);
		maininput.value=input.value;
		
	};
// 		.value=input.value;};
	
	slidecontainerdiv.appendChild(input);
	return slidecontainerdiv;
}
function treatParameters(parentdivid,array){
// 	console.log("parameters hit !");
	for (elem in array)
	{
		try{
			//Gather infos about the object 
			var name=array[elem]["name"];
			var value=array[elem]["value"];
			
			
			var parameterpara=document.createElement("p");
			var parameterparanode=document.createTextNode(name);
			var parameterparainput=document.createElement("input");
			parameterparainput.id=name+"maininput";
			parameterparainput.classList.add("parameterinputbox");
			parameterparainput.value=value;
			parameterpara.appendChild(parameterparanode);
			parameterpara.appendChild(parameterparainput);
			
			
			if ("type" in array[elem]){
				if ((array[elem]["type"]=="double")||(array[elem]["type"]=="int")){
						var paramvar=makeSlideParameters(array[elem])
						parameterpara.appendChild(paramvar);
				}
			}
			
			
			var paramdiv=document.getElementById(parentdivid);
			paramdiv.appendChild(parameterpara);	
		}
		catch(e){
			console.log("Probleme reader parameters "+array[elem])
		}
		
	}
}

function recurseIntoParametersTree(parentdivid,startobject){
	for (k in startobject)
	{
		if (k!="parameters")
		{
			//Add a title with that key 
			var keydivision=document.createElement("div");
			keydivision.id=k+"div";
			var keyheading=document.createElement("h2");
			var keynode=document.createTextNode(k);
			
			keydivision.appendChild(keyheading);
			keyheading.appendChild(keynode);
			
			var paramdiv=document.getElementById(parentdivid);
			paramdiv.appendChild(keydivision);		
			
			recurseIntoParametersTree(keydivision.id,startobject[k]);
		}
		else 
		{
			treatParameters(parentdivid,startobject[k]);
		}		
	}
	
}


function getContent()
{
	UpdateSettingsFromServer();
	var title=Object.keys(jsonsettings)[0];
	recurseIntoParametersTree("parameterslistdiv",jsonsettings[title]);
}
