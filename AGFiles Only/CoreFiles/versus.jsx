function VersusImage(){
    
    var templateName;
    var files = projectObject.fileNumber;
    var type = templateTypes[projectObject.type];

    var text_top = projectObject.text.top;
    var text_bottom = projectObject.text.bottom;
    
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
//    AGlog.createEvent('Verify [Template][Info]: La plantilla seleccionada tiene los siguientes sets: \n'+ mainLayerSets.toString());
    selectLayer(true,false,mainLayerSets[1]);

    function EditWorkingArea (){
        var theLayers = collectLayers(app.activeDocument.activeLayer, []); 
//        AGlog.createEvent('Verify [Template][Info]: El set seleccionado tiene los siguientes layers: \n'+ theLayers.toString());
        
        $.evalFile (setSizes);
        for (var l = 0; l < theLayers.length ; ++l) {
            var oLname = theLayers[l];
            selectLayer(true,false,theLayers[l]);
            openSmartObject();
            placeObject(true,false, _projectFolder+"images/"+projectObject.files[l]);
            renameLayer('oImage');
            FitLayerToCanvas(true);
            app.activeDocument.selection.selectAll();
            
            try{
                selectLayer(true,false,"oImage");
                alignToZone(true,false,'CenterH');;
            }catch(e){
                //$.writeln("No se pudo centrar: ",e)                
             }
            
            saveObject();
            updateSmartObject();
            closeObject();
            renameLayer(oLname);
        }
        
        
        if(text_top.enable || text_bottom.enable){
            selectLayer(true,false,mainLayerSets[3]);
            var theTexts = collectLayers(app.activeDocument.activeLayer, []); 
//            AGlog.createEvent('Verify [Template][Info]: El set seleccionado tiene los siguientes layers: \n'+ theTexts.toString());
            for (var l = 0; l < theTexts.length ; ++l) {
                var oname = theTexts[l].split("_");
                AGlog.createEvent('Search [Layer by Split]:  Buscando capa: '+ oname[2] +', en: '+oname.toString());
                if("Top" == oname[2]){
                    AGlog.createEvent('Search [Status]:  Capa: '+ oname[2] +' encontrada.' );
                    updateText(text_top, theTexts[l]);
                }else if("Bottom" == oname[2]){
                    AGlog.createEvent('Search [Status]:  Capa: '+ oname[2] +' encontrada.' );
                    updateText(text_bottom,theTexts[l]);
                }
            }
        }
    
        selectLayer(true,false,mainLayerSets[0]);
        var theSys = collectLayers(app.activeDocument.activeLayer, []);
        selectLayer(true,false,theSys[0]);
        var mainBg = projectObject.colors.background;
        changeSolidColor(true,false, {'r': (mainBg[0] * 255), 'g': (mainBg[1] * 255), 'b': (mainBg[2] * 255)});
        
        reorderReactions();

        addExifData();
        saveFinalPNG(true,false,projectObject.ProjectName)
        
        saveObject();
        closeDocument();
        endOfProcess(_projectFolder);
    }

    function updateText(obj,layer){
        var oLname = layer;
        selectLayer(true,false,layer);
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
    
        saveObject();
        updateSmartObject();
        closeObject();
        renameLayer(oLname)
    }

    function getTemplate(){
         var text = "";
         if(!text_top.enable && !text_bottom.enable){
             text = "_nt"
         }else if(text_top.enable){
             if(text_bottom.enable){
                text = "";
             }else{
                 text = "_top";
             }             
         }else if(text_bottom.enable){
              text = "_bottom";
         }
     
         templateName = type + files + text;
         templateName
         return templateName;
    }

    function reorderReactions(){
        selectLayer(true,false,mainLayerSets[2]);
        var theLayers = collectLayers(app.activeDocument.activeLayer, []); 
        $.evalFile (setSizes);
        for (var l = 0; l < theLayers.length ; ++l) {            
            selectLayer(true,false,theLayers[l]);
            openSmartObject();
            selectAllLayers();
            hideLayers();
            selectLayer(true,false,projectObject.reactions.list[l].toString());
            showLayer();            
            saveObject();
            updateSmartObject();
            closeObject();
        }
    }


    function verifyExistingImage(){
        AGlog.createEvent('Verify [File]: Buscando si ya se ha creado una imagen con nombre:'+ projectObject.ProjectName);
        var filePath = _projectFolder + projectObject.ProjectName + ".png";
        var file = new File(filePath);
        if ( file.exists ) {
            var doc = app.open(file);
            var info = app.activeDocument.info;
            AGlog.createEvent('Status [File]: Imagen encontrada, renombrando a:'+ projectObject.ProjectName + "-" + info.caption);
            saveFinalPNG(true,false,projectObject.ProjectName + "-" + info.caption);
            closeObject();
        }        
    }
    
    EditWorkingArea();
}