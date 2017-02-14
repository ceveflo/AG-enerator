function VersusImage(){
    
    var templateName;
    var files = projectObject.fileNumber;
    var type = templateTypes[projectObject.type];

    var text_top = projectObject.text.top;
    var text_bottom = projectObject.text.bottom;
    
    var template = getTemplate();
    openPSDTemplate(true,false,template);    
    
    var _projectFolder = projects + "/[AG-Project]" + projectObject.ProjectName + "/";

    try{
        savePSD(true,false,(_projectFolder+projectObject.ProjectName+" ("+template+")"));
    }catch(_){
        $.writeln('No se pudo generar el nuevo PSD');
    }    
    
    selectLayer(true,false,'WorkingArea');
   
        
    function collectLayers(theParent, allLayers) {
        if (!allLayers) {var allLayers = new Array}
        var theNumber = theParent.layers.length - 1;
        for (var m = theNumber; m >= 0; m--) {
            var theLayer = theParent.layers[m];
            theLayer.name = theParent.name + "_" + m;
            // apply the function to layersets;  
            if (theLayer.typename == "ArtLayer") {
                allLayers.push(theLayer)
            } else {
                allLayers = (collectLayers(theLayer, allLayers))
                // this line includes the layer groups;  
                allLayers.push(theLayer);
            }
        };
        return allLayers
    };

    function EditWorkingArea (){
        var theLayers = collectLayers(app.activeDocument.activeLayer, []); 
        $.evalFile (setSizes);
        for (var l = 0; l < theLayers.length ; ++l) {
            selectLayer(true,false,theLayers[l].name);
            openSmartObject();
            placeObject(true,false, _projectFolder+"images/"+projectObject.files[l]);
            renameLayer();
            FitLayerToCanvas(true);
            selectSolidArea(true,false,"imagePlaceHolder");
            
            try{
                selectLayer(true,false,"oimage");
                alignToZone(true,false,'CenterH');;
            }catch(e){
                $.writeln("No se pudo centrar: ",e)                
             }
            
            saveObject();
            updateSmartObject();
            closeObject();
        }
    
        if(text_top.enable){
            updateText(text_top,"Top_Text");
        }
        if(text_bottom.enable){
            updateText(text_bottom,"Bottom_Text");
        }
    
        selectLayer(true,false,"backgroundColor");
        var mainBg = projectObject.colors.background;
        changeSolidColor(true,false, {'r': (mainBg[0] * 255), 'g': (mainBg[1] * 255), 'b': (mainBg[2] * 255)});
        
        reorderReactions();
    
        saveFinalPNG(true,false,projectObject.ProjectName)
        
        saveObject();
        closeDocument();
        _projectFolder = new Folder(_projectFolder);
        _projectFolder.execute()    
    
    
    }

    function updateText(obj,layer){
        selectLayer(true,false,layer);
        openSmartObject();
        selectLayer(true,false,"background_Text");
        var textTochange = app.activeDocument.activeLayer; 

        textTochange.textItem.contents = obj.text;
        
              
        var txt_color = projectObject.colors.text;
        changeColor(true,false, {'r': (txt_color[0] * 255), 'g': (txt_color[1] * 255), 'b': (txt_color[2] * 255)})
        
        selectLayer(true,false,"background_shape");
        var bg_color = projectObject.colors.mask;
        changeSolidColor(true,false,{'r': (bg_color[0] * 255), 'g': (bg_color[1] * 255), 'b': (bg_color[2] * 255)});
    
        saveObject();
        updateSmartObject();
        closeObject();
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
        for(var i = 0; i < files; i++){
            selectLayer(true,false,"faceBookReactions_"+(i+1));
            openSmartObject();
            selectAllLayers();
            hideLayers();
            //$.writeln(projectObject.reactions.list,projectObject.reactions.list[i])
            selectLayer(true,false,projectObject.reactions.list[i].toString());
            showLayer();
            
            saveObject();
            updateSmartObject();
            closeObject();
        }
    }

    EditWorkingArea();
}