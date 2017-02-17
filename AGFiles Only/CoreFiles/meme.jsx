function MemeImage(){

    var templateName;
    var files = projectObject.fileNumber;
    var type = templateTypes[projectObject.type];    
    var text_desc = projectObject.text.description;
    var text_top = projectObject.text.top;
    var text_bottom = projectObject.text.bottom;
    var text_tag = projectObject.text.tag;
    var kind = projectObject.imageType;
    
    var template = getTemplate();        
    
    var _projectFolder = projectFolder+ "/";
    AGlog.createEvent('Execute [Generator]: Ejecutando proyecto: '+ _projectFolder);    
	
	verifyExistingImage();
    
    openPSDTemplate(true,false,template);
    var docRef = app.activeDocument;
    
    try{
        savePSD(true,false,(_projectFolder+projectObject.ProjectName+" ("+template+")"));
        AGlog.createEvent('Create [File]: Creando PSD del proyecto basado en el template:'+ template);
    }catch(_){
        AGlog.createEvent('Status [File][Error]: No se pudo crear el PSD');
    }
    
    var mainLayerSets = CollectAllParents(docRef,[]);
    //var mainDocLayers = collectLayers(docRef,null);
    
    selectLayer(true,false,mainLayerSets[1]);

    function EditWorkingArea (){        
        var theLayers = collectLayers(app.activeDocument.activeLayer, []);
        try{
            AGlog.createEvent('Status [Place]: Insertando Imagen');
            updateImage(theLayers[0]);
        }catch(e){
            AGlog.createEvent('Status [Place][Error]: No se pudo colocar la imagen:\n'+ e);
        }
    
        if(text_top.enable || text_bottom.enable){
            selectLayer(true,false,mainLayerSets[2]);
            var theTexts = collectLayers(app.activeDocument.activeLayer, []); 
            for (var l = 0; l < theTexts.length ; ++l) {
                var oname = theTexts[l].split("_");
                AGlog.createEvent('Search [Layer by Split]:  Buscando capa: '+ oname[1] +', en: '+oname.toString());
                if("Top" == oname[1]){
                    AGlog.createEvent('Search [Status]:  Capa: '+ oname[1] +' encontrada.' );
                    updateText(text_top, theTexts[l]);
                }else if("Bottom" == oname[1]){
                    AGlog.createEvent('Search [Status]:  Capa: '+ oname[1] +' encontrada.' );
                    updateText(text_bottom,theTexts[l]);
                }
            }
        }
    
        selectLayer(true,false,mainLayerSets[0]);
        var theSys = collectLayers(app.activeDocument.activeLayer, []);
        selectLayer(true,false,theSys[0]);
        var mainBg = projectObject.colors.background;
        changeSolidColor(true,false, {'r': (mainBg[0] * 255), 'g': (mainBg[1] * 255), 'b': (mainBg[2] * 255)});
        
        addExifData();        
        saveFinalPNG(true,false,projectObject.ProjectName);
        saveObject();        
        closeDocument();
        endOfProcess(_projectFolder);
    }
    
    function getTemplate(){
         var text = "";
         templateName = type + text;
         return templateName;
    }

    function updateImage(Layer){
            $.evalFile (setSizes);
            selectLayer(true,false,Layer);
                var oname = Layer;
                openSmartObject();
                var sOLayers = collectLayers(app.activeDocument,null);
                selectLayer(true,false,sOLayers[0]);
                placeObject(true,false, _projectFolder+"/images/"+projectObject.files[0]);
                renameLayer();
                FitLayerToCanvas(true,true);
                app.activeDocument.selection.selectAll();
                selectLayer(true,false,"oimage");
                alignToZone(true,false,'CenterH');;      
            saveObject();
            updateSmartObject();
            closeObject();
            renameLayer(oname);
    }

    function updateText(obj,layer){        
        selectLayer(true,false,layer);
        showLayer();
        openSmartObject();
        var sOlayers = collectLayers(app.activeDocument,[]);
        selectLayer(true,false,sOlayers[1]);
        var textTochange = app.activeDocument.activeLayer; 

        textTochange.textItem.contents = obj.text;        
              
        var txt_color = projectObject.colors.text;
        changeColor(true,false, {'r': (txt_color[0] * 255), 'g': (txt_color[1] * 255), 'b': (txt_color[2] * 255)})
        
        selectLayer(true,false,sOlayers[0]);
        var bg_color = projectObject.colors.mask;
        changeSolidColor(true,false,{'r': (bg_color[0] * 255), 'g': (bg_color[1] * 255), 'b': (bg_color[2] * 255)});
        app.refresh();        
        changeOpacity(sOlayers[0]);
    
        saveObject();
        updateSmartObject();
        closeObject();
    }

    function verifyExistingImage(){
        var filePath = _projectFolder + projectObject.ProjectName + ".png";
        var file = new File(filePath);
        if ( file.exists ) {
            var doc = app.open(file);
            var info = app.activeDocument.info;
            saveFinalPNG(true,false,projectObject.ProjectName + "-" + info.caption);
            closeObject();
        }        
    }

    EditWorkingArea();    

}