﻿#target photoshop  
// Make Photoshop the frontmost application
/*========================================= IMPORTS =========================================*/
var setSizes = File(coreFolder + "setSize.jsx");
var versus = File(coreFolder + "versus.jsx");
var image = File(coreFolder + "image.jsx");
var meme = File(coreFolder + "meme.jsx");
var templates = File(coreFolder + "templates.jsx");
$.evalFile (templates);

/*========================================= IMPORTS =========================================*/
/*===========================================================================================*/
/*===========================================================================================*/
/*===================================== GLOBAL VARIABLES =====================================*/

var scriptStatus = true;
var confFilestoOpen = Array("json");
var AGpreferences;
var selectcall = 1;

var AGFolder = new Folder(fileFolder +"/AGFiles Only/");
try{
    AGlog.createEvent('Read [Preferences]: Tratando de leer las preferencias');
	var content = OpenFolder(AGFolder);
	AGpreferences = readJson(content);
}catch(e){
    AGlog.createEvent('Read [Preferences]: Error leyendo las preferencias');
	AGpreferences = {}
	AGpreferences.projectFolder = false;
}

var projects = (AGpreferences.projectFolder == false) ? selectProjectFolder() : AGpreferences.projectFolder;

var openWindow;
var prevWindow;

var projectName;
var projectObject = {};
var projectFolder;

var templateTypes = {image: 'normalTemplate', versus: 'versusTemplate', meme: 'memeTemplate'};
var tagTypes = ["Lanzamiento","Cosplay","Noticia","Hoy en la Historia","En Memoria","Rumor","Custom"];
var reactionTypes = ["like","heart","haha","wow","sad","angry"];


cTID = function(s) { return app.charIDToTypeID(s); };
sTID = function(s) { return app.stringIDToTypeID(s); };


/*===================================== GLOBAL VARIABLES =====================================*/
/*===========================================================================================*/
/*==================================== GLOBAL FUNCTIONS=====================================*/
//https://jsfiddle.net/oxw79ect/1/




function OpenFolder(folder) {
    AGlog.createEvent('Read [Folder]: Buscando en: ' + folder);
	var fileList = folder.getFiles();    
     var content = "";
     var founded = false;
	for ( var i = 0; i < fileList.length; i++ ) {
			// Make sure all the files in the folder are compatible with PS
		if (IsFileOneOfThese(fileList[i], confFilestoOpen )) {
					fileList[i].open( "r","TEXT");
					content = fileList[i].read();
					fileList[i].close();
                       founded = true; 					
		}
	}
    if(founded){
        AGlog.createEvent('Read [json]: Archivo encontrado' + folder);
        return content;  
    }else{
        AGlog.createEvent('Read [json][Alert]: Parece que esta carpeta no tiene un archivo de configuracion. ' + folder);
        alert('Parece que esta carpeta no tiene un archivo de configuracion.')
        return false;
    }

}


function IsFileOneOfThese( inFileName, inArrayOfFileExtensions ) {
	var lastDot = inFileName.toString().lastIndexOf( "." );
	if ( lastDot == -1 ) {
		return false;
	}
	var strLength = inFileName.toString().length;
	var extension = inFileName.toString().substr( lastDot + 1, strLength - lastDot );
	extension = extension.toLowerCase();
	for (var i = 0; i < inArrayOfFileExtensions.length; i++ ) {
         AGlog.createEvent('Read [json]: Buscando archivos: .' + inArrayOfFileExtensions[i]);
		if ( extension == inArrayOfFileExtensions[i] ) {             
			return true;
		}
	}
	return false;
}

function selectProjectFolder(){
    //$.writeln('Verificando el Folder de Proyectos');   
    AGlog.createEvent('Select [dialog]: Abierto dialogo de seleccion de carpeta de proyecto');
    var projectsFolder = Folder("~/").selectDlg("Selecciona donde guardar los proyectos: (Intento " + selectcall + "/3)");
	if(projectsFolder == null || projectsFolder == undefined){
        AGlog.createEvent('Select [dialog]: No se selecciono (intento ' + selectcall + '/3)');
		if(selectcall < 3){              
			selectcall += 1;              
			selectProjectFolder();
		}else{
			scriptStatus = false;
             AGlog.createEvent('Select [dialog][Alert]: Se necesita seleccionar una carpeta de Proyectos para continuar. Por favor reinicie el proceso. Cerrando Generador\n\n');
			alert("Se necesita seleccionar una carpeta de Proyectos para continuar. Por favor reinicie el proceso");
		}
	}else{    
		//$.writeln(projectsFolder);        
         AGpreferences.fileFolder = fileFolder.toString();
         AGpreferences.projectFolder = projectsFolder.toString();

        updateFolder = new Folder(AGpreferences.projectFolder + '/[Updates]');
        if ( ! updateFolder.exists ) {
            updateFolder.create();            
         }

        AGpreferences.updateFolder = updateFolder.toString();

         AGpreferences.logFile = AGlog.file.toString();         
         AGlog.createEvent('Select [dialog]: Se selecciono el folder: '+ AGpreferences.projectFolder+ ' Para guardar proyectos.');
         AGlog.createEvent('Create [Folder]: Se creo un folder para updates.');
		generatePref_file(AGpreferences);
		return projectsFolder;
	}
}

function getPreferences(){
    AGlog.createEvent('Read [file]: Buscando las preferencias en: '+ fileFolder + '/AGFiles Only/');
	var folder = fileFolder + "/AGFiles Only/";
    AGlog.createEvent('Read [file]: Folder:' + folder);
	var AGFiles = folder.getFiles();   
	for ( var i = 0; i < AGFiles.length; i++ ) {
			// Make sure all the files in the folder are compatible with PS
		if (IsFileOneOfThese( AGFiles[i], gFilesToOpen )) {
					AGFiles[i].open( "r","TEXT");
					var content = AGFiles[i].read();
					AGFiles[i].close();
					return content;
		}
	}
}

