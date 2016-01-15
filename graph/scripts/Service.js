//Global variable
		 
//Permette la creazione del grafo e le relative operazioni (Cerca nodo, elimina, aggingi collegamento, ecc)
var graph = new joint.dia.Graph;
		 
//Variabile che permette di creare nodi dello stesso tipo (es 2 nodi facebook) inserendo questo numero nell'identificativo del nodo. Da modificare
var number =0;
		 
// Oggetto che serve per la creazione di un servizio
var service ={firstService:"", secondService:"", whatFist:"undefined",whenFist:"undefined",whereFist:"undefined",whatSecond:"undefined",whenSecond:"undefined",whereSecond:"undefined",description:"undefined"}
		
// Array che permette di memorizzare oggetti del tipo (nome, trigger)
var arrayTrigger = [];
		 
var arrayAction = [];
		 
function models() {

    graph = new joint.dia.Graph;
    var paper = new joint.dia.Paper({
        el: $('#flow'),
		width: 8000,
		height: 7000,
        gridSize: 1,
        model: graph,
        defaultLink: new joint.dia.Link({
            attrs: { '.marker-target': { d: 'M 10 0 L 0 5 L 10 10 z' } },
            smooth: true
         }),
				
		validateMagnet: function(cellView, magnet) 
		{
			// Note that this is the default behaviour. Just showing it here for reference.
			// Disable linking interaction for magnets marked as passive (see below `.inPorts circle`).
			return magnet.getAttribute('magnet') !== 'passive';
		},
				
    });
		
	paper.on('cell:pointerclick', function(cellView,evt, x, y)
	{
				
		//populateProperties("Descrizione qui",graph.getCell(cellView.model.id));
		
	});

			
		

			
	var connect = function(source, sourcePort, target, targetPort) 
	{
		var link = new joint.dia.Link({
		attrs: { '.marker-target': { d: 'M 10 0 L 0 5 L 10 10 z' } },
			smooth: true,
			source: { id: source.id, selector: source.getPortSelector(sourcePort) },
			target: { id: target.id, selector: target.getPortSelector(targetPort) }
		});
		//link.addTo(graph).reparent();
		var inLink = target.get('inLink');
		var outLink = source.get('outLink');
	
		target.set('inLink' , inLink+1);
		source.set('outLink', outLink+1)
		
		
		
		return link;
	};
			
	graph.on('remove', function(cell, collection, opt) {
		if (cell.isLink()) {
			var shapeTrig = graph.getCell(cell.get("source").id);
			var shapeAct = graph.getCell(cell.get("target").id);
			//alert(shapeAct.attr('.inlink/text'));
			var inLink = shapeAct.get('inLink');
			var outLink = shapeTrig.get('outLink');
			
			shapeTrig.set("outLink", outLink-1);
			shapeAct.set("inLink", inLink-1);
			
			
			
			if(outLink-1 == 0)
			{
				shapeTrig.attr('.labelTrigger/text',"");
			}
		
			if(inLink-1 == 0)
			{
				
				shapeAct.attr('.labelAction/text',"");
			}

			
      
		}
	})
	
          
	graph.on('change:source change:target', function(link) {
		if (link.get('source').id && link.get('target').id ) 
		{
			var shape1 = graph.getCell(link.get("source").id);
			var shape2= graph.getCell(link.get("target").id);		
			
			
						

			link=connect(graph.getCell(link.get("source").id), " ",graph.getCell(link.get("target").id), "")
						

						
			
			//create service
			service.firstService =shape1.attr('.label/text');
			service.secondService =shape2.attr('.label/text');
			
			
				
			
			if((shape1.attr('.labelTrigger/text')=="") && (shape2.attr('.labelAction/text')==""))
			{
				splashScreen(shape1,shape2,1,"");
				//createService(1, shape1, shape2);
			}
			else
			{
				if(shape1.attr('.labelTrigger/text')!="" && (shape2.attr('.labelAction/text')==""))
				{
					splashScreen(shape1,shape2,"",2)
					//addService(shape2,2);
				}
				else if (shape2.attr('.labelAction/text')!="" && (shape1.attr('.labelTrigger/text')==""))
				{
					splashScreen(shape1,shape2,"",1)
					//addService(shape1,1);
				}
			}

		}

	});
        
}
		
