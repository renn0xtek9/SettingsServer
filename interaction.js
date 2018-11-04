var jsonsettings;
class Parameter{
	constructor(succesivekeys,array){
		this.parentkeys=succesivekeys;
		this.array=array;}
	getUI(){
		try{
			var name=this.array["name"];
			var value=this.array["value"];
			var block=document.createElement("p");			//The whole block for this parameter (text + input box + slider etc !)
			var textnode=document.createTextNode(name);
			var maininput=document.createElement("input");
			maininput.id=name+"maininput";
			maininput.classList.add("parameterinputbox");
			maininput.value=value;

			var instance=this;
			maininput.oninput=function(){
				instance.valueChanged(maininput.value);
			};
			block.appendChild(textnode);
			block.appendChild(maininput);			
			if ("type" in this.array){
				if ((this.array["type"]=="double")||(this.array["type"]=="int")){
						var paramvar=this.makeSlideParameters(this.array)
						block.appendChild(paramvar);
				}
			}
			return block	
		}
		catch(e){
			console.log("Problem initializing parameters locating in "+this.succesivekeys);
		}
	}
	valueChanged(value){
		console.log("Value Changed");
		//TODO transofrm successive keys to a json (build the payload)
		var keystojson;
		sendModificationToServer(keystojson);
		try{
			document.getElementById(this.array["name"]+"maininput").value=value;
		}
		catch(e){
			console.log("Could not get element by id:"+this.array["name"]+"maininput");
		}
		try{
			document.getElementById(this.array["name"]+"slider").value=value;
		}
		catch(e){
			console.log("Could not get element by id:"+this.array["name"]+"slider");
		}		
	}
	makeSlideParameters(elem){
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
		var instance=this
		input.oninput=function(){
			instance.valueChanged(input.value);
		};	
		slidecontainerdiv.appendChild(input);
		return slidecontainerdiv;
	}
}
var parameterlist=[];


function UpdateSettingsFromServer()
{
	var response=httpGet("settings.json");
	jsonsettings=JSON.parse(response);
	parameterlist=[];
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
		maininput.value=input.value;
	};	
	slidecontainerdiv.appendChild(input);
	return slidecontainerdiv;
}
function treatParameters(parentdivid,array,successivekeyarrays){
// 	console.log("parameters hit !");
	for (elem in array)
	{
		try{
			parameterlist.push(new Parameter(successivekeyarrays,array[elem]));
			var paramdiv=document.getElementById(parentdivid);
			paramdiv.appendChild(parameterlist[parameterlist.length-1].getUI());	

		}
		catch(e){
			console.log("Probleme reader parameters "+array[elem])
		}
	}
}

function recurseIntoParametersTree(parentdivid,startobject,successivekeyarrays){
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
			
			var subarray=successivekeyarrays;
			subarray.push(k);
			recurseIntoParametersTree(keydivision.id,startobject[k],subarray);
			subarray.pop();
		}
		else 
		{
			treatParameters(parentdivid,startobject[k],successivekeyarrays);
		}		
	}
	console.log(parameterlist);
	
}


function getContent()
{
	UpdateSettingsFromServer();
	var title=Object.keys(jsonsettings)[0];
	recurseIntoParametersTree("parameterslistdiv",jsonsettings[title],[title]);
}
function sendModificationToServer(json,value){
	
};
	
