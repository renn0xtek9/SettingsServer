var jsonsettings;
class Parameter{
	constructor(succesivekeys,array){
		this.parentkeys=succesivekeys.slice();
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
				var value=maininput.value;				//This is the default: we return it as a string
				console.log(value);
				if ("type" in instance.array){
					if(instance.array["type"]=="double")
					{
						value=parseFloat(value);
					}
					if(instance.array["type"]=="int")
					{
						value=parseInt(value);
					}
				}
				else {
					console.log("No array");
				}
				instance.valueChanged(value);
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
	getValueString(value){
		//TODO wrap if stting
		return value;
	}
	getModif(value){		
		var arr={parameters:[{name: this.array["name"],value: this.getValueString(value)}]};		
		return arr;
	}
	valueChanged(value){
		console.log("Value Changed");
		
 		var modif=this.getModif(value);
		var jsonobj=modif;
		for (var i=this.parentkeys.length-1;i>-1;i--)
		{
			console.log(i);
			var newobj={};
			newobj[this.parentkeys[i]]=jsonobj;
			jsonobj=newobj;
		}
		sendModificationToServer(jsonobj);
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
			var value=input.value;				//This is the default: we return it as a string
			console.log(value);
			if ("type" in instance.array){
				if(instance.array["type"]=="double")
				{
					value=parseFloat(value);
				}
				if(instance.array["type"]=="int")
				{
					value=parseInt(value);
				}
			}
			else {
				console.log("No array");
			}
			instance.valueChanged(value);
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
function treatParameters(parentdivid,array,successivekeyarrays){
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
}
function getContent()
{
	UpdateSettingsFromServer();
	var title=Object.keys(jsonsettings)[0];
	recurseIntoParametersTree("parameterslistdiv",jsonsettings[title],[title]);
}
function sendModificationToServer(json){
	console.log(json);
	var xhttp = new XMLHttpRequest();
	xhttp.open('POST','settings.html',true);
	xhttp.send(JSON.stringify(json));
};