function getDefaulProjectObjetc(type,name){
    var obj = {};
    obj.type = type;
    obj.ProjectName = name;
    obj.text = {};
    obj.reactions = {enable: false, list : ['like','heart','wow','haha','sad','angry']};
    obj.colors = {"tag-icon": [0,0,0,1], "tag-bg": [1,1,1,1], "tag-text": [0,0,0,1] ,text:[0,0,0,1],mask:[1,1,1,1],background:[0,0,0,1]}
    switch(type){
        case "image":
            obj.fileNumber = 1;
            obj.text.tag = {enable: true, index: -1, text: ''};
            obj.text.description = {enable: true, text: ''};
            obj.text.top = {enable: true, text: ''};
            obj.text.bottom = {enable: true, text: ''};
            break;
        case "versus":
            obj.fileNumber = 4;
            obj.text.tag = {enable: false, index: -1, text: ''};
            obj.text.description = {enable: false, text: ''};
            obj.text.top = {enable: true, text: ''};
            obj.text.bottom = {enable: true, text: ''};
            obj.reactions.enable = true;
            obj
            break;
         case "meme":
            obj.text.tag = {enable: false, index: -1, text: ''};
            obj.text.description = {enable: false, text: ''};
            obj.text.top = {enable: true, text: ''};
            obj.text.bottom = {enable: true, text: ''};
            obj.fileNumber = 1;
            break;
    }
    
    obj.files = [];
    obj.thumbs = [];
    
    return obj;
}

var extend = function () {

    // Variables
    var extended = {};
    var deep = false;
    var i = 0;
    var length = arguments.length;

    // Check if a deep merge
    if ( Object.prototype.toString.call( arguments[0] ) === '[object Boolean]' ) {
        deep = arguments[0];
        i++;
    }

    // Merge the object into the extended object
    var merge = function (obj) {
        for ( var prop in obj ) {
            if ( Object.prototype.hasOwnProperty.call( obj, prop ) ) {
                // If deep merge and property is an object, merge properties
                if ( deep && Object.prototype.toString.call(obj[prop]) === '[object Object]' ) {
                    extended[prop] = extend( true, extended[prop], obj[prop] );
                } else {
                    extended[prop] = obj[prop];
                }
            }
        }
    };

    // Loop through each object and conduct a merge
    for ( ; i < length; i++ ) {
        var obj = arguments[i];
        merge(obj);
    }

    return extended;

};

function generateProject_file(pname, obj){
   AGlog.createEvent('Create [Project Folder]: Creando folder del proyecto con nombre: \[AG-Project\]'+pname+' en Folder:' + AGpreferences.projectFolder);
   projectFolder = new Folder(AGpreferences.projectFolder + '/[AG-Project]'+ pname);   
    if ( ! projectFolder.exists ) {
        projectFolder.create();
        AGlog.createEvent('Create [Project Folder]: Folder Creado ('+projectFolder+')');
    }else{
        AGlog.createEvent('Verify [Project Folder]: Folder Existente ('+projectFolder+')');
    }
    var tempImgtFolder = new Folder(projectFolder + "/images/");
    AGlog.createEvent('Verify [Project Folder][Temp Images]: Creando folder del para imagenes temporales con nombre: images  en  Folder:' + tempImgtFolder);
    if ( ! tempImgtFolder.exists ) {
        AGlog.createEvent('Verify [Project Folder][Temp Images]: El folder no existe, se creara.');
        tempImgtFolder.create();
    }else{
        AGlog.createEvent('Verify [Project Folder][Temp Images]: El folder existe');
    }

   AGlog.createEvent('Create [Project Folder][File]: Generando archivo de proyecto.');
   var saveFile = File(projectFolder + '/' + pname +'\[ProjectFile\].json');
    if(saveFile.exists){
        AGlog.createEvent('Create [Project Folder][File]: Se encontro el archivo ya existente. Eliminando.');
        saveFile.remove();
    }

    var objString = JSON.stringify(obj,null,"\t");
    AGlog.createEvent('Create [Project Folder][File]: Escribiendo archivo de proyecto.\nDatos:'+objString);    
    try{
        saveFile.encoding = "UTF8";
        saveFile.open("e", "TEXT", "????");
        saveFile.writeln(objString);
        saveFile.close();
        AGlog.createEvent('Status [File][Info]: Se creo con exito el archivo de proyecto');
    }catch(e){
        AGlog.createEvent('Status [File][Error]: No se pudo generar el archivo de proyecto.');
    }
}

function generatePref_file(obj){
   AGlog.createEvent('Create [File]: Generando archivo de preferencias');
   var saveFile = File(AGFolder + "/preferences.json");
    if(saveFile.exists){
        AGlog.createEvent('Create [File]: Se encontro el archivo ya existente. Eliminando.');
        saveFile.remove();
    }

    var objString = JSON.stringify(obj);
    AGlog.createEvent('Create [File]: Escribiendo archivo de preferencias.\nDatos:'+objString);    
    try{
        saveFile.encoding = "UTF8";
        saveFile.open("e", "TEXT", "????");
        saveFile.writeln(objString);
        saveFile.close();
        AGlog.createEvent('Status [File][Info]: Se creo con exito el archivo de preferencias');
    }catch(e){
        AGlog.createEvent('Status [File][Error]: No se pudo generar el archivo de preferencias.');
    }
}

function openPSDTemplate(enabled, withDialog, type) {
    AGlog.createEvent('Opening [File][Info]: Abriendo el psd.');
    if (enabled != undefined && !enabled)
      return;
    var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
    var typeValue = (type != undefined ?  type : "normalTemplate");
    var desc1 = new ActionDescriptor();    
    try{
        desc1.putPath(cTID('null'), new File(psd_files+typeValue+".psd"));
        executeAction(cTID('Opn '), desc1, dialogMode);
    }catch(e){
        AGlog.createEvent('Status [File][Error]: No se pudo abrir el psd.\n'+e);
    }  
  };

function selectLayer(enabled, withDialog, layerName ) {
    AGlog.createEvent('Select [Layer][Info]: Buscando: '+ layerName);
    if (enabled != undefined && !enabled)
      return;
    var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    try{
        ref1.putName(cTID('Lyr '), layerName);
        desc1.putReference(cTID('null'), ref1);
        desc1.putBoolean(cTID('MkVs'), false);
        executeAction(cTID('slct'), desc1, dialogMode);
        AGlog.createEvent('Status [Layer][Info]: Capa: '+ layerName + ' encontrada.');
    }catch(e){
        AGlog.createEvent('Status [Layer][Error]: Capa: '+ layerName + ' no encontrada. ¿Es este el nombre correcto?\n' +e);
    }
};

function nullSelection(enabled, withDialog) {
    AGlog.createEvent('Select [Area]: Quitando seleccion.');
    if (enabled != undefined && !enabled)
      return;
    var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putProperty(cTID('Chnl'), sTID("selection"));
    desc1.putReference(cTID('null'), ref1);
    desc1.putEnumerated(cTID('T   '), cTID('Ordn'), cTID('None'));
    try{
        executeAction(cTID('setd'), desc1, dialogMode);
        AGlog.createEvent('Status [Area][Info]: Seleccion removida.');
    }catch(e){
        AGlog.createEvent('Status [Area][Error]: No se quito la seleccion.\n'+e);
    }
};