function splashScreen(ServiceTrig, ServiceAct, view,type)
{
	var content = '<div> <p> Da ora in poi, ogni volta che sarà rilevato un evento sul tuo' +ServiceTrig.attr('.label/text') +','+ ServiceAct.attr('.label/text') +' effettuerà un’azione.'+
					'<p>Dettaglia nei prossimi step l’evento da rilevare in '+ ServiceTrig.attr('.label/text') +' e la conseguente azione che eseguirà '+ ServiceAct.attr('.label/text') +'</p>';
	
	var title = 'Rendi automatica una tua attività'
	
	bootbox.dialog({
		title: title,
		message: content,
		buttons: {
			success: {
				label: "Ok!",
				className: "btn-succes",
				callback: function() {		
					if(view==1)
					{
						createService(1, ServiceTrig, ServiceAct);
					}
					else{
						if(type ==1)
						{
							addService(ServiceTrig,1);
						}
						else{
							addService(ServiceAct,2);
						}
					}
				}
			}
		}
	});
}		
		
		
function createService(view, inCell, outCell)
{
	if(view === 1)
	{

		var content = '<div class="container">'+
				'<form class="form-horizontal" role="form">'+
					'<div class="form-group">'+
						'<label class="control-label col-sm-1">What:</label>'+
						'<div class="dropdown col-sm-4">'+
							'<select class="form-control" id="what">';
		
		
		content+=findService(inCell.attr('.label/text'),1);
		
		var msg ='</select>'+
							'</div>'+
						'</div>'+
						'<div class="form-group">'+
							'<label class="control-label col-sm-1" >When:</label>'+
							'<div class="TimeInput col-sm-4">'+
								
									'<input type="number" id="hour" min="0" max="24" step="1" value="12">'+
								
								'  :  '+
								
									'<input type="number" id="min" min="0" max="24" step="1" value="12">'+
								
							'</div>'+
						'</div>'+
						'<div class="form-group">'+
							'<label class="control-label col-sm-1" >Where:</label>'+
							'<div class="Where col-sm-4">'+
								'<input type="text" id="whereTrigger" placeholder="Type a place">'+
							'</div>'+
						'</div>'+
						'<div class="form-group">   '+     
							'<div class="col-sm-offset-2 col-sm-10">'+
							
							'</div>'+
						'</div>'+
					'</form>'+
				'</div>';
				
		
	
		content+=msg;
	
		
			
			
		bootbox.dialog({
			title: inCell.attr('.label/text'),
			message: content,
			
			buttons: {
				success: {
					label: "Successivo!",
					className: "btn-succes",
					callback: function() {
						createService(2,inCell,outCell)
						service.whatFist= document.getElementById("what").value
						service.whereFist= document.getElementById("whereTrigger").value
						service.whenFist= document.getElementById("hour").value +":" + document.getElementById("min").value;
					}
				}
			}
		}
		);

	}
	else
		{
				var content = '<div class="container">'+
				'<form class="form-horizontal" role="form">'+
					'<div class="form-group">'+
						'<label class="control-label col-sm-1">What:</label>'+
						'<div class="dropdown col-sm-4">'+
							'<select class="form-control" id="what">';
		
		
		content+=findService(outCell.attr('.label/text'),2);
		
		var msg ='</select>'+
							'</div>'+
						'</div>'+
						'<div class="form-group">'+
							'<label class="control-label col-sm-1" >When:</label>'+
							'<div class="TimeInput col-sm-4">'+
								
									'<input type="number" id="hour" min="0" max="24" step="1" value="12">'+
								
								'  :  '+
								
									'<input type="number" id="min" min="0" max="24" step="1" value="12">'+
								
							'</div>'+
						'</div>'+
						'<div class="form-group">'+
							'<label class="control-label col-sm-1" >Where:</label>'+
							'<div class="Where col-sm-4">'+
								'<input type="text" id="whereAction" placeholder="Type a place">'+
							'</div>'+
						'</div>'+
						'<div class="form-group">   '+     
							'<div class="col-sm-offset-2 col-sm-10">'+
							
							'</div>'+
						'</div>'+
					'</form>'+
				'</div>';
				
		
	
		content+=msg;
		
	
		
	
		
			
			
		bootbox.dialog({
			title: "Inserisci dettagli dell’azione da eseguire per " + outCell.attr('.label/text'),
			message: content,
			buttons: {
			
				main: {
					label: "Indietro!",
					className: "btn-succes",
					callback: function() {
						createService(1,inCell,outCell)
					}
				},
				success: {
					label: "Crea regola",
					className: "btn-succes",
					callback: function() {
						//create json service
						service.whatSecond= document.getElementById("what").value
						service.whereSecond= document.getElementById("whereAction").value
						service.whenSecond= document.getElementById("hour").value +":" + document.getElementById("min").value;

						populateProperties ("newService", inCell,outCell)
						
					}
				}
			}
		}
		);
		
		}
	
}

