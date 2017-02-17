function NormalImage(){    
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
        AGlog.createEvent('Create [File]: Creando PSD del proyecto basado en el template');
    }catch(_){
        AGlog.createEvent('Status [File][Error]: No se pudo crear el PSD');
    }
    
    var mainDocLayers = collectLayers(docRef,null);
    AGlog.createEvent('Verify [Template][Info]: La plantilla seleccionada tiene las siguientes capas: \n'+ mainDocLayers.toString());

    function EditWorkingArea (){        
        
       selectLayer(true,false,mainDocLayers[0]); // Setting Background Color
       var mainBg = projectObject.colors.background;
       changeSolidColor(true,false, {'r': (mainBg[0] * 255), 'g': (mainBg[1] * 255), 'b': (mainBg[2] * 255)});
        
        try{
            AGlog.createEvent('Status [Place]: Insertando Imagen');
            updateImage();
        }catch(e){
            AGlog.createEvent('Status [Place][Error]: No se pudo colocar la imagen:\n'+ e);
        }
      
        if(text_desc.enable || text_top.enable){
            updateText({},3,true,true); //setting TextLayers
            
            SetSelectionArea(true,false,mainDocLayers[1]);
            
            selectLayer(true,false,mainDocLayers[3]);
            alignToZone(true,false,'Bottom');
            alignToZone(true,false,'Right');
            moveLayers(true,false,{x: -10, y: -60});
            nullSelection();
        }else{
            selectLayer(true,false,mainDocLayers[3]); // Hiden MainText
            hideLayers();
         }
        /*    
        if(text_bottom.enable){
            updateText(text_bottom,"BottomText");
        }else{
            selectLayer(true,false,"BottomText");
            hideLayers();
        }
        if(text_tag.enable == true){
            updateTAG(text_tag);
        } 

        
        selectLayer(true,false,"AreaImage");
        addFillOpacity(true,false,0);
        saveFinalPNG(true,false,"[VideoMask]"+projectObject.ProjectName);
        
        
        addFillOpacity(true,false,100);
        
        addExifData();
        saveFinalPNG(true,false,projectObject.ProjectName);
        
    
        saveObject();
        closeDocument();
        _projectFolder = new Folder(_projectFolder);
        _projectFolder.execute()     */
    }

    function updateImage(){
        $.evalFile (setSizes);
        selectLayer(true,false,mainDocLayers[1]);   // Setting AreaImage 
        openSmartObject();
        var soDocLayers = collectLayers(app.activeDocument,null);
        AGlog.createEvent('Verify [SmartObject][Info]: El LayerSmart seleccionado tiene las siguientes capas: \n'+ soDocLayers.toString());
        selectLayer(true,false,soDocLayers[2]);
            openSmartObject();
            var imgDocLayers = collectLayers(app.activeDocument,null);
            AGlog.createEvent('Verify [SmartObject][Info]: El LayerSmart seleccionado tiene las siguientes capas: \n'+ imgDocLayers.toString());
            selectLayer(true,false,imgDocLayers[1]);
            placeObject(true,false, _projectFolder+"images/"+projectObject.files[0]);
            renameLayer();
            FitLayerToCanvas(true,true);
            makeHue();
            addHue();
            clipMask();            
            selectLayer(true, false, "oimage");
            SetSelectionArea(true,false,imgDocLayers[0]);
            alignToZone(true,false,'CenterH');
            nullSelection();
            selectLayer(true,false,imgDocLayers[0]);
            hideLayers();
            saveObject();
            updateSmartObject();
            closeObject();
        selectLayer(true,false,soDocLayers[1]);
        addBlur(true,false,25);
        saveObject();
        updateSmartObject();
        closeObject();
    }

    function updateTAG(obj){
        selectLayer(true,false,"TAG") //text_tag 
        openSmartObject();
        
        selectLayer(true,false,"TagText");
        var textTochange = app.activeDocument.activeLayer; 
        var tagTxt = getTag(obj);
        textTochange.textItem.contents = tagTxt;
        var tagBG = projectObject.colors["tag-text"];
        changeColor(true,false, {'r': (tagBG[0] * 255), 'g': (tagBG[1] * 255), 'b': (tagBG[2] * 255)});
        
        selectLayer(true,false,"TAG");
        var tagBG = projectObject.colors["tag-icon"];
        changeSolidColor(true,false, {'r': (tagBG[0] * 255), 'g': (tagBG[1] * 255), 'b': (tagBG[2] * 255)});
        
        selectLayer(true,false,"TAG-BG");
        var tagBG = projectObject.colors["tag-bg"];        
        changeSolidColor(true,false, {'r': (tagBG[0] * 255), 'g': (tagBG[1] * 255), 'b': (tagBG[2] * 255)});
        
        saveObject();
        updateSmartObject();
        closeObject();
    }

    function getTag(obj){
        var txt ="";        
        if(obj.text == txt){
            txt = tagTypes[obj.index];
        }else{
            txt = obj.text;
        }        
        return txt;
    }

    function updateText(obj,layer,changeSize,deep){
        selectLayer(true,false,mainDocLayers[layer]);
        showLayer();
        openSmartObject();
        var soDocLayers = collectLayers(app.activeDocument,[]);
        AGlog.createEvent('Verify [SmartObject][Info]: El LayerSmart seleccionado tiene las siguientes capas: \n'+ soDocLayers.toString());
        
        selectLayer(true,false,soDocLayers[0]);
        showLayer();
        
        if(deep != undefined && deep){        
            if(text_top.enable){
                selectLayer(true,false,soDocLayers[2]);
                showLayer();
                openSmartObject();
                    var textDocLayers = collectLayers(app.activeDocument,[]);
                    AGlog.createEvent('Verify [SmartObject][Info]: El LayerSmart seleccionado tiene las siguientes capas: \n'+ textDocLayers.toString());                    
                    selectLayer(true,false,textDocLayers[0]);
                    changeText(text_top);
                    app.refresh();
                    if(changeSize != undefined && changeSize)
                        fontChangerScreen(textDocLayers[0],"Titulo");
                    trim();
                    saveObject();
                    updateSmartObject();
                    closeObject();
                    
                    app.activeDocument.selection.selectAll();
                    alignToZone(true,false,'Top');
            }
        
            if(text_desc.enable){
                selectLayer(true,false,soDocLayers[1]);
                showLayer();
                openSmartObject();
                    var textDocLayers = collectLayers(app.activeDocument,[]);
                    AGlog.createEvent('Verify [SmartObject][Info]: El LayerSmart seleccionado tiene las siguientes capas: \n'+ textDocLayers.toString());
                    selectLayer(true,false,textDocLayers[0]);
                    changeText(text_desc);
                    app.refresh();
                    if(changeSize != undefined && changeSize)
                        fontChangerScreen(textDocLayers[0],"Descripcion");
                    trim();
                    saveObject();
                    updateSmartObject();
                    closeObject();
                    
                 if(text_top.enable){
                    selectLayer(true,false,soDocLayers[4]);
                    newColorLayerBySelection(0,0,0,soDocLayers[2]);
                    var moveValue =  getLayerMetrics();
                    selectLayer(true,false,"0_0_0");
                    hideLayers();
                    //selectSolidArea(true,false,soDocLayers[0]);
                    app.activeDocument.selection.selectAll();
                    selectLayer(true,false,soDocLayers[1]);
                    alignToZone(true,false,'Top');
                    moveLayers(true,false,{x: 0, y: parseInt(moveValue.h) + 10});   
                    nullSelection();
                }
            }
        
            selectLayer(true,false,soDocLayers[3]);
            var txt_color = projectObject.colors.text;
            changeSolidColor(true,false, {'r': (txt_color[0] * 255), 'g': (txt_color[1] * 255), 'b': (txt_color[2] * 255)});
            
            selectLayer(true,false,soDocLayers[0]);
            hideLayers();
            trim();
            showLayer();
            resizeCanvas(25);            
            selectLayer(true,false,soDocLayers[0]);
            var mask_color = projectObject.colors.mask;
            changeSolidColor(true,false, {'r': (mask_color[0] * 255), 'g': (mask_color[1] * 255), 'b': (mask_color[2] * 255)});            
            app.refresh();                        
            
            changeOpacity(soDocLayers[0]);
            
            
        }else{
            selectLayer(true,false,"TextArea");
            changeText(obj);
            if(changeSize != undefined && changeSize)
                fontChangerScreen("TextArea","");
            var txt_color = projectObject.colors.text;
            changeColor(true,false, {'r': (txt_color[0] * 255), 'g': (txt_color[1] * 255), 'b': (txt_color[2] * 255)});
        }        

        saveObject();
        updateSmartObject();
        closeObject();
        
    }   

    function changeText(obj){
        var textTochange = app.activeDocument.activeLayer; 
        textTochange.textItem.contents = obj.text;
    }

    function getTemplate(){
         var text = "";
         if(kind != "Normal"){
             text += kind;
         }
         if(text_tag.enable != true){
             text += "-noTag";
         }         
         templateName = type + text;
         return templateName;
    }

    function resizeCanvas(newValue){        
        var doc = app.activeDocument; 
        var defaultRulerUnits = app.preferences.rulerUnits;  
        app.preferences.rulerUnits = Units.PIXELS;  
          
        var d_width = parseInt(doc.width.as('px'));
        var d_height =parseInt(doc.height.as('px'));
        
        var value = {width: (d_width + newValue), height: (d_height + newValue)}
        
        changeCanvasSize(true,false,{width:value.width, height:value.height});
        
        app.preferences.rulerUnits = defaultRulerUnits;          
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