function SetSelectionArea(enabled, withDialog,LayerName) {
    AGlog.createEvent('Select [Area]: Seleccionando Area de capa: '+ LayerName);
    if (enabled != undefined && !enabled)
      return;
    var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putProperty(cTID('Chnl'), sTID("selection"));
    desc1.putReference(cTID('null'), ref1);
    var ref2 = new ActionReference();
    try{
        ref2.putEnumerated(cTID('Chnl'), cTID('Chnl'), cTID('Trsp'));
        ref2.putName(cTID('Lyr '), LayerName);
        desc1.putReference(cTID('T   '), ref2);
        executeAction(cTID('setd'), desc1, dialogMode);
        AGlog.createEvent('Status [Area][Info]: Se selecciono el area de la capa: '+ LayerName);
    }catch(e){
        AGlog.createEvent('Status [Area][Error]: No Se selecciono el area de la capa: '+ LayerName +'. Es este el nombre correcto de la capa?');
    }
};

  function selectSolidArea(enabled, withDialog,LayerName) {
    AGlog.createEvent('Select [Area]: Seleccionando Area de capa: '+ LayerName);
    if (enabled != undefined && !enabled)
      return;
    var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putProperty(cTID('Chnl'), sTID("selection"));
    desc1.putReference(cTID('null'), ref1);
    var ref2 = new ActionReference();    
    try{
        ref2.putEnumerated(cTID('Path'), cTID('Path'), sTID("vectorMask"));
        ref2.putName(cTID('Lyr '), LayerName);
        desc1.putReference(cTID('T   '), ref2);
        desc1.putInteger(cTID('Vrsn'), 1);
        desc1.putBoolean(sTID("vectorMaskParams"), true);
        executeAction(cTID('setd'), desc1, dialogMode);
        AGlog.createEvent('Status [Area][Info]: Se selecciono el area de la capa: '+ LayerName);
    }catch(e){
        AGlog.createEvent('Status [Area][Error]: No Se selecciono el area de la capa: '+ LayerName +'. Es este el nombre correcto de la capa?');
    }
  };

function newColorLayerBySelection(red,green,blue,selectLayer) {
    AGlog.createEvent('Create [Layer]: Creando capa con de seleccion: '+ selectLayer);
    try{
        newLayer = app.activeDocument.artLayers.add();
        newLayer.name = red + "_" +green + "_" + blue;
        newColor = new SolidColor;
        newColor.rgb.red = red;
        newColor.rgb.green = green;
        newColor.rgb.blue = blue;
        SetSelectionArea(true,false,selectLayer)
        app.activeDocument.selection.fill(newColor);
        app.activeDocument.selection.deselect();
    }catch(e){
        AGlog.createEvent('Status [Layer][Error]: No se creo la capa:\n'+ e);
    }
};

function getLayerMetrics(){
    var metricLayer = app.activeDocument.activeLayer;
    var width = metricLayer.bounds[2]-metricLayer.bounds[0];
    var length = metricLayer.bounds[3]-metricLayer.bounds[1];
    AGlog.createEvent('Metrics [Layer][Info]: width:'+ width +', height:'+length);
    return {'w': width, 'h': length};
}

function deleteLayer(enabled, withDialog) {
    if (enabled != undefined && !enabled)
      return;
    var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putEnumerated(cTID('Lyr '), cTID('Ordn'), cTID('Trgt'));
    desc1.putReference(cTID('null'), ref1);
    var list1 = new ActionList();
    list1.putInteger(69);
    desc1.putList(cTID('LyrI'), list1);
    executeAction(cTID('Dlt '), desc1, dialogMode);
};


 function trim(enabled, withDialog) {
    AGlog.createEvent('Trim [Area]: Haciendo trim al area del documento activo');
    if (enabled != undefined && !enabled)
      return;
    var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
    var desc1 = new ActionDescriptor();
    desc1.putEnumerated(sTID("trimBasedOn"), sTID("trimBasedOn"), cTID('Trns'));
    desc1.putBoolean(cTID('Top '), true);
    desc1.putBoolean(cTID('Btom'), true);
    desc1.putBoolean(cTID('Left'), true);
    desc1.putBoolean(cTID('Rght'), true);
    try{
        executeAction(sTID('trim'), desc1, dialogMode);
        AGlog.createEvent('Trim [Area][Info]: Trim ejecutado.');
    }catch(e){
        AGlog.createEvent('Trim [Area][Error]: No se pudo hacer trim.\n'+e);
     }
 };


function alignToZone(enabled, withDialog, alignTo) {
    AGlog.createEvent('Align [Layer]: Moviendo capa a: '+ alignTo);
    switch(alignTo){
        case "Top":
            alignTo = "ADSTops";
            break;
        case "Bottom":
            alignTo = "ADSBottoms";
            break;
        case "Left":
            alignTo = "ADSLefts";
            break;
        case "Right":
            alignTo = "ADSRights";
            break;
        case "CenterV":
            alignTo = "ADSCentersV";
            break;
        case "CenterH":
            alignTo = "ADSCentersH";
            break;
    }
    if (enabled != undefined && !enabled)
      return;
    var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    try{
        ref1.putEnumerated(cTID('Lyr '), cTID('Ordn'), cTID('Trgt'));
        desc1.putReference(cTID('null'), ref1);
        desc1.putEnumerated(cTID('Usng'), cTID('ADSt'), sTID(alignTo));
        executeAction(cTID('Algn'), desc1, dialogMode);
        AGlog.createEvent('Align [Layer][Info]: Se movio capa a: '+ alignTo);
    }catch(e){
        AGlog.createEvent('Align [Layer][Error]: No se movio la capa. Hay un area seleccionada?\n'+e);
    }
};

function openSmartObject(enabled, withDialog) {
    AGlog.createEvent('Open [SmartObject]: Abriendo.');
    if (enabled != undefined && !enabled)
      return;
    var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
    var desc1 = new ActionDescriptor();
    try{
        executeAction(sTID('placedLayerEditContents'), desc1, dialogMode);  
        AGlog.createEvent('Open [SmartObject][Info]: abierto.');
    }catch(e){
        AGlog.createEvent('Open [SmartObject][Error]: No se pudo abrir. Es un smart object?\n'+e);
    }
};

  function saveObject(enabled, withDialog) {
    AGlog.createEvent('Save [currentDocument]: Salvando.');
    if (enabled != undefined && !enabled)
      return;
    var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
    try{
        executeAction(cTID('save'), undefined, dialogMode);
        AGlog.createEvent('Save [Status][info]: Salvado.');
    }catch(e){
        AGlog.createEvent('Save [Status][Error]: No se Salvo.'+e);
    }
};