function addService(cell, type)
{
	var title ="";
	if(type=1)
	{
		title +="Inserisci dettagli dell’evento da rilevare per" + name;
	}
	else
	{
		title +="Inserisci dettagli dell’azione da eseguire per" + name;
	}
	var content = '<div class="container">'+
				'<form class="form-horizontal" role="form">'+
					'<div class="form-group">'+
						'<label class="control-label col-sm-1">Quale evento?</label>'+
						'<div class="dropdown col-sm-4">'+
							'<select class="form-control" id="what">';
		
		
		content+=findService(cell.attr('.label/text'),type);
		
	var msg ='</select>'+
				'</div>'+
				'</div>'+
					'<div class="form-group">'+
						'<label class="control-label col-sm-1" >When:</label>'+
						'<div class="TimeInput col-sm-4">'+
								'<input type="number" id="hour" min="0" max="24" step="1" value="12">'+
								
								'  :  '+
								
								'<input type="number" id="min" min="0" max="24" step="1" value="12">'+
								
							'</div>'+
						'</div>'+
						'<div class="form-group">'+
							'<label class="control-label col-sm-1" >Where:</label>'+
							'<div class="Where col-sm-4">'+
								'<input type="text" id="whereAction" placeholder="Type a place">'+
							'</div>'+
						'</div>'+
						'<div class="form-group">   '+     
							'<div class="col-sm-offset-2 col-sm-10">'+
							
							'</div>'+
						'</div>'+
					'</form>'+
				'</div>';
				
		
	
		content+=msg;
		
	
		
	
		
			
	
	bootbox.dialog({
		title: title,
		message: content,
		buttons: {
			success: {
				label: "Crea regola!",
				className: "btn-succes",
				callback: function() {
					if(type ==1)
					{
						service.whatFist= document.getElementById("what").value
						service.whereFist= document.getElementById("whereAction").value
						service.whenFist= document.getElementById("hour").value +":" + document.getElementById("min").value;
						bootbox.alert("Rule created")
						populateProperties ("",cell,null)
					}
					else
					{
						service.whatSecond= document.getElementById("what").value
						service.whereSecond= document.getElementById("whereAction").value
						service.whenSecond= document.getElementById("hour").value +":" + document.getElementById("min").value;
						
						populateProperties ("",null,cell)
					}

					
				}
			}
		}
	});
}
	
		
function createShape(id , Name)
{

	var shape = new joint.shapes.devs.TooledModel({
		position: { x: 15, y: 10 },
		id:Name + number,
		size: { width: 180, height: 35 },
		inPorts: [''],
	    outPorts: [' '],
		attrs: {
			'.label': { text: Name, 'ref-x': .4, 'ref-y': .2   },
			'.labelTrigger': { text:"",'ref-x': 195, 'ref-y': 40},
			'.labelAction': { text:"",'ref-x': -130, 'ref-y': 40 },
			rect: { fill: '#ffffe5', 'font-size': 18 },

			'.inPorts circle': { fill: '#4cb7db', magnet: 'passive', type: 'input' },
			'.outPorts circle': { fill: '#b32500',  type: 'output' },
					
		},
		portsTool: false,
		moveTool:false

		
	});
	shape.set("inLink", 0);
	shape.set("outLink", 0);
	graph.addCell(shape);
	number++;
}
		