function setOnly(enabled, withDialog) {
    AGlog.createEvent('Set [currentDocument]: se utiliza?.');
    if (enabled != undefined && !enabled)
      return;
    var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
    executeAction(cTID('setd'), undefined, dialogMode);
};


function updateSmartObject(enabled, withDialog) {
    AGlog.createEvent('Update [smartObject]: Actualizando.');
    if (enabled != undefined && !enabled)
      return;
    var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
    try{        
        executeAction(sTID('updatePlacedLayer'), undefined, dialogMode);
        AGlog.createEvent('Update [status][Info]: Actualizado.');
    }catch(e){
        AGlog.createEvent('Update [status][Error]: No se actualizo.\n'+e);
    }
};
 
function closeObject(enabled, withDialog) {
    AGlog.createEvent('Close [currentDocument]: Cerrando.');
    if (enabled != undefined && !enabled)
      return;
    var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
    try{
        executeAction(cTID('Cls '), undefined, dialogMode);
        AGlog.createEvent('Close [status][Info]: Cerrado.');
    }
    catch(e){
        AGlog.createEvent('Close [status][Error]: No se cerro.\n'+e);
    }
};

function closeDocument(enabled, withDialog) {
    AGlog.createEvent('Close [Document]: Cerrando.');
    if (enabled != undefined && !enabled)
      return;
    var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
    var desc1 = new ActionDescriptor();
    desc1.putInteger(cTID('DocI'), 1559);
    desc1.putBoolean(sTID("forceNotify"), true);
    try{
        executeAction(cTID('Cls '), undefined, dialogMode);
        AGlog.createEvent('Close [status][Info]: Cerrado.');
    }
    catch(e){
        AGlog.createEvent('Close [status][Error]: No se cerro.\n'+e);
    }
};

  function changeCanvasSize(enabled, withDialog, size) {
    AGlog.createEvent('Resize [canvas]: Transformando canvas. (Size: '+size.width+':'+size.height+')');
    if (enabled != undefined && !enabled)
      return;
    var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
    var desc1 = new ActionDescriptor();
    try{
        desc1.putUnitDouble(cTID('Wdth'), cTID('#Pxl'), size.width);
        desc1.putUnitDouble(cTID('Hght'), cTID('#Pxl'), size.height);
        desc1.putEnumerated(cTID('Hrzn'), cTID('HrzL'), cTID('Cntr'));
        desc1.putEnumerated(cTID('Vrtc'), cTID('VrtL'), cTID('Cntr'));
        executeAction(sTID('canvasSize'), desc1, dialogMode);
        AGlog.createEvent('Resize [status][Info]: Transformado.');
    }catch(e){
        AGlog.createEvent('Resize [status][Info]: No se pudo transformar.\n'+e);
    }
  };

function placeObject(enabled, withDialog, file) {
    AGlog.createEvent('Place [Image]: Insertando imagen: '+file);
    if (enabled != undefined && !enabled)
      return;
    var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
    var desc1 = new ActionDescriptor();
    try{
        desc1.putPath(cTID('null'), new File(file));
        desc1.putEnumerated(cTID('FTcs'), cTID('QCSt'), sTID("QCSAverage"));
        var desc2 = new ActionDescriptor();
        desc2.putUnitDouble(cTID('Hrzn'), cTID('#Pxl'), 0);
        desc2.putUnitDouble(cTID('Vrtc'), cTID('#Pxl'), 0);
        desc1.putObject(cTID('Ofst'), cTID('Ofst'), desc2);
        executeAction(cTID('Plc '), desc1, dialogMode);
        AGlog.createEvent('Status [Image][info]: Imagen Insertanda');
    }catch(e){
        AGlog.createEvent('Status [Image][Error]: No se pudo insertar\n'+e);
    }
};

function changeSolidColor(enabled, withDialog, rgb) {
    AGlog.createEvent('Change [ColorSolid]: Cambiando color');
    if (enabled != undefined && !enabled)
      return;
    var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
    if(rgb == undefined ) rgb  = {r: 255 , g: 255, b: 255};
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    try{
        ref1.putEnumerated(sTID("contentLayer"), cTID('Ordn'), cTID('Trgt'));
        desc1.putReference(cTID('null'), ref1);
        var desc2 = new ActionDescriptor();
        var desc3 = new ActionDescriptor();
        desc3.putDouble(cTID('Rd  '), rgb.r);
        desc3.putDouble(cTID('Grn '), rgb.g);
        desc3.putDouble(cTID('Bl  '), rgb.b);
        desc2.putObject(cTID('Clr '), sTID("RGBColor"), desc3);
        desc1.putObject(cTID('T   '), sTID("solidColorLayer"), desc2);
        executeAction(cTID('setd'), desc1, dialogMode);
        AGlog.createEvent('Status [ColorSolid][info]: Color cambiado a: '+[rgb.r,rgb.g,rgb.b].toString());
    }catch(e){
        AGlog.createEvent('Status [ColorSolid][Error]: No se pudo cambiar. Es un solido?\n'+e);
    }
};

function renameLayer(Name, enabled, withDialog) {
    AGlog.createEvent('Rename [layer]: Cambiando nombre de capa a: '+Name);
    if (enabled != undefined && !enabled)
      return;
    var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putEnumerated(cTID('Lyr '), cTID('Ordn'), cTID('Trgt'));
    desc1.putReference(cTID('null'), ref1);
    var desc2 = new ActionDescriptor();
    try{
        desc2.putString(cTID('Nm  '), Name);
        desc1.putObject(cTID('T   '), cTID('Lyr '), desc2);
        executeAction(cTID('setd'), desc1, dialogMode);
        AGlog.createEvent('Status [layer][info]: Cambiado');
    }catch(e){
        AGlog.createEvent('Status [layer][Error]: No se renombro.\n'+e);
    }
};

  function changeTextSize(enabled, withDialog, size) {
    AGlog.createEvent('Change [TextSize]: Cambiando el tamano del texto a:'+ size);
    if (enabled != undefined && !enabled)
      return;
    var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putProperty(cTID('Prpr'), cTID('TxtS'));
    ref1.putEnumerated(cTID('TxLr'), cTID('Ordn'), cTID('Trgt'));
    desc1.putReference(cTID('null'), ref1);
    var desc2 = new ActionDescriptor();
    try{
        desc2.putInteger(sTID("textOverrideFeatureName"), 808465458);
        desc2.putInteger(sTID("typeStyleOperationType"), 3);
        desc2.putUnitDouble(cTID('Sz  '), cTID('#Pnt'), size);
        desc1.putObject(cTID('T   '), cTID('TxtS'), desc2);
        executeAction(cTID('setd'), desc1, dialogMode);
        AGlog.createEvent('Status [TextSize][info]: Cambiado');
    }catch(e){
        AGlog.createEvent('Status [TextSize][Error]: No se cambio.\n'+e);
    }
  };

function collapseAllGroups() {
    AGlog.createEvent('Collapse [Groups]: Se usa?');
    try {  
        var idcollapseAllGroupsEvent = stringIDToTypeID( "collapseAllGroupsEvent" );  
        var desc13 = new ActionDescriptor();  
        return executeAction( idcollapseAllGroupsEvent, desc13, DialogModes.NO );  
    } catch(err) {}  
}  

function selectAllLayers() {
    AGlog.createEvent('Select [CurrentDocument]: Seleccionando todas las capas del documento activo.');
    var ref = new ActionReference();
    ref.putEnumerated(cTID('Lyr '), cTID('Ordn'), cTID('Trgt'));
    var desc = new ActionDescriptor();
    desc.putReference(cTID('null'), ref);
    try{
        executeAction(sTID('selectAllLayers'), desc, DialogModes.NO);
        AGlog.createEvent('Status [CurrentDocument][info]: Seleccionadas todas las capas del documento activo.');
    }catch(e){
        AGlog.createEvent('Status [CurrentDocument][Error]: No se selecciono nada. existe un documento?\n'+e);
    }
}

function collectLayers(theParent, allLayers) {
    AGlog.createEvent('Collect [Layers]: Obteniendo capas hijas de: '+theParent.name);
    if (!allLayers) {var allLayers = new Array}
    var theNumber = theParent.layers.length - 1;
    for (var m = theNumber; m >= 0; m--) {
        var theLayer = theParent.layers[m];
        var Parentname = theParent.name.split("_")[0] + "_";
        // apply the function to layersets;  
        if (theLayer.typename == "ArtLayer") {
            var oname = theLayer.name.split("_");
            theLayer.name = Parentname + oname[0] + "_" + (oname[1] == undefined ? "layer" : oname[1]);
            allLayers.push(theLayer.name)
        } else {
            allLayers = (collectLayers(theLayer, allLayers))
            // this line includes the layer groups;  
            //allLayers.push(theLayer);
        }
    };
    AGlog.createEvent('Status[Layers]: Capas: '+allLayers.toString());
    return allLayers
};

function CollectAllParents(theParent, allLayers) {
    AGlog.createEvent('Collect [Sets]: Obteniendo Sets hijos de: '+theParent.name);
    if (!allLayers) {var allLayers = new Array}
    var theNumber = theParent.layers.length - 1;
    for (var m = theNumber; m >= 0; m--) {
        var theLayer = theParent.layers[m];
        var Parentname = theParent.name.split("_")[0] + "_";
        // apply the function to layersets;  
        if (theLayer.typename == "LayerSet") {
            var oname = theLayer.name.split("_");
            theLayer.name = oname[0] + "_LayerSet";
            allLayers.push(theLayer.name)
        }
    };
    AGlog.createEvent('Status [Sets][info]:  '+allLayers.toString());
    return allLayers
};

function showLayer(enabled, withDialog){
    AGlog.createEvent('Visibility [layers]: Mostrando layers seleccionadas');
    if (enabled != undefined && !enabled)
      return;
    var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
    var desc1 = new ActionDescriptor();
    var list1 = new ActionList();
    var ref1 = new ActionReference();
    ref1.putEnumerated(cTID('Lyr '), cTID('Ordn'), cTID('Trgt'));
    list1.putReference(ref1);
    desc1.putList(cTID('null'), list1);
    executeAction(cTID('Shw '), desc1, dialogMode);
}

function hideLayers() {
    AGlog.createEvent('Visibility [layers]: Ocultando layers seleccionadas');
    var ref = new ActionReference();
    ref.putEnumerated(cTID('Lyr '), cTID('Ordn'), cTID('Trgt'));
    var list = new ActionList();
    list.putReference(ref);
    var desc = new ActionDescriptor();
    desc.putList(cTID('null'), list);
    executeAction(cTID('Hd  '), desc, DialogModes.NO);
}

function savetempPNG(enabled, withDialog, name) {    
    if (enabled != undefined && !enabled)
      return;
    var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
    var desc1 = new ActionDescriptor();
    var desc2 = new ActionDescriptor();
    desc2.putEnumerated(sTID("PNGInterlaceType"), sTID("PNGInterlaceType"), sTID("PNGInterlaceNone"));
    desc2.putEnumerated(sTID("PNGFilter"), sTID("PNGFilter"), sTID("PNGFilterAdaptive"));
    desc2.putInteger(cTID('Cmpr'), 9);
    desc1.putObject(cTID('As  '), sTID("PNGFormat"), desc2);
    try{
        desc1.putPath(cTID('In  '), new File(projectFolder+"/images/"+name));
        desc1.putInteger(cTID('DocI'), 1569);
        executeAction(cTID('save'), desc1, dialogMode);
        AGlog.createEvent('Save [File]: Imagen guardada con nombre:'+ name + ' en folder: '+ projectFolder+'/images/');
    }catch(e){
        AGlog.createEvent('Save [File][Error]: No se pudo guardar la imagen con nombre:'+ name + ' en folder: '+ projectFolder+'/images/');
    }
};

function saveFinalPNG(enabled, withDialog, name) {
    if (enabled != undefined && !enabled)
      return;
    var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
    var desc1 = new ActionDescriptor();
    var desc2 = new ActionDescriptor();
    desc2.putEnumerated(sTID("PNGInterlaceType"), sTID("PNGInterlaceType"), sTID("PNGInterlaceNone"));
    desc2.putEnumerated(sTID("PNGFilter"), sTID("PNGFilter"), sTID("PNGFilterAdaptive"));
    desc2.putInteger(cTID('Cmpr'), 9);
    desc1.putObject(cTID('As  '), sTID("PNGFormat"), desc2);
    try{
        desc1.putPath(cTID('In  '), new File(projectFolder+"/"+name));
        desc1.putInteger(cTID('DocI'), 1559);
        executeAction(cTID('save'), desc1, dialogMode);
        AGlog.createEvent('Save [File]: Imagen guardada con nombre:'+ name + ' en folder: '+ projectFolder);
    }catch(e){
        AGlog.createEvent('Save [File][Error]: No se pudo guardar la imagen con nombre:'+ name + '.png en folder: '+ projectFolder);
    }
};