function createUI()
{
		
      
	var line = {
        cols: [
				
            {	
				header:"Servizi",
                body:"<div id='api'></div>",
                 width: 250, height: 700
					
					
            },
            { view: "resizer" },
		    {
		        header: "Workspace",
		        body: "<div id='flow'></div>",
		        width:1380,height: 700
			}
     
        ]
    };

    webix.ui({
        container: "area",
        view: "accordion", type: "space",
		padding:5,
        rows: [
			line
        ]

    });
		

}
		
		

	
function fillViews() {
	models();
}


function loadService () {
	var url = "/graph/api/";
	var result ="";
	$.getJSON(url+'fileName.json', function(json)
	{
		for(var i=0; i < json.fileName.length; i++)
		{
			$.getJSON(url + json.fileName[i].name+".json", function(API)
			{
				
				result+= '<p> <button id='+ API.name +' type="button" class="btn btn-secondary btn-block" onClick="createShape(null,this.id)"\>'+ API.name+'</button></p>';
				document.getElementById('api').innerHTML = result;
			});
				
		}
			
	});
	
}

function loadTiggerAction()
{
	var url = "/graph/api/";
	
	$.getJSON(url +"TriggerAction.json", function(json)
	{
		
		
		
		for(var i=0; i < json.lengthTrigger; i++)
		{	
			
			
			var msg ="";
			var name =json.trigger[i].Service[1].name;
			for (var j=2; j< json.trigger[i].Service[0].length+2;j++)
			{	
				msg += "<option>"+json.trigger[i].Service[j].trig+" </option>";
				
			}
			arrayTrigger.push({"name":name,"trig": msg});
		}
		for(var i=0; i< json.lengthAction; i++)
		{
			var msg="";
			var name = json.action[i].Service[1].name;
			for(var j=2; j< json.action[i].Service[0].length+2; j++)
			{
				msg+="<option>"+json.action[i].Service[j].act+"</option>";
			}
			arrayAction.push({"name": name, "act": msg});
		}
		
	});
}

function findService(name, view)
{
	var result="";
	if(view== 1)
	{
		for(var i=0; i< arrayTrigger.length; i++)
		{
			if(arrayTrigger[i].name == name)
			{
				result += arrayTrigger[i].trig;
			}
		}
	}
	else{
		for(var i=0; i< arrayAction.length; i++)
		{
			if(arrayAction[i].name == name)
			{
				result += arrayAction[i].act;
			}
		}
	}
	

	return result;
}




function populateProperties (type, incell, outcell)
{
	var result ="";
	if(type== "newService")
	{
		
		result +="Cosa: "+ service.whatFist +"\n";
		result +="Quando: "+ service.whenFist +"\n";
		result +="Dove: "+ service.whereFist +"\n";
		incell.attr('.labelTrigger/text', result);
		
		result ="";
		
		result +="Cosa: "+ service.whatSecond +"\n";
		result +="Quando: "+ service.whenSecond +"\n";
		result +="Dove: "+ service.whereSecond +"\n";
		outcell.attr('.labelAction/text',result);
	}
	else
	{
		if(incell != null)
		{
			
			result +=" Cosa: "+ service.whatFist +"\n";
			result +=" Quando: "+ service.whenFist +"\n";
			result +=" Dove: "+ service.whereFist +"\n";
			incell.attr('.labelTrigger/text', result);
		}
		else{
			result +="Cosa: "+ service.whatSecond +"\n";
			result +="Quando: "+ service.whenSecond +"\n";
			result +="Dove: "+ service.whereSecond +"\n";
			outcell.attr('.labelAction/text',result);
		}
	}
	
	
	//deleteTempService();
	
}



function deleteTempService()
{
	service ={firstService:"", secondService:"", whatFist:"",whenFist:"",whereFist:"",whatSecond:"",whenSecond:"",whereSecond:"",description:""}
}
		
function searchLink()
{
	var links=[];
	links=graph.getLinks();
	alert(links);
	if(links.length > 0)
	{
		var shape = graph.getCell(links[0].get('source').id);
			
		alert(shape.attr('.label/text'));
	}
}
		