function createThumb(file, fileName){
    var psDoc = file;
    var fileName = fileName;
	if(psDoc.height > psDoc.width) {
		psDoc.resizeImage(null,UnitValue(100,'px'),null,ResampleMethod.BICUBIC);
	}
	else {
		psDoc.resizeImage(UnitValue(100,'px'),null,null,ResampleMethod.BICUBIC);
	}
    savetempPNG(true,false,fileName+"-thumb.png");
}

  function changeColor(enabled, withDialog,rgb) {
    AGlog.createEvent('Change [Layer Text/Fill]: Cambiando color');
    if (enabled != undefined && !enabled)
      return;
    if(rgb == undefined ) rgb  = {r: 0 , g: 0, b: 0};
    var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putProperty(cTID('Prpr'), cTID('TxtS'));
    ref1.putEnumerated(cTID('TxLr'), cTID('Ordn'), cTID('Trgt'));
    desc1.putReference(cTID('null'), ref1);
    var desc2 = new ActionDescriptor();
    desc2.putInteger(sTID("textOverrideFeatureName"), 808466226);
    desc2.putInteger(sTID("typeStyleOperationType"), 3);
    var desc3 = new ActionDescriptor();
    try{
    desc3.putDouble(cTID('Rd  '), rgb.r);
    desc3.putDouble(cTID('Grn '), rgb.g);
    desc3.putDouble(cTID('Bl  '), rgb.b);
    desc2.putObject(cTID('Clr '), sTID("RGBColor"), desc3);
    desc1.putObject(cTID('T   '), cTID('TxtS'), desc2);
    executeAction(cTID('setd'), desc1, dialogMode);
    AGlog.createEvent('Status [ColorSolid][info]: Color cambiado a: '+[rgb.r,rgb.g,rgb.b].toString());
    }catch(e){
        AGlog.createEvent('Status [ColorSolid][Error]: No se pudo cambiar. Es un texto/fill layer?\n'+e);
    }
  };


  // Set Rght, Left, Cntr
  function changeAlignment(enabled, withDialog, align) {
    if (enabled != undefined && !enabled)
      return;
    var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putProperty(cTID('Prpr'), sTID("paragraphStyle"));
    ref1.putEnumerated(cTID('TxLr'), cTID('Ordn'), cTID('Trgt'));
    desc1.putReference(cTID('null'), ref1);
    var desc2 = new ActionDescriptor();
    desc2.putInteger(sTID("textOverrideFeatureName"), 808464433);
    desc2.putEnumerated(cTID('Algn'), cTID('Alg '), cTID(align));
    desc1.putObject(cTID('T   '), sTID("paragraphStyle"), desc2);
    executeAction(cTID('setd'), desc1, dialogMode);
  };

  // Set
  function hyphenateText(enabled, withDialog) {
    if (enabled != undefined && !enabled)
      return;
    var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putProperty(cTID('Prpr'), sTID("paragraphStyle"));
    ref1.putEnumerated(cTID('TxLr'), cTID('Ordn'), cTID('Trgt'));
    desc1.putReference(cTID('null'), ref1);
    var desc2 = new ActionDescriptor();
    desc2.putInteger(sTID("textOverrideFeatureName"), 808464439);
    desc2.putBoolean(sTID("hyphenate"), true);
    desc1.putObject(cTID('T   '), sTID("paragraphStyle"), desc2);
    executeAction(cTID('setd'), desc1, dialogMode);
  };

  // Set
  function changeLineHeight(enabled, withDialog,lHeight) {
    if (enabled != undefined && !enabled)
      return;
    var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putProperty(cTID('Prpr'), cTID('TxtS'));
    ref1.putEnumerated(cTID('TxLr'), cTID('Ordn'), cTID('Trgt'));
    desc1.putReference(cTID('null'), ref1);
    var desc2 = new ActionDescriptor();
    desc2.putInteger(sTID("textOverrideFeatureName"), 808465712);
    desc2.putInteger(sTID("typeStyleOperationType"), 3);
    desc2.putUnitDouble(cTID('Bsln'), cTID('#Pnt'), lHeight);
    desc1.putObject(cTID('T   '), cTID('TxtS'), desc2);
    executeAction(cTID('setd'), desc1, dialogMode);
  };


  // Set
  function changeFont(enabled, withDialog,fontNumber) {
    if (enabled != undefined && !enabled)
      return;
    var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putProperty(cTID('Prpr'), cTID('TxtS'));
    ref1.putEnumerated(cTID('TxLr'), cTID('Ordn'), cTID('Trgt'));
    desc1.putReference(cTID('null'), ref1);
    var desc2 = new ActionDescriptor();
    desc2.putInteger(sTID("textOverrideFeatureName"), 808465457);
    desc2.putInteger(sTID("typeStyleOperationType"), 3);

    switch(fontNumber) {
        case 1:
            desc2.putString(sTID("fontPostScriptName"), "Gobold");
            desc2.putString(cTID('FntN'), "Gobold");
            break;
        case 2:
            desc2.putString(sTID("fontPostScriptName"), "ArialMT");
            desc2.putString(cTID('FntN'), "Arial");
            break;
        default:
            desc2.putString(sTID("fontPostScriptName"), "LucidaSansUnicode");
            desc2.putString(cTID('FntN'), "Lucida Sans Unicode");
    }

    desc2.putString(cTID('FntS'), "Regular");
    desc2.putInteger(cTID('Scrp'), 0);
    desc2.putInteger(cTID('FntT'), 1);
    desc2.putUnitDouble(cTID('Sz  '), cTID('#Pnt'), 72);
    desc2.putDouble(cTID('HrzS'), 100);
    desc2.putDouble(cTID('VrtS'), 100);
    desc2.putBoolean(sTID("syntheticBold"), false);
    desc2.putBoolean(sTID("syntheticItalic"), false);
    desc2.putBoolean(sTID("autoLeading"), true);
    desc2.putInteger(cTID('Trck'), 0);
    desc2.putUnitDouble(cTID('Bsln'), cTID('#Pnt'), -11);
    desc2.putDouble(sTID("characterRotation"), 0);
    desc2.putEnumerated(cTID('AtKr'), cTID('AtKr'), sTID("metricsKern"));
    desc2.putEnumerated(sTID("fontCaps"), sTID("fontCaps"), cTID('Nrml'));
    desc2.putEnumerated(sTID("digitSet"), sTID("digitSet"), sTID("defaultDigits"));
    desc2.putEnumerated(sTID("dirOverride"), sTID("dirOverride"), sTID("dirOverrideDefault"));
    desc2.putEnumerated(sTID("kashidas"), sTID("kashidas"), sTID("kashidaDefault"));
    desc2.putEnumerated(sTID("diacVPos"), sTID("diacVPos"), sTID("diacVPosOpenType"));
    desc2.putUnitDouble(sTID("diacXOffset"), cTID('#Pnt'), 0);
    desc2.putUnitDouble(sTID("diacYOffset"), cTID('#Pnt'), 0);
    desc2.putUnitDouble(sTID("markYDistFromBaseline"), cTID('#Pnt'), 15.5000429153442);
    desc2.putEnumerated(sTID("baseline"), sTID("baseline"), cTID('Nrml'));
    desc2.putEnumerated(sTID("otbaseline"), sTID("otbaseline"), cTID('Nrml'));
    desc2.putEnumerated(sTID("strikethrough"), sTID("strikethrough"), sTID("strikethroughOff"));
    desc2.putEnumerated(cTID('Undl'), cTID('Undl'), sTID("underlineOff"));
    desc2.putUnitDouble(sTID("underlineOffset"), cTID('#Pnt'), 0);
    desc2.putBoolean(sTID("ligature"), true);
    desc2.putBoolean(sTID("altligature"), false);
    desc2.putBoolean(sTID("contextualLigatures"), true);
    desc2.putBoolean(sTID("alternateLigatures"), false);
    desc2.putBoolean(sTID("oldStyle"), false);
    desc2.putBoolean(sTID("fractions"), false);
    desc2.putBoolean(sTID("ordinals"), false);
    desc2.putBoolean(sTID("swash"), false);
    desc2.putBoolean(sTID("titling"), false);
    desc2.putBoolean(sTID("connectionForms"), false);
    desc2.putBoolean(sTID("stylisticAlternates"), false);
    desc2.putBoolean(sTID("ornaments"), false);
    desc2.putBoolean(sTID("justificationAlternates"), false);
    desc2.putEnumerated(sTID("figureStyle"), sTID("figureStyle"), cTID('Nrml'));
    desc2.putBoolean(sTID("proportionalMetrics"), false);
    desc2.putBoolean(cTID('kana'), false);
    desc2.putBoolean(sTID("italics"), false);
    desc2.putBoolean(cTID('ruby'), false);
    desc2.putEnumerated(sTID("baselineDirection"), sTID("baselineDirection"), sTID("withStream"));
    desc2.putEnumerated(sTID("textLanguage"), sTID("textLanguage"), sTID("spanishLanguage"));
    desc2.putEnumerated(sTID("japaneseAlternate"), sTID("japaneseAlternate"), sTID("defaultForm"));
    desc2.putDouble(sTID("mojiZume"), 0);
    desc2.putEnumerated(sTID("gridAlignment"), sTID("gridAlignment"), sTID("roman"));
    desc2.putBoolean(sTID("enableWariChu"), false);
    desc2.putInteger(sTID("wariChuCount"), 2);
    desc2.putInteger(sTID("wariChuLineGap"), 0);
    desc2.putDouble(sTID("wariChuScale"), 0.5);
    desc2.putInteger(sTID("wariChuWidow"), 2);
    desc2.putInteger(sTID("wariChuOrphan"), 2);
    desc2.putEnumerated(sTID("wariChuJustification"), sTID("wariChuJustification"), sTID("wariChuAutoJustify"));
    desc2.putInteger(sTID("tcyUpDown"), 0);
    desc2.putInteger(sTID("tcyLeftRight"), 0);
    desc2.putDouble(sTID("leftAki"), -1);
    desc2.putDouble(sTID("rightAki"), -1);
    desc2.putInteger(sTID("jiDori"), 0);
    desc2.putBoolean(sTID("noBreak"), false);
    desc2.putBoolean(cTID('Fl  '), true);
    desc2.putBoolean(cTID('Strk'), false);
    desc2.putBoolean(sTID("fillFirst"), true);
    desc2.putBoolean(sTID("fillOverPrint"), false);
    desc2.putBoolean(sTID("strokeOverPrint"), false);
    desc2.putEnumerated(sTID("lineCap"), sTID("lineCap"), sTID("buttCap"));
    desc2.putEnumerated(sTID("lineJoin"), sTID("lineJoin"), sTID("miterJoin"));
    desc2.putUnitDouble(sTID("lineWidth"), cTID('#Pnt'), 1);
    desc2.putUnitDouble(sTID("miterLimit"), cTID('#Pnt'), 4);
    desc2.putDouble(sTID("lineDashoffset"), 0);
    desc1.putObject(cTID('T   '), cTID('TxtS'), desc2);
    executeAction(cTID('setd'), desc1, dialogMode);
  };

  function savePSD(enabled, withDialog,PSDpath) {
    if (enabled != undefined && !enabled)
      return;
    var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
    var desc1 = new ActionDescriptor();
    var desc2 = new ActionDescriptor();
    desc2.putBoolean(sTID("maximizeCompatibility"), true);
    desc1.putObject(cTID('As  '), cTID('Pht3'), desc2);
    try{
        desc1.putPath(cTID('In  '), new File(PSDpath+".psd"));
        desc1.putInteger(cTID('DocI'), 3715);
        executeAction(cTID('save'), desc1, dialogMode);
    }catch(e){
        AGlog.createEvent('Status [File][Error]: No se pudo crear el PSD\n'+e);
    }
  };


  function addBlur(enabled, withDialog, blurValue) {
    AGlog.createEvent('Blur [layer]: Agregando blur: '+blurValue);
    if (enabled != undefined && !enabled)
      return;
    var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
    var desc1 = new ActionDescriptor();
    try{    
        desc1.putUnitDouble(cTID('Rds '), cTID('#Pxl'), blurValue);
        executeAction(sTID('gaussianBlur'), desc1, dialogMode);
        AGlog.createEvent('Status [layer][info]: blur agregado.');
    }catch(e){
        AGlog.createEvent('Status [layer][Error]: Imposible agregar blur. Es una capa vacia? ');
    }
  };

  // Set
  function addOpacity(enabled, withDialog, opacityValue) {
    AGlog.createEvent('Opacity [layer]: Valor de opacidad: '+opacityValue);
    if (enabled != undefined && !enabled)
      return;
    var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putEnumerated(cTID('Lyr '), cTID('Ordn'), cTID('Trgt'));
    desc1.putReference(cTID('null'), ref1);
    var desc2 = new ActionDescriptor();
    try{
        desc2.putUnitDouble(cTID('Opct'), cTID('#Prc'), opacityValue);
        desc1.putObject(cTID('T   '), cTID('Lyr '), desc2);
        executeAction(cTID('setd'), desc1, dialogMode);
        AGlog.createEvent('Opacity [Status][Info]: Valor de opacidad modificado.');
    }catch(e){
        AGlog.createEvent('Opacity [Status][Error]: Valor de opacidad sin cambios.\n'+e);
    }
  };

  function addExifData(){
    AGlog.createEvent('DocInfo [currentDocument]: Agregando Exif');
    var docRef = app.activeDocument;
    docRef.info.author = "Cesar Velasco"
    docRef.info.caption = 
    docRef.info.captionWriter = "AG Programmer"
    docRef.info.copyrightNotice = "Copyright (c) AG Generator Photography";
    docRef.info.copyrighted = CopyrightedType.PUBLICDOMAIN;
    
    var theDate = new Date()
    // the year is from 1900 ????
    var theYear = (theDate.getYear() + 1900).toString()
    // convert the month from 0..12 to 00..12
    var theMonth = theDate.getMonth().toString()
    if (theDate.getMonth() < 10) {
    theMonth = "0" + theMonth
    }
    // convert the day from 0..31 to 00.31
    var theDay = theDate.getDate().toString()
    if (theDate.getDate() < 10) {
    theDay = "0" + theDay
    }
    var theTime = theDate.getHours().toString()+theDate.getMinutes().toString()+theDate.getSeconds().toString();
    // stick them all together
    docRef.info.creationDate = theYear + theMonth + theDay +" T"+ theTime;
    docRef.info.caption = theYear + theMonth + theDay +"T"+ theTime;
  }

  // Set
  function addFillOpacity(enabled, withDialog, opacityValue) {
      AGlog.createEvent('Opacity [layer]: Agregando opacidad (Fill): '+ opacityValue);
    if (enabled != undefined && !enabled)
      return;
    var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putEnumerated(cTID('Lyr '), cTID('Ordn'), cTID('Trgt'));
    desc1.putReference(cTID('null'), ref1);
    var desc2 = new ActionDescriptor();
    try{
        desc2.putUnitDouble(sTID("fillOpacity"), cTID('#Prc'), opacityValue);
        desc1.putObject(cTID('T   '), cTID('Lyr '), desc2);
        executeAction(cTID('setd'), desc1, dialogMode);
        AGlog.createEvent('Opacity [Status][Info]: Valor de opacidad modificado.');
    }catch(e){
        AGlog.createEvent('Opacity [Status][Error]: Valor de opacidad sin cambios.\n'+e);
    }
  };

  // Layer Via Copy
  function copyLayer(enabled, withDialog) {
    if (enabled != undefined && !enabled)
      return;
    var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
    executeAction(sTID('copyToLayer'), undefined, dialogMode);
  };


  // Invert
  function InvertLayer(enabled, withDialog) {
    if (enabled != undefined && !enabled)
      return;
    var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
    executeAction(cTID('Invr'), undefined, dialogMode);
  };

  // Make
  function makeHue(enabled, withDialog) {
    if (enabled != undefined && !enabled)
      return;
    var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putClass(cTID('AdjL'));
    desc1.putReference(cTID('null'), ref1);
    var desc2 = new ActionDescriptor();
    var desc3 = new ActionDescriptor();
    desc3.putEnumerated(sTID("presetKind"), sTID("presetKindType"), sTID("presetKindDefault"));
    desc3.putBoolean(cTID('Clrz'), false);
    desc2.putObject(cTID('Type'), cTID('HStr'), desc3);
    desc1.putObject(cTID('Usng'), cTID('AdjL'), desc2);
    try{
        executeAction(cTID('Mk  '), desc1, dialogMode);
        AGlog.createEvent('Create [Layer]: layer de ajuste Hue creado');
    }catch(e){
        AGlog.createEvent('Create [Layer][error]: layer de ajuste Hue no fue creado');
    }
  };

  // Set
  function addHue(enabled, withDialog) {
    if (enabled != undefined && !enabled)
      return;
    var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putEnumerated(cTID('AdjL'), cTID('Ordn'), cTID('Trgt'));
    desc1.putReference(cTID('null'), ref1);
    var desc2 = new ActionDescriptor();
    var list1 = new ActionList();
    var desc3 = new ActionDescriptor();
    desc3.putInteger(cTID('H   '), 0);
    desc3.putInteger(cTID('Strt'), 35);
    desc3.putInteger(cTID('Lght'), -5);
    list1.putObject(cTID('Hst2'), desc3);
    desc2.putList(cTID('Adjs'), list1);
    desc1.putObject(cTID('T   '), cTID('HStr'), desc2);
    executeAction(cTID('setd'), desc1, dialogMode);
  };

  // Create Clipping Mask
  function clipMask(enabled, withDialog) {
    if (enabled != undefined && !enabled)
      return;
    var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putEnumerated(cTID('Lyr '), cTID('Ordn'), cTID('Trgt'));
    desc1.putReference(cTID('null'), ref1);
    executeAction(sTID('groupEvent'), desc1, dialogMode);
  };

  // Move
  function moveLayers(enabled, withDialog, MoveValues) {
    if (enabled != undefined && !enabled)
      return;
    var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putEnumerated(cTID('Lyr '), cTID('Ordn'), cTID('Trgt'));
    desc1.putReference(cTID('null'), ref1);
    var desc2 = new ActionDescriptor();
    desc2.putUnitDouble(cTID('Hrzn'), cTID('#Pxl'), MoveValues.x);
    desc2.putUnitDouble(cTID('Vrtc'), cTID('#Pxl'), MoveValues.y);
    desc1.putObject(cTID('T   '), cTID('Ofst'), desc2);
    executeAction(cTID('move'), desc1, dialogMode);
  };

function endOfProcess(folder){
    app.refresh();
    copyLogTofolder(folder);
    alert('La Creación ha terminado con éxito!');    
    var _projectFolder = new Folder(folder);    
    _projectFolder.execute();    
}

function copyLogTofolder(folder){
    var cfile  = File(folder+ "/Eventlog.txt");
    var log = AGlog.file;
        log.open("e", "TEXT", "????");
        logR = log.read();
        log.close();
    cfile.encoding = "UTF8";
    cfile.open("e", "TEXT", "????");
    cfile.write(logR);
    cfile.close();
}

function readJson(file){
    var json;
    if(file != undefined){
        json = JSON.parse(file);  
    }else{
        json = projectObject;
     }
    ////$.writeln ('readJson: ',json);
    return json;
}

if(scriptStatus){
    AGlog.createEvent('Window [Start Screen]: Abriendo ventana');
	callWindow('StarScreen',undefined);
} 